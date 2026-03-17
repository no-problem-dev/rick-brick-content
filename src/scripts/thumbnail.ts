import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import type { ResearchResult } from '../types/research.js';
import { upsertFrontmatterField } from '../utils/frontmatter.js';
import { resolveSlug, validateSlug } from '../utils/slug.js';
import { CATEGORIES, ARTICLES_DIR, IMAGES_DIR, TMP_DIR, IMAGEN_MODEL, DEFAULT_IMAGE_PATH } from '../config/constants.js';

interface ThumbnailResult {
  slug: string;
  status: 'success' | 'fallback';
  path: string;
  error?: string;
}

/**
 * sharp で 1200x630 に中央クロップする。
 * sharp が利用できない場合はクロップをスキップして元画像をそのまま使う。
 */
async function cropImage(inputBuffer: Buffer, outputPath: string): Promise<void> {
  try {
    const sharp = (await import('sharp')).default;
    await sharp(inputBuffer)
      .resize(1200, 630, { fit: 'cover', position: 'centre' })
      .png()
      .toFile(outputPath);
  } catch {
    // sharp が利用できない場合は元画像をそのまま保存
    writeFileSync(outputPath, inputBuffer);
  }
}

async function generateThumbnail(
  slug: string,
  title: string,
  summary: string,
  apiKey: string,
): Promise<ThumbnailResult> {
  const outputPath = join(IMAGES_DIR, `${slug}.png`);
  const defaultImagePath = DEFAULT_IMAGE_PATH;

  mkdirSync(dirname(outputPath), { recursive: true });

  try {
    const prompt = `Create a modern, visually appealing blog thumbnail image.\nTopic: ${title}\nSummary: ${summary}\nStyle: Clean, tech-themed, abstract illustration. No text in the image.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: '16:9',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Imagen API error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json() as {
      predictions?: Array<{ bytesBase64Encoded?: string; mimeType?: string }>;
    };
    const imageData = data.predictions?.[0]?.bytesBase64Encoded;

    if (!imageData) {
      throw new Error('No image data in Imagen response');
    }

    const buffer = Buffer.from(imageData, 'base64');
    await cropImage(buffer, outputPath);

    return { slug, status: 'success', path: outputPath };
  } catch (error) {
    console.error(`Thumbnail generation failed for ${slug}:`, error);

    // フォールバック: デフォルト画像をコピー
    if (existsSync(defaultImagePath)) {
      copyFileSync(defaultImagePath, outputPath);
    }

    return {
      slug,
      status: 'fallback',
      path: outputPath,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * 記事ファイルの frontmatter に thumbnail パスを追記する
 */
function updateArticleThumbnail(slug: string, thumbnailPath: string): void {
  const articlesDir = ARTICLES_DIR;

  // articles/ から {date}-{slug}.md にマッチするファイルを探す
  if (!existsSync(articlesDir)) {
    console.log(`Articles directory not found, skipping frontmatter update`);
    return;
  }

  const files = readdirSync(articlesDir);
  const articleFile = files.find((f) => f.endsWith(`-${slug}.md`));

  if (!articleFile) {
    console.log(`Article file for slug "${slug}" not found, skipping frontmatter update`);
    return;
  }

  const articlePath = join(articlesDir, articleFile);
  const content = readFileSync(articlePath, 'utf-8');
  const updated = upsertFrontmatterField(content, 'thumbnail', thumbnailPath);
  writeFileSync(articlePath, updated);
  console.log(`Updated frontmatter: ${articlePath} → thumbnail: "${thumbnailPath}"`);
}

async function main() {
  const isMock = process.env.RESEARCH_PROVIDER === 'mock';

  if (!isMock) {
    const apiKey = process.env.GEMINI_IMAGE_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_IMAGE_API_KEY is not set');
      process.exit(1);
    }
  }

  const apiKey = isMock ? '' : process.env.GEMINI_IMAGE_API_KEY!;
  const categories = CATEGORIES;
  const today = new Date().toISOString().split('T')[0];

  for (const category of categories) {
    const inputPath = join(TMP_DIR, `research-${category}.json`);
    if (!existsSync(inputPath)) continue;

    const result: ResearchResult = JSON.parse(readFileSync(inputPath, 'utf-8'));
    if (result.status !== 'success' || !result.frontmatter) continue;

    const slug = resolveSlug(result, category, today);
    if (!validateSlug(slug)) {
      console.error(`${category}: invalid slug "${slug}", skipping thumbnail generation`);
      continue;
    }

    if (isMock) {
      const mockSrc = 'fixtures/images/mock-thumbnail.png';
      const outputPath = join(IMAGES_DIR, `${slug}.png`);
      mkdirSync(dirname(outputPath), { recursive: true });
      if (existsSync(mockSrc)) {
        copyFileSync(mockSrc, outputPath);
        console.log(`${category}: mock thumbnail copied → ${outputPath}`);
      }
      updateArticleThumbnail(slug, `/images/${slug}.png`);
      continue;
    }

    const { title, summary } = result.frontmatter;
    const thumbnailResult = await generateThumbnail(slug, title, summary, apiKey);
    console.log(`${category}: thumbnail ${thumbnailResult.status} → ${thumbnailResult.path}`);

    // 記事 frontmatter に thumbnail パスを追記
    const thumbnailPublicPath = thumbnailResult.status === 'success'
      ? `/images/${slug}.png`
      : '/images/defaults/default.png';
    updateArticleThumbnail(slug, thumbnailPublicPath);
  }
}

main().catch(console.error);
