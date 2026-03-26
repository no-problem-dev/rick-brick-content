import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter, normalizeFrontmatter, extractMarkdownFromLLMResponse } from '../utils/frontmatter.js';
import { buildArticleFilename } from '../utils/slug.js';
import { getTodayDate, daysAgoJST, getPublishDateTime } from '../utils/date.js';
import { ARTICLES_DIR, TMP_DIR } from '../config/constants.js';
import type { RecapCategory } from '../config/constants.js';
import { callOpenAi } from '../utils/llm-client.js';

const RECAP_MODEL = 'gpt-5.4-nano';
const RECAP_PROVIDER = 'openai';

interface ArticleData {
  date: string;
  category: string;
  tags: string[];
  content: string;
}

/**
 * recapType に応じて収集対象カテゴリを返す
 */
function getSourceCategories(recapType: RecapCategory): string[] {
  switch (recapType) {
    case 'ai-weekly-recap':       return ['ai-tech-daily'];
    case 'extended-weekly-recap': return ['extended-daily'];
    case 'monthly-paper-recap':   return ['paper-review', 'extended-paper-review'];
  }
}

/**
 * articles/ から対象カテゴリの過去 daysBack 日分の .md ファイルを収集する
 */
function collectArticles(articlesDir: string, today: string, sourceCategories: string[], daysBack: number): ArticleData[] {
  if (!existsSync(articlesDir)) return [];

  const todayDate = new Date(today);
  const cutoffDate = new Date(todayDate);
  cutoffDate.setDate(todayDate.getDate() - daysBack);

  const files = readdirSync(articlesDir).filter((f) => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(f));
  const articles: ArticleData[] = [];

  for (const filename of files) {
    const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
    if (!dateMatch) continue;

    const fileDate = new Date(dateMatch[1]!);
    // cutoffDate <= fileDate < today
    if (fileDate < cutoffDate || fileDate >= todayDate) continue;

    const filePath = join(articlesDir, filename);
    const content = readFileSync(filePath, 'utf-8');
    const { frontmatter } = parseFrontmatter(content);

    if (!sourceCategories.includes(String(frontmatter.category ?? ''))) continue;

    articles.push({
      date: dateMatch[1]!,
      category: String(frontmatter.category ?? ''),
      tags: Array.isArray(frontmatter.tags) ? (frontmatter.tags as string[]) : [],
      content,
    });
  }

  return articles;
}

/**
 * 全記事のタグを集約し、recapType を先頭に追加する
 */
function aggregateTags(articles: ArticleData[], recapType: string): string[] {
  const tagSet = new Set<string>();
  for (const article of articles) {
    for (const tag of article.tags) {
      tagSet.add(tag);
    }
  }
  return [recapType, ...Array.from(tagSet)];
}

/**
 * 記事データを XML 形式に変換する
 */
function buildArticlesXml(articles: ArticleData[]): string {
  return articles
    .map(
      (a) =>
        `<article date="${a.date}" category="${a.category}">\n${a.content}\n</article>`,
    )
    .join('\n\n');
}

async function main() {
  const today = getTodayDate();
  const recapType = (process.env.RECAP_TYPE || 'ai-weekly-recap') as RecapCategory;

  const sourceCategories = getSourceCategories(recapType);
  const daysBack = recapType === 'monthly-paper-recap' ? 31 : 7;

  // 1. 対象記事を収集
  const articles = collectArticles(ARTICLES_DIR, today, sourceCategories, daysBack);

  if (articles.length === 0) {
    console.log(`No articles found for ${recapType} (sources: ${sourceCategories.join(', ')}, past ${daysBack} days). Skipping.`);
    process.exit(0);
  }

  console.log(`Found ${articles.length} articles for ${recapType}`);

  // 2. タグ集約 + recap_period 算出
  const aggregatedTags = aggregateTags(articles, recapType);

  const periodStart = daysAgoJST(today, daysBack);
  const periodEnd = daysAgoJST(today, 1);
  const recapPeriod = `${periodStart}/${periodEnd}`;

  // 3. プロンプト構築
  const basePromptPath = `prompts/base/${recapType}.md`;
  if (!existsSync(basePromptPath)) {
    console.error(`Base prompt not found: ${basePromptPath}`);
    process.exit(1);
  }

  let basePrompt = readFileSync(basePromptPath, 'utf-8');
  const articlesXml = `<articles>\n${buildArticlesXml(articles)}\n</articles>`;
  basePrompt = basePrompt.replace('{{ARTICLES}}', articlesXml);

  const providerPromptPath = `prompts/providers/${RECAP_PROVIDER}.md`;
  const providerPrompt = existsSync(providerPromptPath)
    ? readFileSync(providerPromptPath, 'utf-8')
    : '';
  const fullPrompt = providerPrompt ? `${basePrompt}\n\n${providerPrompt}` : basePrompt;

  // 4. OpenAI API 呼び出し
  console.log(`Calling OpenAI API (${RECAP_MODEL}) for ${recapType}...`);
  let rawMarkdown: string;
  try {
    rawMarkdown = await callOpenAi(fullPrompt, { model: RECAP_MODEL, errorWaitMs: 60000 });
  } catch (error) {
    console.error(`Failed to generate ${recapType}: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }

  // 5. frontmatter 正規化 + フィールド注入
  const cleanedMarkdown = extractMarkdownFromLLMResponse(rawMarkdown);
  const dateTime = getPublishDateTime(today, recapType);
  const slug = `${recapType}-${today}`;
  const markdown = normalizeFrontmatter(cleanedMarkdown, {
    category: recapType,
    date: dateTime,
    automated: true,
    provider: RECAP_PROVIDER,
    slug,
    recap_period: recapPeriod,
    tags: aggregatedTags,
    draft: process.env.DRAFT_MODE === 'true' ? true : undefined,
  });

  // 自動生成注意文を末尾に追加
  const markdownWithNote = markdown + '\n\n---\n\n> 本記事は LLM により自動生成されたものです。内容に誤りが含まれる可能性があります。\n';

  // 6. ファイル書き出し
  mkdirSync(ARTICLES_DIR, { recursive: true });
  const filename = buildArticleFilename(slug, today);
  const outputPath = join(ARTICLES_DIR, filename);
  writeFileSync(outputPath, markdownWithNote);
  console.log(`${recapType}: generated ${filename}`);

  // 7. サムネイル生成用 .tmp/research-{recapType}.json を出力
  mkdirSync(TMP_DIR, { recursive: true });
  const { frontmatter } = parseFrontmatter(markdownWithNote);
  const researchResult = {
    status: 'success' as const,
    category: recapType,
    markdown: markdownWithNote,
    frontmatter: {
      title: String(frontmatter.title ?? ''),
      summary: String(frontmatter.summary ?? ''),
      slug,
      tags: aggregatedTags,
      date: today,
    },
  };
  writeFileSync(join(TMP_DIR, `research-${recapType}.json`), JSON.stringify(researchResult, null, 2));
  console.log(`${recapType}: wrote research-${recapType}.json for thumbnail generation`);
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
