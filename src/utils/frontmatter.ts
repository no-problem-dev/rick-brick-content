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
  provider?: string;
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
  // boolean 値はクォートなしで書き込む（Astro の Zod スキーマが boolean を期待するため）
  const newLine = value === 'true' || value === 'false'
    ? `${key}: ${value}`
    : `${key}: "${value}"`;

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

  // 二重 frontmatter 検出: `---` が3つ以上出現するケースを処理
  // OpenAI は `--- ` (末尾スペース) を出力するため、trim して正規化
  text = text.replace(/^---[ \t]*$/gm, '---');
  // 各行の末尾スペースも除去（frontmatter フィールド行の末尾スペース対策）
  text = text.split('\n').map(line => line.trimEnd()).join('\n');

  if (text.startsWith('---\n')) {
    const separatorPattern = /^---$/gm;
    const separators: number[] = [];
    let m: RegExpExecArray | null;
    while ((m = separatorPattern.exec(text)) !== null) {
      separators.push(m.index);
    }

    if (separators.length >= 3) {
      // 複数の frontmatter ブロック候補がある
      // 各ペアのブロックを評価し、frontmatter らしいキーが最も多いものを採用
      const fmKeys = /^(?:title|slug|date|category|tags|summary|sources|automated|provider|draft|thumbnail):/m;
      let bestPairIdx = -1;
      let bestScore = -1;

      for (let i = 0; i < separators.length - 1; i += 1) {
        const blockStart = separators[i]! + 4; // skip "---\n"
        const blockEnd = separators[i + 1]!;
        const block = text.slice(blockStart, blockEnd);
        // Count frontmatter-like key: value lines
        const keyMatches = block.match(/^\w+:\s/gm);
        const score = keyMatches ? keyMatches.length : 0;
        // Also check for known frontmatter keys
        const hasKnownKeys = fmKeys.test(block);
        const adjustedScore = hasKnownKeys ? score + 10 : score;
        if (adjustedScore > bestScore) {
          bestScore = adjustedScore;
          bestPairIdx = i;
        }
      }

      if (bestPairIdx >= 0 && bestScore > 0) {
        const blockStart = separators[bestPairIdx]! + 4;
        const blockEnd = separators[bestPairIdx + 1]!;
        const fmContent = text.slice(blockStart, blockEnd);
        const bodyAfter = text.slice(separators[bestPairIdx + 1]! + 3); // skip "---"
        // bodyAfter starts with \n or is empty
        const body = bodyAfter.startsWith('\n') ? bodyAfter.slice(1) : bodyAfter;
        return `---\n${fmContent}\n---\n${body}`;
      }
    }

    // 正常な単一 frontmatter（--- が2つ）、またはスコアが0のケース
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
 * URL からトラッキングパラメータ（utm_*）を除去する
 */
function cleanTrackingParams(url: string): string {
  try {
    const u = new URL(url);
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    let changed = false;
    trackingParams.forEach(p => {
      if (u.searchParams.has(p)) {
        u.searchParams.delete(p);
        changed = true;
      }
    });
    return changed ? u.toString() : url;
  } catch {
    return url;
  }
}

/**
 * frontmatter のフィールドを検証し、不足・不正フィールドを補完する。
 * LLM がどんな出力をしても最低限の品質を保証する「安全ネット」。
 */
export function normalizeFrontmatter(markdown: string, defaults: FrontmatterDefaults): string {
  const extracted = extractMarkdownFromLLMResponse(markdown);
  const { frontmatter, body } = parseFrontmatter(extracted);

  // title: 空文字の場合は body の最初の見出しから取得を試みる。見出しもなければフォールバック
  if (!frontmatter.title || String(frontmatter.title).trim() === '') {
    let titleFromBody: string | undefined;
    // title フィールドが存在するが空の場合（LLM が空値を出力）、body の見出しから取得
    if (frontmatter.title !== undefined) {
      const headingMatch = body.match(/^#+\s+(.+)$/m);
      if (headingMatch && headingMatch[1]!.trim().length > 0) {
        titleFromBody = headingMatch[1]!.trim();
      }
    }
    frontmatter.title = titleFromBody ?? `[${defaults.category}] ${defaults.date}`;
  }

  // slug: 不正文字を除去
  if (!frontmatter.slug || String(frontmatter.slug).trim() === '') {
    frontmatter.slug = `${defaults.category}-${defaults.date}`;
  } else {
    frontmatter.slug = String(frontmatter.slug).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  }

  // date: TARGET_DATE 設定時は常に defaults.date（= TARGET_DATE）を使用
  if (process.env.TARGET_DATE || !frontmatter.date || !/^\d{4}-\d{2}-\d{2}$/.test(String(frontmatter.date))) {
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

  // provider: デフォルト値で補完（LLM 出力に含まれていない場合）
  if (!frontmatter.provider && defaults.provider) {
    frontmatter.provider = defaults.provider;
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
  // summary サニタイズ
  let summaryStr = String(frontmatter.summary);
  // 改行を半角スペースに置換
  summaryStr = summaryStr.replace(/\n/g, ' ');
  // リテラルな \n も置換（LLM が文字列として出力するケース）
  summaryStr = summaryStr.replace(/\\n/g, ' ');
  // 先頭の --- やフィールド名エコーを除去
  summaryStr = summaryStr.replace(/^---\s*/, '').replace(/^(title|slug|date|category):\s*/i, '');
  // 連続スペースを単一スペースに正規化
  summaryStr = summaryStr.replace(/\s{2,}/g, ' ').trim();
  frontmatter.summary = summaryStr;

  // sources: URL でない項目を除去 + トラッキングパラメータ除去
  if (!Array.isArray(frontmatter.sources)) {
    frontmatter.sources = [];
  } else {
    frontmatter.sources = (frontmatter.sources as string[]).filter((s) => {
      try { new URL(String(s)); return true; } catch { return false; }
    }).map(s => cleanTrackingParams(String(s)));
  }

  // sources が空の場合、body 内の Markdown リンクから URL を抽出
  if ((frontmatter.sources as string[]).length === 0) {
    const urlPattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    const extractedUrls: string[] = [];
    let match;
    while ((match = urlPattern.exec(body)) !== null) {
      extractedUrls.push(cleanTrackingParams(match[2]!));
    }
    // 重複排除、最大10件
    frontmatter.sources = [...new Set(extractedUrls)].slice(0, 10);
  }

  // ホワイトリスト方式: FIELD_ORDER に含まれるフィールドのみ、指定順序で出力
  const FIELD_ORDER = ['title', 'slug', 'summary', 'date', 'tags', 'category', 'automated', 'provider', 'sources'];

  const fmLines: string[] = [];
  for (const key of FIELD_ORDER) {
    if (frontmatter[key] === undefined) continue;
    // provider が空文字やfalsyの場合はスキップ（provider 未指定時）
    if (key === 'provider' && !frontmatter[key]) continue;
    const val = frontmatter[key];
    if (typeof val === 'boolean') {
      fmLines.push(`${key}: ${val}`);
    } else if (Array.isArray(val)) {
      fmLines.push(`${key}: ${JSON.stringify(val)}`);
    } else {
      fmLines.push(`${key}: "${String(val)}"`);
    }
  }

  return `---\n${fmLines.join('\n')}\n---\n${body}`;
}
