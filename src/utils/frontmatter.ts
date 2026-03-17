/**
 * frontmatter 操作ユーティリティ
 * validate.ts / thumbnail.ts / generate.ts で共通利用する
 */

export interface ParsedArticle {
  frontmatter: Record<string, unknown>;
  body: string;
  raw: string;
}

export interface FrontmatterDefaults {
  category: string;
  date: string;
  automated: boolean;
}

/**
 * 簡易 YAML パーサー（frontmatter 用）
 * gray-matter に依存しないスタンドアロン実装
 */
export function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const fm: Record<string, unknown> = {};
  const lines = match[1]!.split('\n');
  for (const line of lines) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      const [, key, val] = kv;
      if (val!.startsWith('[')) {
        try { fm[key!] = JSON.parse(val!); } catch { fm[key!] = val; }
      } else if (val === 'true') {
        fm[key!] = true;
      } else if (val === 'false') {
        fm[key!] = false;
      } else {
        fm[key!] = val!.replace(/^["']|["']$/g, '');
      }
    }
  }

  return { frontmatter: fm, body: match[2]! };
}

/**
 * frontmatter にフィールドを追加・更新する
 * 既存のフィールドは上書きし、新規フィールドは末尾に追加する
 */
export function upsertFrontmatterField(content: string, key: string, value: string): string {
  const match = content.match(/^(---\n)([\s\S]*?)(\n---\n)([\s\S]*)$/);
  if (!match) return content;

  const [, open, fmBlock, close, body] = match;
  const lines = fmBlock!.split('\n');
  const pattern = new RegExp(`^${key}:\\s*`);

  const existingIndex = lines.findIndex((line) => pattern.test(line));
  const newLine = `${key}: "${value}"`;

  if (existingIndex >= 0) {
    lines[existingIndex] = newLine;
  } else {
    lines.push(newLine);
  }

  return `${open}${lines.join('\n')}${close}${body}`;
}

/**
 * LLM 出力から Markdown を抽出する。
 * コードフェンスで囲まれている場合は除去。
 * frontmatter がない場合は補完する。
 */
export function extractMarkdownFromLLMResponse(rawText: string): string {
  let text = rawText.trim();

  // コードフェンス除去: ```markdown ... ``` or ``` ... ```
  const fenceMatch = text.match(/^```(?:markdown)?\s*\n([\s\S]*?)\n```\s*$/);
  if (fenceMatch) {
    text = fenceMatch[1]!.trim();
  }

  if (text.startsWith('---\n')) {
    return text;
  }

  // 開始の --- がないが、\n---\n が本文中にあるケース
  // frontmatter フィールドが先頭にあり、--- で閉じられている
  // (例: "title: ...\nslug: ...\n---\n# Body")
  // summary が複数行にまたがったり、空行が混じる場合にも対応
  const closingIdx = text.indexOf('\n---\n');
  if (closingIdx > 0) {
    const before = text.slice(0, closingIdx);
    // 先頭部分が key: value 形式の行で始まっているか確認
    if (/^\w+:\s/.test(before)) {
      return `---\n${before}\n---\n${text.slice(closingIdx + 5)}`;
    }
  }

  // frontmatter がまったくない場合は空の frontmatter を付与
  return `---\n---\n${text}`;
}

/**
 * frontmatter のフィールドを検証し、不足・不正フィールドを補完する。
 * LLM がどんな出力をしても最低限の品質を保証する「安全ネット」。
 */
export function normalizeFrontmatter(markdown: string, defaults: FrontmatterDefaults): string {
  const extracted = extractMarkdownFromLLMResponse(markdown);
  const { frontmatter, body } = parseFrontmatter(extracted);

  // title
  if (!frontmatter.title || String(frontmatter.title).trim() === '') {
    frontmatter.title = `[${defaults.category}] ${defaults.date}`;
  }

  // slug: 不正文字を除去
  if (!frontmatter.slug || String(frontmatter.slug).trim() === '') {
    frontmatter.slug = `${defaults.category}-${defaults.date}`;
  } else {
    frontmatter.slug = String(frontmatter.slug).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  }

  // date
  if (!frontmatter.date || !/^\d{4}-\d{2}-\d{2}$/.test(String(frontmatter.date))) {
    frontmatter.date = defaults.date;
  }

  // category
  if (!frontmatter.category) {
    frontmatter.category = defaults.category;
  }

  // automated
  if (frontmatter.automated === undefined) {
    frontmatter.automated = defaults.automated;
  }

  // tags: 配列でなければ配列化
  if (!Array.isArray(frontmatter.tags)) {
    if (typeof frontmatter.tags === 'string' && frontmatter.tags.trim()) {
      frontmatter.tags = [frontmatter.tags.trim()];
    } else {
      frontmatter.tags = ['AI'];
    }
  }
  if ((frontmatter.tags as string[]).length === 0) {
    frontmatter.tags = ['AI'];
  }

  // summary: 50-200文字にトリム、不足なら本文先頭150文字
  if (!frontmatter.summary || String(frontmatter.summary).trim() === '') {
    const plainBody = body.replace(/^#+\s.*$/gm, '').replace(/\n+/g, ' ').trim();
    frontmatter.summary = plainBody.slice(0, 150);
  } else {
    const summary = String(frontmatter.summary);
    if (summary.length > 200) {
      frontmatter.summary = summary.slice(0, 197) + '...';
    }
  }

  // sources: URL でない項目を除去
  if (!Array.isArray(frontmatter.sources)) {
    frontmatter.sources = [];
  } else {
    frontmatter.sources = (frontmatter.sources as string[]).filter((s) => {
      try { new URL(String(s)); return true; } catch { return false; }
    });
  }

  // frontmatter を再構築
  const fmLines = Object.entries(frontmatter).map(([key, val]) => {
    if (typeof val === 'boolean') return `${key}: ${val}`;
    if (Array.isArray(val)) return `${key}: ${JSON.stringify(val)}`;
    return `${key}: "${String(val)}"`;
  });

  return `---\n${fmLines.join('\n')}\n---\n${body}`;
}
