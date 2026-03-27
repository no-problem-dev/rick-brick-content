/**
 * 定時 SNS 投稿スクリプト
 * 直近2記事から1トピックをピックアップし、プラットフォーム別に
 * 最適化されたコメントを生成して各 SNS に投稿する。
 *
 * X: セルフリプライ戦略（本文にURLを含めず、120秒後にリプライでURL投稿）
 * Bluesky: リンクカード付き投稿（ペナルティなし）
 * Mastodon: ハッシュタグ付き投稿（Trending狙い）
 *
 * 環境変数:
 *   OPENAI_API_KEY           — OpenAI API キー
 *   X_API_KEY                — X API Consumer Key
 *   X_API_SECRET             — X API Consumer Secret
 *   X_ACCESS_TOKEN           — X Access Token
 *   X_ACCESS_TOKEN_SECRET    — X Access Token Secret
 *   BSKY_HANDLE              — Bluesky ハンドル
 *   BSKY_APP_PASSWORD        — Bluesky アプリパスワード
 *   MASTODON_INSTANCE_URL    — Mastodon インスタンス URL
 *   MASTODON_ACCESS_TOKEN    — Mastodon アクセストークン
 *   SITE_URL                 — サイト URL (デフォルト: https://oct-rick-brick.com)
 *   DRY_RUN                  — "true" で投稿をスキップ（ログのみ）
 */

import path from 'node:path';
import {
  getRecentArticles,
  buildJaArticleUrl,
  buildEnArticleUrl,
  buildEnPostText,
  callOpenAI,
  SITE_URL_DEFAULT,
  type ArticleForSns,
} from '../utils/sns-post-builder.js';
import { postToXWithReply, type XApiCredentials } from '../utils/x-api.js';
import { postToBluesky, type BskyCredentials, type LinkCard } from '../utils/bluesky-api.js';
import { postToMastodon, type MastodonCredentials } from '../utils/mastodon-api.js';
import { logPost } from '../utils/sns-post-log.js';
import { readStrategy, getTopPostsForPlatform, getCrossPlatformTopPosts } from '../utils/sns-strategy.js';
import { buildXScheduledPrompt } from '../prompts/sns-x.js';
import { buildBlueskyScheduledPrompt } from '../prompts/sns-bluesky.js';
import { buildMastodonScheduledPrompt } from '../prompts/sns-mastodon.js';
import { ARTICLES_DIR, ARTICLES_BASE_DIR } from '../config/constants.js';

const BSKY_MAX_LENGTH = 300;
const MASTODON_MAX_LENGTH = 500;

// ---------------------------------------------------------------------------
// トピック選定+感想生成（プラットフォーム別プロンプト対応）
// ---------------------------------------------------------------------------

interface GeneratedComment {
  comment: string;
  articleIndex: number;
  topic: string;
}

function buildArticleTopics(articles: ArticleForSns[]) {
  return articles.map((a) => ({
    title: a.title,
    topics: a.snsTopics.length > 0
      ? a.snsTopics
      : [{ topic: a.title, summary: a.summary }],
  }));
}

async function generateScheduledComment(
  articles: ArticleForSns[],
  platform: 'x' | 'bluesky' | 'mastodon',
): Promise<GeneratedComment | null> {
  const strategy = readStrategy();
  const topPosts = getTopPostsForPlatform(strategy, platform, 3);
  const crossPlatformTopPosts = getCrossPlatformTopPosts(strategy, 3);
  const platformStrategy = strategy?.platforms.find((p) => p.platform === platform);
  const guidelines = platformStrategy?.guidelines || '';
  const commonPatterns = strategy?.crossPlatform?.commonPatterns || '';

  const articleTopics = buildArticleTopics(articles);

  let prompt: string;
  switch (platform) {
    case 'x':
      prompt = buildXScheduledPrompt(articleTopics, topPosts, crossPlatformTopPosts, guidelines, commonPatterns);
      break;
    case 'bluesky':
      prompt = buildBlueskyScheduledPrompt(articleTopics, topPosts, crossPlatformTopPosts, guidelines, commonPatterns);
      break;
    case 'mastodon':
      prompt = buildMastodonScheduledPrompt(articleTopics, topPosts, crossPlatformTopPosts, guidelines, commonPatterns);
      break;
  }

  const rawText = await callOpenAI(prompt);

  if (!rawText) {
    console.warn(`Comment generation (${platform}) returned empty text.`);
    return null;
  }

  try {
    const jsonMatch = rawText.match(/\{[\s\S]*"comment"[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn(`Failed to extract JSON from response (${platform}): ${rawText}`);
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      comment: string;
      article_index: number;
      topic?: string;
    };

    const articleIndex =
      parsed.article_index >= 1 && parsed.article_index <= articles.length
        ? parsed.article_index
        : 1;

    console.log(
      `Generated comment (${platform}): ${parsed.comment} [article ${articleIndex}, topic: ${parsed.topic || 'N/A'}]`,
    );

    return {
      comment: parsed.comment,
      articleIndex,
      topic: parsed.topic || '',
    };
  } catch (error) {
    console.error(`Comment generation parse error (${platform}):`, error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// メイン処理
// ---------------------------------------------------------------------------

async function main() {
  const siteUrl = process.env.SITE_URL || SITE_URL_DEFAULT;
  const dryRun = process.env.DRY_RUN === 'true';

  console.log(`Scheduled SNS Post: dry_run=${dryRun}`);

  const jaArticles = getRecentArticles(ARTICLES_DIR, 2);
  const enArticles = getRecentArticles(
    path.join(ARTICLES_BASE_DIR, 'en'),
    2,
  );

  if (jaArticles.length === 0 && enArticles.length === 0) {
    console.log('No articles found. Exiting.');
    process.exit(0);
  }

  console.log(`Found JA articles: ${jaArticles.map((a) => a.articleId).join(', ')}`);
  console.log(`Found EN articles: ${enArticles.map((a) => a.articleId).join(', ')}`);

  const articlesForJa = jaArticles.length > 0 ? jaArticles : enArticles;
  const articlesForEn = enArticles.length > 0 ? enArticles : jaArticles;

  // プラットフォーム別にコメントを生成
  const [xResult, bskyResult, mastodonResult] = await Promise.all([
    generateScheduledComment(articlesForJa, 'x'),
    generateScheduledComment(articlesForEn, 'bluesky'),
    generateScheduledComment(articlesForEn, 'mastodon'),
  ]);

  // --- X (日本語) — セルフリプライ戦略 ---
  if (xResult) {
    const selectedArticle = articlesForJa[xResult.articleIndex - 1]!;
    const url = buildJaArticleUrl(selectedArticle.articleId, siteUrl);

    // 本文は感想・考察のみ（URL なし）
    console.log(`\n--- X Post (main text, no URL) ---\n${xResult.comment}\n---`);

    if (dryRun) {
      console.log('(dry run - skipped X post)');
    } else {
      const credentials: XApiCredentials = {
        apiKey: process.env.X_API_KEY || '',
        apiSecret: process.env.X_API_SECRET || '',
        accessToken: process.env.X_ACCESS_TOKEN || '',
        accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET || '',
      };

      if (credentials.apiKey && credentials.apiSecret && credentials.accessToken && credentials.accessTokenSecret) {
        try {
          const result = await postToXWithReply(
            xResult.comment,
            selectedArticle.title,
            url,
            credentials,
          );
          if (result.success && result.tweetId) {
            console.log(`X: Posted successfully (tweet_id=${result.tweetId})`);
            logPost('x', result.tweetId, xResult.comment, 'scheduled', selectedArticle.articleId);
          } else {
            console.error(`X: Failed to post: ${result.error}`);
          }
        } catch (error) {
          console.error('X: Post error:', error);
        }
      } else {
        console.warn('X: Credentials not set. Skipping.');
      }
    }
  } else {
    console.log('Skipping X post (no comment generated).');
  }

  // --- Bluesky (英語) ---
  if (bskyResult) {
    const selectedArticle = articlesForEn[bskyResult.articleIndex - 1]!;
    const url = buildEnArticleUrl(selectedArticle.articleId, siteUrl);
    const lines = [bskyResult.comment];
    const bskyPost = buildEnPostText(lines, url, BSKY_MAX_LENGTH);
    console.log(`\n--- Bluesky Post ---\n${bskyPost}\n---`);

    if (dryRun) {
      console.log('(dry run - skipped Bluesky post)');
    } else {
      const credentials: BskyCredentials = {
        handle: process.env.BSKY_HANDLE || '',
        appPassword: process.env.BSKY_APP_PASSWORD || '',
      };

      if (credentials.handle && credentials.appPassword) {
        const linkCard: LinkCard = {
          url,
          title: selectedArticle.title,
          description: selectedArticle.summary,
        };
        try {
          const result = await postToBluesky(bskyPost, credentials, linkCard);
          if (result.success && result.uri) {
            console.log(`Bluesky: Posted successfully (uri=${result.uri})`);
            logPost('bluesky', result.uri, bskyPost, 'scheduled', selectedArticle.articleId);
          } else {
            console.error(`Bluesky: Failed to post: ${result.error}`);
          }
        } catch (error) {
          console.error('Bluesky: Post error:', error);
        }
      } else {
        console.warn('Bluesky: Credentials not set. Skipping.');
      }
    }
  } else {
    console.log('Skipping Bluesky post (no comment generated).');
  }

  // --- Mastodon (英語) ---
  if (mastodonResult) {
    const selectedArticle = articlesForEn[mastodonResult.articleIndex - 1]!;
    const url = buildEnArticleUrl(selectedArticle.articleId, siteUrl);
    const lines = [mastodonResult.comment];
    const mastodonPost = buildEnPostText(lines, url, MASTODON_MAX_LENGTH);
    console.log(`\n--- Mastodon Post ---\n${mastodonPost}\n---`);

    if (dryRun) {
      console.log('(dry run - skipped Mastodon post)');
    } else {
      const credentials: MastodonCredentials = {
        instanceUrl: process.env.MASTODON_INSTANCE_URL || '',
        accessToken: process.env.MASTODON_ACCESS_TOKEN || '',
      };

      if (credentials.instanceUrl && credentials.accessToken) {
        try {
          const result = await postToMastodon(mastodonPost, credentials);
          if (result.success && result.url) {
            console.log(`Mastodon: Posted successfully (url=${result.url})`);
            logPost('mastodon', result.url, mastodonPost, 'scheduled', selectedArticle.articleId);
          } else {
            console.error(`Mastodon: Failed to post: ${result.error}`);
          }
        } catch (error) {
          console.error('Mastodon: Post error:', error);
        }
      } else {
        console.warn('Mastodon: Credentials not set. Skipping.');
      }
    }
  } else {
    console.log('Skipping Mastodon post (no comment generated).');
  }

  console.log('\nScheduled SNS post completed.');
}

main().catch((error) => {
  console.error('Scheduled SNS post error:', error);
  process.exit(0);
});
