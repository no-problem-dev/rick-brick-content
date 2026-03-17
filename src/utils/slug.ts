import type { ResearchResult } from '../types/research.js';

/**
 * ResearchResult から slug を解決する。
 * 優先順位: frontmatter.slug → category-date フォールバック
 */
export function resolveSlug(
  result: ResearchResult,
  category: string,
  date: string,
): string {
  const slug = result.frontmatter?.slug;
  const base = slug && slug.trim() !== '' ? slug.trim() : `${category}-${date}`;
  const suffix = process.env.SLUG_SUFFIX;
  return suffix ? `${base}-${suffix}` : base;
}

/**
 * slug と日付からファイル名を生成する。
 */
export function buildArticleFilename(slug: string, date: string): string {
  return `${date}-${slug}.md`;
}

/**
 * slug の形式が有効かチェックする。
 * 有効: 小文字英数字とハイフンのみ、1文字以上
 */
export function validateSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]*$/.test(slug);
}
