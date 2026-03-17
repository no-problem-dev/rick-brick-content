import type { ResearchProvider, ResearchRequest, ResearchResult, ClaudeProviderConfig } from '../types/research.js';
import { readFileSync } from 'node:fs';

export class ClaudeProvider implements ResearchProvider {
  readonly name = 'claude' as const;
  private config: ClaudeProviderConfig;

  constructor(config: ClaudeProviderConfig) {
    this.config = config;
  }

  async research(request: ResearchRequest): Promise<ResearchResult> {
    const basePrompt = readFileSync(request.basePromptPath, 'utf-8');
    const providerPrompt = readFileSync(request.providerPromptPath, 'utf-8');
    const fullPrompt = `${basePrompt}\n\n${providerPrompt}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: 8192,
        tools: [{ type: 'web_search', name: 'web_search' }],
        messages: [{ role: 'user', content: fullPrompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        category: request.category,
        status: 'error',
        error: `Claude API error ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json() as { content: Array<{ type: string; text?: string }> };
    const textBlock = data.content.find((c) => c.type === 'text');
    if (!textBlock?.text) {
      return {
        category: request.category,
        status: 'error',
        error: 'No text content in Claude response',
      };
    }

    return {
      category: request.category,
      status: 'success',
      markdown: textBlock.text,
    };
  }
}
