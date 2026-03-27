/**
 * SNS メトリクス収集スクリプト
 * 投稿ログから未収集の投稿のエンゲージメントメトリクスを各 API から取得する。
 *
 * 環境変数:
 *   X_API_KEY              — X API Consumer Key
 *   X_API_SECRET           — X API Consumer Secret
 *   X_ACCESS_TOKEN         — X Access Token
 *   X_ACCESS_TOKEN_SECRET  — X Access Token Secret
 *   BSKY_HANDLE            — Bluesky ハンドル（メトリクス取得は認証不要だが互換性のため）
 *   DRY_RUN                — "true" でファイル書き込みをスキップ
 */

import crypto from 'node:crypto';
import { getPostLog, type PostLogEntry, type SnsPlatform } from '../utils/sns-post-log.js';
import {
  readMetrics,
  writeMetrics,
  calculateScore,
  analyzePerformance,
  writeStrategy,
  type PostMetrics,
} from '../utils/sns-strategy.js';

function getNowJST(): string {
  return new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Tokyo' }).replace(' ', 'T') + '+09:00';
}

// ---------------------------------------------------------------------------
// X (Twitter) メトリクス取得
// ---------------------------------------------------------------------------

function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function generateOAuthHeader(
  method: string,
  url: string,
  params: Record<string, string>,
): string {
  const apiKey = process.env.X_API_KEY || '';
  const apiSecret = process.env.X_API_SECRET || '';
  const accessToken = process.env.X_ACCESS_TOKEN || '';
  const accessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET || '';

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: '1.0',
  };

  const allParams = { ...oauthParams, ...params };
  const sortedParams = Object.entries(allParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${percentEncode(k)}=${percentEncode(v)}`)
    .join('&');

  const signatureBaseString = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(sortedParams),
  ].join('&');

  const signingKey = `${percentEncode(apiSecret)}&${percentEncode(accessTokenSecret)}`;
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');

  oauthParams.oauth_signature = signature;

  const headerString = Object.entries(oauthParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${percentEncode(k)}="${percentEncode(v)}"`)
    .join(', ');

  return `OAuth ${headerString}`;
}

interface XPublicMetrics {
  impression_count: number;
  like_count: number;
  retweet_count: number;
  reply_count: number;
  quote_count: number;
}

async function getXTweetMetrics(tweetId: string): Promise<XPublicMetrics | null> {
  const apiKey = process.env.X_API_KEY;
  if (!apiKey) {
    console.warn('X API credentials not set. Skipping X metrics.');
    return null;
  }

  const baseUrl = 'https://api.twitter.com/2/tweets';
  const params = {
    ids: tweetId,
    'tweet.fields': 'public_metrics',
  };
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = `${baseUrl}?${queryString}`;

  const authHeader = generateOAuthHeader('GET', baseUrl, params);

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: { Authorization: authHeader },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`X API error for tweet ${tweetId}: ${response.status} ${errorText}`);
      return null;
    }

    const data = (await response.json()) as {
      data?: Array<{ public_metrics?: XPublicMetrics }>;
    };

    return data.data?.[0]?.public_metrics ?? null;
  } catch (error) {
    console.error(`X API fetch error for tweet ${tweetId}:`, error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Bluesky メトリクス取得（認証不要、public API）
// ---------------------------------------------------------------------------

interface BskyPostView {
  likeCount?: number;
  repostCount?: number;
  replyCount?: number;
  quoteCount?: number;
}

async function getBlueskyPostMetrics(uri: string): Promise<BskyPostView | null> {
  try {
    const params = new URLSearchParams({ uri, depth: '0' });
    const response = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?${params}`,
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Bluesky API error for ${uri}: ${response.status} ${errorText}`);
      return null;
    }

    const data = (await response.json()) as {
      thread?: {
        post?: {
          likeCount?: number;
          repostCount?: number;
          replyCount?: number;
          quoteCount?: number;
        };
      };
    };

    const post = data.thread?.post;
    if (!post) return null;

    return {
      likeCount: post.likeCount ?? 0,
      repostCount: post.repostCount ?? 0,
      replyCount: post.replyCount ?? 0,
      quoteCount: post.quoteCount ?? 0,
    };
  } catch (error) {
    console.error(`Bluesky API fetch error for ${uri}:`, error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Mastodon メトリクス取得（認証不要）
// ---------------------------------------------------------------------------

interface MastodonStatusMetrics {
  favourites_count: number;
  reblogs_count: number;
  replies_count: number;
}

async function getMastodonStatusMetrics(statusUrl: string): Promise<MastodonStatusMetrics | null> {
  try {
    // statusUrl = "https://mastodon.social/@user/123456789"
    // API: GET https://mastodon.social/api/v1/statuses/123456789
    const urlObj = new URL(statusUrl);
    const statusId = urlObj.pathname.split('/').pop();
    if (!statusId) return null;

    const apiUrl = `${urlObj.origin}/api/v1/statuses/${statusId}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Mastodon API error for ${statusUrl}: ${response.status} ${errorText}`);
      return null;
    }

    const data = (await response.json()) as MastodonStatusMetrics;
    return {
      favourites_count: data.favourites_count ?? 0,
      reblogs_count: data.reblogs_count ?? 0,
      replies_count: data.replies_count ?? 0,
    };
  } catch (error) {
    console.error(`Mastodon API fetch error for ${statusUrl}:`, error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// メイン処理
// ---------------------------------------------------------------------------

async function collectMetricsForEntry(
  entry: PostLogEntry,
): Promise<PostMetrics | null> {
  const now = getNowJST();

  // 投稿後24時間未満はスキップ
  const postTime = new Date(entry.timestamp).getTime();
  const elapsed = Date.now() - postTime;
  if (elapsed < 24 * 60 * 60 * 1000) {
    console.log(`Skipping ${entry.platform}:${entry.postId} (less than 24h old)`);
    return null;
  }

  let metrics: PostMetrics['metrics'] | null = null;

  switch (entry.platform) {
    case 'x': {
      const xMetrics = await getXTweetMetrics(entry.postId);
      if (xMetrics) {
        metrics = {
          impressions: xMetrics.impression_count,
          likes: xMetrics.like_count,
          reposts: xMetrics.retweet_count,
          replies: xMetrics.reply_count,
          quotes: xMetrics.quote_count,
        };
      }
      break;
    }
    case 'bluesky': {
      const bskyMetrics = await getBlueskyPostMetrics(entry.postId);
      if (bskyMetrics) {
        metrics = {
          likes: bskyMetrics.likeCount ?? 0,
          reposts: bskyMetrics.repostCount ?? 0,
          replies: bskyMetrics.replyCount ?? 0,
          quotes: bskyMetrics.quoteCount ?? 0,
        };
      }
      break;
    }
    case 'mastodon': {
      const mstdnMetrics = await getMastodonStatusMetrics(entry.postId);
      if (mstdnMetrics) {
        metrics = {
          likes: mstdnMetrics.favourites_count,
          reposts: mstdnMetrics.reblogs_count,
          replies: mstdnMetrics.replies_count,
        };
      }
      break;
    }
  }

  if (!metrics) return null;

  const score = calculateScore(entry.platform, metrics);

  return {
    platform: entry.platform,
    postId: entry.postId,
    text: entry.text,
    type: entry.type,
    timestamp: entry.timestamp,
    collectedAt: now,
    metrics,
    score,
  };
}

async function main() {
  const dryRun = process.env.DRY_RUN === 'true';
  console.log(`Collect SNS Metrics: dry_run=${dryRun}`);

  const postLog = getPostLog();
  if (postLog.length === 0) {
    console.log('No post log entries found. Exiting.');
    return;
  }

  console.log(`Found ${postLog.length} post log entries.`);

  // 既存メトリクスの postId セットを作成（重複収集を防止）
  const existingMetrics = readMetrics();
  const collectedIds = new Set(existingMetrics.map((m) => `${m.platform}:${m.postId}`));

  const uncollected = postLog.filter(
    (entry) => !collectedIds.has(`${entry.platform}:${entry.postId}`),
  );

  console.log(`Uncollected entries: ${uncollected.length}`);

  const newMetrics: PostMetrics[] = [];

  for (const entry of uncollected) {
    const metric = await collectMetricsForEntry(entry);
    if (metric) {
      newMetrics.push(metric);
      console.log(
        `Collected: ${metric.platform}:${metric.postId} score=${metric.score} ` +
        `likes=${metric.metrics.likes} reposts=${metric.metrics.reposts}`,
      );
    }

    // レートリミット回避
    await new Promise((r) => setTimeout(r, 500));
  }

  if (newMetrics.length === 0) {
    console.log('No new metrics collected.');
    return;
  }

  const allMetrics = [...existingMetrics, ...newMetrics];

  if (dryRun) {
    console.log(`(dry run) Would write ${allMetrics.length} metrics entries.`);
    return;
  }

  // メトリクスファイル更新
  writeMetrics(allMetrics);
  console.log(`Written ${allMetrics.length} metrics entries to sns-metrics.json`);

  // 戦略ファイル更新
  const strategy = analyzePerformance(allMetrics);
  writeStrategy(strategy);
  console.log('Updated sns-strategy.json');
}

main().catch((error) => {
  console.error('Collect SNS metrics error:', error);
  process.exit(0);
});
