/**
 * SNS 投稿ログ記録ユーティリティ
 * 投稿実行時に postId/URI とテキストを data/sns-post-log.json に記録する。
 * メトリクス収集スクリプトがこのログを参照して各 API からエンゲージメントを取得する。
 */

import fs from 'node:fs';
import path from 'node:path';

const LOG_FILE = path.resolve('data/sns-post-log.json');

export type SnsPlatform = 'x' | 'bluesky' | 'mastodon';
export type SnsPostType = 'notification' | 'scheduled';

export interface PostLogEntry {
  platform: SnsPlatform;
  postId: string;
  text: string;
  articleId?: string;
  type: SnsPostType;
  timestamp: string;
}

function getNowJST(): string {
  return new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Tokyo' }).replace(' ', 'T') + '+09:00';
}

function readLog(): PostLogEntry[] {
  try {
    if (!fs.existsSync(LOG_FILE)) return [];
    const raw = fs.readFileSync(LOG_FILE, 'utf-8').trim();
    if (!raw) return [];
    return JSON.parse(raw) as PostLogEntry[];
  } catch {
    console.warn('Failed to read sns-post-log.json, starting fresh.');
    return [];
  }
}

function writeLog(entries: PostLogEntry[]): void {
  const dir = path.dirname(LOG_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(LOG_FILE, JSON.stringify(entries, null, 2) + '\n', 'utf-8');
}

/**
 * 投稿ログを追記する
 */
export function logPost(
  platform: SnsPlatform,
  postId: string,
  text: string,
  type: SnsPostType,
  articleId?: string,
): void {
  const entries = readLog();
  entries.push({
    platform,
    postId,
    text,
    articleId,
    type,
    timestamp: getNowJST(),
  });
  writeLog(entries);
  console.log(`Post logged: platform=${platform}, postId=${postId}, type=${type}`);
}

/**
 * 全ログエントリを取得する
 */
export function getPostLog(): PostLogEntry[] {
  return readLog();
}
