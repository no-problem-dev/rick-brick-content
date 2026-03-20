/**
 * 9本の tech-article サムネイルを猫プロンプトで再生成するスクリプト
 *
 * Usage:
 *   ANTHROPIC_API_KEY=xxx GEMINI_IMAGE_API_KEY=yyy npx tsx src/scripts/regen-thumbnails.ts
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';

// ---- 設定 ----
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GEMINI_IMAGE_API_KEY = process.env.GEMINI_IMAGE_API_KEY;
const CLAUDE_MODEL = 'claude-haiku-4-5-20251001';
const IMAGEN_MODEL = 'imagen-4.0-ultra-generate-001';
const ARTICLES_DIR = 'articles';
const IMAGES_DIR = 'images';
const PUBLIC_IMAGES_DIR = '../public/images'; // rick-brick 側

const THUMBNAIL_COMMON_CONSTRAINTS = `This must look like an actual photograph — real fur texture with individual hair strands visible, natural eye reflections and catchlights, realistic ambient lighting with natural shadows. The cat should be naturally posed. All props and environment must also look photographically real — no CGI, no digital art, no illustration style.
STRICTLY PROHIBITED: Do NOT include any text, letters, words, numbers, watermarks, logos, or captions anywhere in the image. The image must contain absolutely zero text or writing of any kind. No cartoon or illustrated style — this must be indistinguishable from a real photograph. No server rooms, no circuit boards, no outer space, no cyberspace, no holograms, no glowing neon UIs, no sci-fi aesthetics.`;

// ---- 対象記事のスラッグとファイル名のマッピング ----
const TARGETS: Array<{ slug: string; filename: string }> = [
  { slug: 'agentic-reasoning-framework', filename: '2026-03-18-agentic-reasoning-framework-llm.md' },
  { slug: 'agents-of-chaos-research', filename: '2026-03-18-agents-of-chaos-aligned-ai-manipulation.md' },
  { slug: 'ai-avalanche-competition', filename: '2026-03-18-ai-avalanche-model-competition-strategy.md' },
  { slug: 'constitutional-ai-open-source', filename: '2026-03-18-anthropic-constitutional-ai-cc0-open.md' },
  { slug: 'cerebras-inference-acceleration', filename: '2026-03-18-cerebras-openai-inference-acceleration.md' },
  { slug: 'llm-model-competition', filename: '2026-03-18-claude-sonnet-gemini-pro-model-race.md' },
  { slug: 'mcp-agent-protocol', filename: '2026-03-18-mcp-standardization-agent-protocol.md' },
  { slug: 'nvidia-vera-rubin-platform', filename: '2026-03-18-nvidia-vera-rubin-inference-infrastructure.md' },
  { slug: 'spec-driven-development', filename: '2026-03-18-spec-driven-development-ai-coding.md' },
];

// ---- frontmatter パーサー ----
interface ArticleData {
  title: string;
  summary: string;
  body: string;
}

function parseArticle(filepath: string): ArticleData {
  const content = readFileSync(filepath, 'utf-8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    throw new Error(`Cannot parse frontmatter: ${filepath}`);
  }
  const fmRaw = fmMatch[1];
  const body = fmMatch[2].trim();

  // title の抽出（複数行対応）
  const titleMatch = fmRaw.match(/^title:\s*["']?(.*?)["']?\s*$/m);
  const title = titleMatch ? titleMatch[1].replace(/^["']|["']$/g, '') : '';

  // summary の抽出（複数行対応）
  const summaryMatch = fmRaw.match(/^summary:\s*["']?(.*?)["']?\s*$/m);
  const summary = summaryMatch ? summaryMatch[1].replace(/^["']|["']$/g, '') : '';

  return { title, summary, body: body.slice(0, 2000) };
}

// ---- STEP 1: Claude で猫シーンプロンプトを生成 ----
async function generateCatScene(article: ArticleData): Promise<string> {
  const metaPrompt = `あなたはブログ記事のサムネイル画像を企画する、常軌を逸したクリエイティブディレクターです。
以下の記事内容を読み、猫が主人公の実写風サムネイル画像のシーンを1つ提案してください。

ルール:
1. 記事の核心概念を1つ選び、それを「もし猫の世界で起きたら？」という思考実験に変換する。技術用語をそのまま視覚化するのではなく、概念の本質を猫の日常行動に置き換える。
2. シーンには必ず「二重の意味」を持たせる。見た人が一瞬笑い、次に「あ、これ記事のあの話か」と気づく構造にする。
3. 猫の表情・ポーズに感情を込める。無表情で座っている猫は禁止。困惑、得意げ、企み顔、哲学的な遠い目、など状況にマッチした感情を指定する。
4. 小道具は「ありえないけど成立している」レベルにする。猫がメガネをかけている程度では弱い。状況全体が現実の延長線上にあるが、よく見ると完全に狂っている、というバランスを狙う。
5. カメラアングル・照明・背景の雰囲気を具体的に指定する。映画のワンシーンのような臨場感を意識する。
6. 画像内にテキストは一切含めない。視覚だけで伝える。
7. 150語以内の英語で出力する。

記事タイトル: ${article.title}
記事要約: ${article.summary}
記事本文（抜粋）: ${article.body}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 512,
      messages: [{ role: 'user', content: metaPrompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json() as {
    content?: Array<{ type: string; text: string }>;
  };
  const text = data.content?.[0]?.text ?? '';
  return text.trim();
}

// ---- STEP 2: Imagen API で画像生成 ----
async function generateImage(scene: string, outputPath: string): Promise<void> {
  const prompt = `${scene}\n${THUMBNAIL_COMMON_CONSTRAINTS}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_IMAGE_API_KEY!,
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
    predictions?: Array<{ bytesBase64Encoded?: string }>;
  };
  const imageData = data.predictions?.[0]?.bytesBase64Encoded;

  if (!imageData) {
    throw new Error('No image data in Imagen response');
  }

  const buffer = Buffer.from(imageData, 'base64');

  // sharp で 1200x630 にクロップ
  try {
    const { dirname } = await import('node:path');
    const sharp = (await import('sharp')).default;
    mkdirSync(dirname(outputPath), { recursive: true });
    await sharp(buffer)
      .resize(1200, 630, { fit: 'cover', position: 'centre' })
      .png()
      .toFile(outputPath);
  } catch {
    writeFileSync(outputPath, buffer);
  }
}

// ---- 2秒スリープ ----
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---- メイン ----
async function main() {
  if (!ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set');
    process.exit(1);
  }
  if (!GEMINI_IMAGE_API_KEY) {
    console.error('GEMINI_IMAGE_API_KEY is not set');
    process.exit(1);
  }

  mkdirSync(IMAGES_DIR, { recursive: true });

  const results: Array<{ slug: string; status: string; error?: string }> = [];

  for (let i = 0; i < TARGETS.length; i++) {
    const { slug, filename } = TARGETS[i];
    const articlePath = join(ARTICLES_DIR, filename);
    const outputPath = join(IMAGES_DIR, `${slug}.png`);
    const publicOutputPath = join(PUBLIC_IMAGES_DIR, `${slug}.png`);

    console.log(`\n[${i + 1}/${TARGETS.length}] Processing: ${slug}`);

    // 記事読み込み
    let article: ArticleData;
    try {
      article = parseArticle(articlePath);
      console.log(`  title: ${article.title.slice(0, 60)}...`);
    } catch (err) {
      console.error(`  ERROR reading article: ${err}`);
      results.push({ slug, status: 'error', error: String(err) });
      continue;
    }

    // STEP 1: Claude で猫シーン生成
    let scene: string;
    let retries = 0;
    while (true) {
      try {
        console.log('  STEP 1: Generating cat scene via Claude...');
        scene = await generateCatScene(article);
        console.log(`  Scene: ${scene.slice(0, 100)}...`);
        break;
      } catch (err) {
        retries++;
        if (retries >= 3) {
          console.error(`  ERROR in STEP 1 (3 retries exceeded): ${err}`);
          results.push({ slug, status: 'error', error: String(err) });
          scene = '';
          break;
        }
        console.warn(`  STEP 1 retry ${retries}/3: ${err}`);
        await sleep(3000);
      }
    }

    if (!scene) continue;

    // STEP 2: Imagen API で画像生成
    retries = 0;
    while (true) {
      try {
        console.log('  STEP 2: Generating image via Imagen API...');
        await generateImage(scene, outputPath);
        console.log(`  Saved: ${outputPath}`);

        // public/images/ にもコピー
        if (existsSync(PUBLIC_IMAGES_DIR) || true) {
          try {
            mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
            copyFileSync(outputPath, publicOutputPath);
            console.log(`  Copied: ${publicOutputPath}`);
          } catch (copyErr) {
            console.warn(`  WARNING: Could not copy to public/images/: ${copyErr}`);
          }
        }

        results.push({ slug, status: 'success' });
        break;
      } catch (err) {
        retries++;
        if (retries >= 3) {
          console.error(`  ERROR in STEP 2 (3 retries exceeded): ${err}`);
          results.push({ slug, status: 'error', error: String(err) });
          break;
        }
        console.warn(`  STEP 2 retry ${retries}/3: ${err}`);
        await sleep(5000);
      }
    }

    // レートリミット対策: 各画像生成間に 2 秒のインターバル
    if (i < TARGETS.length - 1) {
      console.log('  Waiting 2 seconds...');
      await sleep(2000);
    }
  }

  // 結果サマリー
  console.log('\n=== 完了レポート ===');
  for (const r of results) {
    const status = r.status === 'success' ? 'OK' : 'FAIL';
    const msg = r.error ? ` (${r.error.slice(0, 80)})` : '';
    console.log(`  [${status}] ${r.slug}${msg}`);
  }

  const succeeded = results.filter((r) => r.status === 'success').length;
  const failed = results.filter((r) => r.status !== 'success').length;
  console.log(`\n結果: ${succeeded} 成功 / ${failed} 失敗`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
