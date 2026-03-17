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

/**
 * サムネイルプロンプトを多様なスタイルから選択して生成する。
 * slug のハッシュ値を使い、同じ記事なら同じスタイルが選ばれる（再現性あり）。
 */
function buildThumbnailPrompt(title: string, summary: string, slug: string): string {
  const styles = [
    {
      camera: 'Canon EOS R5 with RF 50mm f/1.2L lens, ISO 400',
      lighting: 'natural golden hour window lighting with warm tones',
      direction: 'Shallow depth of field with creamy circular bokeh. Warm, inviting atmosphere.',
      catBreed: 'a fluffy orange tabby cat',
      environment: 'cozy home office with wooden desk, warm lamp light, and scattered tech magazines',
    },
    {
      camera: 'Sony A7R V with 85mm f/1.4 GM lens, ISO 200',
      lighting: 'cool blue-toned ambient light from multiple monitors',
      direction: 'Moody, cinematic look with dramatic light-shadow contrast. Cyberpunk aesthetic.',
      catBreed: 'a sleek black cat with bright green eyes',
      environment: 'dark tech lab with neon-lit screens, server racks glowing in the background',
    },
    {
      camera: 'Nikon Z9 with 35mm f/1.4 lens, ISO 800',
      lighting: 'bright overhead studio lighting, clean white background',
      direction: 'Clean, minimalist composition with sharp focus. Editorial magazine style.',
      catBreed: 'a white Scottish Fold with round face',
      environment: 'minimalist white desk with a single sleek laptop and coffee cup',
    },
    {
      camera: 'Fujifilm X-T5 with 56mm f/1.2 lens, ISO 400',
      lighting: 'soft diffused natural light from a large window, rainy day atmosphere',
      direction: 'Film-like grain with muted pastel tones. Nostalgic, contemplative mood.',
      catBreed: 'a gray British Shorthair with amber eyes',
      environment: 'library corner with stacked books, rain-streaked window, and a vintage desk lamp',
    },
    {
      camera: 'Leica SL2-S with 50mm f/2 APO lens, ISO 100',
      lighting: 'harsh directional sunlight creating strong geometric shadows',
      direction: 'High contrast with deep blacks and bright highlights. Architectural feel.',
      catBreed: 'a calico cat with distinctive patches',
      environment: 'modern concrete office with floor-to-ceiling windows and geometric furniture',
    },
    {
      camera: 'Canon EOS R3 with RF 28-70mm f/2L lens, ISO 320',
      lighting: 'warm tungsten desk lamp mixed with cool screen glow',
      direction: 'Split lighting with warm and cool tones. Intimate, focused atmosphere.',
      catBreed: 'a Siamese cat with blue eyes',
      environment: 'cluttered engineer workstation with oscilloscope, breadboards, and tangled cables',
    },
    {
      camera: 'Hasselblad X2D with XCD 80mm f/1.9 lens, ISO 64',
      lighting: 'overcast outdoor light, soft and even illumination',
      direction: 'Medium format look with incredible detail and smooth tonal gradation.',
      catBreed: 'a Maine Coon with luxurious fur',
      environment: 'rooftop terrace with city skyline backdrop, potted plants, and a tablet on the table',
    },
    {
      camera: 'Olympus OM-1 Mark II with 45mm f/1.2 PRO lens, ISO 640',
      lighting: 'colorful LED strip lighting in pink, purple, and blue',
      direction: 'Vibrant neon color palette with playful energy. Gaming/streamer aesthetic.',
      catBreed: 'a Bengal cat with spotted coat',
      environment: 'gaming setup with RGB keyboard, multiple monitors showing AI dashboards, and headphones',
    },
  ];

  // slug から決定的にスタイルを選択（同じ記事 = 同じスタイル）
  const hash = slug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const style = styles[hash % styles.length]!;

  return `Shot on ${style.camera}, ${style.lighting}. A real domestic cat — specifically ${style.catBreed} — photographed in a scene related to the blog topic.\nTopic: ${title}\nSummary: ${summary}\nPhotography direction: ${style.direction} This must look like an actual photograph — real fur texture with individual hair strands visible, natural eye reflections and catchlights, realistic ambient lighting with natural shadows. The cat should be naturally posed in or near props that represent the topic. ${style.environment}. The props and environment must also look photographically real — no CGI, no digital art, no illustration style.\nSTRICTLY PROHIBITED: Do NOT include any text, letters, words, numbers, watermarks, logos, or captions anywhere in the image. The image must contain absolutely zero text or writing of any kind. No cartoon or illustrated style — this must be indistinguishable from a real photograph.`;
}

async function generateThumbnail(
  slug: string,
  title: string,
  summary: string,
  apiKey: string,
): Promise<ThumbnailResult> {
  console.log(`Thumbnail style seed: slug="${slug}" → style index ${slug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 8}`);
  const outputPath = join(IMAGES_DIR, `${slug}.png`);
  const defaultImagePath = DEFAULT_IMAGE_PATH;

  mkdirSync(dirname(outputPath), { recursive: true });

  try {
    const prompt = buildThumbnailPrompt(title, summary, slug);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-goog-api-key': apiKey,
      },
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
