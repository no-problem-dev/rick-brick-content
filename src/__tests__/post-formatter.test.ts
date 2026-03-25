import { describe, expect, it } from 'vitest';
import {
  formatPost,
  tagsToHashtags,
  trimToLength,
} from '../utils/post-formatter.js';

describe('tagsToHashtags', () => {
  it('should convert tags to hashtags', () => {
    expect(tagsToHashtags(['AI', 'LLM'])).toEqual(['#AI', '#LLM']);
  });

  it('should remove spaces and hyphens', () => {
    expect(tagsToHashtags(['Machine Learning', 'large-language-model'])).toEqual(
      ['#MachineLearning', '#largelanguagemodel'],
    );
  });

  it('should deduplicate case-insensitively', () => {
    expect(tagsToHashtags(['AI', 'ai', 'Ai'])).toEqual(['#AI']);
  });

  it('should limit to maxCount', () => {
    expect(tagsToHashtags(['a', 'b', 'c', 'd', 'e'], 3)).toEqual([
      '#a',
      '#b',
      '#c',
    ]);
  });

  it('should skip empty tags', () => {
    expect(tagsToHashtags(['', '#', '-', 'AI'])).toEqual(['#AI']);
  });
});

describe('trimToLength', () => {
  it('should return text as-is if within limit', () => {
    expect(trimToLength('hello', 10)).toBe('hello');
  });

  it('should trim and add ellipsis', () => {
    expect(trimToLength('hello world', 8)).toBe('hello...');
  });

  it('should return empty for very small maxLength', () => {
    expect(trimToLength('hello', 2)).toBe('');
  });

  it('should handle exact length', () => {
    expect(trimToLength('hello', 5)).toBe('hello');
  });
});

describe('formatPost', () => {
  const siteUrl = 'https://oct-rick-brick.com';
  const baseInput = {
    title: 'AI News Digest',
    summary: 'Latest developments in AI research.',
    comment: 'Fascinating progress in AI research this week',
    tags: ['AI', 'LLM'],
    articleId: '2026-03-22-ai-news',
  };

  it('should generate a post with header, title, comment, and URL', () => {
    const result = formatPost(baseInput, siteUrl, 300);
    expect(result).toContain('\u{1F4DD} New article posted');
    expect(result).toContain('AI News Digest');
    expect(result).toContain('Fascinating progress in AI research this week');
    expect(result).toContain(
      'https://oct-rick-brick.com/en/articles/2026-03-22-ai-news/',
    );
    // No hashtags in new format
    expect(result).not.toContain('#AI');
    expect(result).not.toContain('#LLM');
  });

  it('should use /en/ prefix in URL', () => {
    const result = formatPost(baseInput, siteUrl, 300);
    expect(result).toMatch(/\/en\/articles\//);
  });

  it('should include more comment for larger maxLength (Mastodon)', () => {
    const longComment = 'A '.repeat(200);
    const input = { ...baseInput, comment: longComment };
    const short = formatPost(input, siteUrl, 300);
    const long = formatPost(input, siteUrl, 500);
    expect(long.length).toBeGreaterThan(short.length);
  });

  it('should omit comment if no room', () => {
    const longTitle = 'A'.repeat(280);
    const input = { ...baseInput, title: longTitle };
    const result = formatPost(input, siteUrl, 300);
    expect(result).not.toContain('Fascinating progress');
  });

  it('should work without comment', () => {
    const input = { ...baseInput, comment: '', tags: [] };
    const result = formatPost(input, siteUrl, 300);
    expect(result).toContain('\u{1F4DD} New article posted');
    expect(result).toContain('AI News Digest');
    expect(result).not.toContain('#');
  });

  it('should separate sections with double newlines', () => {
    const result = formatPost(baseInput, siteUrl, 300);
    const parts = result.split('\n\n');
    expect(parts.length).toBeGreaterThanOrEqual(3);
  });
});
