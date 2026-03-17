import { describe, it, expect } from 'vitest';
import { parseFrontmatter, upsertFrontmatterField, extractMarkdownFromLLMResponse, normalizeFrontmatter } from '../utils/frontmatter.js';

describe('parseFrontmatter', () => {
  it('fm-1: 正常な frontmatter + body をパースする', () => {
    // Arrange
    const content = [
      '---',
      'title: My Article',
      'date: 2026-03-17',
      'tags: ["ai", "ml"]',
      '---',
      '# Body',
      'Content here.',
    ].join('\n');

    // Act
    const { frontmatter, body } = parseFrontmatter(content);

    // Assert
    expect(frontmatter.title).toBe('My Article');
    expect(frontmatter.date).toBe('2026-03-17');
    expect(frontmatter.tags).toEqual(['ai', 'ml']);
    expect(body).toBe('# Body\nContent here.');
  });

  it('fm-2: frontmatter なしの場合は空オブジェクト + body = content', () => {
    // Arrange
    const content = '# Just a body\nNo frontmatter here.';

    // Act
    const { frontmatter, body } = parseFrontmatter(content);

    // Assert
    expect(frontmatter).toEqual({});
    expect(body).toBe(content);
  });
});

describe('upsertFrontmatterField', () => {
  const baseContent = [
    '---',
    'title: My Article',
    'date: 2026-03-17',
    '---',
    '# Body',
  ].join('\n');

  it('fm-3: 既存フィールドを上書きする', () => {
    // Arrange
    const key = 'title';
    const newValue = 'Updated Title';

    // Act
    const updated = upsertFrontmatterField(baseContent, key, newValue);

    // Assert
    const { frontmatter } = parseFrontmatter(updated);
    expect(frontmatter.title).toBe(newValue);
    // 他のフィールドは変わらない
    expect(frontmatter.date).toBe('2026-03-17');
  });

  it('fm-4: 新規フィールドを末尾に追加する', () => {
    // Arrange
    const key = 'slug';
    const value = 'my-article';

    // Act
    const updated = upsertFrontmatterField(baseContent, key, value);

    // Assert
    const { frontmatter } = parseFrontmatter(updated);
    expect(frontmatter.slug).toBe(value);
    // 既存フィールドは変わらない
    expect(frontmatter.title).toBe('My Article');
    expect(frontmatter.date).toBe('2026-03-17');
  });
});

describe('extractMarkdownFromLLMResponse', () => {
  it('fm-5: コードフェンスを除去する', () => {
    const input = '```markdown\n---\ntitle: Test\n---\n# Body\n```';
    const result = extractMarkdownFromLLMResponse(input);
    expect(result).toBe('---\ntitle: Test\n---\n# Body');
  });

  it('fm-6: frontmatter なしの場合は空 frontmatter を付与', () => {
    const input = '# Just a body';
    const result = extractMarkdownFromLLMResponse(input);
    expect(result.startsWith('---\n---\n')).toBe(true);
    expect(result).toContain('# Just a body');
  });

  it('fm-7: 正常な frontmatter はそのまま返す', () => {
    const input = '---\ntitle: Test\n---\n# Body';
    const result = extractMarkdownFromLLMResponse(input);
    expect(result).toBe(input);
  });

  it('fm-15: 開始 --- なしの frontmatter フィールドを補完する', () => {
    const input = 'title: "Test Article"\nslug: "test"\ndate: "2026-03-17"\n---\n# Body';
    const result = extractMarkdownFromLLMResponse(input);
    expect(result).toBe('---\ntitle: "Test Article"\nslug: "test"\ndate: "2026-03-17"\n---\n# Body');
  });

  it('fm-16: summary が長文でも開始 --- なしの frontmatter を補完する', () => {
    const input = 'title: "Test"\nsummary: "This is a very long summary that might span or have special chars: colons, quotes"\nsources: ["https://example.com"]\n---\n\n## Body';
    const result = extractMarkdownFromLLMResponse(input);
    expect(result.startsWith('---\ntitle:')).toBe(true);
    expect(result).toContain('\n---\n\n## Body');
  });
});

describe('normalizeFrontmatter', () => {
  const defaults = { category: 'paper-review', date: '2026-03-17', automated: true };

  it('fm-8: 完全な frontmatter は変更しない', () => {
    const input = [
      '---',
      'title: "Test Article"',
      'slug: "paper-review-2026-03-17"',
      'date: "2026-03-17"',
      'category: "paper-review"',
      'automated: true',
      'tags: ["AI", "ML"]',
      'summary: "This is a test summary that is long enough"',
      'sources: ["https://example.com"]',
      '---',
      '# Body',
    ].join('\n');

    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);
    expect(frontmatter.title).toBe('Test Article');
    expect(frontmatter.slug).toBe('paper-review-2026-03-17');
    expect(frontmatter.tags).toEqual(['AI', 'ML']);
  });

  it('fm-9: frontmatter なしの場合はデフォルト値で生成', () => {
    const input = '# Just a body\nSome content here.';
    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);

    expect(frontmatter.title).toBe('[paper-review] 2026-03-17');
    expect(frontmatter.slug).toBe('paper-review-2026-03-17');
    expect(frontmatter.date).toBe('2026-03-17');
    expect(frontmatter.category).toBe('paper-review');
    expect(frontmatter.automated).toBe(true);
    expect(frontmatter.tags).toEqual(['AI']);
  });

  it('fm-10: date 不足時にデフォルト値で補完', () => {
    const input = '---\ntitle: Test\ntags: ["AI"]\n---\n# Body';
    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);
    expect(frontmatter.date).toBe('2026-03-17');
  });

  it('fm-11: tags が文字列の場合は配列化', () => {
    const input = '---\ntitle: Test\ntags: AI\n---\n# Body';
    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);
    expect(Array.isArray(frontmatter.tags)).toBe(true);
    expect(frontmatter.tags).toEqual(['AI']);
  });

  it('fm-12: summary が200文字超の場合はトリム', () => {
    const longSummary = 'あ'.repeat(300);
    const input = `---\ntitle: Test\nsummary: ${longSummary}\n---\n# Body`;
    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);
    expect(String(frontmatter.summary).length).toBeLessThanOrEqual(200);
  });

  it('fm-13: コードフェンスありの入力も正しく処理', () => {
    const input = '```markdown\n---\ntitle: Test\n---\n# Body\n```';
    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);
    expect(frontmatter.title).toBe('Test');
  });

  it('fm-14: sources に無効 URL がある場合は除去', () => {
    const input = '---\ntitle: Test\nsources: ["not-url", "https://example.com"]\n---\n# Body';
    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);
    expect(frontmatter.sources).toEqual(['https://example.com']);
  });
});
