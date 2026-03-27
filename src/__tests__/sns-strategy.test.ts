import { describe, it, expect } from 'vitest';
import {
  calculateScore,
  analyzePerformance,
  type PostMetrics,
} from '../utils/sns-strategy.js';

describe('calculateScore', () => {
  it('X: impressions * 0.5 + likes * 3 + reposts * 5 + quotes * 4 + replies * 2', () => {
    const score = calculateScore('x', {
      impressions: 100,
      likes: 10,
      reposts: 5,
      quotes: 2,
      replies: 3,
    });
    // 100*0.5 + 10*3 + 5*5 + 2*4 + 3*2 = 50 + 30 + 25 + 8 + 6 = 119
    expect(score).toBe(119);
  });

  it('Bluesky: likes * 3 + reposts * 5 + quotes * 4 + replies * 2', () => {
    const score = calculateScore('bluesky', {
      likes: 10,
      reposts: 5,
      quotes: 2,
      replies: 3,
    });
    // 10*3 + 5*5 + 2*4 + 3*2 = 30 + 25 + 8 + 6 = 69
    expect(score).toBe(69);
  });

  it('Mastodon: reposts * 5 + likes * 3 + replies * 2', () => {
    const score = calculateScore('mastodon', {
      likes: 10,
      reposts: 5,
      replies: 3,
    });
    // 5*5 + 10*3 + 3*2 = 25 + 30 + 6 = 61
    expect(score).toBe(61);
  });

  it('ゼロメトリクスの場合はスコア0', () => {
    expect(calculateScore('x', { likes: 0, reposts: 0, replies: 0 })).toBe(0);
    expect(calculateScore('bluesky', { likes: 0, reposts: 0, replies: 0 })).toBe(0);
    expect(calculateScore('mastodon', { likes: 0, reposts: 0, replies: 0 })).toBe(0);
  });
});

describe('analyzePerformance', () => {
  const sampleMetrics: PostMetrics[] = [
    {
      platform: 'x',
      postId: 'x1',
      text: 'X post 1',
      type: 'notification',
      timestamp: '2026-03-01T10:00:00+09:00',
      collectedAt: '2026-03-02T04:00:00+09:00',
      metrics: { impressions: 200, likes: 20, reposts: 10, replies: 5, quotes: 3 },
      score: 0, // 計算前
    },
    {
      platform: 'x',
      postId: 'x2',
      text: 'X post 2',
      type: 'scheduled',
      timestamp: '2026-03-01T12:00:00+09:00',
      collectedAt: '2026-03-02T04:00:00+09:00',
      metrics: { impressions: 50, likes: 5, reposts: 2, replies: 1, quotes: 0 },
      score: 0,
    },
    {
      platform: 'bluesky',
      postId: 'bsky1',
      text: 'Bluesky post 1',
      type: 'notification',
      timestamp: '2026-03-01T10:00:00+09:00',
      collectedAt: '2026-03-02T04:00:00+09:00',
      metrics: { likes: 15, reposts: 8, replies: 3, quotes: 2 },
      score: 0,
    },
  ];

  // スコアを事前に計算
  const metricsWithScores = sampleMetrics.map((m) => ({
    ...m,
    score: calculateScore(m.platform, m.metrics),
  }));

  it('プラットフォーム別の戦略を生成する', () => {
    const strategy = analyzePerformance(metricsWithScores);

    expect(strategy.platforms).toHaveLength(3);

    const xStrategy = strategy.platforms.find((p) => p.platform === 'x');
    expect(xStrategy).toBeTruthy();
    expect(xStrategy!.totalPosts).toBe(2);
    expect(xStrategy!.topPosts.length).toBeGreaterThan(0);

    const bskyStrategy = strategy.platforms.find((p) => p.platform === 'bluesky');
    expect(bskyStrategy).toBeTruthy();
    expect(bskyStrategy!.totalPosts).toBe(1);

    const mastodonStrategy = strategy.platforms.find((p) => p.platform === 'mastodon');
    expect(mastodonStrategy).toBeTruthy();
    expect(mastodonStrategy!.totalPosts).toBe(0);
  });

  it('クロスプラットフォーム戦略を生成する', () => {
    const strategy = analyzePerformance(metricsWithScores);

    expect(strategy.crossPlatform).toBeTruthy();
    expect(strategy.crossPlatform.topPosts.length).toBeGreaterThan(0);
    // normalizedScore は 0-100 の範囲
    for (const post of strategy.crossPlatform.topPosts) {
      expect(post.normalizedScore).toBeGreaterThanOrEqual(0);
      expect(post.normalizedScore).toBeLessThanOrEqual(100);
    }
  });

  it('空のメトリクスでもエラーにならない', () => {
    const strategy = analyzePerformance([]);

    expect(strategy.platforms).toHaveLength(3);
    for (const p of strategy.platforms) {
      expect(p.totalPosts).toBe(0);
      expect(p.topPosts).toEqual([]);
      expect(p.avgScore).toBe(0);
    }
    expect(strategy.crossPlatform.topPosts).toEqual([]);
  });

  it('topPosts は上位10件に制限される', () => {
    const manyMetrics: PostMetrics[] = Array.from({ length: 20 }, (_, i) => ({
      platform: 'x' as const,
      postId: `x${i}`,
      text: `Post ${i}`,
      type: 'scheduled' as const,
      timestamp: '2026-03-01T10:00:00+09:00',
      collectedAt: '2026-03-02T04:00:00+09:00',
      metrics: { impressions: i * 10, likes: i, reposts: 0, replies: 0 },
      score: calculateScore('x', { impressions: i * 10, likes: i, reposts: 0, replies: 0 }),
    }));

    const strategy = analyzePerformance(manyMetrics);
    const xStrategy = strategy.platforms.find((p) => p.platform === 'x');
    expect(xStrategy!.topPosts).toHaveLength(10);
    // スコアが高い順
    for (let i = 0; i < xStrategy!.topPosts.length - 1; i++) {
      expect(xStrategy!.topPosts[i]!.score).toBeGreaterThanOrEqual(xStrategy!.topPosts[i + 1]!.score);
    }
  });
});
