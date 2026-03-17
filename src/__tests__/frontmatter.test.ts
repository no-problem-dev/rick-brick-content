import { describe, it, expect } from 'vitest';
import { parseFrontmatter, upsertFrontmatterField } from '../utils/frontmatter.js';

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
