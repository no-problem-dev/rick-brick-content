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

import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from '../utils/frontmatter.js';
import { formatPost } from '../utils/post-formatter.js';
import { postToMastodon, type MastodonCredentials } from '../utils/mastodon-api.js';
import { ARTICLES_BASE_DIR } from '../config/constants.js';

function getTodayJST(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
}

async function main() {
  const targetDate = process.env.TARGET_DATE || getTodayJST();
  const siteUrl = process.env.SITE_URL || 'https://oct-rick-brick.com';
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
  const articlesDir = path.resolve(path.join(ARTICLES_BASE_DIR, 'en'));
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

    const postText = formatPost({ title, summary, tags, articleId }, siteUrl, 500);
    console.log(`\n--- Post for ${file} ---\n${postText}\n---`);

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
      if (files.indexOf(file) < files.length - 1) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  console.log(`\nDone. Posted ${posted}/${files.length} article(s) to Mastodon.`);
}

main().catch((error) => {
  console.error('Post to Mastodon error:', error);
  process.exit(0); // ワークフロー失敗にしない
});
