/**
 * Bluesky 自動投稿スクリプト
 * 生成された英語記事の frontmatter を読み取り、Bluesky に投稿する。
 *
 * 環境変数:
 *   TARGET_DATE      — 対象日付 (YYYY-MM-DD)。空欄で JST 当日
 *   BSKY_HANDLE      — Bluesky ハンドル (例: yourname.bsky.social)
 *   BSKY_APP_PASSWORD — Bluesky アプリパスワード
 *   SITE_URL         — サイト URL (デフォルト: https://oct-rick-brick.com)
 *   DRY_RUN          — "true" で投稿をスキップ（ログのみ）
 */

import path from 'node:path';
import {
  getArticlesByDate,
  buildEnArticleUrl,
  buildEnPostText,
  SITE_URL_DEFAULT,
} from '../utils/sns-post-builder.js';
import { generateSnsComment } from '../utils/sns-comment-generator.js';
import { postToBluesky, type BskyCredentials, type LinkCard } from '../utils/bluesky-api.js';
import { ARTICLES_BASE_DIR } from '../config/constants.js';

function getTodayJST(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
}

async function main() {
  const targetDate = process.env.TARGET_DATE || getTodayJST();
  const siteUrl = process.env.SITE_URL || SITE_URL_DEFAULT;
  const dryRun = process.env.DRY_RUN === 'true';

  console.log(`Post to Bluesky: target_date=${targetDate}, dry_run=${dryRun}`);

  // Bluesky 認証情報チェック
  const credentials: BskyCredentials = {
    handle: process.env.BSKY_HANDLE || '',
    appPassword: process.env.BSKY_APP_PASSWORD || '',
  };

  if (!dryRun && (!credentials.handle || !credentials.appPassword)) {
    console.error('Bluesky credentials are not set. Skipping post.');
    process.exit(0);
  }

  // 対象日付の英語記事を検索
  const articlesDir = path.join(ARTICLES_BASE_DIR, 'en');
  const articles = getArticlesByDate(articlesDir, targetDate);

  if (articles.length === 0) {
    console.log(`No articles found for ${targetDate}`);
    process.exit(0);
  }

  console.log(`Found ${articles.length} article(s): ${articles.map((a) => a.articleId).join(', ')}`);

  let posted = 0;
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i]!;

    // OpenAI API で人間っぽい一言コメントを生成
    const comment = await generateSnsComment({ title: article.title, summary: article.summary, language: 'en' });

    const header = '\u{1F4DD} New article posted';
    const lines: string[] = [header];
    if (comment) {
      lines.push(`${article.title}\n${comment}`);
    } else {
      lines.push(article.title);
    }

    const url = buildEnArticleUrl(article.articleId, siteUrl);
    const postText = buildEnPostText(lines, url, 300);
    console.log(`\n--- Post for ${article.articleId} ---\n${postText}\n---`);

    // リンクカード（OGP画像付きプレビュー）
    const linkCard: LinkCard = {
      url,
      title: article.title,
      description: article.summary,
    };

    if (dryRun) {
      console.log('(dry run — skipped posting)');
    } else {
      const result = await postToBluesky(postText, credentials, linkCard);
      if (result.success) {
        console.log(`Posted successfully: uri=${result.uri}`);
        posted++;
      } else {
        console.error(`Failed to post: ${result.error}`);
      }

      // 複数記事がある場合はレートリミット回避のため待機
      if (i < articles.length - 1) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  console.log(`\nDone. Posted ${posted}/${articles.length} article(s) to Bluesky.`);
}

main().catch((error) => {
  console.error('Post to Bluesky error:', error);
  process.exit(0); // ワークフロー失敗にしない
});
