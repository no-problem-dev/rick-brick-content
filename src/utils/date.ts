/**
 * TARGET_DATE 環境変数または当日日付（JST）を YYYY-MM-DD 形式で返す。
 */
export function getTodayDate(): string {
  if (process.env.TARGET_DATE) return process.env.TARGET_DATE;
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().split('T')[0];
}
