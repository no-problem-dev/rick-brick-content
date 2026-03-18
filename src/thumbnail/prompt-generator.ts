import type { ThumbnailPromptRequest, ThumbnailPromptResult } from '../types/thumbnail.js';
import { THUMBNAIL_PROMPT_MODEL, THUMBNAIL_COMMON_CONSTRAINTS } from '../config/constants.js';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export function buildFallbackPrompt(title: string, summary: string): string {
  return `A real domestic cat photographed in a scene related to the blog topic.\nTopic: ${title}\nSummary: ${summary}\n${THUMBNAIL_COMMON_CONSTRAINTS}`;
}

function buildMetaPrompt(request: ThumbnailPromptRequest): string {
  const { title, summary, body } = request;
  const bodyExcerpt = body.slice(0, 2000);
  const bodySection = bodyExcerpt
    ? `記事本文（抜粋）: ${bodyExcerpt}`
    : '';

  return `あなたはブログ記事のサムネイル画像を企画するクリエイティブディレクターです。
以下の記事内容を読み、猫が主人公の実写風サムネイル画像のシーンを1つ提案してください。

ルール:
- 猫が自然にその場面にいる設定にする
- 記事のキーワードや概念を視覚的な小道具・背景・シチュエーションで表現する
- ユーモアや意外性を入れて面白い構図にする
- カメラアングル、照明、背景の雰囲気も具体的に指定する
- 画像内にテキストは一切含めない前提で、視覚だけで記事テーマが伝わるようにする
- 150語以内の英語で出力する

記事タイトル: ${title}
記事要約: ${summary}${bodySection ? `\n${bodySection}` : ''}`;
}

function buildFallbackResult(request: ThumbnailPromptRequest): ThumbnailPromptResult {
  const { title, summary } = request;
  return { prompt: buildFallbackPrompt(title, summary), scene: 'fallback' };
}

export async function generateThumbnailPrompt(
  request: ThumbnailPromptRequest,
  apiKey: string,
  model?: string,
): Promise<ThumbnailPromptResult> {
  const usedModel = model ?? THUMBNAIL_PROMPT_MODEL;

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: usedModel,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: buildMetaPrompt(request),
          },
        ],
      }),
    });

    if (!response.ok) {
      return buildFallbackResult(request);
    }

    const data = await response.json() as { content: Array<{ type: string; text: string }> };
    const textBlock = data.content.find((block) => block.type === 'text');
    if (!textBlock) {
      return buildFallbackResult(request);
    }

    const scene = textBlock.text;
    const prompt = `${scene}\n${THUMBNAIL_COMMON_CONSTRAINTS}`;

    return { prompt, scene };
  } catch {
    return buildFallbackResult(request);
  }
}
