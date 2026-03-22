import { describe, it, expect, afterEach } from 'vitest';
import { resolveSlug, buildArticleFilename, validateSlug, replaceDateInSlug } from '../utils/slug.js';
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

describe('resolveSlug with TARGET_DATE', () => {
  afterEach(() => {
    delete process.env.TARGET_DATE;
    delete process.env.SLUG_SUFFIX;
  });

  it('target-date-1: TARGET_DATE 設定時、LLM slug 内の日付が TARGET_DATE に置換される', () => {
    process.env.TARGET_DATE = '2026-03-17';
    const result: ResearchResult = {
      category: 'paper-review',
      status: 'success',
      frontmatter: { title: 'Test', summary: 'S', tags: ['ai'], date: '2026-03-18', slug: 'paper-review-2026-03-18' },
    };
    expect(resolveSlug(result, 'paper-review', '2026-03-17')).toBe('paper-review-2026-03-17');
  });

  it('target-date-2: TARGET_DATE 未設定時でも slug 内の日付は date 引数に正規化される', () => {
    const result: ResearchResult = {
      category: 'paper-review',
      status: 'success',
      frontmatter: { title: 'Test', summary: 'S', tags: ['ai'], date: '2026-03-18', slug: 'paper-review-2026-03-18' },
    };
    // date 引数と slug 内の日付が同じ場合は結果も同じ
    expect(resolveSlug(result, 'paper-review', '2026-03-18')).toBe('paper-review-2026-03-18');
  });

  it('target-date-2b: LLM が UTC 日付を slug に埋め込んだ場合、JST の date に正規化される', () => {
    const result: ResearchResult = {
      category: 'ai-tech-daily',
      status: 'success',
      frontmatter: { title: 'Test', summary: 'S', tags: ['ai'], date: '2026-03-21', slug: 'ai-tech-daily-2026-03-21' },
    };
    // date 引数（JST）が 2026-03-22 なら、slug 内の 03-21 も 03-22 に置換される
    expect(resolveSlug(result, 'ai-tech-daily', '2026-03-22')).toBe('ai-tech-daily-2026-03-22');
  });

  it('target-date-3: TARGET_DATE + SLUG_SUFFIX の併用', () => {
    process.env.TARGET_DATE = '2026-03-17';
    process.env.SLUG_SUFFIX = 'gemini';
    const result: ResearchResult = {
      category: 'paper-review',
      status: 'success',
      frontmatter: { title: 'Test', summary: 'S', tags: ['ai'], date: '2026-03-18', slug: 'paper-review-2026-03-18' },
    };
    expect(resolveSlug(result, 'paper-review', '2026-03-17')).toBe('paper-review-2026-03-17-gemini');
  });

  it('target-date-4: slug に日付パターンがない場合は変更なし', () => {
    process.env.TARGET_DATE = '2026-03-17';
    const result: ResearchResult = {
      category: 'paper-review',
      status: 'success',
      frontmatter: { title: 'Test', summary: 'S', tags: ['ai'], date: '2026-03-18', slug: 'my-custom-slug' },
    };
    expect(resolveSlug(result, 'paper-review', '2026-03-17')).toBe('my-custom-slug');
  });
});

describe('replaceDateInSlug', () => {
  it('slug 内の日付を指定日付に置換する', () => {
    expect(replaceDateInSlug('paper-review-2026-03-18', '2026-03-17')).toBe('paper-review-2026-03-17');
  });

  it('日付パターンがない場合は変更なし', () => {
    expect(replaceDateInSlug('my-custom-slug', '2026-03-17')).toBe('my-custom-slug');
  });

  it('複数の日付パターンがある場合は最初のみ置換', () => {
    expect(replaceDateInSlug('2026-03-18-review-2026-03-18', '2026-03-17')).toBe('2026-03-17-review-2026-03-18');
  });
});
