import { describe, it, expect, afterEach } from 'vitest';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { validateArticle } from '../scripts/validate.js';

const TMP_DIR = '/tmp/rick-brick-test-validate';

const VALID_ARTICLE_CONTENT = [
  '---',
  'title: テスト記事のタイトル',
  'date: 2026-03-17',
  'tags: ["ai", "ml"]',
  'category: paper-review',
  'summary: これはテスト記事の要約です。50文字以上200文字以下の要約テキストをここに記述します。テスト用のサンプルテキストです。',
  'automated: true',
  'sources: ["https://example.com/paper"]',
  '---',
  '# テスト記事',
  '',
  'これはテスト記事の本文です。2000文字以上の内容が必要です。十分な情報量を確保するためにテキストを追加します。'.repeat(50),
  '',
  'この記事は自動生成されたものです。',
].join('\n');

const INVALID_ARTICLE_CONTENT = [
  '---',
  'date: 2026-03-17',
  'tags: ["ai"]',
  'category: paper-review',
  '---',
  '# 短い本文',
].join('\n');

afterEach(() => {
  if (existsSync(TMP_DIR)) {
    rmSync(TMP_DIR, { recursive: true, force: true });
  }
});

describe('validateArticle', () => {
  it('val-1: 全フィールド正常な記事は hasErrors = false', () => {
    // Arrange
    mkdirSync(TMP_DIR, { recursive: true });
    const filePath = join(TMP_DIR, '2026-03-17-test-article.md');
    writeFileSync(filePath, VALID_ARTICLE_CONTENT, 'utf-8');

    // Act
    const result = validateArticle(filePath, 'test-article');

    // Assert
    // 画像チェック（check 8）は warning なので hasErrors に影響しない
    const errorChecks = result.checks.filter((c) => c.severity === 'error' && !c.passed);
    expect(result.hasErrors).toBe(false);
    expect(errorChecks).toHaveLength(0);
  });

  it('val-2: 必須フィールド欠損（title 欠損）は hasErrors = true', () => {
    // Arrange
    mkdirSync(TMP_DIR, { recursive: true });
    const filePath = join(TMP_DIR, '2026-03-17-missing-title.md');
    writeFileSync(filePath, INVALID_ARTICLE_CONTENT, 'utf-8');

    // Act
    const result = validateArticle(filePath, 'missing-title');

    // Assert
    expect(result.hasErrors).toBe(true);
    // checkId 1（必須フィールド）が fail していること
    const check1 = result.checks.find((c) => c.checkId === 1);
    expect(check1?.passed).toBe(false);
  });
});
