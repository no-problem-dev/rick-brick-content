import { createResearchProvider } from '../providers/provider-factory.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { DAILY_CATEGORIES, WEEKLY_CATEGORIES, TMP_DIR } from '../config/constants.js';
import type { Category } from '../config/constants.js';

async function main() {
  const provider = createResearchProvider();
  mkdirSync(TMP_DIR, { recursive: true });

  const articleType = process.env.ARTICLE_TYPE || 'daily';
  let categoriesToProcess: readonly string[];
  switch (articleType) {
    case 'daily':  categoriesToProcess = DAILY_CATEGORIES; break;
    case 'weekly': categoriesToProcess = WEEKLY_CATEGORIES; break;
    default:       categoriesToProcess = DAILY_CATEGORIES;
  }

  const categories = categoriesToProcess as readonly Category[];

  // 順次実行（web_search レート制限を回避するため並列にしない）
  for (const category of categories) {
    const outputPath = join(TMP_DIR, `research-${category}.json`);
    let data: { category: string; status: 'success' | 'error' | 'skipped'; error?: string; markdown?: string; frontmatter?: unknown };

    // リトライ: 最大3回（429 レート制限時は60秒待機）
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await provider.research({
          category,
          basePromptPath: `prompts/base/${category}.md`,
          providerPromptPath: `prompts/providers/${provider.name}.md`,
        });
        // extended-daily: LLM が NO_NEWS_FOUND を返した場合はスキップ扱い
        if (result.status === 'success' && result.markdown?.includes('<!-- NO_NEWS_FOUND -->')) {
          data = { category, status: 'skipped' };
          break;
        }
        data = result;
        if (result.status === 'success') break;
        const isRateLimit = result.error?.includes('429') || result.error?.includes('rate_limit');
        if (attempt < 3) {
          const waitMs = isRateLimit ? 60000 : 5000;
          console.log(`${category}: attempt ${attempt} failed, retrying in ${waitMs / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, waitMs));
        }
      } catch (error) {
        data = {
          category,
          status: 'error' as const,
          error: error instanceof Error ? error.message : String(error),
        };
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }

    writeFileSync(outputPath, JSON.stringify(data!, null, 2));
    if (data!.status === 'success') {
      console.log(`${category}: OK`);
    } else if (data!.status === 'skipped') {
      console.log(`${category}: SKIPPED (NO_NEWS_FOUND)`);
    } else {
      console.error(`${category}: ERROR - ${'error' in data! ? data!.error : 'unknown'}`);
    }

    // レート制限回避: カテゴリ間で60秒待機（API の per-minute 制限対策）
    if (categories.indexOf(category) < categories.length - 1) {
      console.log('Waiting 60s before next research to avoid rate limits...');
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
  }
}

main().catch(console.error);
