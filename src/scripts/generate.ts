import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ResearchResult } from '../types/research.js';
import { resolveSlug, buildArticleFilename, validateSlug } from '../utils/slug.js';
import { getTodayDate } from '../utils/date.js';
import { upsertFrontmatterField, normalizeFrontmatter } from '../utils/frontmatter.js';
import { DAILY_CATEGORIES, ARTICLES_DIR, TMP_DIR } from '../config/constants.js';

export interface ProcessedArticle {
  slug: string;
  filename: string;
  markdown: string;
}

/**
 * ResearchResult を処理し、ファイル出力用のデータを生成する純粋関数。
 * ファイル I/O は含まない。
 */
export function processResearchResult(
  result: ResearchResult,
  category: string,
  today: string,
  provider?: string,
): ProcessedArticle | null {
  if (result.status !== 'success' || !result.markdown) {
    return null;
  }

  // LLM 出力の frontmatter を正規化（不足フィールドの補完、不正値の修復）
  let markdown = normalizeFrontmatter(result.markdown, {
    category,
    date: today,
    automated: true,
    provider,
  });
  // 自動生成注意文を末尾に追加
  markdown += '\n\n---\n\n> 本記事は LLM により自動生成されたものです。内容に誤りが含まれる可能性があります。\n';

  const slug = resolveSlug(result, category, today);
  if (!validateSlug(slug)) {
    return null;
  }

  // frontmatter 内の slug を resolveSlug の結果（SLUG_SUFFIX 付き）で上書き
  markdown = upsertFrontmatterField(markdown, 'slug', slug);

  const filename = buildArticleFilename(slug, today);
  return { slug, filename, markdown };
}

function main() {
  const today = getTodayDate();
  const provider = process.env.RESEARCH_PROVIDER || undefined;

  for (const category of DAILY_CATEGORIES) {
    const inputPath = join(TMP_DIR, `research-${category}.json`);
    if (!existsSync(inputPath)) {
      console.log(`${category}: research file not found, skipping`);
      continue;
    }

    const result: ResearchResult = JSON.parse(readFileSync(inputPath, 'utf-8'));
    const processed = processResearchResult(result, category, today, provider);
    if (!processed) {
      console.log(`${category}: research failed or invalid slug, skipping`);
      continue;
    }

    const outputPath = join(ARTICLES_DIR, processed.filename);
    let markdown = processed.markdown;
    if (process.env.DRAFT_MODE === 'true') {
      markdown = upsertFrontmatterField(markdown, 'draft', 'true');
    }
    writeFileSync(outputPath, markdown);
    console.log(`${category}: generated ${processed.filename}`);
  }
}

main();
