/** 記事カテゴリ一覧 */
export const CATEGORIES = ['paper-review', 'ai-news-digest'] as const;
export type Category = (typeof CATEGORIES)[number];

/** ディレクトリパス */
export const ARTICLES_DIR = 'articles';
export const IMAGES_DIR = 'images';
export const TMP_DIR = '.tmp';

/** Imagen API */
export const IMAGEN_MODEL = 'imagen-4.0-generate-001';

/** デフォルト画像 */
export const DEFAULT_IMAGE_PATH = 'images/defaults/default.png';
