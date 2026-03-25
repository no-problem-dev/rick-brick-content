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

import {
  getArticlesByDate,
  buildJaArticleUrl,
  buildXPostText,
  SITE_URL_DEFAULT,
} from '../utils/sns-post-builder.js';
import { generateSnsComment } from '../utils/sns-comment-generator.js';
import { postTweet, type XApiCredentials } from '../utils/x-api.js';
import { ARTICLES_DIR } from '../config/constants.js';

function getTodayJST(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
}

async function main() {
  const targetDate = process.env.TARGET_DATE || getTodayJST();
  const siteUrl = process.env.SITE_URL || SITE_URL_DEFAULT;
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
  const articles = getArticlesByDate(ARTICLES_DIR, targetDate);

  if (articles.length === 0) {
    console.log(`No articles found for ${targetDate}`);
    process.exit(0);
  }

  console.log(`Found ${articles.length} article(s): ${articles.map((a) => a.articleId).join(', ')}`);

  let posted = 0;
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i]!;

    // OpenAI API で人間っぽい一言コメントを生成
    const comment = await generateSnsComment({ title: article.title, summary: article.summary, language: 'ja' });

    const header = '\u{1F4DD} \u65B0\u3057\u3044\u8A18\u4E8B\u3092\u6295\u7A3F\u3057\u307E\u3057\u305F';
    const lines: string[] = [header];
    if (comment) {
      lines.push(`${article.title}\n${comment}`);
    } else {
      lines.push(article.title);
    }

    const url = buildJaArticleUrl(article.articleId, siteUrl);
    const tweetText = buildXPostText(lines, url);
    console.log(`\n--- Tweet for ${article.articleId} ---\n${tweetText}\n---`);

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
      if (i < articles.length - 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  console.log(`\nDone. Posted ${posted}/${articles.length} article(s) to X.`);
}

main().catch((error) => {
  console.error('Post to X error:', error);
  process.exit(0); // ワークフロー失敗にしない
});
