import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter, yamlQuote, formatFrontmatterField } from '../utils/frontmatter.js';
import { getTodayDate } from '../utils/date.js';
import { callLlm } from '../utils/llm-client.js';
import { sanitizeTagsForLocale } from '../config/tag-fallback.js';
import {
  ARTICLES_BASE_DIR,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LANGUAGE_NAME_BY_LOCALE,
  DISCLAIMER_BY_LOCALE,
  type SupportedLocale,
} from '../config/constants.js';

// ---------------------------------------------------------------------------
// 型定義
// ---------------------------------------------------------------------------

interface TranslationResult {
  title: string;
  summary: string;
  tags: string[];
  body: string;
}

interface SnsTopicItem {
  topic: string;
  summary: string;
}

interface TranslateStats {
  total: number;
  translated: number;
  skipped: number;
  errors: number;
}

// ---------------------------------------------------------------------------
// 定数
// ---------------------------------------------------------------------------

const TRANSLATE_MODEL_CLAUDE = 'claude-haiku-4-5-20251001';
const TRANSLATE_MODEL_GEMINI = 'gemini-2.5-flash-lite';
const TRANSLATE_MODEL_OPENAI = 'gpt-5.4-nano';

/** プロバイダーごとのモデル名を返す */
function getModelForProvider(provider: string): string {
  switch (provider) {
    case 'claude': return TRANSLATE_MODEL_CLAUDE;
    case 'openai': return TRANSLATE_MODEL_OPENAI;
    case 'gemini':
    default: return TRANSLATE_MODEL_GEMINI;
  }
}

// ---------------------------------------------------------------------------
// 翻訳ロジック
// ---------------------------------------------------------------------------

/**
 * LLM レスポンスから JSON を抽出してパースする
 */
function parseTranslationResponse(rawText: string): TranslationResult {
  let text = rawText.trim();

  // コードフェンスで囲まれている場合は除去
  const fenceMatch = text.match(/^```(?:json)?\s*\n([\s\S]*?)\n```\s*$/);
  if (fenceMatch) {
    text = fenceMatch[1]!.trim();
  }

  // JSON パース（不正エスケープの修正を試みる）
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text) as Record<string, unknown>;
  } catch {
    // LLM が JSON 文字列値内に不正なエスケープ（\: など）を含む場合の修復
    const fixed = text.replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
    try {
      parsed = JSON.parse(fixed) as Record<string, unknown>;
    } catch {
      // フォールバック: title, summary, body をキーで手動抽出
      const titleMatch = text.match(/"title"\s*:\s*"((?:[^"\\]|\\.)*)"/);
      const summaryMatch = text.match(/"summary"\s*:\s*"((?:[^"\\]|\\.)*)"/);
      const bodyMatch = text.match(/"body"\s*:\s*"([\s\S]*)"\s*\}?\s*$/);
      if (titleMatch && bodyMatch) {
        parsed = {
          title: titleMatch[1]!.replace(/\\"/g, '"').replace(/\\n/g, '\n'),
          summary: (summaryMatch?.[1] ?? '').replace(/\\"/g, '"').replace(/\\n/g, '\n'),
          body: bodyMatch[1]!.replace(/\\"/g, '"').replace(/\\n/g, '\n'),
        };
      } else {
        throw new Error(`Failed to parse translation response as JSON: ${text.slice(0, 200)}...`);
      }
    }
  }
  const title = typeof parsed.title === 'string' ? parsed.title : '';
  const summary = typeof parsed.summary === 'string' ? parsed.summary : '';
  const tags = Array.isArray(parsed.tags) ? (parsed.tags as unknown[]).map(String) : [];
  const body = typeof parsed.body === 'string' ? parsed.body : '';

  if (!title || !body) {
    throw new Error('Translation response missing required fields (title, body)');
  }

  return { title, summary, tags, body };
}

/**
 * sns_topics を対象言語に翻訳する。
 * OpenAI API を使い、topic と summary を一括翻訳して返す。
 */
async function translateSnsTopics(
  snsTopics: SnsTopicItem[],
  targetLocale: SupportedLocale,
  provider: string,
): Promise<SnsTopicItem[]> {
  if (snsTopics.length === 0) return [];

  const targetLanguage = LANGUAGE_NAME_BY_LOCALE[targetLocale];
  const prompt = `Translate the following JSON array of SNS topics to ${targetLanguage}.
Each item has "topic" and "summary" fields. Translate both fields naturally.
Return ONLY a valid JSON array with the same structure. No explanation.

${JSON.stringify(snsTopics)}`;

  const rawResponse = await callLlm(prompt, provider, { model: getModelForProvider(provider) });

  let text = rawResponse.trim();
  const fenceMatch = text.match(/^```(?:json)?\s*\n([\s\S]*?)\n```\s*$/);
  if (fenceMatch) text = fenceMatch[1]!.trim();

  try {
    const parsed = JSON.parse(text) as unknown[];
    return parsed
      .filter((item): item is Record<string, unknown> =>
        typeof item === 'object' && item !== null &&
        typeof (item as Record<string, unknown>).topic === 'string' &&
        typeof (item as Record<string, unknown>).summary === 'string')
      .map((item) => ({
        topic: String(item.topic).trim(),
        summary: String(item.summary).trim(),
      }));
  } catch {
    // パース失敗時は原文をそのまま返す（ビルドは壊さない）
    console.warn(`  [${targetLocale}] sns_topics translation parse failed, keeping original`);
    return snsTopics;
  }
}

/**
 * 記事本文から自動生成注意文（`---` 以降の最後のブロック）を除去する
 */
function removeDisclaimerFromBody(body: string): string {
  const disclaimerPattern = /\n\n---\n\n>.*$/s;
  return body.replace(disclaimerPattern, '');
}

/**
 * frontmatter を再構築する（翻訳済み title/summary/tags + 原文の他フィールドをコピー）
 */
function buildTranslatedFrontmatter(
  originalFrontmatter: Record<string, unknown>,
  translatedTitle: string,
  translatedSummary: string,
  translatedTags?: string[],
  translatedSnsTopics?: SnsTopicItem[],
): string {
  const FIELD_ORDER = ['title', 'slug', 'summary', 'date', 'tags', 'category', 'automated', 'provider', 'sources', 'sns_topics', 'thumbnail'];

  const merged: Record<string, unknown> = {
    ...originalFrontmatter,
    title: translatedTitle,
    summary: translatedSummary,
    ...(translatedTags && translatedTags.length > 0 ? { tags: translatedTags } : {}),
    ...(translatedSnsTopics && translatedSnsTopics.length > 0 ? { sns_topics: translatedSnsTopics } : {}),
  };

  const fmLines: string[] = [];

  for (const key of FIELD_ORDER) {
    if (merged[key] === undefined) continue;
    if (key === 'provider' && !merged[key]) continue;
    fmLines.push(formatFrontmatterField(key, merged[key]));
  }

  for (const key of Object.keys(merged)) {
    if (FIELD_ORDER.includes(key)) continue;
    if (key === 'provider' && !merged[key]) continue;
    fmLines.push(formatFrontmatterField(key, merged[key]));
  }

  return `---\n${fmLines.join('\n')}\n---\n`;
}

/**
 * 翻訳プロンプトを構築する
 */
function buildTranslatePrompt(
  targetLocale: SupportedLocale,
  title: string,
  summary: string,
  tags: string[],
  body: string,
): string {
  const promptPath = 'prompts/translate/base.md';
  if (!existsSync(promptPath)) {
    throw new Error(`Translation prompt not found: ${promptPath}`);
  }

  const basePrompt = readFileSync(promptPath, 'utf-8');
  const targetLanguage = LANGUAGE_NAME_BY_LOCALE[targetLocale];

  return basePrompt
    .replace(/\{\{TARGET_LANGUAGE\}\}/g, targetLanguage)
    .replace('{{TITLE}}', title)
    .replace('{{SUMMARY}}', summary)
    .replace('{{TAGS}}', JSON.stringify(tags))
    .replace('{{BODY}}', body);
}

/**
 * 1つの記事を1つの言語に翻訳してファイルに書き出す
 */
async function translateArticle(
  sourceFilePath: string,
  targetLocale: SupportedLocale,
  provider: string,
): Promise<'translated' | 'skipped' | 'error'> {
  const sourceContent = readFileSync(sourceFilePath, 'utf-8');
  const { frontmatter, body: fullBody } = parseFrontmatter(sourceContent);

  const title = String(frontmatter.title ?? '');
  const summary = String(frontmatter.summary ?? '');

  // slug: frontmatter から取得。なければファイル名から推定
  const rawSlug = String(frontmatter.slug ?? '');
  const basename = sourceFilePath.split('/').pop() ?? '';
  const slugFromFilename = basename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
  const slug = rawSlug || slugFromFilename;

  // date: frontmatter から取得。なければファイル名から推定
  const rawDate = String(frontmatter.date ?? '');
  const dateFromFilename = basename.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? '';
  const date = rawDate || dateFromFilename;

  if (!slug || !date) {
    console.warn(`  [${targetLocale}] Missing slug or date in ${sourceFilePath}, skipping`);
    return 'error';
  }

  // 出力パス
  const filename = basename;
  const targetDir = join(ARTICLES_BASE_DIR, targetLocale);
  const targetFilePath = join(targetDir, filename);

  // 既存ファイルはスキップ（冪等性）
  if (existsSync(targetFilePath)) {
    console.log(`  [${targetLocale}] Already exists, skipping: ${filename}`);
    return 'skipped';
  }

  // 本文から自動生成注意文を除去
  const bodyWithoutDisclaimer = removeDisclaimerFromBody(fullBody);

  // タグを取得
  const tags = Array.isArray(frontmatter.tags) ? (frontmatter.tags as unknown[]).map(String) : [];

  // 翻訳プロンプト構築 → LLM API 呼び出し
  const prompt = buildTranslatePrompt(targetLocale, title, summary, tags, bodyWithoutDisclaimer);
  console.log(`  [${targetLocale}] Translating via ${provider}...`);
  const rawResponse = await callLlm(prompt, provider, { model: getModelForProvider(provider) });

  // レスポンスをパース
  const translation = parseTranslationResponse(rawResponse);

  // summary の長さを 200 文字に制限
  let translatedSummary = translation.summary;
  if (translatedSummary.length > 200) {
    translatedSummary = translatedSummary.slice(0, 197) + '...';
  }

  // タグ: 翻訳結果を優先、日本語が残っていればフォールバック変換
  const rawTranslatedTags = translation.tags.length > 0 ? translation.tags : tags;
  const translatedTags = sanitizeTagsForLocale(rawTranslatedTags, targetLocale);

  // sns_topics: 配列が存在する場合は対象言語に翻訳
  let translatedSnsTopics: SnsTopicItem[] | undefined;
  if (Array.isArray(frontmatter.sns_topics) && frontmatter.sns_topics.length > 0) {
    const originalTopics = (frontmatter.sns_topics as Array<Record<string, unknown>>)
      .filter((item) => typeof item.topic === 'string' && typeof item.summary === 'string')
      .map((item) => ({ topic: String(item.topic), summary: String(item.summary) }));
    if (originalTopics.length > 0) {
      try {
        translatedSnsTopics = await translateSnsTopics(originalTopics, targetLocale, provider);
      } catch (e) {
        console.warn(`  [${targetLocale}] sns_topics translation failed, keeping original: ${e instanceof Error ? e.message : e}`);
        translatedSnsTopics = originalTopics;
      }
    }
  }

  const newFrontmatter = buildTranslatedFrontmatter(frontmatter, translation.title, translatedSummary, translatedTags, translatedSnsTopics);

  // 本文 + 対象言語の注意文を組み立て
  const disclaimer = DISCLAIMER_BY_LOCALE[targetLocale];
  const translatedBody = `${translation.body.trim()}\n\n---\n\n> ${disclaimer}\n`;

  const translatedMarkdown = `${newFrontmatter}${translatedBody}`;

  // 出力ディレクトリを作成してファイル書き出し
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(targetFilePath, translatedMarkdown);
  console.log(`  [${targetLocale}] Written: ${filename}`);

  return 'translated';
}

// ---------------------------------------------------------------------------
// ファイル収集
// ---------------------------------------------------------------------------

function collectSourceFiles(targetDate: string): string[] {
  const sourceDir = join(ARTICLES_BASE_DIR, DEFAULT_LOCALE);
  if (!existsSync(sourceDir)) return [];
  return readdirSync(sourceDir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(f))
    .filter((f) => f.startsWith(targetDate))
    .map((f) => join(sourceDir, f));
}

function collectAllSourceFiles(): string[] {
  const sourceDir = join(ARTICLES_BASE_DIR, DEFAULT_LOCALE);
  if (!existsSync(sourceDir)) return [];
  return readdirSync(sourceDir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(f))
    .map((f) => join(sourceDir, f));
}

// ---------------------------------------------------------------------------
// メイン処理
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  if (process.env.SKIP_TRANSLATE === 'true') {
    console.log('SKIP_TRANSLATE=true, skipping translation.');
    return;
  }

  const provider = process.env.RESEARCH_PROVIDER || 'gemini';
  const isBatchMode = process.env.BATCH_TRANSLATE === 'true';
  const targetDate = getTodayDate();

  const allTargetLocales = SUPPORTED_LOCALES.filter((l) => l !== DEFAULT_LOCALE) as SupportedLocale[];
  let targetLocales: SupportedLocale[];

  const translateLangsEnv = process.env.TRANSLATE_LANGS;
  if (translateLangsEnv) {
    const requested = translateLangsEnv.split(',').map((l) => l.trim());
    targetLocales = allTargetLocales.filter((l) => requested.includes(l));
    if (targetLocales.length === 0) {
      console.error(`TRANSLATE_LANGS contains no valid locales: ${translateLangsEnv}`);
      console.error(`Valid locales: ${allTargetLocales.join(', ')}`);
      process.exit(1);
    }
  } else {
    targetLocales = allTargetLocales;
  }

  const sourceFiles = isBatchMode ? collectAllSourceFiles() : collectSourceFiles(targetDate);

  if (sourceFiles.length === 0) {
    console.log(isBatchMode
      ? 'No source articles found in articles/ja/. Nothing to translate.'
      : `No articles found for date ${targetDate} in articles/ja/. Nothing to translate.`);
    return;
  }

  console.log(`Mode: ${isBatchMode ? 'batch' : 'daily'}`);
  console.log(`Provider: ${provider}`);
  console.log(`Target locales: ${targetLocales.join(', ')}`);
  console.log(`Source files: ${sourceFiles.length}`);

  const stats: TranslateStats = { total: 0, translated: 0, skipped: 0, errors: 0 };

  for (const sourceFilePath of sourceFiles) {
    const filename = sourceFilePath.split('/').pop() ?? sourceFilePath;
    console.log(`\nProcessing: ${filename}`);

    for (let i = 0; i < targetLocales.length; i++) {
      const targetLocale = targetLocales[i]!;
      stats.total++;

      try {
        const result = await translateArticle(sourceFilePath, targetLocale, provider);
        if (result === 'translated') stats.translated++;
        else if (result === 'skipped') stats.skipped++;
        else stats.errors++;
      } catch (error) {
        console.error(`  [${targetLocale}] Error: ${error instanceof Error ? error.message : String(error)}`);
        stats.errors++;
      }

      if (i < targetLocales.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    if (isBatchMode && sourceFiles.indexOf(sourceFilePath) < sourceFiles.length - 1) {
      console.log('Waiting 3s before next article...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  console.log('\n--- Translation Summary ---');
  console.log(`Total:      ${stats.total}`);
  console.log(`Translated: ${stats.translated}`);
  console.log(`Skipped:    ${stats.skipped}`);
  console.log(`Errors:     ${stats.errors}`);

  if (stats.errors > 0) {
    console.warn(`\nWarning: ${stats.errors} translation(s) failed.`);
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
