import type { ResearchProvider, ResearchProviderName } from '../types/research.js';
import { ClaudeProvider } from './claude-provider.js';
import { GeminiProvider } from './gemini-provider.js';
import { OpenaiProvider } from './openai-provider.js';
import { MockProvider } from './mock-provider.js';

export function createResearchProvider(): ResearchProvider {
  const providerName = (process.env.RESEARCH_PROVIDER || 'claude') as ResearchProviderName;
  const modelOverride = process.env.RESEARCH_MODEL || '';

  switch (providerName) {
    case 'claude': {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
      return new ClaudeProvider({ apiKey, model: modelOverride || 'claude-haiku-4-5' });
    }
    case 'gemini': {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
      return new GeminiProvider({ apiKey, model: modelOverride || 'gemini-2.0-flash' });
    }
    case 'openai': {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
      return new OpenaiProvider({ apiKey, model: modelOverride || 'gpt-4.1-nano' });
    }
    case 'mock': {
      return new MockProvider({ apiKey: 'mock', model: 'mock' });
    }
    default:
      throw new Error(`Unknown RESEARCH_PROVIDER: ${providerName}`);
  }
}
