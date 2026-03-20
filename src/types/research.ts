import type { Category } from '../config/constants.js';

export type ResearchProviderName = 'claude' | 'gemini' | 'openai' | 'mock';

export interface ResearchRequest {
  category: Category;
  basePromptPath: string;
  providerPromptPath: string;
}

export interface ResearchResult {
  category: Category;
  status: 'success' | 'error' | 'skipped';
  error?: string;
  markdown?: string;
  frontmatter?: {
    title: string;
    summary: string;
    tags: string[];
    date: string;
    slug: string;
  };
  /** 検索ツールのAPIレスポンスから構造的に抽出したURL一覧 */
  searchUrls?: string[];
}

export interface ResearchProvider {
  readonly name: ResearchProviderName;
  research(request: ResearchRequest): Promise<ResearchResult>;
}

export interface ProviderConfig {
  apiKey: string;
  model: string;
}
