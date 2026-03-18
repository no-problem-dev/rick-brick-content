/** 記事カテゴリ一覧 */
export const CATEGORIES = ['paper-review', 'ai-news-digest'] as const;
export type Category = (typeof CATEGORIES)[number];

/** ディレクトリパス */
export const ARTICLES_DIR = 'articles';
export const IMAGES_DIR = 'images';
export const TMP_DIR = '.tmp';

/** Imagen API */
export const IMAGEN_MODEL = 'imagen-4.0-generate-001';

/** Thumbnail prompt generation */
export const THUMBNAIL_PROMPT_MODEL = 'claude-haiku-4-5-20251001';
export const THUMBNAIL_COMMON_CONSTRAINTS = `This must look like an actual photograph — real fur texture with individual hair strands visible, natural eye reflections and catchlights, realistic ambient lighting with natural shadows. The cat should be naturally posed. All props and environment must also look photographically real — no CGI, no digital art, no illustration style.
STRICTLY PROHIBITED: Do NOT include any text, letters, words, numbers, watermarks, logos, or captions anywhere in the image. The image must contain absolutely zero text or writing of any kind. No cartoon or illustrated style — this must be indistinguishable from a real photograph.`;

/** デフォルト画像 */
export const DEFAULT_IMAGE_PATH = 'images/defaults/default.png';
