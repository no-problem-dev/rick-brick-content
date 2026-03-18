/**
 * TARGET_DATE 環境変数または当日日付を YYYY-MM-DD 形式で返す。
 */
export function getTodayDate(): string {
  return process.env.TARGET_DATE || new Date().toISOString().split('T')[0];
}
