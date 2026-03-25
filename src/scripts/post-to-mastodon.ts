/**
 * Mastodon 自動投稿スクリプト
 * 生成された英語記事の frontmatter を読み取り、Mastodon に投稿する。
 *
 * 環境変数:
 *   TARGET_DATE           — 対象日付 (YYYY-MM-DD)。空欄で JST 当日
 *   MASTODON_INSTANCE_URL — Mastodon インスタンス URL (例: https://mastodon.social)
 *   MASTODON_ACCESS_TOKEN — Mastodon アクセストークン
 *   SITE_URL              — サイト URL (デフォルト: https://oct-rick-brick.com)
 *   DRY_RUN               — "true" で投稿をスキップ（ログのみ）
 */

import path from 'node:path';
import {
  getArticlesByDate,
  buildEnArticleUrl,
  buildEnPostText,
  SITE_URL_DEFAULT,
} from '../utils/sns-post-builder.js';
import { generateSnsComment } from '../utils/sns-comment-generator.js';
import { postToMastodon, type MastodonCredentials } from '../utils/mastodon-api.js';
import { ARTICLES_BASE_DIR } from '../config/constants.js';

function getTodayJST(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
}

async function main() {
  const targetDate = process.env.TARGET_DATE || getTodayJST();
  const siteUrl = process.env.SITE_URL || SITE_URL_DEFAULT;
  const dryRun = process.env.DRY_RUN === 'true';

  console.log(`Post to Mastodon: target_date=${targetDate}, dry_run=${dryRun}`);

  // Mastodon 認証情報チェック
  const credentials: MastodonCredentials = {
    instanceUrl: process.env.MASTODON_INSTANCE_URL || '',
    accessToken: process.env.MASTODON_ACCESS_TOKEN || '',
  };

  if (!dryRun && (!credentials.instanceUrl || !credentials.accessToken)) {
    console.error('Mastodon credentials are not set. Skipping post.');
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
    const postText = buildEnPostText(lines, url, 500);
    console.log(`\n--- Post for ${article.articleId} ---\n${postText}\n---`);

    if (dryRun) {
      console.log('(dry run — skipped posting)');
    } else {
      const result = await postToMastodon(postText, credentials);
      if (result.success) {
        console.log(`Posted successfully: url=${result.url}`);
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

  console.log(`\nDone. Posted ${posted}/${articles.length} article(s) to Mastodon.`);
}

main().catch((error) => {
  console.error('Post to Mastodon error:', error);
  process.exit(0); // ワークフロー失敗にしない
});
