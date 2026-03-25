/**
 * LLM API クライアント共通モジュール
 * Claude / Gemini / OpenAI の各 API 呼び出しを統一インターフェースで提供する。
 * translate.ts, recap.ts 等から共通利用する。
 */

export interface LlmCallOptions {
  model: string;
  maxTokens?: number;
  maxRetries?: number;
  /** レート制限時の待機時間（ms） */
  rateLimitWaitMs?: number;
  /** エラー時の待機時間（ms） */
  errorWaitMs?: number;
}

const DEFAULT_MAX_TOKENS = 16384;
const DEFAULT_MAX_RETRIES = 1;
const DEFAULT_RATE_LIMIT_WAIT_MS = 60000;
const DEFAULT_ERROR_WAIT_MS = 5000;

async function retryableCall(
  label: string,
  opts: Required<LlmCallOptions>,
  fn: (attempt: number) => Promise<string>,
): Promise<string> {
  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      if (attempt < opts.maxRetries) {
        const waitMs = opts.errorWaitMs;
        console.log(`${label} error on attempt ${attempt}: ${error instanceof Error ? error.message : String(error)}, retrying in ${waitMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      } else {
        throw error;
      }
    }
  }
  throw new Error(`${label} call failed after ${opts.maxRetries} attempts`);
}

function resolveOpts(opts: LlmCallOptions): Required<LlmCallOptions> {
  return {
    model: opts.model,
    maxTokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
    maxRetries: opts.maxRetries ?? DEFAULT_MAX_RETRIES,
    rateLimitWaitMs: opts.rateLimitWaitMs ?? DEFAULT_RATE_LIMIT_WAIT_MS,
    errorWaitMs: opts.errorWaitMs ?? DEFAULT_ERROR_WAIT_MS,
  };
}

export async function callClaude(prompt: string, opts: LlmCallOptions): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');

  const o = resolveOpts(opts);
  return retryableCall('Claude API', o, async (attempt) => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: o.model,
        max_tokens: o.maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429 && attempt < o.maxRetries) {
        console.log(`Claude API rate limited, waiting ${o.rateLimitWaitMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, o.rateLimitWaitMs));
      }
      throw new Error(`Claude API error ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as {
      content: Array<{ type: string; text?: string }>;
    };
    const textBlock = data.content.find((c) => c.type === 'text' && c.text);
    if (!textBlock?.text) throw new Error('No text content in Claude response');
    return textBlock.text;
  });
}

export async function callGemini(prompt: string, opts: LlmCallOptions): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

  const o = resolveOpts(opts);
  return retryableCall('Gemini API', o, async (attempt) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${o.model}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: o.maxTokens },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429 && attempt < o.maxRetries) {
        console.log(`Gemini API rate limited, waiting ${o.rateLimitWaitMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, o.rateLimitWaitMs));
      }
      throw new Error(`Gemini API error ${response.status}: ${errorText}`);
    }

    // response.json() は記事本文の特殊文字で失敗することがあるため
    // response.text() で取得後に手動パース
    const rawJson = await response.text();
    let data: { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    try {
      data = JSON.parse(rawJson) as typeof data;
    } catch {
      const fixed = rawJson.replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
      data = JSON.parse(fixed) as typeof data;
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No text content in Gemini response');
    return text;
  });
}

export async function callOpenAi(prompt: string, opts: LlmCallOptions): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');

  const o = resolveOpts(opts);
  return retryableCall('OpenAI API', o, async (attempt) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: o.model,
        max_tokens: o.maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429 && attempt < o.maxRetries) {
        console.log(`OpenAI API rate limited, waiting ${o.rateLimitWaitMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, o.rateLimitWaitMs));
      }
      throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('No text content in OpenAI response');
    return text;
  });
}

/**
 * プロバイダー名に応じて適切な LLM API を呼び出す
 */
export async function callLlm(prompt: string, provider: string, opts: LlmCallOptions): Promise<string> {
  switch (provider) {
    case 'claude':
      return callClaude(prompt, opts);
    case 'openai':
      return callOpenAi(prompt, opts);
    case 'gemini':
    default:
      return callGemini(prompt, opts);
  }
}
