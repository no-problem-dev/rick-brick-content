import type { Category } from '../config/constants.js';

/** サムネイルプロンプト生成リクエスト */
export interface ThumbnailPromptRequest {
  title: string;
  summary: string;
  body: string;
  category: Category;
}

/** サムネイルプロンプト生成結果 */
export interface ThumbnailPromptResult {
  prompt: string;
  scene: string;
}

/** LLM ベースのサムネイルプロンプトジェネレーター */
export interface ThumbnailPromptGenerator {
  generate(request: ThumbnailPromptRequest): Promise<ThumbnailPromptResult>;
}
