/**
 * X (Twitter) 専用 SNS 投稿プロンプト
 * レコメンドアルゴリズムの外部リンクペナルティを回避するため、
 * 本文には URL を含めず、純粋な感想・考察のみを生成する。
 */

import type { PostMetrics } from '../utils/sns-strategy.js';

interface XPromptInput {
  title: string;
  summary: string;
  topPosts: Array<{ text: string; score: number; metrics: PostMetrics['metrics'] }>;
  crossPlatformTopPosts: Array<{
    text: string;
    platform: string;
    normalizedScore: number;
    metrics: PostMetrics['metrics'];
  }>;
  guidelines: string;
  commonPatterns: string;
}

/**
 * X 用の通知投稿プロンプトを生成する
 * 感想・考察のみ。タイトル・URL・ドメイン名・リンク誘導文言は絶対に含めない。
 */
export function buildXNotificationPrompt(input: XPromptInput): string {
  const topPostsSection = input.topPosts.length > 0
    ? `\n【X で高いエンゲージメントを獲得した投稿】\n${input.topPosts.map((p) => `- 「${p.text}」(♥${p.metrics.likes} RT${p.metrics.reposts})`).join('\n')}\n`
    : '';

  const crossPlatformSection = input.crossPlatformTopPosts.length > 0
    ? `\n【他プラットフォームで人気だった投稿（文体・構成の参考に）】\n${input.crossPlatformTopPosts.map((p) => `- [${p.platform}] 「${p.text}」(スコア: ${p.normalizedScore})`).join('\n')}\n`
    : '';

  const guidelinesSection = input.guidelines
    ? `\n【分析から得られたガイドライン】\n${input.guidelines}\n`
    : '';

  const commonPatternsSection = input.commonPatterns
    ? `\n【全プラットフォーム共通の成功パターン】\n${input.commonPatterns}\n`
    : '';

  return `あなたはAI技術に詳しいエンジニアです。以下の記事について、X (Twitter) に投稿する感想を書いてください。

【絶対ルール】
- 記事についての感想・考察・知見だけを書いてください
- 記事タイトル、URL、ドメイン名は絶対に含めないでください
- 「詳しくはこちら」「記事はこちら」等のリンク誘導文言も禁止です
- 一人のエンジニアが自然に感想を述べているように見える文章にしてください
- ハッシュタグや絵文字は含めないでください
- 200文字以内
${topPostsSection}${crossPlatformSection}${guidelinesSection}${commonPatternsSection}
【記事情報】
タイトル: ${input.title}
要約: ${input.summary}`;
}

/**
 * X 用の定時トピック投稿プロンプトを生成する
 * トピック選定 + 感想生成。タイトル・URL は含めない。
 */
export function buildXScheduledPrompt(
  articles: Array<{ title: string; topics: Array<{ topic: string; summary: string }> }>,
  topPosts: XPromptInput['topPosts'],
  crossPlatformTopPosts: XPromptInput['crossPlatformTopPosts'],
  guidelines: string,
  commonPatterns: string,
): string {
  const articleTexts = articles
    .map((a) => {
      const topicLines = a.topics.length > 0
        ? a.topics.map((t) => `- ${t.topic}: ${t.summary}`).join('\n')
        : '- (トピックなし)';
      return `${a.title}のトピック:\n${topicLines}`;
    })
    .join('\n\n');

  const topPostsSection = topPosts.length > 0
    ? `\n【X で高いエンゲージメントを獲得した投稿】\n${topPosts.map((p) => `- 「${p.text}」(♥${p.metrics.likes} RT${p.metrics.reposts})`).join('\n')}\n`
    : '';

  const crossPlatformSection = crossPlatformTopPosts.length > 0
    ? `\n【他プラットフォームで人気だった投稿（文体・構成の参考に）】\n${crossPlatformTopPosts.map((p) => `- [${p.platform}] 「${p.text}」(スコア: ${p.normalizedScore})`).join('\n')}\n`
    : '';

  const guidelinesSection = guidelines
    ? `\n【分析から得られたガイドライン】\n${guidelines}\n`
    : '';

  const commonPatternsSection = commonPatterns
    ? `\n【全プラットフォーム共通の成功パターン】\n${commonPatterns}\n`
    : '';

  return `以下の記事のトピック一覧から、1つのトピックを選んでください。
選んだトピックについて、テックブログ運営者が個人的に感じた自然な感想を述べ、
そこから得られる知見や考察を加えてください。

【絶対ルール】
- 感想・考察・知見だけを書いてください
- 記事タイトル、URL、ドメイン名は絶対に含めないでください
- 「詳しくはこちら」「記事はこちら」等のリンク誘導文言も禁止です
- ハッシュタグや絵文字は使わないでください
- 「〜について書きました」のような自己言及はしないでください
- 全体で100-200文字程度に収めてください
${topPostsSection}${crossPlatformSection}${guidelinesSection}${commonPatternsSection}
${articleTexts}

以下のJSON形式で返してください:
{"comment": "感想と考察", "article_index": 1, "topic": "選んだトピック名"}`;
}
