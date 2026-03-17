import type { ResearchProvider, ResearchRequest, ResearchResult, GeminiProviderConfig } from '../types/research.js';
import { readFileSync } from 'node:fs';

export class GeminiProvider implements ResearchProvider {
  readonly name = 'gemini' as const;
  private config: GeminiProviderConfig;

  constructor(config: GeminiProviderConfig) {
    this.config = config;
  }

  async research(request: ResearchRequest): Promise<ResearchResult> {
    const basePrompt = readFileSync(request.basePromptPath, 'utf-8');
    const providerPrompt = readFileSync(request.providerPromptPath, 'utf-8');
    const fullPrompt = `${basePrompt}\n\n${providerPrompt}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        tools: [{ googleSearch: {} }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        category: request.category,
        status: 'error',
        error: `Gemini API error ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return {
        category: request.category,
        status: 'error',
        error: 'No text content in Gemini response',
      };
    }

    return {
      category: request.category,
      status: 'success',
      markdown: text,
    };
  }
}
