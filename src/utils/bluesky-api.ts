/**
 * Bluesky (AT Protocol) API クライアント
 * @atproto/api SDK を使用
 */
import { AtpAgent, RichText } from '@atproto/api';

export interface BskyCredentials {
  handle: string;
  appPassword: string;
}

export interface PostResult {
  success: boolean;
  uri?: string;
  error?: string;
}

export async function postToBluesky(
  text: string,
  credentials: BskyCredentials,
): Promise<PostResult> {
  const agent = new AtpAgent({ service: 'https://bsky.social' });

  await agent.login({
    identifier: credentials.handle,
    password: credentials.appPassword,
  });

  const rt = new RichText({ text });
  await rt.detectFacets(agent);

  const response = await agent.post({
    text: rt.text,
    facets: rt.facets,
    createdAt: new Date().toISOString(),
  });

  return {
    success: true,
    uri: response.uri,
  };
}
