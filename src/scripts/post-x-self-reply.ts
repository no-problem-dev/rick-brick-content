/**
 * X セルフリプライ投稿スクリプト
 * post-generate パイプラインで deploy 完了後に呼ばれる。
 * .tmp/x-tweet-id.txt に記録された tweetId に対して
 * 記事タイトル + URL のリプライを投稿する。
 *
 * 環境変数:
 *   TARGET_DATE          — 対象日付 (YYYY-MM-DD)
 *   X_API_KEY            — X API Consumer Key
 *   X_API_SECRET         — X API Consumer Secret
 *   X_ACCESS_TOKEN       — X Access Token
 *   X_ACCESS_TOKEN_SECRET — X Access Token Secret
 *   SITE_URL             — サイト URL (デフォルト: https://oct-rick-brick.com)
 */

import fs from 'node:fs';
import {
  getArticlesByDate,
  buildJaArticleUrl,
  SITE_URL_DEFAULT,
} from '../utils/sns-post-builder.js';
import { postTweet, type XApiCredentials } from '../utils/x-api.js';
import { ARTICLES_DIR } from '../config/constants.js';

function getTodayJST(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
}

async function main() {
  const targetDate = process.env.TARGET_DATE || getTodayJST();
  const siteUrl = process.env.SITE_URL || SITE_URL_DEFAULT;

  // .tmp/x-tweet-id.txt から tweetId を読み取る
  const tweetIdFile = '.tmp/x-tweet-id.txt';
  if (!fs.existsSync(tweetIdFile)) {
    console.log('No tweet ID file found. Nothing to reply to.');
    return;
  }

  const tweetId = fs.readFileSync(tweetIdFile, 'utf-8').trim();
  if (!tweetId) {
    console.log('Tweet ID file is empty. Nothing to reply to.');
    return;
  }

  console.log(`Self-reply target: tweet_id=${tweetId}`);

  const credentials: XApiCredentials = {
    apiKey: process.env.X_API_KEY || '',
    apiSecret: process.env.X_API_SECRET || '',
    accessToken: process.env.X_ACCESS_TOKEN || '',
    accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET || '',
  };

  if (!credentials.apiKey || !credentials.apiSecret || !credentials.accessToken || !credentials.accessTokenSecret) {
    console.error('X API credentials are not set. Skipping self-reply.');
    return;
  }

  const articles = getArticlesByDate(ARTICLES_DIR, targetDate);
  if (articles.length === 0) {
    console.log(`No articles found for ${targetDate}. Skipping self-reply.`);
    return;
  }

  // 最初の記事のタイトルとURLでリプライ（複数記事の場合は最初のもの）
  const article = articles[0]!;
  const url = buildJaArticleUrl(article.articleId, siteUrl);
  const replyText = `\u{1F4DD} ${article.title}\n${url}`;

  console.log(`Replying: ${replyText}`);

  const result = await postTweet(replyText, credentials, {
    reply: { in_reply_to_tweet_id: tweetId },
  });

  if (result.success) {
    console.log(`Self-reply posted: tweet_id=${result.tweetId}`);
  } else {
    console.error(`Self-reply failed: ${result.error}`);
  }

  // クリーンアップ
  fs.unlinkSync(tweetIdFile);
}

main().catch((error) => {
  console.error('X self-reply error:', error);
  process.exit(0);
});
