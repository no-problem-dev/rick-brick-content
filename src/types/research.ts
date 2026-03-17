export type ResearchProviderName = 'claude' | 'gemini' | 'openai';

export interface ResearchRequest {
  category: 'paper-review' | 'ai-news-digest';
  basePromptPath: string;
  providerPromptPath: string;
}

export interface ResearchResult {
  category: 'paper-review' | 'ai-news-digest';
  status: 'success' | 'error';
  error?: string;
  markdown?: string;
  frontmatter?: {
    title: string;
    summary: string;
    tags: string[];
    date: string;
    slug: string;
  };
}

export interface ResearchProvider {
  readonly name: ResearchProviderName;
  research(request: ResearchRequest): Promise<ResearchResult>;
}

export interface ProviderConfig {
  apiKey: string;
  model: string;
}
