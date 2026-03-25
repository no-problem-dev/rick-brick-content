/**
 * SNS 投稿共通ユーティリティ
 * 記事生成直後の通知投稿と定時のトピック投稿の両方で使用
 */

import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './frontmatter.js';
import { weightedCharCount } from './tweet-formatter.js';
import { trimToLength } from './post-formatter.js';

export const SITE_URL_DEFAULT = 'https://oct-rick-brick.com';
export const SNS_COMMENT_MODEL = 'gpt-4.1-nano';

const X_MAX_WEIGHT = 280;
const X_URL_WEIGHT = 23; // t.co 短縮URL のウェイト固定値

export interface SnsTopic {
  topic: string;
  summary: string;
}

export interface ArticleForSns {
  articleId: string;
  title: string;
  summary: string;
  snsTopics: SnsTopic[];
}

/**
 * frontmatter の sns_topics ブロックをパースする。
 * parseFrontmatter() は単純な key: value しか扱えないため、
 * 生の frontmatter テキストから YAML ブロック形式の sns_topics を抽出する。
 */
function parseSnsTopics(fileContent: string): SnsTopic[] {
  const fmMatch = fileContent.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return [];

  const fmText = fmMatch[1]!;

  // sns_topics: の開始位置を見つける
  const snsTopicsStart = fmText.indexOf('sns_topics:');
  if (snsTopicsStart === -1) return [];

  // sns_topics: 以降の行を取得
  const afterSnsTopics = fmText.slice(snsTopicsStart + 'sns_topics:'.length);
  const lines = afterSnsTopics.split('\n');

  const topics: SnsTopic[] = [];
  let currentTopic: string | null = null;
  let currentSummary: string | null = null;

  for (const line of lines) {
    // インデントされていない行に到達したら終了（次のフィールド）
    if (line.match(/^\S/) && line.trim() !== '') break;

    const topicMatch = line.match(/^\s+-\s+topic:\s*"?(.+?)"?\s*$/);
    const summaryMatch = line.match(/^\s+summary:\s*"?(.+?)"?\s*$/);

    if (topicMatch) {
      // 前のトピックを保存
      if (currentTopic !== null) {
        topics.push({ topic: currentTopic, summary: currentSummary || '' });
      }
      currentTopic = topicMatch[1]!;
      currentSummary = null;
    } else if (summaryMatch && currentTopic !== null) {
      currentSummary = summaryMatch[1]!;
    }
  }

  // 最後のトピックを保存
  if (currentTopic !== null) {
    topics.push({ topic: currentTopic, summary: currentSummary || '' });
  }

  return topics;
}

/** frontmatter から SNS 用の記事情報を抽出 */
export function extractArticleForSns(fileContent: string, fileName: string): ArticleForSns | null {
  const { frontmatter } = parseFrontmatter(fileContent);
  if (frontmatter.draft === true) return null;
  const title = String(frontmatter.title || '');
  if (!title) return null;

  const snsTopics = parseSnsTopics(fileContent);

  return {
    articleId: fileName.replace(/\.md$/, ''),
    title,
    summary: String(frontmatter.summary || ''),
    snsTopics,
  };
}

/** 記事ディレクトリから対象日付の記事を取得 */
export function getArticlesByDate(dir: string, targetDate: string): ArticleForSns[] {
  const resolvedDir = path.resolve(dir);
  if (!fs.existsSync(resolvedDir)) {
    console.warn(`Directory not found: ${resolvedDir}`);
    return [];
  }

  const files = fs
    .readdirSync(resolvedDir)
    .filter((f) => f.startsWith(`${targetDate}-`) && f.endsWith('.md'))
    .sort();

  const articles: ArticleForSns[] = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(resolvedDir, file), 'utf-8');
    const article = extractArticleForSns(content, file);
    if (article) {
      articles.push(article);
    }
  }
  return articles;
}

/** 記事ディレクトリから直近N件の記事を取得 */
export function getRecentArticles(dir: string, count: number): ArticleForSns[] {
  const resolvedDir = path.resolve(dir);
  if (!fs.existsSync(resolvedDir)) {
    console.warn(`Directory not found: ${resolvedDir}`);
    return [];
  }

  const files = fs
    .readdirSync(resolvedDir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .reverse(); // 新しい順

  const articles: ArticleForSns[] = [];
  for (const file of files) {
    if (articles.length >= count) break;
    const content = fs.readFileSync(path.join(resolvedDir, file), 'utf-8');
    const article = extractArticleForSns(content, file);
    if (article) {
      articles.push(article);
    }
  }
  return articles;
}

/** 日本語記事URLを構築 */
export function buildJaArticleUrl(articleId: string, siteUrl: string): string {
  return `${siteUrl}/articles/${articleId}/`;
}

/** 英語記事URLを構築 */
export function buildEnArticleUrl(articleId: string, siteUrl: string): string {
  return `${siteUrl}/en/articles/${articleId}/`;
}

/**
 * テキストを指定ウェイト以内にトリムする（X 用）
 */
function trimToWeight(text: string, maxWeight: number): string {
  if (weightedCharCount(text) <= maxWeight) return text;

  const ellipsisWeight = weightedCharCount('...');
  const target = maxWeight - ellipsisWeight;
  if (target <= 0) return '';

  let current = 0;
  let lastIndex = 0;
  for (const char of text) {
    const code = char.codePointAt(0)!;
    const w = isCJK(code) ? 2 : 1;
    if (current + w > target) break;
    current += w;
    lastIndex += char.length;
  }

  return text.slice(0, lastIndex) + '...';
}

function isCJK(code: number): boolean {
  return (
    (code >= 0x3000 && code <= 0x9fff) ||
    (code >= 0xf900 && code <= 0xfaff) ||
    (code >= 0xff00 && code <= 0xffef) ||
    (code >= 0x20000 && code <= 0x2fa1f)
  );
}

/** X 投稿テキストを280ウェイト以内に組み立て */
export function buildXPostText(lines: string[], url: string): string {
  const body = lines.join('\n\n');

  // URL は t.co で 23 固定、URL 前の改行2つ分
  const urlSectionWeight = X_URL_WEIGHT + weightedCharCount('\n\n');
  const availableWeight = X_MAX_WEIGHT - urlSectionWeight;

  const trimmedBody = trimToWeight(body, availableWeight);
  return `${trimmedBody}\n\n${url}`;
}

/** Bluesky/Mastodon 投稿テキストを maxLength 以内に組み立て */
export function buildEnPostText(lines: string[], url: string, maxLength: number): string {
  const body = lines.join('\n\n');

  // URL + 改行2つ分
  const urlSectionLength = url.length + 2; // "\n\n"
  const availableLength = maxLength - urlSectionLength;

  const trimmedBody = trimToLength(body, availableLength);
  return `${trimmedBody}\n\n${url}`;
}

/**
 * OpenAI API でテキスト生成（共通）
 * sns-comment-generator.ts と post-sns-scheduled.ts で重複していた OpenAI 呼び出しを統一
 */
export async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OPENAI_API_KEY is not set.');
    return '';
  }

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: SNS_COMMENT_MODEL,
        input: prompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} ${errorText}`);
      return '';
    }

    const data = (await response.json()) as {
      output: Array<{
        type: string;
        content?: Array<{
          type: string;
          text?: string;
        }>;
      }>;
    };

    const messageItem = data.output.find((item) => item.type === 'message');
    const textContent = messageItem?.content?.find(
      (c) => c.type === 'output_text',
    );
    return textContent?.text?.trim() || '';
  } catch (error) {
    console.error('OpenAI API call error:', error);
    return '';
  }
}
