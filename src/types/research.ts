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

export interface ClaudeProviderConfig {
  apiKey: string;
  model: string;
}

export interface GeminiProviderConfig {
  apiKey: string;
  model: string;
}

export interface OpenaiProviderConfig {
  apiKey: string;
  model: string;
}
