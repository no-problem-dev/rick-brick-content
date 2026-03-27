/**
 * SNS パフォーマンス分析エンジン
 * メトリクスデータを分析し、プラットフォーム別の「成功プロファイル」を生成する。
 * 出力: data/sns-strategy.json
 */

import fs from 'node:fs';
import path from 'node:path';
import type { SnsPlatform } from './sns-post-log.js';

const METRICS_FILE = path.resolve('data/sns-metrics.json');
const STRATEGY_FILE = path.resolve('data/sns-strategy.json');

export interface PostMetrics {
  platform: SnsPlatform;
  postId: string;
  text: string;
  type: 'notification' | 'scheduled';
  timestamp: string;
  collectedAt: string;
  metrics: {
    impressions?: number;
    likes: number;
    reposts: number;
    replies: number;
    quotes?: number;
  };
  score: number;
}

export interface PlatformStrategy {
  platform: SnsPlatform;
  updatedAt: string;
  topPosts: Array<{
    text: string;
    score: number;
    metrics: PostMetrics['metrics'];
  }>;
  guidelines: string;
  avgScore: number;
  totalPosts: number;
}

export interface CrossPlatformStrategy {
  updatedAt: string;
  topPosts: Array<{
    text: string;
    platform: SnsPlatform;
    normalizedScore: number;
    metrics: PostMetrics['metrics'];
  }>;
  commonPatterns: string;
}

export interface SnsStrategy {
  platforms: PlatformStrategy[];
  crossPlatform: CrossPlatformStrategy;
}

function getNowJST(): string {
  return new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Tokyo' }).replace(' ', 'T') + '+09:00';
}

/**
 * プラットフォーム別エンゲージメントスコアを計算する
 */
export function calculateScore(platform: SnsPlatform, metrics: PostMetrics['metrics']): number {
  switch (platform) {
    case 'x':
      return (metrics.impressions ?? 0) * 0.5
        + metrics.likes * 3
        + metrics.reposts * 5
        + (metrics.quotes ?? 0) * 4
        + metrics.replies * 2;
    case 'bluesky':
      return metrics.likes * 3
        + metrics.reposts * 5
        + (metrics.quotes ?? 0) * 4
        + metrics.replies * 2;
    case 'mastodon':
      return metrics.reposts * 5
        + metrics.likes * 3
        + metrics.replies * 2;
  }
}

/**
 * メトリクスファイルを読み込む
 */
export function readMetrics(): PostMetrics[] {
  try {
    if (!fs.existsSync(METRICS_FILE)) return [];
    const raw = fs.readFileSync(METRICS_FILE, 'utf-8').trim();
    if (!raw) return [];
    return JSON.parse(raw) as PostMetrics[];
  } catch {
    return [];
  }
}

/**
 * メトリクスファイルに書き込む
 */
export function writeMetrics(metrics: PostMetrics[]): void {
  const dir = path.dirname(METRICS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2) + '\n', 'utf-8');
}

/**
 * パーセンタイル順位で正規化（0-100）
 */
function normalizeScore(score: number, allScores: number[]): number {
  if (allScores.length === 0) return 0;
  const sorted = [...allScores].sort((a, b) => a - b);
  const rank = sorted.filter((s) => s <= score).length;
  return Math.round((rank / sorted.length) * 100);
}

/**
 * メトリクスデータからプラットフォーム別戦略を生成する
 */
export function analyzePerformance(metrics: PostMetrics[]): SnsStrategy {
  const now = getNowJST();
  const platforms: SnsPlatform[] = ['x', 'bluesky', 'mastodon'];

  const platformStrategies: PlatformStrategy[] = platforms.map((platform) => {
    const platformMetrics = metrics.filter((m) => m.platform === platform);
    const sorted = [...platformMetrics].sort((a, b) => b.score - a.score);
    const top10 = sorted.slice(0, 10);
    const totalScore = platformMetrics.reduce((sum, m) => sum + m.score, 0);

    return {
      platform,
      updatedAt: now,
      topPosts: top10.map((m) => ({
        text: m.text,
        score: m.score,
        metrics: m.metrics,
      })),
      guidelines: '',
      avgScore: platformMetrics.length > 0 ? totalScore / platformMetrics.length : 0,
      totalPosts: platformMetrics.length,
    };
  });

  // クロスプラットフォーム: パーセンタイルで正規化して比較
  const platformScoreMap = new Map<SnsPlatform, number[]>();
  for (const platform of platforms) {
    const scores = metrics.filter((m) => m.platform === platform).map((m) => m.score);
    platformScoreMap.set(platform, scores);
  }

  const allNormalized = metrics.map((m) => ({
    text: m.text,
    platform: m.platform,
    normalizedScore: normalizeScore(m.score, platformScoreMap.get(m.platform) || []),
    metrics: m.metrics,
  }));

  const crossPlatformTop = [...allNormalized]
    .sort((a, b) => b.normalizedScore - a.normalizedScore)
    .slice(0, 10);

  return {
    platforms: platformStrategies,
    crossPlatform: {
      updatedAt: now,
      topPosts: crossPlatformTop,
      commonPatterns: '',
    },
  };
}

/**
 * 戦略ファイルを読み込む
 */
export function readStrategy(): SnsStrategy | null {
  try {
    if (!fs.existsSync(STRATEGY_FILE)) return null;
    const raw = fs.readFileSync(STRATEGY_FILE, 'utf-8').trim();
    if (!raw) return null;
    return JSON.parse(raw) as SnsStrategy;
  } catch {
    return null;
  }
}

/**
 * 戦略ファイルに書き込む
 */
export function writeStrategy(strategy: SnsStrategy): void {
  const dir = path.dirname(STRATEGY_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STRATEGY_FILE, JSON.stringify(strategy, null, 2) + '\n', 'utf-8');
}

/**
 * プラットフォーム別の成功事例を取得する（プロンプト注入用）
 */
export function getTopPostsForPlatform(
  strategy: SnsStrategy | null,
  platform: SnsPlatform,
  count: number = 3,
): Array<{ text: string; score: number; metrics: PostMetrics['metrics'] }> {
  if (!strategy) return [];
  const ps = strategy.platforms.find((p) => p.platform === platform);
  return ps ? ps.topPosts.slice(0, count) : [];
}

/**
 * クロスプラットフォームの成功事例を取得する（プロンプト注入用）
 */
export function getCrossPlatformTopPosts(
  strategy: SnsStrategy | null,
  count: number = 3,
): CrossPlatformStrategy['topPosts'] {
  if (!strategy) return [];
  return strategy.crossPlatform.topPosts.slice(0, count);
}
