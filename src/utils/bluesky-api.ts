/**
 * Bluesky (AT Protocol) API クライアント
 * @atproto/api SDK を使用
 *
 * 投稿にリンクカード（embed external）を付与し、
 * OGP 画像（og:image）をサムネイルとして表示する。
 */
import { AtpAgent, RichText, type BlobRef } from '@atproto/api';

export interface BskyCredentials {
  handle: string;
  appPassword: string;
}

export interface PostResult {
  success: boolean;
  uri?: string;
  error?: string;
}

/** 投稿に添付するリンクカード情報 */
export interface LinkCard {
  url: string;
  title: string;
  description: string;
}

/**
 * URL の OGP メタタグをフェッチして og:image の URL を取得する
 */
async function fetchOgImageUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Rick-Brick Bot/1.0' },
      redirect: 'follow',
    });
    if (!response.ok) return null;

    const html = await response.text();

    // og:image メタタグを抽出
    const ogImageMatch = html.match(
      /<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i,
    ) ?? html.match(
      /<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:image["']/i,
    );

    return ogImageMatch?.[1] || null;
  } catch (error) {
    console.warn(`Failed to fetch OGP from ${url}:`, error);
    return null;
  }
}

/**
 * 画像 URL から画像データをダウンロードし Bluesky にアップロードする
 */
async function uploadImageBlob(
  agent: AtpAgent,
  imageUrl: string,
): Promise<BlobRef | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const contentType = response.headers.get('content-type') || 'image/png';
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const uploadResult = await agent.uploadBlob(uint8Array, {
      encoding: contentType,
    });

    return uploadResult.data.blob;
  } catch (error) {
    console.warn(`Failed to upload image blob from ${imageUrl}:`, error);
    return null;
  }
}

/**
 * Bluesky にテキストを投稿する
 * linkCard が指定された場合、リンクカード（embed external）を付与し
 * OGP 画像をサムネイルとして表示する
 */
export async function postToBluesky(
  text: string,
  credentials: BskyCredentials,
  linkCard?: LinkCard,
): Promise<PostResult> {
  const agent = new AtpAgent({ service: 'https://bsky.social' });

  await agent.login({
    identifier: credentials.handle,
    password: credentials.appPassword,
  });

  const rt = new RichText({ text });
  await rt.detectFacets(agent);

  // embed external（リンクカード）を構築
  let embed: { $type: string; external: Record<string, unknown> } | undefined;
  if (linkCard) {
    const ogImageUrl = await fetchOgImageUrl(linkCard.url);
    let thumb: BlobRef | null = null;
    if (ogImageUrl) {
      thumb = await uploadImageBlob(agent, ogImageUrl);
    }

    embed = {
      $type: 'app.bsky.embed.external',
      external: {
        uri: linkCard.url,
        title: linkCard.title,
        description: linkCard.description,
        ...(thumb ? { thumb } : {}),
      },
    };
  }

  const response = await agent.post({
    text: rt.text,
    facets: rt.facets,
    ...(embed ? { embed } : {}),
    createdAt: new Date().toISOString(),
  });

  return {
    success: true,
    uri: response.uri,
  };
}
