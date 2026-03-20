import { describe, it, expect } from 'vitest';
import { weightedCharCount, tagsToHashtags, formatTweet } from '../utils/tweet-formatter.js';

describe('weightedCharCount', () => {
  it('ASCII 文字は 1 ウェイト', () => {
    expect(weightedCharCount('hello')).toBe(5);
  });

  it('日本語文字は 2 ウェイト', () => {
    expect(weightedCharCount('こんにちは')).toBe(10);
  });

  it('混合テキスト', () => {
    // "AI" = 2, "ニュース" = 8
    expect(weightedCharCount('AIニュース')).toBe(10);
  });

  it('空文字は 0', () => {
    expect(weightedCharCount('')).toBe(0);
  });

  it('記号・スペース', () => {
    expect(weightedCharCount('#AI ')).toBe(4);
  });
});

describe('tagsToHashtags', () => {
  it('タグにハッシュタグを付与', () => {
    expect(tagsToHashtags(['AI', 'OpenAI'])).toEqual(['#AI', '#OpenAI']);
  });

  it('重複タグを排除（大文字小文字無視）', () => {
    expect(tagsToHashtags(['AI', 'ai', 'OpenAI'])).toEqual(['#AI', '#OpenAI']);
  });

  it('maxCount で数を制限', () => {
    expect(tagsToHashtags(['AI', 'ML', 'NLP', 'LLM', 'GPT'], 3)).toEqual(['#AI', '#ML', '#NLP']);
  });

  it('空タグ・スペースのみは除外', () => {
    expect(tagsToHashtags(['', ' ', 'AI'])).toEqual(['#AI']);
  });

  it('スペース・記号を除去', () => {
    expect(tagsToHashtags(['生成 AI', 'AI・ML'])).toEqual(['#生成AI', '#AIML']);
  });
});

describe('formatTweet', () => {
  const siteUrl = 'https://oct-rick-brick.com';

  it('基本的なツイートを生成', () => {
    const result = formatTweet({
      title: 'AIニュースダイジェスト 2026年3月20日',
      summary: 'OpenAIによるAstral買収など',
      tags: ['AI', 'OpenAI'],
      articleId: 'ai-news-digest-2026-03-20',
    }, siteUrl);

    expect(result).toContain('AIニュースダイジェスト 2026年3月20日');
    expect(result).toContain('https://oct-rick-brick.com/articles/ai-news-digest-2026-03-20/');
    expect(result).toContain('#AI');
    expect(result).toContain('#OpenAI');
  });

  it('280 ウェイトを超えない', () => {
    const result = formatTweet({
      title: 'とても長いタイトルのAI技術記事',
      summary: 'あ'.repeat(200), // 非常に長い summary
      tags: ['AI', 'ML', 'NLP', 'LLM'],
      articleId: 'long-article-2026-03-20',
    }, siteUrl);

    // URL 部分を抜いてウェイト計算（URL は 23 固定）
    const urlPattern = /https?:\/\/[^\s]+/;
    const urlMatch = result.match(urlPattern);
    const textWithoutUrl = result.replace(urlPattern, '');
    const totalWeight = weightedCharCount(textWithoutUrl) + 23;

    expect(totalWeight).toBeLessThanOrEqual(280);
    expect(urlMatch).not.toBeNull();
  });

  it('summary が省略される場合は ... で終わる', () => {
    const result = formatTweet({
      title: 'とても長いタイトルのAI技術記事です',
      summary: 'あ'.repeat(200),
      tags: ['AI', 'ML', 'NLP'],
      articleId: 'test-2026-03-20',
    }, siteUrl);

    // summary が含まれていて ... で切られている
    expect(result).toContain('...');
  });

  it('タグが空でも動作する', () => {
    const result = formatTweet({
      title: 'テスト記事',
      summary: 'テストサマリー',
      tags: [],
      articleId: 'test-article',
    }, siteUrl);

    expect(result).toContain('テスト記事');
    expect(result).toContain('https://oct-rick-brick.com/articles/test-article/');
    expect(result).not.toContain('#');
  });
});
