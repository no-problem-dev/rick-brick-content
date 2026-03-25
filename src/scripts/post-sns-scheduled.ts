/**
 * 定時 SNS 投稿スクリプト
 * 直近2記事から1トピックをピックアップし、OpenAI API で
 * 人間らしい感想+知見・考察を生成して各 SNS に投稿する。
 *
 * sns_topics フィールドを使用してトピック選定を行う。
 * sns_topics がない記事（既存記事）へのフォールバック: summary を使用。
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
  buildXPostText,
  buildEnPostText,
  callOpenAI,
  SITE_URL_DEFAULT,
  type ArticleForSns,
} from '../utils/sns-post-builder.js';
import { postTweet, type XApiCredentials } from '../utils/x-api.js';
import { postToBluesky, type BskyCredentials, type LinkCard } from '../utils/bluesky-api.js';
import { postToMastodon, type MastodonCredentials } from '../utils/mastodon-api.js';
import { ARTICLES_DIR, ARTICLES_BASE_DIR } from '../config/constants.js';

const BSKY_MAX_LENGTH = 300;
const MASTODON_MAX_LENGTH = 500;

// ---------------------------------------------------------------------------
// OpenAI API でトピック選定+感想生成
// ---------------------------------------------------------------------------

interface GeneratedComment {
  comment: string;
  articleIndex: number; // 1-based
  topic: string;
}

/**
 * sns_topics ベースのプロンプトでトピック選定+感想を生成する
 */
function buildTopicPrompt(articles: ArticleForSns[], language: 'ja' | 'en'): string {
  const articleTexts = articles
    .map((a, i) => {
      const topicLines =
        a.snsTopics.length > 0
          ? a.snsTopics.map((t) => `- ${t.topic}: ${t.summary}`).join('\n')
          : `- ${a.summary}`;
      return `${a.title}\u306E\u30C8\u30D4\u30C3\u30AF:\n${topicLines}`;
    })
    .join('\n\n');

  if (language === 'ja') {
    return `以下の記事のトピック一覧から、1つのトピックを選んでください。
選んだトピックについて、テックブログ運営者が個人的に感じた自然な感想を述べ、
そこから得られる知見や考察を加えてください。

全体で100-200文字程度に収めてください。
ハッシュタグや絵文字は使わないでください。
「〜について書きました」のような自己言及はしないでください。

${articleTexts}

以下のJSON形式で返してください:
{"comment": "感想と考察", "article_index": 1, "topic": "選んだトピック名"}`;
  }

  // English
  const articleTextsEn = articles
    .map((a) => {
      const topicLines =
        a.snsTopics.length > 0
          ? a.snsTopics.map((t) => `- ${t.topic}: ${t.summary}`).join('\n')
          : `- ${a.summary}`;
      return `Topics from "${a.title}":\n${topicLines}`;
    })
    .join('\n\n');

  return `From the following article topics, pick one topic.
Write a natural, human-like comment about the chosen topic as if you're the tech blog owner,
and add insight or observation.

Keep the total around 100-200 characters.
Do not use hashtags or emojis.
Do not use self-referencing phrases like "I wrote about...".

${articleTextsEn}

Return in the following JSON format:
{"comment": "your comment text", "article_index": 1, "topic": "chosen topic name"}`;
}

async function generateScheduledComment(
  articles: ArticleForSns[],
  language: 'ja' | 'en',
): Promise<GeneratedComment | null> {
  const prompt = buildTopicPrompt(articles, language);
  const rawText = await callOpenAI(prompt);

  if (!rawText) {
    console.warn('Comment generation returned empty text.');
    return null;
  }

  try {
    // JSON をパース（```json``` ブロック内かもしれないので柔軟にパース）
    const jsonMatch = rawText.match(/\{[\s\S]*"comment"[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn(`Failed to extract JSON from response: ${rawText}`);
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
      `Generated comment (${language}): ${parsed.comment} [article ${articleIndex}, topic: ${parsed.topic || 'N/A'}]`,
    );

    return {
      comment: parsed.comment,
      articleIndex,
      topic: parsed.topic || '',
    };
  } catch (error) {
    console.error('Comment generation parse error:', error);
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

  // 直近2記事を取得（日本語・英語）
  const jaArticles = getRecentArticles(ARTICLES_DIR, 2);
  const enArticles = getRecentArticles(
    path.join(ARTICLES_BASE_DIR, 'en'),
    2,
  );

  if (jaArticles.length === 0 && enArticles.length === 0) {
    console.log('No articles found. Exiting.');
    process.exit(0);
  }

  console.log(
    `Found JA articles: ${jaArticles.map((a) => a.articleId).join(', ')}`,
  );
  console.log(
    `Found EN articles: ${enArticles.map((a) => a.articleId).join(', ')}`,
  );

  // OpenAI API でコメント生成
  const articlesForJa = jaArticles.length > 0 ? jaArticles : enArticles;
  const articlesForEn = enArticles.length > 0 ? enArticles : jaArticles;

  const [jaResult, enResult] = await Promise.all([
    generateScheduledComment(articlesForJa, 'ja'),
    generateScheduledComment(articlesForEn, 'en'),
  ]);

  // --- X (日本語) ---
  if (jaResult) {
    const selectedArticle = articlesForJa[jaResult.articleIndex - 1]!;
    const clipEmoji = '\u{1F4CE}'; // 📎
    const lines = [jaResult.comment, `${clipEmoji} ${selectedArticle.title}`];
    const url = buildJaArticleUrl(selectedArticle.articleId, siteUrl);
    const xPost = buildXPostText(lines, url);
    console.log(`\n--- X Post ---\n${xPost}\n---`);

    if (dryRun) {
      console.log('(dry run - skipped X post)');
    } else {
      const credentials: XApiCredentials = {
        apiKey: process.env.X_API_KEY || '',
        apiSecret: process.env.X_API_SECRET || '',
        accessToken: process.env.X_ACCESS_TOKEN || '',
        accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET || '',
      };

      if (
        credentials.apiKey &&
        credentials.apiSecret &&
        credentials.accessToken &&
        credentials.accessTokenSecret
      ) {
        try {
          const result = await postTweet(xPost, credentials);
          if (result.success) {
            console.log(`X: Posted successfully (tweet_id=${result.tweetId})`);
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
    console.log('Skipping X post (no JA comment generated).');
  }

  // --- Bluesky (英語) ---
  if (enResult) {
    const selectedArticle = articlesForEn[enResult.articleIndex - 1]!;
    const clipEmoji = '\u{1F4CE}'; // 📎
    const lines = [enResult.comment, `${clipEmoji} ${selectedArticle.title}`];
    const url = buildEnArticleUrl(selectedArticle.articleId, siteUrl);
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
          if (result.success) {
            console.log(`Bluesky: Posted successfully (uri=${result.uri})`);
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
    console.log('Skipping Bluesky post (no EN comment generated).');
  }

  // --- Mastodon (英語) ---
  if (enResult) {
    const selectedArticle = articlesForEn[enResult.articleIndex - 1]!;
    const clipEmoji = '\u{1F4CE}'; // 📎
    const lines = [enResult.comment, `${clipEmoji} ${selectedArticle.title}`];
    const url = buildEnArticleUrl(selectedArticle.articleId, siteUrl);
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
          if (result.success) {
            console.log(`Mastodon: Posted successfully (url=${result.url})`);
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
    console.log('Skipping Mastodon post (no EN comment generated).');
  }

  console.log('\nScheduled SNS post completed.');
}

main().catch((error) => {
  console.error('Scheduled SNS post error:', error);
  process.exit(0); // ワークフロー失敗にしない
});
