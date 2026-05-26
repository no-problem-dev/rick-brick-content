/**
 * ワークフローのプロバイダー自動選択ロジック。
 */

export type ResearchProvider = 'openai';

/**
 * 日次記事のプロバイダーを自動選択する。
 * 常に openai を返す。
 */
export function selectDailyProvider(_dateStr: string): ResearchProvider {
  return 'openai';
}

/**
 * 週次記事のプロバイダーを自動選択する。
 * 常に openai を返す。
 */
export function selectWeeklyProvider(_dateStr: string): ResearchProvider {
  return 'openai';
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
