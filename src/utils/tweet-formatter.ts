/**
 * frontmatter → ツイートテキスト変換
 * X の Weighted Character Count に基づいて 280 ウェイト以内に収める
 */

const X_MAX_WEIGHT = 280;
const X_URL_WEIGHT = 23; // t.co 短縮URL のウェイト固定値

/**
 * X の Weighted Character Count を計算する
 * CJK 文字（日本語含む）= 2, それ以外 = 1
 * URL は含めず別途 23 として加算する
 */
export function weightedCharCount(text: string): number {
  let count = 0;
  for (const char of text) {
    const code = char.codePointAt(0)!;
    if (isCJK(code)) {
      count += 2;
    } else {
      count += 1;
    }
  }
  return count;
}

/**
 * CJK 文字かどうかを判定する
 * Hiragana, Katakana, CJK Unified Ideographs, Halfwidth/Fullwidth Forms 等
 */
function isCJK(code: number): boolean {
  return (
    (code >= 0x3000 && code <= 0x9fff) || // CJK Unified, Hiragana, Katakana, etc.
    (code >= 0xf900 && code <= 0xfaff) || // CJK Compatibility Ideographs
    (code >= 0xff00 && code <= 0xffef) || // Halfwidth and Fullwidth Forms
    (code >= 0x20000 && code <= 0x2fa1f)  // CJK Extension B-F
  );
}

export interface TweetInput {
  title: string;
  summary: string;
  comment: string;
  tags: string[];
  articleId: string;
}

/**
 * タグ配列からハッシュタグ文字列の配列を生成する
 * スペース・記号を除去し、# を付与。重複排除
 */
export function tagsToHashtags(tags: string[], maxCount = 4): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const tag of tags) {
    const cleaned = tag.replace(/[\s#\-・、。]/g, '');
    if (!cleaned || seen.has(cleaned.toLowerCase())) continue;
    seen.add(cleaned.toLowerCase());
    result.push(`#${cleaned}`);
    if (result.length >= maxCount) break;
  }

  return result;
}

/**
 * frontmatter からツイートテキストを生成する
 * 280 ウェイト以内に収まるよう comment を動的にトリムする
 */
export function formatTweet(input: TweetInput, siteUrl: string): string {
  const url = `${siteUrl}/articles/${input.articleId}/`;
  const header = '\u{1F4DD} \u65B0\u3057\u3044\u8A18\u4E8B\u3092\u6295\u7A3F\u3057\u307E\u3057\u305F';

  // 固定部分のウェイトを計算（URL + 改行）
  const separator = '\n\n';
  const fixedWeight =
    X_URL_WEIGHT + // URL は 23 固定
    weightedCharCount(separator) + // header 後の改行
    weightedCharCount(separator) + // URL 前の改行
    weightedCharCount(header);

  const titleWeight = weightedCharCount(input.title);
  const availableForComment = X_MAX_WEIGHT - fixedWeight - titleWeight;

  let commentText = '';
  if (input.comment && availableForComment > 10) {
    commentText = trimToWeight(input.comment, availableForComment - weightedCharCount('\n'));
  }

  // テキスト組み立て
  const parts = [header];
  if (commentText) {
    parts.push(`${input.title}\n${commentText}`);
  } else {
    parts.push(input.title);
  }
  parts.push(url);

  return parts.join(separator);
}

/**
 * テキストを指定ウェイト以内にトリムする
 * 末尾に「...」を付与して収める
 */
function trimToWeight(text: string, maxWeight: number): string {
  if (weightedCharCount(text) <= maxWeight) return text;

  // 「...」の分を引く
  const ellipsisWeight = weightedCharCount('...');
  const target = maxWeight - ellipsisWeight;
  if (target <= 0) return '';

  let current = 0;
  let lastIndex = 0;
  for (const char of text) {
    const code = char.codePointAt(0)!;
    const w = isCJK(code) ? 2 : 1;
    if (current + w > target) break;
    current += w;
    lastIndex += char.length;
  }

  return text.slice(0, lastIndex) + '...';
}
