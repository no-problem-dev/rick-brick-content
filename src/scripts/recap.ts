import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter, normalizeFrontmatter, upsertFrontmatterField, extractMarkdownFromLLMResponse } from '../utils/frontmatter.js';
import { buildArticleFilename } from '../utils/slug.js';
import { getTodayDate, daysAgoJST } from '../utils/date.js';
import { ARTICLES_DIR, TMP_DIR } from '../config/constants.js';
import type { RecapCategory } from '../config/constants.js';

const RECAP_MODEL = 'claude-haiku-4-5-20251001';

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

/**
 * Claude Haiku API を呼び出してまとめ記事を生成する（最大3回試行）
 */
async function callClaudeApi(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: RECAP_MODEL,
          max_tokens: 16384,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const isRateLimit = response.status === 429;
        if (attempt < 3) {
          const waitMs = isRateLimit ? 60000 : 60000;
          console.log(`Claude API error ${response.status}, retrying in ${waitMs / 1000}s... (attempt ${attempt}/3)`);
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          continue;
        }
        throw new Error(`Claude API error ${response.status}: ${errorText}`);
      }

      const data = (await response.json()) as {
        content: Array<{ type: string; text?: string }>;
      };

      const textBlock = data.content.find((c) => c.type === 'text' && c.text);
      if (!textBlock?.text) {
        throw new Error('No text content in Claude response');
      }

      return textBlock.text;
    } catch (error) {
      if (attempt < 3) {
        console.log(`Error on attempt ${attempt}: ${error instanceof Error ? error.message : String(error)}, retrying in 60s...`);
        await new Promise((resolve) => setTimeout(resolve, 60000));
      } else {
        throw error;
      }
    }
  }

  throw new Error('Claude API call failed after 3 attempts');
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

  const providerPromptPath = 'prompts/providers/claude.md';
  const providerPrompt = existsSync(providerPromptPath)
    ? readFileSync(providerPromptPath, 'utf-8')
    : '';
  const fullPrompt = providerPrompt ? `${basePrompt}\n\n${providerPrompt}` : basePrompt;

  // 4. Claude API 呼び出し
  console.log(`Calling Claude API for ${recapType}...`);
  let rawMarkdown: string;
  try {
    rawMarkdown = await callClaudeApi(fullPrompt);
  } catch (error) {
    console.error(`Failed to generate ${recapType}: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }

  // 5. frontmatter 正規化 + フィールド注入
  const cleanedMarkdown = extractMarkdownFromLLMResponse(rawMarkdown);
  let markdown = normalizeFrontmatter(cleanedMarkdown, {
    category: recapType,
    date: today,
    automated: true,
    provider: 'claude',
  });

  const slug = `${recapType}-${today}`;
  markdown = upsertFrontmatterField(markdown, 'slug', slug);
  markdown = upsertFrontmatterField(markdown, 'category', recapType);
  markdown = upsertFrontmatterField(markdown, 'automated', 'true');
  markdown = upsertFrontmatterField(markdown, 'provider', 'claude');
  markdown = upsertFrontmatterField(markdown, 'recap_period', recapPeriod);
  markdown = upsertFrontmatterField(markdown, 'tags', JSON.stringify(aggregatedTags));

  // 自動生成注意文を末尾に追加
  markdown += '\n\n---\n\n> 本記事は LLM により自動生成されたものです。内容に誤りが含まれる可能性があります。\n';

  // DRAFT_MODE 対応
  if (process.env.DRAFT_MODE === 'true') {
    markdown = upsertFrontmatterField(markdown, 'draft', 'true');
  }

  // 6. ファイル書き出し
  mkdirSync(ARTICLES_DIR, { recursive: true });
  const filename = buildArticleFilename(slug, today);
  const outputPath = join(ARTICLES_DIR, filename);
  writeFileSync(outputPath, markdown);
  console.log(`${recapType}: generated ${filename}`);

  // 7. サムネイル生成用 .tmp/research-{recapType}.json を出力
  mkdirSync(TMP_DIR, { recursive: true });
  const { frontmatter } = parseFrontmatter(markdown);
  const researchResult = {
    status: 'success' as const,
    category: recapType,
    markdown,
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
