import { describe, it, expect, vi, beforeEach } from 'vitest';

// callOpenAI をモック
vi.mock('../utils/sns-post-builder.js', async () => {
  const actual = await vi.importActual<typeof import('../utils/sns-post-builder.js')>('../utils/sns-post-builder.js');
  return {
    ...actual,
    callOpenAI: vi.fn().mockResolvedValue('This is a generated comment about AI.'),
  };
});

// readStrategy をモック
vi.mock('../utils/sns-strategy.js', async () => {
  const actual = await vi.importActual<typeof import('../utils/sns-strategy.js')>('../utils/sns-strategy.js');
  return {
    ...actual,
    readStrategy: vi.fn().mockReturnValue(null),
    getTopPostsForPlatform: vi.fn().mockReturnValue([]),
    getCrossPlatformTopPosts: vi.fn().mockReturnValue([]),
  };
});

describe('sns-comment-generator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generateSnsComment は非空の文字列を返す', async () => {
    const { generateSnsComment } = await import('../utils/sns-comment-generator.js');
    const result = await generateSnsComment({
      title: 'AI Test Article',
      summary: 'A summary about AI',
      language: 'en',
    });
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('generatePlatformComment は各プラットフォームで動作する', async () => {
    const { generatePlatformComment } = await import('../utils/sns-comment-generator.js');

    for (const platform of ['x', 'bluesky', 'mastodon'] as const) {
      const result = await generatePlatformComment(platform, 'Test Article', 'Summary');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    }
  });
});
