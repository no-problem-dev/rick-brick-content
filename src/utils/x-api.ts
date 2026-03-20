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

/**
 * POST /2/tweets でツイートを投稿する
 */
export async function postTweet(
  text: string,
  credentials: XApiCredentials,
): Promise<PostTweetResult> {
  const authHeader = generateOAuthHeader('POST', TWEETS_ENDPOINT, credentials);

  const response = await fetch(TWEETS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
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
