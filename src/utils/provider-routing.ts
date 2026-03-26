/**
 * ワークフローのプロバイダー自動選択ロジック。
 * シェルスクリプトにあった偶奇判定を TypeScript に移行し、テスト可能にしたもの。
 */

export type ResearchProvider = 'openai' | 'gemini';

/**
 * 日次記事のプロバイダーを自動選択する。
 * JST 日付の日部分の偶奇で判定: 偶数日→openai、奇数日→gemini
 *
 * @param dateStr YYYY-MM-DD 形式の JST 日付文字列
 */
export function selectDailyProvider(dateStr: string): ResearchProvider {
  const day = parseInt(dateStr.split('-')[2]!, 10);
  return day % 2 === 0 ? 'openai' : 'gemini';
}

/**
 * 週次記事のプロバイダーを自動選択する。
 * ISO 週番号の偶奇で判定: 偶数週→openai、奇数週→gemini
 *
 * @param dateStr YYYY-MM-DD 形式の JST 日付文字列
 */
export function selectWeeklyProvider(dateStr: string): ResearchProvider {
  const isoWeek = getISOWeekNumber(dateStr);
  return isoWeek % 2 === 0 ? 'openai' : 'gemini';
}

/**
 * ISO 8601 の週番号を返す。
 */
export function getISOWeekNumber(dateStr: string): number {
  const date = new Date(`${dateStr}T12:00:00+09:00`);
  // ISO week: 木曜日が属する年の第1週から起算
  const target = new Date(date.valueOf());
  // 最も近い木曜日に調整
  target.setUTCDate(target.getUTCDate() + 3 - ((target.getUTCDay() + 6) % 7));
  // その年の1月1日
  const jan1 = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  // 木曜日までの日数差 / 7 + 1
  return Math.ceil(((target.getTime() - jan1.getTime()) / 86400000 + 1) / 7);
}
