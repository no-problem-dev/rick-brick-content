/**
 * frontmatter 操作ユーティリティ
 * validate.ts / thumbnail.ts / generate.ts / translate.ts で共通利用する
 */

/**
 * YAML 文字列値を安全にダブルクォートで囲む。
 * 値中のバックスラッシュ・ダブルクォートをエスケープする。
 */
export function yamlQuote(val: string): string {
  const escaped = val.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${escaped}"`;
}

/**
 * frontmatter の1フィールドを YAML 行（`key: value`）に変換する。
 * boolean はそのまま、配列は JSON.stringify、文字列は yamlQuote で安全化。
 */
export function formatFrontmatterField(key: string, val: unknown): string {
  if (typeof val === 'boolean') {
    return `${key}: ${val}`;
  }
  if (Array.isArray(val)) {
    return `${key}: ${JSON.stringify(val)}`;
  }
  return `${key}: ${yamlQuote(String(val))}`;
}

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
  /** 検索ツールのAPIレスポンスから構造的に抽出したURL一覧 */
  searchUrls?: string[];
  /** slug を明示的に指定する場合。指定時は LLM 出力の slug を上書き */
  slug?: string;
  /** recap_period フィールド（まとめ記事用）*/
  recap_period?: string;
  /** tags を明示的に指定する場合。指定時は LLM 出力の tags を上書き */
  tags?: string[];
  /** draft フラグ（true の場合は draft: true を frontmatter に追加）*/
  draft?: boolean;
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
  let currentKey: string | null = null;
  let currentList: Record<string, string>[] | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;

    // マルチライン YAML 配列の項目行（"  - key: value" or "    key: value"）
    if (currentKey && currentList !== null && /^\s+/.test(line)) {
      const itemMatch = line.match(/^\s+-\s+(\w+):\s*(.*)$/);
      if (itemMatch) {
        // 新しいリスト項目の開始
        const val = itemMatch[2]!.replace(/^["']|["']$/g, '');
        currentList.push({ [itemMatch[1]!]: val });
      } else {
        const propMatch = line.match(/^\s+(\w+):\s*(.*)$/);
        if (propMatch && currentList.length > 0) {
          // 既存リスト項目のプロパティ追加
          const val = propMatch[2]!.replace(/^["']|["']$/g, '');
          currentList[currentList.length - 1]![propMatch[1]!] = val;
        }
      }
      continue;
    }

    // マルチライン配列の終了（新しいトップレベルキーに到達）
    if (currentKey && currentList !== null) {
      fm[currentKey] = currentList;
      currentKey = null;
      currentList = null;
    }

    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      const [, key, val] = kv;
      if (val!.startsWith('[')) {
        try { fm[key!] = JSON.parse(val!); } catch { fm[key!] = val; }
      } else if (val === 'true') {
        fm[key!] = true;
      } else if (val === 'false') {
        fm[key!] = false;
      } else if (val!.trim() === '') {
        // 値が空の場合、次行がインデントされていればマルチライン配列の開始
        if (i + 1 < lines.length && /^\s+-\s/.test(lines[i + 1]!)) {
          currentKey = key!;
          currentList = [];
        } else {
          fm[key!] = '';
        }
      } else {
        fm[key!] = val!.replace(/^["']|["']$/g, '');
      }
    }
  }

  // 最後のマルチライン配列を格納
  if (currentKey && currentList !== null) {
    fm[currentKey] = currentList;
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

  // defaults.date は YYYY-MM-DD または YYYY-MM-DDTHH:MM 形式。日付のみの部分を抽出
  const dateOnly = defaults.date.slice(0, 10);

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
    frontmatter.title = titleFromBody ?? `[${defaults.category}] ${dateOnly}`;
  }

  // slug: defaults.slug が指定されている場合は上書き。なければ LLM 出力を正規化
  if (defaults.slug) {
    frontmatter.slug = defaults.slug;
  } else if (!frontmatter.slug || String(frontmatter.slug).trim() === '') {
    frontmatter.slug = `${defaults.category}-${dateOnly}`;
  } else {
    frontmatter.slug = String(frontmatter.slug).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  }

  // date: LLM 出力の日付は信頼せず、常に defaults.date で上書き（時刻付きの場合はそのまま保持）
  frontmatter.date = defaults.date;

  // title 内の日付も正規化（LLM が UTC ベースの日付をタイトルに埋め込むケースを防ぐ）
  // "2026年03月21日" → "2026年03月22日", "2026-03-21" → "2026-03-22" 等
  const titleStr = String(frontmatter.title);
  const [y, m, d] = dateOnly.split('-');
  frontmatter.title = titleStr
    .replace(/\d{4}年\d{2}月\d{2}日/, `${y}年${m}月${d}日`)
    .replace(/\d{4}-\d{2}-\d{2}/, dateOnly);

  // category
  if (!frontmatter.category) {
    frontmatter.category = defaults.category;
  }

  // automated
  if (frontmatter.automated === undefined) {
    frontmatter.automated = defaults.automated;
  }

  // provider: defaults が指定されている場合は常に上書き（LLM がプロンプト例示の値をそのまま出力するため）
  if (defaults.provider) {
    frontmatter.provider = defaults.provider;
  }

  // tags: defaults.tags が指定されている場合は上書き。なければ LLM 出力を正規化
  if (defaults.tags !== undefined) {
    frontmatter.tags = defaults.tags.length > 0 ? defaults.tags : ['AI'];
  } else if (!Array.isArray(frontmatter.tags)) {
    if (typeof frontmatter.tags === 'string' && frontmatter.tags.trim()) {
      frontmatter.tags = [frontmatter.tags.trim()];
    } else {
      frontmatter.tags = ['AI'];
    }
  }
  if ((frontmatter.tags as string[]).length === 0) {
    frontmatter.tags = ['AI'];
  }

  // summary: 不足なら本文先頭150文字で補完（トリミングはフロントエンド側の CSS line-clamp で制御）
  if (!frontmatter.summary || String(frontmatter.summary).trim() === '') {
    const plainBody = body.replace(/^#+\s.*$/gm, '').replace(/\n+/g, ' ').trim();
    frontmatter.summary = plainBody.slice(0, 150);
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

  // sns_topics: 配列であることを検証、不正な場合は除去
  if (frontmatter.sns_topics !== undefined) {
    if (Array.isArray(frontmatter.sns_topics)) {
      frontmatter.sns_topics = (frontmatter.sns_topics as Array<Record<string, unknown>>)
        .filter((item) => item && typeof item.topic === 'string' && typeof item.summary === 'string')
        .map((item) => ({
          topic: String(item.topic).trim(),
          summary: String(item.summary).trim(),
        }));
      if ((frontmatter.sns_topics as unknown[]).length === 0) {
        delete frontmatter.sns_topics;
      }
    } else {
      delete frontmatter.sns_topics;
    }
  }

  // sources: searchUrls（APIレスポンスから構造的に抽出したURL）を優先し、
  // LLM生成の sources で補完する
  const searchUrls = (defaults.searchUrls ?? [])
    .filter((s) => { try { new URL(String(s)); return true; } catch { return false; } })
    .map(s => cleanTrackingParams(String(s)));

  // LLM生成の sources をクリーニング
  let llmSources: string[] = [];
  if (Array.isArray(frontmatter.sources)) {
    llmSources = (frontmatter.sources as string[]).filter((s) => {
      try { new URL(String(s)); return true; } catch { return false; }
    }).map(s => cleanTrackingParams(String(s)));
  }

  // sources が両方空の場合、body 内の Markdown リンクから URL を抽出
  if (searchUrls.length === 0 && llmSources.length === 0) {
    const urlPattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    const extractedUrls: string[] = [];
    let match;
    while ((match = urlPattern.exec(body)) !== null) {
      extractedUrls.push(cleanTrackingParams(match[2]!));
    }
    llmSources = extractedUrls;
  }

  // searchUrls を優先し、LLM生成分で補完（重複排除、最大20件）
  frontmatter.sources = [...new Set([...searchUrls, ...llmSources])].slice(0, 20);

  // recap_period: defaults.recap_period が指定されている場合は設定
  if (defaults.recap_period) {
    frontmatter.recap_period = defaults.recap_period;
  }

  // draft: defaults.draft が true の場合は設定
  if (defaults.draft === true) {
    frontmatter.draft = true;
  }

  // ホワイトリスト方式: FIELD_ORDER に含まれるフィールドのみ、指定順序で出力
  const FIELD_ORDER = ['title', 'slug', 'summary', 'date', 'tags', 'category', 'automated', 'provider', 'sources', 'sns_topics', 'recap_period', 'draft'];

  const fmLines: string[] = [];
  for (const key of FIELD_ORDER) {
    if (frontmatter[key] === undefined) continue;
    // provider が空文字やfalsyの場合はスキップ（provider 未指定時）
    if (key === 'provider' && !frontmatter[key]) continue;
    // draft が false の場合はスキップ（draft: true のときのみ出力）
    if (key === 'draft' && !frontmatter[key]) continue;
    fmLines.push(formatFrontmatterField(key, frontmatter[key]));
  }

  return `---\n${fmLines.join('\n')}\n---\n${body}`;
}
