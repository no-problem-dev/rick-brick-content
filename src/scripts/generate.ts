import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ResearchResult } from '../types/research.js';

function main() {
  const tmpDir = '.tmp';
  const outputDir = 'articles';
  const categories = ['paper-review', 'ai-news-digest'] as const;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  for (const category of categories) {
    const inputPath = join(tmpDir, `research-${category}.json`);
    if (!existsSync(inputPath)) {
      console.log(`${category}: research file not found, skipping`);
      continue;
    }

    const result: ResearchResult = JSON.parse(readFileSync(inputPath, 'utf-8'));
    if (result.status !== 'success' || !result.markdown) {
      console.log(`${category}: research failed, skipping`);
      continue;
    }

    // Markdown にフロントマッターが含まれているか確認
    let markdown = result.markdown;
    // 自動生成注意文を末尾に追加
    markdown += '\n\n---\n\n> 本記事は LLM により自動生成されたものです。内容に誤りが含まれる可能性があります。\n';

    // slug を frontmatter から抽出するか、カテゴリ+日付で生成
    const slugMatch = markdown.match(/slug:\s*["']?([^\s"']+)/);
    const slug = slugMatch?.[1] || `${category}-${today}`;
    const filename = `${today}-${slug}.md`;
    const outputPath = join(outputDir, filename);

    writeFileSync(outputPath, markdown);
    console.log(`${category}: generated ${filename}`);
  }
}

main();
