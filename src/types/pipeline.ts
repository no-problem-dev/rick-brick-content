import type { ResearchProviderName } from './research.js';

export interface PipelineResult {
  executedAt: string;
  provider: ResearchProviderName;
  paperReview: ArticlePipelineResult;
  aiNewsDigest: ArticlePipelineResult;
  pushed: boolean;
  pushedFiles: string[];
  deployTriggered: boolean;
}

export interface ArticlePipelineResult {
  category: 'paper-review' | 'ai-news-digest';
  articleStatus: 'success' | 'error';
  articleError?: string;
  slug?: string;
  thumbnailStatus?: 'success' | 'fallback';
  validationResult?: Record<string, unknown>;
}
