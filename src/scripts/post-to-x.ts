/**
 * X (Twitter) 自動投稿スクリプト
 * 記事生成直後に X に投稿する。セルフリプライ戦略を使用。
 *
 * 本文: 感想・考察のみ（URL なし） → レコメンドアルゴリズムに最適化
 * セルフリプライ: 記事タイトル + URL（指定秒数後に自動投稿）
 *
 * 環境変数:
 *   TARGET_DATE          — 対象日付 (YYYY-MM-DD)。空欄で JST 当日
 *   X_API_KEY            — X API Consumer Key
 *   X_API_SECRET         — X API Consumer Secret
 *   X_ACCESS_TOKEN       — X Access Token
 *   X_ACCESS_TOKEN_SECRET — X Access Token Secret
 *   SITE_URL             — サイト URL (デフォルト: https://oct-rick-brick.com)
 *   DRY_RUN              — "true" で投稿をスキップ（ログのみ）
 *   OPENAI_API_KEY       — OpenAI API キー
 *   X_SELF_REPLY_DELAY   — セルフリプライまでの待機秒数（デフォルト: 0、post-generate側で制御）
 */

import {
  getArticlesByDate,
  buildJaArticleUrl,
  SITE_URL_DEFAULT,
} from '../utils/sns-post-builder.js';
import { generatePlatformComment } from '../utils/sns-comment-generator.js';
import { postTweet, postToXWithReply, type XApiCredentials } from '../utils/x-api.js';
import { logPost } from '../utils/sns-post-log.js';
import { ARTICLES_DIR } from '../config/constants.js';

function getTodayJST(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
}

async function main() {
  const targetDate = process.env.TARGET_DATE || getTodayJST();
  const siteUrl = process.env.SITE_URL || SITE_URL_DEFAULT;
  const dryRun = process.env.DRY_RUN === 'true';
  const selfReplyDelay = parseInt(process.env.X_SELF_REPLY_DELAY || '0', 10) * 1000;

  console.log(`Post to X: target_date=${targetDate}, dry_run=${dryRun}, self_reply_delay=${selfReplyDelay / 1000}s`);

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

  const articles = getArticlesByDate(ARTICLES_DIR, targetDate);

  if (articles.length === 0) {
    console.log(`No articles found for ${targetDate}`);
    process.exit(0);
  }

  console.log(`Found ${articles.length} article(s): ${articles.map((a) => a.articleId).join(', ')}`);

  let posted = 0;
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i]!;
    const url = buildJaArticleUrl(article.articleId, siteUrl);

    // プラットフォーム最適化されたコメントを生成（URL なし）
    const comment = await generatePlatformComment('x', article.title, article.summary);
    if (!comment) {
      console.warn(`Skipping ${article.articleId}: comment generation failed`);
      continue;
    }

    console.log(`\n--- X Post for ${article.articleId} ---`);
    console.log(`Main text (no URL): ${comment}`);
    console.log(`Self-reply: 📝 ${article.title}\n${url}`);
    console.log('---');

    if (dryRun) {
      console.log('(dry run — skipped posting)');
    } else {
      if (selfReplyDelay > 0) {
        // セルフリプライ付き: 本文投稿 → 待機 → リプライでURL
        const result = await postToXWithReply(comment, article.title, url, credentials, selfReplyDelay);
        if (result.success && result.tweetId) {
          console.log(`Posted with self-reply: tweet_id=${result.tweetId}`);
          logPost('x', result.tweetId, comment, 'notification', article.articleId);
          posted++;
        } else {
          console.error(`Failed to post: ${result.error}`);
        }
      } else {
        // セルフリプライなし（post-generate 側で別ステップとして制御）
        // 本文のみ投稿し、tweetId を stdout に出力（action.yml で拾う）
        const result = await postTweet(comment, credentials);
        if (result.success && result.tweetId) {
          console.log(`Posted main text: tweet_id=${result.tweetId}`);
          // tweetId をファイルに書き出す（post-generate action で使用）
          const fs = await import('node:fs');
          fs.mkdirSync('.tmp', { recursive: true });
          fs.writeFileSync('.tmp/x-tweet-id.txt', result.tweetId, 'utf-8');
          logPost('x', result.tweetId, comment, 'notification', article.articleId);
          posted++;
        } else {
          console.error(`Failed to post: ${result.error}`);
        }
      }

      if (i < articles.length - 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  console.log(`\nDone. Posted ${posted}/${articles.length} article(s) to X.`);
}

main().catch((error) => {
  console.error('Post to X error:', error);
  process.exit(0);
});
