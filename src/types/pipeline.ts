import type { Category } from '../config/constants.js';
import type { ResearchProviderName } from './research.js';

export interface PipelineResult {
  executedAt: string;
  provider: ResearchProviderName;
  results: ArticlePipelineResult[];
  pushed: boolean;
  pushedFiles: string[];
  deployTriggered: boolean;
}

export interface ArticlePipelineResult {
  category: Category;
  articleStatus: 'success' | 'error' | 'skipped';
  articleError?: string;
  slug?: string;
  thumbnailStatus?: 'success' | 'fallback';
  validationResult?: Record<string, unknown>;
}
