const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

/**
 * Date オブジェクトを JST として YYYY-MM-DD 形式に変換する。
 */
export function formatDateJST(date: Date): string {
  const jst = new Date(date.getTime() + JST_OFFSET_MS);
  return jst.toISOString().split('T')[0]!;
}

/**
 * TARGET_DATE 環境変数または当日日付（JST）を YYYY-MM-DD 形式で返す。
 */
export function getTodayDate(): string {
  if (process.env.TARGET_DATE) return process.env.TARGET_DATE;
  return formatDateJST(new Date());
}

/**
 * 基準日から N 日前の日付を YYYY-MM-DD 形式（JST）で返す。
 * baseDate は YYYY-MM-DD 形式の JST 日付文字列を想定。
 */
export function daysAgoJST(baseDate: string, days: number): string {
  // baseDate を JST 正午として解釈し、日付境界のズレを防止
  const date = new Date(`${baseDate}T12:00:00+09:00`);
  date.setDate(date.getDate() - days);
  return formatDateJST(date);
}
