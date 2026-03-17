import { createResearchProvider } from '../providers/provider-factory.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { CATEGORIES, TMP_DIR } from '../config/constants.js';

async function main() {
  const provider = createResearchProvider();
  mkdirSync(TMP_DIR, { recursive: true });

  const categories = CATEGORIES;

  // 並列実行
  const results = await Promise.allSettled(
    categories.map(async (category) => {
      // リトライ: 最大2回
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const result = await provider.research({
            category,
            basePromptPath: `prompts/base/${category}.md`,
            providerPromptPath: `prompts/providers/${provider.name}.md`,
          });
          if (result.status === 'success') return result;
          if (attempt === 2) return result;
        } catch (error) {
          if (attempt === 2) {
            return {
              category,
              status: 'error' as const,
              error: error instanceof Error ? error.message : String(error),
            };
          }
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      throw new Error('Unreachable');
    })
  );

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const settled = results[i];
    if (!settled) continue;
    const outputPath = join(TMP_DIR, `research-${category}.json`);
    const data = settled.status === 'fulfilled'
      ? settled.value
      : { category, status: 'error' as const, error: String((settled as PromiseRejectedResult).reason) };
    writeFileSync(outputPath, JSON.stringify(data, null, 2));
    if (data.status === 'success') {
      console.log(`${category}: OK`);
    } else {
      console.error(`${category}: ERROR - ${'error' in data ? data.error : 'unknown'}`);
    }
  }
}

main().catch(console.error);
