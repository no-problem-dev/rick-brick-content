import type { ThumbnailPromptRequest, ThumbnailPromptResult } from '../types/thumbnail.js';
import {
  generateThumbnailPrompt,
  generateThumbnailPromptGemini,
  generateThumbnailPromptOpenai,
} from './prompt-generator.js';
import { buildFallbackResult } from './meta-prompt.js';

type ProviderName = 'claude' | 'gemini' | 'openai' | 'mock';

interface PromptGeneratorConfig {
  provider: ProviderName;
  apiKey: string;
  model?: string;
}

const API_KEY_ENV: Record<Exclude<ProviderName, 'mock'>, string> = {
  claude: 'ANTHROPIC_API_KEY',
  gemini: 'GEMINI_API_KEY',
  openai: 'OPENAI_API_KEY',
};

export function resolvePromptGeneratorConfig(): PromptGeneratorConfig {
  const provider = (process.env.RESEARCH_PROVIDER || 'claude') as ProviderName;
  if (provider === 'mock') {
    return { provider: 'mock', apiKey: '' };
  }
  const apiKey = process.env[API_KEY_ENV[provider]] || '';
  return { provider, apiKey, model: process.env.THUMBNAIL_PROMPT_MODEL };
}

const GENERATORS: Record<
  Exclude<ProviderName, 'mock'>,
  (req: ThumbnailPromptRequest, apiKey: string, model?: string) => Promise<ThumbnailPromptResult>
> = {
  claude: generateThumbnailPrompt,
  gemini: generateThumbnailPromptGemini,
  openai: generateThumbnailPromptOpenai,
};

export async function generatePromptByProvider(
  request: ThumbnailPromptRequest,
  config: PromptGeneratorConfig,
): Promise<ThumbnailPromptResult> {
  if (config.provider === 'mock' || !config.apiKey) {
    if (!config.apiKey && config.provider !== 'mock') {
      console.warn(`No API key for thumbnail prompt provider "${config.provider}", using fallback`);
    }
    return buildFallbackResult(request);
  }

  return GENERATORS[config.provider](request, config.apiKey, config.model);
}
