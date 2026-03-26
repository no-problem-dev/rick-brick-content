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

  it('fm-double-1: 正常な単一 frontmatter はそのまま返す', () => {
    const input = '---\ntitle: Test\nslug: test-slug\ndate: 2026-03-17\n---\n# Body';
    const result = extractMarkdownFromLLMResponse(input);
    expect(result).toBe(input);
  });

  it('fm-double-2: 二重 frontmatter から正しい frontmatter を抽出する', () => {
    const input = [
      '---',
      'some: broken',
      'output: from prompt echo',
      '---',
      '',
      '---',
      'title: "Real Article Title"',
      'slug: "paper-review-2026-03-17"',
      'date: "2026-03-17"',
      'category: "paper-review"',
      'automated: true',
      'tags: ["AI", "ML"]',
      'summary: "This is the real summary"',
      'sources: ["https://example.com"]',
      '---',
      '',
      '# Real Body Content',
      'This is the actual article body.',
    ].join('\n');
    const result = extractMarkdownFromLLMResponse(input);
    expect(result).toContain('title: "Real Article Title"');
    expect(result).toContain('# Real Body Content');
    expect(result).not.toContain('broken');
    expect(result).not.toContain('prompt echo');
    // 結果が正しい frontmatter で始まること
    expect(result.startsWith('---\n')).toBe(true);
  });

  it('fm-double-5: 末尾スペース付き二重 frontmatter (OpenAI 実パターン) を処理する', () => {
    // OpenAI Responses API は `--- ` (末尾スペース) と各行に末尾スペースを付けて出力する
    const input = [
      '--- ',
      'title: "Broken Title" ',
      'slug: "paper-review-2026-03-17" ',
      '--- ',
      '--- ',
      '--- ',
      'title: "Real Article Title" ',
      'slug: "paper-review-2026-03-17" ',
      'date: "2026-03-17" ',
      'tags: ["AI", "ML"] ',
      'category: "paper-review" ',
      'automated: true ',
      'sources: ["https://arxiv.org/abs/1234.5678"] ',
      '--- ',
      '',
      '### エグゼクティブサマリー',
      '',
      '本論文の解説です。',
    ].join('\n');
    const result = extractMarkdownFromLLMResponse(input);
    expect(result).toContain('title: "Real Article Title"');
    expect(result).toContain('### エグゼクティブサマリー');
    expect(result).not.toContain('Broken Title');
    expect(result.startsWith('---\n')).toBe(true);
    // body に余分な --- が残っていないこと
    const { body } = parseFrontmatter(result);
    expect(body).not.toMatch(/^---$/m);
  });

  it('fm-double-3: frontmatter なしは空 frontmatter を付与', () => {
    const input = '# Just a body\nNo frontmatter.';
    const result = extractMarkdownFromLLMResponse(input);
    expect(result.startsWith('---\n---\n')).toBe(true);
    expect(result).toContain('# Just a body');
  });

  it('fm-double-4: コードフェンス内の frontmatter を正しく処理', () => {
    const input = '```markdown\n---\ntitle: Test\nslug: test\n---\n# Body\n```';
    const result = extractMarkdownFromLLMResponse(input);
    expect(result).toBe('---\ntitle: Test\nslug: test\n---\n# Body');
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

  it('fm-12: summary が200文字超でもトリムせず全文保持', () => {
    const longSummary = 'あ'.repeat(300);
    const input = `---\ntitle: Test\nsummary: ${longSummary}\n---\n# Body`;
    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);
    expect(String(frontmatter.summary).length).toBe(300);
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

  it('fm-17: provider 指定時に frontmatter に provider が追加される', () => {
    const input = '---\ntitle: Test\ntags: ["AI"]\n---\n# Body';
    const result = normalizeFrontmatter(input, { ...defaults, provider: 'claude' });
    const { frontmatter } = parseFrontmatter(result);
    expect(frontmatter.provider).toBe('claude');
  });

  it('fm-18: provider 未指定時は frontmatter に provider が含まれない', () => {
    const input = '---\ntitle: Test\ntags: ["AI"]\n---\n# Body';
    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);
    expect(frontmatter.provider).toBeUndefined();
  });

  it('fm-19: LLM 出力に provider が既にある場合は上書きしない', () => {
    const input = '---\ntitle: Test\nprovider: gemini\ntags: ["AI"]\n---\n# Body';
    const result = normalizeFrontmatter(input, { ...defaults, provider: 'claude' });
    const { frontmatter } = parseFrontmatter(result);
    expect(frontmatter.provider).toBe('gemini');
  });

  it('fm-20: 各プロバイダー（claude/gemini/openai）が正しく設定される', () => {
    const input = '---\ntitle: Test\ntags: ["AI"]\n---\n# Body';
    for (const provider of ['claude', 'gemini', 'openai']) {
      const result = normalizeFrontmatter(input, { ...defaults, provider });
      const { frontmatter } = parseFrontmatter(result);
      expect(frontmatter.provider).toBe(provider);
    }
  });
});

describe('normalizeFrontmatter - sources auto-extraction', () => {
  const defaults = { category: 'paper-review', date: '2026-03-17', automated: true };

  it('fm-sources-1: frontmatter に有効 URL ありならそのまま', () => {
    const input = '---\ntitle: Test\nsources: ["https://example.com"]\ntags: ["AI"]\n---\n# Body\n[link](https://other.com)';
    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);
    expect(frontmatter.sources).toEqual(['https://example.com']);
  });

  it('fm-sources-2: sources 空 + body にリンクあり → body から抽出', () => {
    const input = '---\ntitle: Test\nsources: []\ntags: ["AI"]\n---\n# Body\n[Paper](https://arxiv.org/abs/1234) and [Blog](https://blog.example.com)';
    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);
    expect(frontmatter.sources).toEqual(['https://arxiv.org/abs/1234', 'https://blog.example.com']);
  });

  it('fm-sources-3: sources 空 + body にリンクなし → 空配列', () => {
    const input = '---\ntitle: Test\nsources: []\ntags: ["AI"]\n---\n# Body\nNo links here.';
    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);
    expect(frontmatter.sources).toEqual([]);
  });

  it('fm-sources-4: UTM パラメータ付き URL → パラメータ除去', () => {
    const input = '---\ntitle: Test\nsources: ["https://example.com/article?utm_source=openai&utm_medium=referral"]\ntags: ["AI"]\n---\n# Body';
    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);
    expect(frontmatter.sources).toEqual(['https://example.com/article']);
  });
});

describe('normalizeFrontmatter - field ordering and sanitization', () => {
  const defaults = { category: 'paper-review', date: '2026-03-17', automated: true, provider: 'claude' };

  it('fm-order-1: フィールド順序が FIELD_ORDER に一致する', () => {
    const input = '---\nsources: ["https://example.com"]\ntitle: Test\ncategory: paper-review\nslug: test\ndate: 2026-03-17\nautomated: true\ntags: ["AI"]\nsummary: A valid summary text here\n---\n# Body';
    const result = normalizeFrontmatter(input, defaults);
    const lines = result.split('\n');
    // frontmatter 内のフィールド順序を確認（--- の間の行）
    const fmLines = lines.slice(1, lines.indexOf('---', 1));
    const keys = fmLines.map(l => l.split(':')[0]);
    expect(keys).toEqual(['title', 'slug', 'summary', 'date', 'tags', 'category', 'automated', 'provider', 'sources']);
  });

  it('fm-order-2: 余分なフィールドが除去される', () => {
    const input = '---\ntitle: Test\nslug: test\nextra_field: should be removed\ntags: ["AI"]\nsummary: A valid summary\ndate: 2026-03-17\n---\n# Body';
    const result = normalizeFrontmatter(input, defaults);
    expect(result).not.toContain('extra_field');
  });

  it('fm-sanitize-1: summary の改行・連続スペースを正規化', () => {
    const input = '---\ntitle: Test\ntags: ["AI"]\nsummary: Line one\\nLine two   with   spaces\n---\n# Body';
    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);
    const summary = String(frontmatter.summary);
    expect(summary).not.toContain('\\n');
    expect(summary).not.toMatch(/\s{2,}/);
  });

  it('fm-sanitize-2: title が空 → body の最初の見出しから取得', () => {
    const input = '---\ntitle: \ntags: ["AI"]\nsummary: A valid summary text\n---\n# Amazing Paper Title\nBody content here.';
    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);
    expect(frontmatter.title).toBe('Amazing Paper Title');
  });

  it('fm-sanitize-3: sns_topics が空文字列 → 除去される', () => {
    const input = '---\ntitle: "Test"\ntags: ["AI"]\nsummary: "Summary"\nsns_topics: ""\n---\n# Body';
    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);
    expect(frontmatter.sns_topics).toBeUndefined();
  });

  it('fm-sanitize-4: sns_topics がマルチライン YAML 配列 → 正しくパース・保持される', () => {
    const input = [
      '---',
      'title: "Test"',
      'tags: ["AI"]',
      'summary: "Summary"',
      'sns_topics:',
      '  - topic: "Topic One"',
      '    summary: "Summary for topic one"',
      '  - topic: "Topic Two"',
      '    summary: "Summary for topic two"',
      '---',
      '# Body',
    ].join('\n');
    const result = normalizeFrontmatter(input, defaults);
    const { frontmatter } = parseFrontmatter(result);
    expect(Array.isArray(frontmatter.sns_topics)).toBe(true);
    const topics = frontmatter.sns_topics as Array<{ topic: string; summary: string }>;
    expect(topics).toHaveLength(2);
    expect(topics[0]!.topic).toBe('Topic One');
    expect(topics[0]!.summary).toBe('Summary for topic one');
    expect(topics[1]!.topic).toBe('Topic Two');
  });
});

describe('parseFrontmatter - multiline YAML arrays', () => {
  it('fm-multiline-1: マルチライン配列をオブジェクト配列としてパースする', () => {
    const content = [
      '---',
      'title: "Test"',
      'sns_topics:',
      '  - topic: "T1"',
      '    summary: "S1"',
      '  - topic: "T2"',
      '    summary: "S2"',
      'thumbnail: "/images/test.png"',
      '---',
      '# Body',
    ].join('\n');
    const { frontmatter } = parseFrontmatter(content);
    expect(Array.isArray(frontmatter.sns_topics)).toBe(true);
    const topics = frontmatter.sns_topics as Array<Record<string, string>>;
    expect(topics).toHaveLength(2);
    expect(topics[0]).toEqual({ topic: 'T1', summary: 'S1' });
    expect(topics[1]).toEqual({ topic: 'T2', summary: 'S2' });
    expect(frontmatter.thumbnail).toBe('/images/test.png');
  });

  it('fm-multiline-2: マルチライン配列が frontmatter の最後にある場合', () => {
    const content = [
      '---',
      'title: "Test"',
      'sns_topics:',
      '  - topic: "T1"',
      '    summary: "S1"',
      '---',
      '# Body',
    ].join('\n');
    const { frontmatter } = parseFrontmatter(content);
    expect(Array.isArray(frontmatter.sns_topics)).toBe(true);
    const topics = frontmatter.sns_topics as Array<Record<string, string>>;
    expect(topics).toHaveLength(1);
    expect(topics[0]).toEqual({ topic: 'T1', summary: 'S1' });
  });

  it('fm-multiline-3: 値が空で次行もインデントなし → 空文字列のまま', () => {
    const content = [
      '---',
      'title: "Test"',
      'provider: ',
      'category: "ai-tech-daily"',
      '---',
      '# Body',
    ].join('\n');
    const { frontmatter } = parseFrontmatter(content);
    expect(frontmatter.provider).toBe('');
    expect(frontmatter.category).toBe('ai-tech-daily');
  });
});
