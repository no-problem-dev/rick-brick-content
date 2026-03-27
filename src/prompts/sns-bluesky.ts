/**
 * Bluesky 専用 SNS 投稿プロンプト
 * リンクカード（embed external）はペナルティなしのため URL を含める。
 * 英語圏ユーザー向けに英語で投稿。
 */

import type { PostMetrics } from '../utils/sns-strategy.js';

interface BlueskyPromptInput {
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
 * Bluesky 用の通知投稿プロンプトを生成する
 */
export function buildBlueskyNotificationPrompt(input: BlueskyPromptInput): string {
  const topPostsSection = input.topPosts.length > 0
    ? `\n[Top performing posts on Bluesky]\n${input.topPosts.map((p) => `- "${p.text}" (♥${p.metrics.likes} RP${p.metrics.reposts})`).join('\n')}\n`
    : '';

  const crossPlatformSection = input.crossPlatformTopPosts.length > 0
    ? `\n[Popular posts from other platforms (for tone/structure reference)]\n${input.crossPlatformTopPosts.map((p) => `- [${p.platform}] "${p.text}" (score: ${p.normalizedScore})`).join('\n')}\n`
    : '';

  const guidelinesSection = input.guidelines
    ? `\n[Guidelines from analysis]\n${input.guidelines}\n`
    : '';

  const commonPatternsSection = input.commonPatterns
    ? `\n[Cross-platform success patterns]\n${input.commonPatterns}\n`
    : '';

  return `You are a tech enthusiast sharing insights about AI research.
Write a post for Bluesky about the following article.

Rules:
- Write in English, conversational tone
- The article link will be attached as a link card separately, so do not include the URL in the text
- Keep it under 250 characters to leave room for the link
- No hashtags or emojis
- Write a natural, insightful comment about the article's content
${topPostsSection}${crossPlatformSection}${guidelinesSection}${commonPatternsSection}
Article title: ${input.title}
Summary: ${input.summary}`;
}

/**
 * Bluesky 用の定時トピック投稿プロンプトを生成する
 */
export function buildBlueskyScheduledPrompt(
  articles: Array<{ title: string; topics: Array<{ topic: string; summary: string }> }>,
  topPosts: BlueskyPromptInput['topPosts'],
  crossPlatformTopPosts: BlueskyPromptInput['crossPlatformTopPosts'],
  guidelines: string,
  commonPatterns: string,
): string {
  const articleTexts = articles
    .map((a) => {
      const topicLines = a.topics.length > 0
        ? a.topics.map((t) => `- ${t.topic}: ${t.summary}`).join('\n')
        : '- (no topics)';
      return `Topics from "${a.title}":\n${topicLines}`;
    })
    .join('\n\n');

  const topPostsSection = topPosts.length > 0
    ? `\n[Top performing posts on Bluesky]\n${topPosts.map((p) => `- "${p.text}" (♥${p.metrics.likes} RP${p.metrics.reposts})`).join('\n')}\n`
    : '';

  const crossPlatformSection = crossPlatformTopPosts.length > 0
    ? `\n[Popular posts from other platforms (for tone/structure reference)]\n${crossPlatformTopPosts.map((p) => `- [${p.platform}] "${p.text}" (score: ${p.normalizedScore})`).join('\n')}\n`
    : '';

  const guidelinesSection = guidelines
    ? `\n[Guidelines from analysis]\n${guidelines}\n`
    : '';

  const commonPatternsSection = commonPatterns
    ? `\n[Cross-platform success patterns]\n${commonPatterns}\n`
    : '';

  return `From the following article topics, pick one topic.
Write a natural, human-like comment about the chosen topic as if you're the tech blog owner,
and add insight or observation.

Rules:
- Write in English, conversational tone
- Include the article link (no penalty on Bluesky)
- Keep the total under 250 characters
- No hashtags or emojis
- Do not use self-referencing phrases like "I wrote about..."
${topPostsSection}${crossPlatformSection}${guidelinesSection}${commonPatternsSection}
${articleTexts}

Return in the following JSON format:
{"comment": "your comment text", "article_index": 1, "topic": "chosen topic name"}`;
}
