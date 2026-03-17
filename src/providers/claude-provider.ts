import type { ResearchRequest, ResearchResult } from '../types/research.js';
import { BaseResearchProvider } from './base-provider.js';

export class ClaudeProvider extends BaseResearchProvider {
  readonly name = 'claude' as const;

  async research(request: ResearchRequest): Promise<ResearchResult> {
    const fullPrompt = this.loadPrompts(request);

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
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: fullPrompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return this.buildError(request.category, `Claude API error ${response.status}: ${errorText}`);
    }

    const data = await response.json() as { content: Array<{ type: string; text?: string }> };
    const textBlock = data.content.find((c) => c.type === 'text');
    if (!textBlock?.text) {
      return this.buildError(request.category, 'No text content in Claude response');
    }

    return this.buildResult(request.category, textBlock.text);
  }
}
