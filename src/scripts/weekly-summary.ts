import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter, normalizeFrontmatter, upsertFrontmatterField, extractMarkdownFromLLMResponse } from '../utils/frontmatter.js';
import { buildArticleFilename } from '../utils/slug.js';
import { ARTICLES_DIR, TMP_DIR } from '../config/constants.js';

const WEEKLY_SUMMARY_MODEL = 'claude-haiku-4-5-20251001';
const WEEKLY_SUMMARY_BASE_PROMPT = 'prompts/base/weekly-summary.md';
const WEEKLY_SUMMARY_PROVIDER_PROMPT = 'prompts/providers/claude.md';

interface ArticleData {
  date: string;
  category: string;
  tags: string[];
  content: string;
}

/**
 * articles/ から過去7日分の .md ファイルを収集する（weekly-summary 自身は除外）
 */
function collectRecentArticles(articlesDir: string, today: string): ArticleData[] {
  if (!existsSync(articlesDir)) return [];

  const todayDate = new Date(today);
  const sevenDaysAgo = new Date(todayDate);
  sevenDaysAgo.setDate(todayDate.getDate() - 7);

  const files = readdirSync(articlesDir).filter((f) => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(f));
  const articles: ArticleData[] = [];

  for (const filename of files) {
    const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
    if (!dateMatch) continue;

    const fileDate = new Date(dateMatch[1]!);
    // 過去7日以内（当日を含まない: 7日前 <= fileDate < today）
    if (fileDate < sevenDaysAgo || fileDate >= todayDate) continue;

    const filePath = join(articlesDir, filename);
    const content = readFileSync(filePath, 'utf-8');
    const { frontmatter } = parseFrontmatter(content);

    // weekly-summary 自身は除外
    if (frontmatter.category === 'weekly-summary') continue;

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
 * 全記事のタグを集約し、"weekly-summary" を先頭に追加する
 */
function aggregateTags(articles: ArticleData[]): string[] {
  const tagSet = new Set<string>();
  for (const article of articles) {
    for (const tag of article.tags) {
      tagSet.add(tag);
    }
  }
  return ['weekly-summary', ...Array.from(tagSet)];
}

/**
 * 記事データを XML 形式に変換する
 */
function buildArticlesXml(articles: ArticleData[]): string {
  return articles
    .map(
      (a) =>
        `<article date="${a.date}" category="${a.category}" tags="${a.tags.join(',')}">\n${a.content}\n</article>`,
    )
    .join('\n\n');
}

/**
 * Claude Haiku API を呼び出してサマリ記事を生成する（最大3回試行）
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
          model: WEEKLY_SUMMARY_MODEL,
          max_tokens: 16384,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
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

      // 最初の text ブロックを取得
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
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const today = jst.toISOString().split('T')[0]!;

  // 1. 過去7日分の記事を収集
  const articles = collectRecentArticles(ARTICLES_DIR, today);

  // 2. 記事が 0 本の場合は正常終了
  if (articles.length === 0) {
    console.log('No articles found in the past 7 days. Skipping weekly summary generation.');
    process.exit(0);
  }

  console.log(`Found ${articles.length} articles for weekly summary`);

  // 3. タグ集約 + summary_period 算出
  const aggregatedTags = aggregateTags(articles);

  const todayDate = new Date(today);
  const sevenDaysAgo = new Date(todayDate);
  sevenDaysAgo.setDate(todayDate.getDate() - 7);
  const yesterday = new Date(todayDate);
  yesterday.setDate(todayDate.getDate() - 1);
  const periodStart = sevenDaysAgo.toISOString().split('T')[0]!;
  const periodEnd = yesterday.toISOString().split('T')[0]!;
  const summaryPeriod = `${periodStart}/${periodEnd}`;

  // 4. プロンプト構築
  if (!existsSync(WEEKLY_SUMMARY_BASE_PROMPT)) {
    console.error(`Base prompt not found: ${WEEKLY_SUMMARY_BASE_PROMPT}`);
    process.exit(1);
  }

  let basePrompt = readFileSync(WEEKLY_SUMMARY_BASE_PROMPT, 'utf-8');
  const articlesXml = buildArticlesXml(articles);
  basePrompt = basePrompt.replace('{{ARTICLES}}', articlesXml);

  const providerPrompt = existsSync(WEEKLY_SUMMARY_PROVIDER_PROMPT)
    ? readFileSync(WEEKLY_SUMMARY_PROVIDER_PROMPT, 'utf-8')
    : '';
  const fullPrompt = providerPrompt ? `${basePrompt}\n\n${providerPrompt}` : basePrompt;

  // 5. Claude API 呼び出し
  console.log('Calling Claude API for weekly summary...');
  let rawMarkdown: string;
  try {
    rawMarkdown = await callClaudeApi(fullPrompt);
  } catch (error) {
    console.error(`Failed to generate weekly summary: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }

  // 6. frontmatter 正規化 + フィールド注入
  const cleanedMarkdown = extractMarkdownFromLLMResponse(rawMarkdown);
  let markdown = normalizeFrontmatter(cleanedMarkdown, {
    category: 'weekly-summary',
    date: today,
    automated: true,
    provider: 'claude',
  });

  const slug = `weekly-summary-${today}`;
  markdown = upsertFrontmatterField(markdown, 'slug', slug);
  markdown = upsertFrontmatterField(markdown, 'category', 'weekly-summary');
  markdown = upsertFrontmatterField(markdown, 'automated', 'true');
  markdown = upsertFrontmatterField(markdown, 'provider', 'claude');
  markdown = upsertFrontmatterField(markdown, 'summary_period', summaryPeriod);
  markdown = upsertFrontmatterField(markdown, 'tags', JSON.stringify(aggregatedTags));

  // 自動生成注意文を末尾に追加
  markdown += '\n\n---\n\n> 本記事は LLM により自動生成されたものです。内容に誤りが含まれる可能性があります。\n';

  // DRAFT_MODE 対応
  if (process.env.DRAFT_MODE === 'true') {
    markdown = upsertFrontmatterField(markdown, 'draft', 'true');
  }

  // 7. ファイル書き出し
  const filename = buildArticleFilename(slug, today);
  const outputPath = join(ARTICLES_DIR, filename);
  writeFileSync(outputPath, markdown);
  console.log(`weekly-summary: generated ${filename}`);

  // 8. サムネイル生成用 .tmp/research-weekly-summary.json を出力
  mkdirSync(TMP_DIR, { recursive: true });
  const { frontmatter } = parseFrontmatter(markdown);
  const researchResult = {
    status: 'success' as const,
    category: 'weekly-summary' as const,
    markdown,
    frontmatter: {
      title: String(frontmatter.title ?? ''),
      summary: String(frontmatter.summary ?? ''),
      slug,
      tags: aggregatedTags,
      date: today,
    },
  };
  writeFileSync(join(TMP_DIR, 'research-weekly-summary.json'), JSON.stringify(researchResult, null, 2));
  console.log('weekly-summary: wrote research-weekly-summary.json for thumbnail generation');
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
