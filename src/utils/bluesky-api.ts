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

/** Bluesky の uploadBlob 上限 (1MB) */
const BSKY_BLOB_MAX_SIZE = 1_000_000;

/**
 * 画像 URL から画像データをダウンロードし Bluesky にアップロードする。
 * 1MB 超の場合は sharp で JPEG 圧縮してからアップロードする。
 */
async function uploadImageBlob(
  agent: AtpAgent,
  imageUrl: string,
): Promise<BlobRef | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    let buffer = new Uint8Array(arrayBuffer);
    let encoding = response.headers.get('content-type') || 'image/png';

    if (buffer.length > BSKY_BLOB_MAX_SIZE) {
      const sharp = (await import('sharp')).default;
      const originalSize = buffer.length;

      // 品質を段階的に下げて 1MB 未満に収める
      for (const quality of [80, 60, 40, 20]) {
        const compressed = await sharp(buffer)
          .jpeg({ quality })
          .toBuffer();
        if (compressed.length < BSKY_BLOB_MAX_SIZE) {
          console.log(
            `Bluesky: compressed image ${originalSize} → ${compressed.length} bytes (quality=${quality})`,
          );
          buffer = new Uint8Array(compressed);
          encoding = 'image/jpeg';
          break;
        }
      }
    }

    const uploadResult = await agent.uploadBlob(buffer, { encoding });
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
