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
      output: Array<{
        type: string;
        content?: Array<{
          type: string;
          text?: string;
          annotations?: Array<{ type: string; url?: string }>;
        }>;
      }>;
    };
    const messageItem = data.output.find((item) => item.type === 'message');
    const textContent = messageItem?.content?.find((c) => c.type === 'output_text');
    const text = textContent?.text;
    if (!text) {
      return this.buildError(request.category, 'No text content in OpenAI response');
    }

    // annotations の url_citation から検索結果URLを構造的に抽出
    const searchUrls: string[] = [];
    if (messageItem?.content) {
      for (const content of messageItem.content) {
        if (content.annotations) {
          for (const annotation of content.annotations) {
            if (annotation.type === 'url_citation' && annotation.url) {
              searchUrls.push(annotation.url);
            }
          }
        }
      }
    }

    console.log(`OpenAI search URLs extracted: ${searchUrls.length} URLs`);
    return this.buildResult(request.category, text, searchUrls);
  }
}
