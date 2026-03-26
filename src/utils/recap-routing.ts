import type { RecapCategory } from '../config/constants.js';

/**
 * 指定日付に生成すべき recap カテゴリの一覧を返す。
 * GitHub Actions ワークフローのシェルスクリプトにあった曜日・月末判定ロジックを
 * TypeScript に移行し、テスト可能にしたもの。
 *
 * @param dateStr YYYY-MM-DD 形式の JST 日付文字列
 * @returns 生成すべき RecapCategory の配列。空配列ならスキップ。
 */
export function determineRecapCategories(dateStr: string): RecapCategory[] {
  const categories: RecapCategory[] = [];

  // 日付を JST 正午として解釈し、タイムゾーンによる日付ズレを防止
  const date = new Date(`${dateStr}T12:00:00+09:00`);
  const dow = date.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  // 火曜 (dow=2) → ai-weekly-recap
  if (dow === 2) {
    categories.push('ai-weekly-recap');
  }

  // 木曜 (dow=4) → extended-weekly-recap
  if (dow === 4) {
    categories.push('extended-weekly-recap');
  }

  // 月末判定: 翌日の日が 1 なら月末
  if (isLastDayOfMonth(dateStr)) {
    categories.push('monthly-paper-recap');
  }

  return categories;
}

/**
 * 指定日付が月の最終日かどうかを判定する。
 * 翌日の日部分が "01" であれば月末と判定。
 */
export function isLastDayOfMonth(dateStr: string): boolean {
  const date = new Date(`${dateStr}T12:00:00+09:00`);
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  return nextDay.getUTCDate() === 1;
}
