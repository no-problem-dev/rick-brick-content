import type { ResearchRequest, ResearchResult } from '../types/research.js';
import { BaseResearchProvider } from './base-provider.js';

export class OpenaiProvider extends BaseResearchProvider {
  readonly name = 'openai' as const;

  async research(request: ResearchRequest): Promise<ResearchResult> {
    const fullPrompt = this.loadPrompts(request);

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        input: fullPrompt,
        tools: [{ type: 'web_search' }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return this.buildError(request.category, `OpenAI API error ${response.status}: ${errorText}`);
    }

    const data = await response.json() as {
      output: Array<{ type: string; content?: Array<{ type: string; text?: string }> }>;
    };
    const messageItem = data.output.find((item) => item.type === 'message');
    const text = messageItem?.content?.find((c) => c.type === 'output_text')?.text;
    if (!text) {
      return this.buildError(request.category, 'No text content in OpenAI response');
    }

    return this.buildResult(request.category, text);
  }
}
