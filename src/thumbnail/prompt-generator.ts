import type { ThumbnailPromptRequest, ThumbnailPromptResult } from '../types/thumbnail.js';
import { THUMBNAIL_PROMPT_MODEL } from '../config/constants.js';
import { buildMetaPrompt, buildFallbackResult, buildPromptWithConstraints } from './meta-prompt.js';

export { buildFallbackPrompt } from './meta-prompt.js';

const GEMINI_THUMBNAIL_PROMPT_MODEL = 'gemini-3.1-flash-lite-preview';
const OPENAI_THUMBNAIL_PROMPT_MODEL = 'gpt-5.4-nano';

/**
 * LLM API を呼び出してシーン記述を取得する共通ラッパー。
 * fetch 構築とレスポンスからのテキスト抽出のみプロバイダー固有。
 */
async function callLlmForPrompt(
  request: ThumbnailPromptRequest,
  doFetch: () => Promise<Response>,
  extractText: (json: unknown) => string | undefined,
): Promise<ThumbnailPromptResult> {
  try {
    const response = await doFetch();
    if (!response.ok) {
      return buildFallbackResult(request);
    }
    const data: unknown = await response.json();
    const text = extractText(data);
    if (!text) {
      return buildFallbackResult(request);
    }
    return buildPromptWithConstraints(text);
  } catch {
    return buildFallbackResult(request);
  }
}

export async function generateThumbnailPrompt(
  request: ThumbnailPromptRequest,
  apiKey: string,
  model?: string,
): Promise<ThumbnailPromptResult> {
  const usedModel = model ?? THUMBNAIL_PROMPT_MODEL;
  return callLlmForPrompt(
    request,
    () =>
      fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: usedModel,
          max_tokens: 1024,
          temperature: 1.0,
          messages: [{ role: 'user', content: buildMetaPrompt(request) }],
        }),
      }),
    (data) => {
      const d = data as { content: Array<{ type: string; text: string }> };
      return d.content.find((block) => block.type === 'text')?.text;
    },
  );
}

export async function generateThumbnailPromptGemini(
  request: ThumbnailPromptRequest,
  apiKey: string,
  model?: string,
): Promise<ThumbnailPromptResult> {
  const usedModel = model ?? GEMINI_THUMBNAIL_PROMPT_MODEL;
  return callLlmForPrompt(
    request,
    () =>
      fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${usedModel}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: buildMetaPrompt(request) }] }],
            generationConfig: { temperature: 2.0 },
          }),
        },
      ),
    (data) => {
      const d = data as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      return d.candidates?.[0]?.content?.parts?.[0]?.text;
    },
  );
}

export async function generateThumbnailPromptOpenai(
  request: ThumbnailPromptRequest,
  apiKey: string,
  model?: string,
): Promise<ThumbnailPromptResult> {
  const usedModel = model ?? OPENAI_THUMBNAIL_PROMPT_MODEL;
  return callLlmForPrompt(
    request,
    () =>
      fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: usedModel,
          input: buildMetaPrompt(request),
          temperature: 2.0,
        }),
      }),
    (data) => {
      const d = data as {
        output: Array<{ type: string; content?: Array<{ type: string; text?: string }> }>;
      };
      const messageItem = d.output.find((item) => item.type === 'message');
      return messageItem?.content?.find((c) => c.type === 'output_text')?.text;
    },
  );
}
