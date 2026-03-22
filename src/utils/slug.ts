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
  let base = slug && slug.trim() !== '' ? slug.trim() : `${category}-${date}`;

  // slug 内の日付部分を date（JST の今日の日付）に常に置換
  // LLM が UTC ベースの日付を slug に埋め込むケースを防ぐ
  base = replaceDateInSlug(base, date);

  const suffix = process.env.SLUG_SUFFIX;
  return suffix ? `${base}-${suffix}` : base;
}

/**
 * slug 内の YYYY-MM-DD パターンを指定日付に置換する。
 * 複数の日付パターンがある場合は最初のマッチのみ置換。
 */
export function replaceDateInSlug(slug: string, date: string): string {
  return slug.replace(/\d{4}-\d{2}-\d{2}/, date);
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
