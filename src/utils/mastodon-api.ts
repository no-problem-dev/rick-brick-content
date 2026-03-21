/**
 * Mastodon API クライアント
 * 外部ライブラリ不要（fetch のみ）
 */
import crypto from 'node:crypto';

export interface MastodonCredentials {
  instanceUrl: string;
  accessToken: string;
}

export interface PostResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function postToMastodon(
  text: string,
  credentials: MastodonCredentials,
): Promise<PostResult> {
  const response = await fetch(
    `${credentials.instanceUrl}/api/v1/statuses`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify({
        status: text,
        visibility: 'public',
        language: 'en',
      }),
    },
  );

  if (response.ok) {
    const data = (await response.json()) as { url?: string };
    return { success: true, url: data.url };
  }

  const errorText = await response.text();
  return { success: false, error: `${response.status} ${errorText}` };
}
