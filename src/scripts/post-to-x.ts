/**
 * X (Twitter) 自動投稿スクリプト
 * 生成された記事の frontmatter を読み取り、X に投稿する。
 *
 * 環境変数:
 *   TARGET_DATE          — 対象日付 (YYYY-MM-DD)。空欄で JST 当日
 *   X_API_KEY            — X API Consumer Key
 *   X_API_SECRET         — X API Consumer Secret
 *   X_ACCESS_TOKEN       — X Access Token
 *   X_ACCESS_TOKEN_SECRET — X Access Token Secret
 *   SITE_URL             — サイト URL (デフォルト: https://oct-rick-brick.com)
 *   DRY_RUN              — "true" で投稿をスキップ（ログのみ）
 */

import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from '../utils/frontmatter.js';
import { formatTweet } from '../utils/tweet-formatter.js';
import { postTweet, type XApiCredentials } from '../utils/x-api.js';
import { ARTICLES_DIR } from '../config/constants.js';

function getTodayJST(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
}

async function main() {
  const targetDate = process.env.TARGET_DATE || getTodayJST();
  const siteUrl = process.env.SITE_URL || 'https://oct-rick-brick.com';
  const dryRun = process.env.DRY_RUN === 'true';

  console.log(`Post to X: target_date=${targetDate}, dry_run=${dryRun}`);

  // X API 認証情報チェック
  const credentials: XApiCredentials = {
    apiKey: process.env.X_API_KEY || '',
    apiSecret: process.env.X_API_SECRET || '',
    accessToken: process.env.X_ACCESS_TOKEN || '',
    accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET || '',
  };

  if (!dryRun && (!credentials.apiKey || !credentials.apiSecret || !credentials.accessToken || !credentials.accessTokenSecret)) {
    console.error('X API credentials are not set. Skipping post.');
    process.exit(0);
  }

  // 対象日付の記事を検索
  const articlesDir = path.resolve(ARTICLES_DIR);
  const files = fs.readdirSync(articlesDir)
    .filter((f) => f.startsWith(`${targetDate}-`) && f.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    console.log(`No articles found for ${targetDate}`);
    process.exit(0);
  }

  console.log(`Found ${files.length} article(s): ${files.join(', ')}`);

  let posted = 0;
  for (const file of files) {
    const filePath = path.join(articlesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter } = parseFrontmatter(content);

    // draft 記事はスキップ
    if (frontmatter.draft === true) {
      console.log(`Skipping draft: ${file}`);
      continue;
    }

    const articleId = file.replace(/\.md$/, '');
    const title = String(frontmatter.title || '');
    const summary = String(frontmatter.summary || '');
    const tags = Array.isArray(frontmatter.tags) ? (frontmatter.tags as string[]) : [];

    if (!title) {
      console.log(`Skipping (no title): ${file}`);
      continue;
    }

    const tweetText = formatTweet({ title, summary, tags, articleId }, siteUrl);
    console.log(`\n--- Tweet for ${file} ---\n${tweetText}\n---`);

    if (dryRun) {
      console.log('(dry run — skipped posting)');
    } else {
      const result = await postTweet(tweetText, credentials);
      if (result.success) {
        console.log(`Posted successfully: tweet_id=${result.tweetId}`);
        posted++;
      } else {
        console.error(`Failed to post: ${result.error}`);
      }

      // 複数記事がある場合はレートリミット回避のため待機
      if (files.indexOf(file) < files.length - 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  console.log(`\nDone. Posted ${posted}/${files.length} article(s) to X.`);
}

main().catch((error) => {
  console.error('Post to X error:', error);
  process.exit(0); // ワークフロー失敗にしない
});
