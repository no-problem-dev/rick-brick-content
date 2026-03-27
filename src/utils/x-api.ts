/**
 * X (Twitter) API v2 — OAuth 1.0a 署名 + POST /2/tweets
 * 外部パッケージ不要（Node.js native crypto を使用）
 */

import crypto from 'node:crypto';

const TWEETS_ENDPOINT = 'https://api.twitter.com/2/tweets';

export interface XApiCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

export interface PostTweetResult {
  success: boolean;
  tweetId?: string;
  error?: string;
}

/**
 * RFC 3986 パーセントエンコード
 */
function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/**
 * OAuth 1.0a Authorization ヘッダーを生成する
 */
function generateOAuthHeader(
  method: string,
  url: string,
  credentials: XApiCredentials,
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: credentials.apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: credentials.accessToken,
    oauth_version: '1.0',
  };

  // パラメータをアルファベット順にソートして Signature Base String を構築
  const sortedParams = Object.entries(oauthParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${percentEncode(k)}=${percentEncode(v)}`)
    .join('&');

  const signatureBaseString = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(sortedParams),
  ].join('&');

  // HMAC-SHA1 署名
  const signingKey = `${percentEncode(credentials.apiSecret)}&${percentEncode(credentials.accessTokenSecret)}`;
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');

  oauthParams.oauth_signature = signature;

  // Authorization ヘッダー組み立て
  const headerString = Object.entries(oauthParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${percentEncode(k)}="${percentEncode(v)}"`)
    .join(', ');

  return `OAuth ${headerString}`;
}

export interface PostTweetOptions {
  reply?: { in_reply_to_tweet_id: string };
}

/**
 * POST /2/tweets でツイートを投稿する
 */
export async function postTweet(
  text: string,
  credentials: XApiCredentials,
  options?: PostTweetOptions,
): Promise<PostTweetResult> {
  const authHeader = generateOAuthHeader('POST', TWEETS_ENDPOINT, credentials);

  const body: Record<string, unknown> = { text };
  if (options?.reply) {
    body.reply = options.reply;
  }

  const response = await fetch(TWEETS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = (await response.json()) as { data?: { id?: string } };
    return {
      success: true,
      tweetId: data.data?.id,
    };
  }

  const errorText = await response.text();
  return {
    success: false,
    error: `${response.status} ${errorText}`,
  };
}

/**
 * X に2段階投稿する共通関数。全投稿パスから使用する。
 * 本文には URL を絶対に含めない。リンクは必ずセルフリプライで投稿する。
 *
 * @param commentText 感想・考察のみの本文（URLなし）
 * @param articleTitle 記事タイトル
 * @param articleUrl 記事URL
 * @param credentials X API 認証情報
 * @param delayMs セルフリプライまでの待機時間（デフォルト120秒）
 * @returns 本文ツイートの tweetId（ログ記録用）
 */
export async function postToXWithReply(
  commentText: string,
  articleTitle: string,
  articleUrl: string,
  credentials: XApiCredentials,
  delayMs: number = 120_000,
): Promise<PostTweetResult> {
  // Step 1: 感想・考察のみの本文投稿（レコメンド対象になる）
  const mainTweet = await postTweet(commentText, credentials);

  if (!mainTweet.success || !mainTweet.tweetId) {
    return mainTweet;
  }

  console.log(`X: Main tweet posted (id=${mainTweet.tweetId}). Waiting ${delayMs / 1000}s for self-reply...`);

  // Step 2: 待機後、セルフリプライで記事タイトル+URL
  await new Promise((r) => setTimeout(r, delayMs));

  const replyText = `\u{1F4DD} ${articleTitle}\n${articleUrl}`;
  const replyResult = await postTweet(replyText, credentials, {
    reply: { in_reply_to_tweet_id: mainTweet.tweetId },
  });

  if (replyResult.success) {
    console.log(`X: Self-reply posted (id=${replyResult.tweetId})`);
  } else {
    console.error(`X: Self-reply failed: ${replyResult.error}`);
  }

  // 本文ツイートの結果を返す（ログ記録は本文側の tweetId を使う）
  return mainTweet;
}
