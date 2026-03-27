import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// logPost と getPostLog をテスト
// data/sns-post-log.json へのファイル I/O をモックする

const TEST_LOG_FILE = path.resolve('data/sns-post-log.json');

describe('sns-post-log', () => {
  let logPost: typeof import('../utils/sns-post-log.js').logPost;
  let getPostLog: typeof import('../utils/sns-post-log.js').getPostLog;

  beforeEach(async () => {
    // テスト前にファイルをクリーンアップ
    if (fs.existsSync(TEST_LOG_FILE)) {
      fs.writeFileSync(TEST_LOG_FILE, '[]', 'utf-8');
    }
    // モジュールを再ロード
    vi.resetModules();
    const mod = await import('../utils/sns-post-log.js');
    logPost = mod.logPost;
    getPostLog = mod.getPostLog;
  });

  afterEach(() => {
    // テスト後にクリーンアップ
    if (fs.existsSync(TEST_LOG_FILE)) {
      fs.writeFileSync(TEST_LOG_FILE, '[]', 'utf-8');
    }
  });

  it('空のログファイルから空配列を返す', () => {
    const log = getPostLog();
    expect(log).toEqual([]);
  });

  it('logPost でエントリを追加し getPostLog で取得できる', () => {
    logPost('x', 'tweet123', 'Test tweet text', 'notification', 'article-1');

    const log = getPostLog();
    expect(log).toHaveLength(1);
    expect(log[0]).toMatchObject({
      platform: 'x',
      postId: 'tweet123',
      text: 'Test tweet text',
      type: 'notification',
      articleId: 'article-1',
    });
    expect(log[0]!.timestamp).toBeTruthy();
  });

  it('複数エントリを追記できる', () => {
    logPost('x', 'tweet1', 'Text 1', 'notification');
    logPost('bluesky', 'at://uri/1', 'Text 2', 'scheduled', 'article-2');
    logPost('mastodon', 'https://mastodon.social/@user/123', 'Text 3', 'notification');

    const log = getPostLog();
    expect(log).toHaveLength(3);
    expect(log[0]!.platform).toBe('x');
    expect(log[1]!.platform).toBe('bluesky');
    expect(log[2]!.platform).toBe('mastodon');
  });

  it('articleId は省略可能', () => {
    logPost('x', 'tweet1', 'Text', 'scheduled');
    const log = getPostLog();
    expect(log[0]!.articleId).toBeUndefined();
  });
});
