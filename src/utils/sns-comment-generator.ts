/**
 * SNS 投稿用コメント生成ユーティリティ
 * プラットフォーム別に最適化されたプロンプトでコメントを生成する。
 *
 * 環境変数:
 *   OPENAI_API_KEY — OpenAI API キー
 */

import { callOpenAI } from './sns-post-builder.js';
import {
  readStrategy,
  getTopPostsForPlatform,
  getCrossPlatformTopPosts,
  type SnsStrategy,
} from './sns-strategy.js';
import type { SnsPlatform } from './sns-post-log.js';
import { buildXNotificationPrompt } from '../prompts/sns-x.js';
import { buildBlueskyNotificationPrompt } from '../prompts/sns-bluesky.js';
import { buildMastodonNotificationPrompt } from '../prompts/sns-mastodon.js';

interface CommentInput {
  title: string;
  summary: string;
  language: 'ja' | 'en';
}

/**
 * プラットフォーム非依存の簡易コメント生成（後方互換）
 * 成功事例がまだない初期フェーズで使用される。
 */
export async function generateSnsComment(input: CommentInput): Promise<string> {
  const languageInstruction =
    input.language === 'ja'
      ? '日本語で、人間が書いたような自然な感想を1文で書いてください。50文字程度の短い感想にしてください。'
      : 'Write a natural, human-like one-sentence comment in English. Keep it around 50 characters.';

  const prompt = `以下の記事について、SNS投稿用の一言コメントを生成してください。

記事タイトル: ${input.title}
記事の要約: ${input.summary}

${languageInstruction}
ハッシュタグや絵文字は含めないでください。記事の内容に対する個人的な感想や注目ポイントを述べてください。`;

  const text = await callOpenAI(prompt);

  if (!text) {
    console.warn('SNS comment generation returned empty text.');
    return '';
  }

  console.log(`Generated SNS comment (${input.language}): ${text}`);
  return text;
}

/**
 * プラットフォーム別の最適化されたコメントを生成する
 */
export async function generatePlatformComment(
  platform: SnsPlatform,
  title: string,
  summary: string,
): Promise<string> {
  const strategy = readStrategy();

  const topPosts = getTopPostsForPlatform(strategy, platform, 3);
  const crossPlatformTopPosts = getCrossPlatformTopPosts(strategy, 3);
  const platformStrategy = strategy?.platforms.find((p) => p.platform === platform);
  const guidelines = platformStrategy?.guidelines || '';
  const commonPatterns = strategy?.crossPlatform?.commonPatterns || '';

  let prompt: string;

  switch (platform) {
    case 'x':
      prompt = buildXNotificationPrompt({
        title,
        summary,
        topPosts,
        crossPlatformTopPosts,
        guidelines,
        commonPatterns,
      });
      break;
    case 'bluesky':
      prompt = buildBlueskyNotificationPrompt({
        title,
        summary,
        topPosts,
        crossPlatformTopPosts,
        guidelines,
        commonPatterns,
      });
      break;
    case 'mastodon':
      prompt = buildMastodonNotificationPrompt({
        title,
        summary,
        topPosts,
        crossPlatformTopPosts,
        guidelines,
        commonPatterns,
      });
      break;
  }

  const text = await callOpenAI(prompt);

  if (!text) {
    console.warn(`Platform comment generation (${platform}) returned empty text.`);
    return '';
  }

  console.log(`Generated ${platform} comment: ${text}`);
  return text;
}

/**
 * 戦略データを取得する（外部から利用可能）
 */
export function getStrategy(): SnsStrategy | null {
  return readStrategy();
}
