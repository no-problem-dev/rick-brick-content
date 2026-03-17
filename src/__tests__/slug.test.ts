import { describe, it, expect, afterEach } from 'vitest';
import { resolveSlug, buildArticleFilename, validateSlug } from '../utils/slug.js';
import type { ResearchResult } from '../types/research.js';

describe('resolveSlug', () => {
  const category = 'paper-review';
  const date = '2026-03-17';

  it('slug-1: frontmatter.slug が存在する場合はその値を返す', () => {
    // Arrange
    const result: ResearchResult = {
      category: 'paper-review',
      status: 'success',
      frontmatter: {
        title: 'Test',
        summary: 'Summary',
        tags: ['ai'],
        date,
        slug: 'my-article',
      },
    };

    // Act
    const slug = resolveSlug(result, category, date);

    // Assert
    expect(slug).toBe('my-article');
  });

  it('slug-2: frontmatter.slug が空文字の場合は category-date を返す', () => {
    // Arrange
    const result: ResearchResult = {
      category: 'paper-review',
      status: 'success',
      frontmatter: {
        title: 'Test',
        summary: 'Summary',
        tags: ['ai'],
        date,
        slug: '',
      },
    };

    // Act
    const slug = resolveSlug(result, category, date);

    // Assert
    expect(slug).toBe(`${category}-${date}`);
  });

  it('slug-3: frontmatter が undefined の場合は category-date を返す', () => {
    // Arrange
    const result: ResearchResult = {
      category: 'paper-review',
      status: 'success',
    };

    // Act
    const slug = resolveSlug(result, category, date);

    // Assert
    expect(slug).toBe(`${category}-${date}`);
  });

  it('slug-4: frontmatter.slug がスペース付きの場合は trim して返す', () => {
    // Arrange
    const result: ResearchResult = {
      category: 'paper-review',
      status: 'success',
      frontmatter: {
        title: 'Test',
        summary: 'Summary',
        tags: ['ai'],
        date,
        slug: '  spaced  ',
      },
    };

    // Act
    const slug = resolveSlug(result, category, date);

    // Assert
    expect(slug).toBe('spaced');
  });
});

describe('buildArticleFilename', () => {
  it('slug-5: slug と date からファイル名を生成する', () => {
    // Arrange
    const slug = 'my-slug';
    const date = '2026-03-17';

    // Act
    const filename = buildArticleFilename(slug, date);

    // Assert
    expect(filename).toBe('2026-03-17-my-slug.md');
  });
});

describe('validateSlug', () => {
  it('slug-6: 有効な slug は true を返す', () => {
    // Arrange & Act & Assert
    expect(validateSlug('valid-slug')).toBe(true);
    expect(validateSlug('paper-review')).toBe(true);
    expect(validateSlug('abc123')).toBe(true);
  });

  it('slug-7: 空文字は false を返す', () => {
    // Arrange & Act & Assert
    expect(validateSlug('')).toBe(false);
  });

  it('slug-8: 大文字を含む場合は false を返す', () => {
    // Arrange & Act & Assert
    expect(validateSlug('Invalid-Slug')).toBe(false);
  });

  it('slug-9: ハイフン始まりは false を返す', () => {
    // Arrange & Act & Assert
    expect(validateSlug('-starts-with-hyphen')).toBe(false);
  });
});

describe('resolveSlug with SLUG_SUFFIX', () => {
  const category = 'paper-review';
  const date = '2026-03-17';

  afterEach(() => {
    delete process.env.SLUG_SUFFIX;
  });

  it('slug-suffix-1: SLUG_SUFFIX 未設定時は従来通りの slug', () => {
    delete process.env.SLUG_SUFFIX;
    const result: ResearchResult = {
      category: 'paper-review',
      status: 'success',
      frontmatter: { title: 'Test', summary: 'S', tags: ['ai'], date, slug: 'paper-review-2026-03-17' },
    };
    expect(resolveSlug(result, category, date)).toBe('paper-review-2026-03-17');
  });

  it('slug-suffix-2: SLUG_SUFFIX=gemini の場合はサフィックスが付く', () => {
    process.env.SLUG_SUFFIX = 'gemini';
    const result: ResearchResult = {
      category: 'paper-review',
      status: 'success',
      frontmatter: { title: 'Test', summary: 'S', tags: ['ai'], date, slug: 'paper-review-2026-03-17' },
    };
    expect(resolveSlug(result, category, date)).toBe('paper-review-2026-03-17-gemini');
  });

  it('slug-suffix-3: SLUG_SUFFIX=openai でフォールバック slug にもサフィックスが付く', () => {
    process.env.SLUG_SUFFIX = 'openai';
    const result: ResearchResult = {
      category: 'paper-review',
      status: 'success',
    };
    expect(resolveSlug(result, category, date)).toBe('paper-review-2026-03-17-openai');
  });
});
