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
        'anthropic-version': '2025-04-15',
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
    const textBlocks = data.content.filter((c) => c.type === 'text' && c.text);

    if (textBlocks.length === 0) {
      return this.buildError(request.category, 'No text content in Claude response');
    }

    console.log(`Claude response: ${data.content.length} content blocks, types: [${data.content.map((c) => c.type).join(', ')}]`);

    // web_search 使用時は複数の text ブロックが返る:
    // 最初の text = 前置き（「調査します」等）、最後の text = 実際の記事
    // frontmatter (---) を含む text ブロックを優先、なければ最後の text ブロックを使用
    const articleBlock = textBlocks.find((c) => c.text!.includes('---\n')) ?? textBlocks[textBlocks.length - 1]!;

    return this.buildResult(request.category, articleBlock.text!);
  }
}
