import { createResearchProvider } from '../providers/provider-factory.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { CATEGORIES, TMP_DIR } from '../config/constants.js';

async function main() {
  const provider = createResearchProvider();
  mkdirSync(TMP_DIR, { recursive: true });

  const categories = CATEGORIES;

  // 順次実行（web_search レート制限を回避するため並列にしない）
  for (const category of categories) {
    const outputPath = join(TMP_DIR, `research-${category}.json`);
    let data: { category: string; status: 'success' | 'error'; error?: string; markdown?: string; frontmatter?: unknown };

    // リトライ: 最大2回
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const result = await provider.research({
          category,
          basePromptPath: `prompts/base/${category}.md`,
          providerPromptPath: `prompts/providers/${provider.name}.md`,
        });
        data = result;
        if (result.status === 'success') break;
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      } catch (error) {
        data = {
          category,
          status: 'error' as const,
          error: error instanceof Error ? error.message : String(error),
        };
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }

    writeFileSync(outputPath, JSON.stringify(data!, null, 2));
    if (data!.status === 'success') {
      console.log(`${category}: OK`);
    } else {
      console.error(`${category}: ERROR - ${'error' in data! ? data!.error : 'unknown'}`);
    }
  }
}

main().catch(console.error);
