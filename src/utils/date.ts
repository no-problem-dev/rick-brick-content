import { CATEGORY_PUBLISH_TIME } from '../config/constants.js';

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
 * YYYY-MM-DD 形式の日付にカテゴリ別の公開時刻を付与し、YYYY-MM-DDTHH:MM 形式で返す。
 * CATEGORY_PUBLISH_TIME に定義がないカテゴリは 00:00 をフォールバックとする。
 */
export function getPublishDateTime(date: string, category: string): string {
  const time = CATEGORY_PUBLISH_TIME[category] ?? '00:00';
  return `${date}T${time}`;
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
