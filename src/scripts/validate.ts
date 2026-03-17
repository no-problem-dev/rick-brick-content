import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter } from '../utils/frontmatter.js';

// parseFrontmatter を再エクスポート（既存の import 先との後方互換性）
export { parseFrontmatter };

type CheckSeverity = 'error' | 'warning';

interface CheckResult {
  checkId: number;
  description: string;
  severity: CheckSeverity;
  passed: boolean;
  message?: string;
}

interface ArticleValidationResult {
  file: string;
  slug: string;
  checks: CheckResult[];
  hasErrors: boolean;
  hasWarnings: boolean;
}

interface ValidationSummary {
  totalArticles: number;
  articlesWithErrors: number;
  articlesWithWarnings: number;
  results: ArticleValidationResult[];
}

/**
 * QG-2 品質チェック（AP-5-1 準拠）
 */
export function validateArticle(filePath: string, slug: string): ArticleValidationResult {
  const content = readFileSync(filePath, 'utf-8');
  const { frontmatter: fm, body } = parseFrontmatter(content);

  const checks: CheckResult[] = [
    // 1. frontmatter 必須フィールドの存在
    {
      checkId: 1,
      description: 'frontmatter 必須フィールドの存在',
      severity: 'error' as CheckSeverity,
      passed: ['title', 'date', 'tags', 'category', 'summary'].every(
        (f) => fm[f] !== undefined && fm[f] !== '',
      ),
      message: 'title, date, tags, category, summary が必要です',
    },
    // 2. frontmatter 型・フォーマット
    {
      checkId: 2,
      description: 'date の YYYY-MM-DD フォーマット',
      severity: 'error' as CheckSeverity,
      passed: typeof fm.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fm.date),
      message: 'date が YYYY-MM-DD 形式ではありません',
    },
    // 2b. tags が配列
    {
      checkId: 2,
      description: 'tags が配列',
      severity: 'error' as CheckSeverity,
      passed: Array.isArray(fm.tags) && fm.tags.length >= 1,
      message: 'tags が1つ以上の配列である必要があります',
    },
    // 3. automated: true フラグ
    {
      checkId: 3,
      description: 'automated: true フラグ',
      severity: 'error' as CheckSeverity,
      passed: fm.automated === true,
      message: '自動生成記事に automated: true が設定されていません',
    },
    // 4. sources フィールド
    {
      checkId: 4,
      description: 'sources フィールド',
      severity: 'error' as CheckSeverity,
      passed: Array.isArray(fm.sources) && fm.sources.length >= 1 &&
        (fm.sources as string[]).every((s: string) => /^https?:\/\//.test(s)),
      message: 'sources が1つ以上の有効な URL を含む必要があります',
    },
    // 5. paper_url フィールド（paper-review のみ）
    {
      checkId: 5,
      description: 'paper_url フィールド (paper-review)',
      severity: 'error' as CheckSeverity,
      passed: fm.category !== 'paper-review' || (typeof fm.paper_url === 'string' && fm.paper_url.length > 0),
      message: 'paper-review には paper_url が必要です',
    },
    // 6. ファイル名規則
    {
      checkId: 6,
      description: 'ファイル名規則 (YYYY-MM-DD-slug.md)',
      severity: 'error' as CheckSeverity,
      passed: /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(filePath.split('/').pop() || ''),
      message: 'ファイル名が YYYY-MM-DD-slug.md 形式ではありません',
    },
    // 7. 注意文の存在
    {
      checkId: 7,
      description: '自動生成注意文の存在',
      severity: 'error' as CheckSeverity,
      passed: body.includes('自動生成'),
      message: '記事末尾に自動生成注意文がありません',
    },
    // 8. サムネイル画像の存在
    {
      checkId: 8,
      description: 'サムネイル画像の存在',
      severity: 'warning' as CheckSeverity,
      passed: existsSync(join('images', `${slug}.png`)) ||
        existsSync(join('images/defaults', 'default.png')),
      message: 'サムネイル画像が見つかりません',
    },
    // 9. summary の長さ（50-200文字）
    {
      checkId: 9,
      description: 'summary の長さ',
      severity: 'error' as CheckSeverity,
      passed: typeof fm.summary === 'string' && fm.summary.length >= 50 && fm.summary.length <= 200,
      message: 'summary は 50-200 文字である必要があります',
    },
    // 10. 本文の最低文字数
    {
      checkId: 10,
      description: '本文の最低文字数 (500文字)',
      severity: 'error' as CheckSeverity,
      passed: body.length >= 500,
      message: '本文が 500 文字未満です',
    },
  ];

  return {
    file: filePath,
    slug,
    checks,
    hasErrors: checks.some((c) => c.severity === 'error' && !c.passed),
    hasWarnings: checks.some((c) => c.severity === 'warning' && !c.passed),
  };
}

function main() {
  const today = new Date().toISOString().split('T')[0]!;
  const articlesDir = 'articles';
  const categories = ['paper-review', 'ai-news-digest'] as const;

  const results: ArticleValidationResult[] = [];

  for (const category of categories) {
    const tmpPath = join('.tmp', `research-${category}.json`);
    if (!existsSync(tmpPath)) continue;

    const research = JSON.parse(readFileSync(tmpPath, 'utf-8')) as {
      status: string;
      frontmatter?: { slug?: string };
    };
    if (research.status !== 'success') continue;

    const slug = research.frontmatter?.slug ?? `${category}-${today}`;
    const filePath = join(articlesDir, `${today}-${slug}.md`);

    if (!existsSync(filePath)) {
      console.log(`${category}: file not found (${filePath}), skipping`);
      continue;
    }

    const result = validateArticle(filePath, slug);
    results.push(result);

    console.log(`\n${category} (${filePath}):`);
    for (const c of result.checks) {
      const icon = c.passed ? '\u2713' : (c.severity === 'error' ? '\u2717' : '\u26a0');
      console.log(`  ${icon} [${c.severity}] ${c.description}: ${c.passed ? 'OK' : c.message}`);
    }
  }

  const summary: ValidationSummary = {
    totalArticles: results.length,
    articlesWithErrors: results.filter((r) => r.hasErrors).length,
    articlesWithWarnings: results.filter((r) => r.hasWarnings).length,
    results,
  };

  console.log(`\n--- Summary ---`);
  console.log(`Total: ${summary.totalArticles}, Errors: ${summary.articlesWithErrors}, Warnings: ${summary.articlesWithWarnings}`);

  // QG-3: エラーでも続行（常に exit 0）
  process.exit(0);
}

// スクリプトとして直接実行された場合のみ main を呼ぶ
// テストからのインポート時は実行しない
const isDirectRun = process.argv[1]?.includes('validate');
if (isDirectRun) {
  main();
}
