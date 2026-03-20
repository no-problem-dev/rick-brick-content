import type { ResearchRequest, ResearchResult } from '../types/research.js';
import { BaseResearchProvider } from './base-provider.js';

export class GeminiProvider extends BaseResearchProvider {
  readonly name = 'gemini' as const;

  async research(request: ResearchRequest): Promise<ResearchResult> {
    const fullPrompt = this.loadPrompts(request);

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
      return this.buildError(request.category, `Gemini API error ${response.status}: ${errorText}`);
    }

    const data = await response.json() as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
        groundingMetadata?: {
          groundingChunks?: Array<{ web?: { uri?: string; title?: string } }>;
        };
      }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return this.buildError(request.category, 'No text content in Gemini response');
    }

    // groundingMetadata.groundingChunks から検索結果URLを構造的に抽出
    const searchUrls: string[] = [];
    const chunks = data.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      for (const chunk of chunks) {
        if (chunk.web?.uri) {
          searchUrls.push(chunk.web.uri);
        }
      }
    }

    console.log(`Gemini search URLs extracted: ${searchUrls.length} URLs`);
    return this.buildResult(request.category, text, searchUrls);
  }
}
