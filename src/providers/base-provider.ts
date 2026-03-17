import type { ResearchProvider, ResearchRequest, ResearchResult, ResearchProviderName, ProviderConfig } from '../types/research.js';
import { readFileSync } from 'node:fs';
import { parseFrontmatter } from '../utils/frontmatter.js';

export abstract class BaseResearchProvider implements ResearchProvider {
  abstract readonly name: ResearchProviderName;
  protected config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  /** プロンプト読み込み（共通） */
  protected loadPrompts(request: ResearchRequest): string {
    const base = readFileSync(request.basePromptPath, 'utf-8');
    const provider = readFileSync(request.providerPromptPath, 'utf-8');
    return `${base}\n\n${provider}`;
  }

  /** API レスポンスのテキストから ResearchResult を構築（共通） */
  protected buildResult(
    category: ResearchRequest['category'],
    markdown: string,
  ): ResearchResult {
    const { frontmatter } = parseFrontmatter(markdown);
    return {
      category,
      status: 'success',
      markdown,
      frontmatter: {
        title: String(frontmatter.title ?? ''),
        summary: String(frontmatter.summary ?? ''),
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        date: String(frontmatter.date ?? ''),
        slug: String(frontmatter.slug ?? ''),
      },
    };
  }

  /** エラー結果の構築（共通） */
  protected buildError(
    category: ResearchRequest['category'],
    error: string,
  ): ResearchResult {
    return { category, status: 'error', error };
  }

  abstract research(request: ResearchRequest): Promise<ResearchResult>;
}
