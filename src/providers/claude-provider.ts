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
    const textBlocks = data.content.filter((c) => c.type === 'text' && c.text);

    if (textBlocks.length === 0) {
      return this.buildError(request.category, 'No text content in Claude response');
    }

    console.log(`Claude response: ${data.content.length} content blocks, types: [${data.content.map((c) => c.type).join(', ')}]`);

    // web_search 使用時、text ブロックが多数に分割される:
    // [text(前置き), server_tool_use, ..., web_search_tool_result, text(記事1), text(記事2), ...]
    // 最後の web_search_tool_result 以降の text ブロックをすべて連結して記事とする
    const lastSearchIdx = data.content.reduce(
      (acc, c, i) => (c.type === 'web_search_tool_result' ? i : acc), -1,
    );

    // 検索結果以降の text ブロックを連結（検索なしの場合は前置きを除いて全連結）
    const articleTexts = data.content
      .filter((c, i) => c.type === 'text' && c.text && i > (lastSearchIdx >= 0 ? lastSearchIdx : 0))
      .map((c) => c.text!);

    // 検索結果後の text がなければフォールバック: 全 text ブロックの最後
    const articleText = articleTexts.length > 0
      ? articleTexts.join('\n\n')
      : textBlocks[textBlocks.length - 1]!.text!;

    return this.buildResult(request.category, articleText);
  }
}
