import type { ResearchProvider, ResearchRequest, ResearchResult, OpenaiProviderConfig } from '../types/research.js';
import { readFileSync } from 'node:fs';

export class OpenaiProvider implements ResearchProvider {
  readonly name = 'openai' as const;
  private config: OpenaiProviderConfig;

  constructor(config: OpenaiProviderConfig) {
    this.config = config;
  }

  async research(request: ResearchRequest): Promise<ResearchResult> {
    const basePrompt = readFileSync(request.basePromptPath, 'utf-8');
    const providerPrompt = readFileSync(request.providerPromptPath, 'utf-8');
    const fullPrompt = `${basePrompt}\n\n${providerPrompt}`;

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
      return {
        category: request.category,
        status: 'error',
        error: `OpenAI API error ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json() as {
      output: Array<{ type: string; content?: Array<{ type: string; text?: string }> }>;
    };
    const messageItem = data.output.find((item) => item.type === 'message');
    const text = messageItem?.content?.find((c) => c.type === 'output_text')?.text;
    if (!text) {
      return {
        category: request.category,
        status: 'error',
        error: 'No text content in OpenAI response',
      };
    }

    return {
      category: request.category,
      status: 'success',
      markdown: text,
    };
  }
}
