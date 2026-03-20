import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter } from '../utils/frontmatter.js';
import { resolveSlug, buildArticleFilename } from '../utils/slug.js';
import { getTodayDate } from '../utils/date.js';
import type { ResearchResult } from '../types/research.js';
import { DAILY_CATEGORIES, WEEKLY_CATEGORIES, RECAP_CATEGORIES, ARTICLES_DIR, IMAGES_DIR, TMP_DIR } from '../config/constants.js';

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

  const isRecap = (RECAP_CATEGORIES as readonly string[]).includes(String(fm.category));

  // recap_period 妥当性チェック用ヘルパー
  function validateRecapPeriod(period: unknown, category: unknown): boolean {
    if (typeof period !== 'string') return false;
    const match = period.match(/^(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})$/);
    if (!match) return false;
    const start = new Date(match[1]!);
    const end = new Date(match[2]!);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
    if (start >= end) return false;
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (category === 'monthly-paper-recap') return diffDays >= 28 && diffDays <= 32;
    return diffDays >= 6 && diffDays <= 8;
  }

  const checks: CheckResult[] = [
    {
      checkId: 1,
      description: 'frontmatter 必須フィールドの存在',
      severity: 'error',
      passed: ['title', 'date', 'tags', 'category', 'summary'].every(
        (f) => fm[f] !== undefined && fm[f] !== '',
      ),
      message: 'title, date, tags, category, summary が必要です',
    },
    {
      checkId: 2,
      description: 'date の YYYY-MM-DD フォーマット',
      severity: 'error',
      passed: typeof fm.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fm.date),
      message: 'date が YYYY-MM-DD 形式ではありません',
    },
    {
      checkId: 3,
      description: 'tags が配列',
      severity: 'error',
      passed: Array.isArray(fm.tags) && fm.tags.length >= 1,
      message: 'tags が1つ以上の配列である必要があります',
    },
    {
      checkId: 4,
      description: 'automated: true フラグ',
      severity: 'error',
      passed: fm.automated === true,
      message: '自動生成記事に automated: true が設定されていません',
    },
    {
      checkId: 5,
      description: 'sources フィールド',
      severity: 'error',
      passed: Array.isArray(fm.sources) && fm.sources.length >= 1 &&
        (fm.sources as string[]).every((s: string) => /^https?:\/\//.test(s)),
      message: 'sources が1つ以上の有効な URL を含む必要があります',
    },
    {
      checkId: 6,
      description: 'ファイル名規則 (YYYY-MM-DD-slug.md)',
      severity: 'error',
      passed: /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(filePath.split('/').pop() || ''),
      message: 'ファイル名が YYYY-MM-DD-slug.md 形式ではありません',
    },
    {
      checkId: 7,
      description: '自動生成注意文の存在',
      severity: 'error',
      passed: body.includes('自動生成'),
      message: '記事末尾に自動生成注意文がありません',
    },
    {
      checkId: 8,
      description: 'サムネイル画像の存在',
      severity: 'warning',
      passed: existsSync(join(IMAGES_DIR, `${slug}.png`)) ||
        existsSync(join(IMAGES_DIR, 'defaults', 'default.png')),
      message: 'サムネイル画像が見つかりません',
    },
    {
      checkId: 9,
      description: 'summary の長さ',
      severity: 'error',
      passed: typeof fm.summary === 'string' && fm.summary.length >= 50 && fm.summary.length <= 200,
      message: 'summary は 50-200 文字である必要があります',
    },
    {
      checkId: 10,
      description: '本文の最低文字数 (2000文字)',
      severity: 'error',
      passed: body.length >= 2000,
      message: '本文が 2000 文字未満です',
    },
    {
      checkId: 11,
      description: 'provider フィールドの値',
      severity: 'warning' as CheckSeverity,
      passed: typeof fm.provider === 'string' && ['claude', 'gemini', 'openai'].includes(fm.provider),
      message: 'provider が claude/gemini/openai のいずれかではありません',
    },
    {
      checkId: 12,
      description: '本文中に Markdown リンクが存在',
      severity: 'warning' as CheckSeverity,
      // recap カテゴリは免除
      passed: isRecap ? true : /\[([^\]]+)\]\(https?:\/\/[^\s)]+\)/.test(body),
      message: '本文中に Markdown リンク [text](url) が見つかりません',
    },
    {
      checkId: 13,
      description: '参考文献セクションの存在',
      severity: 'warning' as CheckSeverity,
      // recap カテゴリは免除
      passed: isRecap ? true : /参考文献/.test(body),
      message: '本文中に「参考文献」セクションが見つかりません',
    },
    {
      checkId: 14,
      description: 'recap_period フィールド（YYYY-MM-DD/YYYY-MM-DD 形式）',
      severity: 'error' as const,
      passed: !isRecap || (
        typeof fm.recap_period === 'string' &&
        /^\d{4}-\d{2}-\d{2}\/\d{4}-\d{2}-\d{2}$/.test(fm.recap_period)
      ),
      message: 'recap_period が YYYY-MM-DD/YYYY-MM-DD 形式ではありません',
    },
    {
      checkId: 15,
      description: 'recap_period 期間妥当性（monthly: 28-32日、週次: 6-8日）',
      severity: 'warning' as const,
      passed: !isRecap || validateRecapPeriod(fm.recap_period, fm.category),
      message: '期間が不正です（monthly: 28-32日間、週次: 6-8日間であること）',
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
  const today = getTodayDate();
  const articlesDir = ARTICLES_DIR;

  const results: ArticleValidationResult[] = [];

  // 日次 + 週次カテゴリ: .tmp/research-{category}.json 経由でファイルパスを解決
  for (const category of [...DAILY_CATEGORIES, ...WEEKLY_CATEGORIES]) {
    const tmpPath = join(TMP_DIR, `research-${category}.json`);
    if (!existsSync(tmpPath)) continue;

    const research: ResearchResult = JSON.parse(readFileSync(tmpPath, 'utf-8'));
    if (research.status !== 'success') continue;

    const slug = resolveSlug(research, category, today);
    const filePath = join(articlesDir, buildArticleFilename(slug, today));

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

  // recap カテゴリ: articles/ ディレクトリから当日ファイルを直接検索
  const allArticles = existsSync(articlesDir) ? readdirSync(articlesDir) : [];
  for (const recapCategory of RECAP_CATEGORIES) {
    const recapPattern = new RegExp(`^${today}-${recapCategory}-.+\\.md$`);
    const recapFiles = allArticles.filter((f) => recapPattern.test(f));

    for (const filename of recapFiles) {
      const filePath = join(articlesDir, filename);
      const slug = filename.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');

      const result = validateArticle(filePath, slug);
      results.push(result);

      console.log(`\n${recapCategory} (${filePath}):`);
      for (const c of result.checks) {
        const icon = c.passed ? '\u2713' : (c.severity === 'error' ? '\u2717' : '\u26a0');
        console.log(`  ${icon} [${c.severity}] ${c.description}: ${c.passed ? 'OK' : c.message}`);
      }
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

  // QG-3: エラーがある場合は exit 1 で後続の commit/push を阻止
  if (summary.articlesWithErrors > 0) {
    console.error(`\nValidation failed: ${summary.articlesWithErrors} article(s) have errors`);
    process.exit(1);
  }
}

// スクリプトとして直接実行された場合のみ main を呼ぶ
// テストからのインポート時は実行しない
const isDirectRun = process.argv[1]?.includes('validate');
if (isDirectRun) {
  main();
}
