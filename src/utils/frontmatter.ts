/**
 * frontmatter 操作ユーティリティ
 * validate.ts / thumbnail.ts で共通利用する
 */

export interface ParsedArticle {
  frontmatter: Record<string, unknown>;
  body: string;
  raw: string;
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
