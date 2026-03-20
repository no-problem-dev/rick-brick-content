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
 * 280 ウェイト以内に収まるよう summary を動的にトリムする
 */
export function formatTweet(input: TweetInput, siteUrl: string): string {
  const url = `${siteUrl}/articles/${input.articleId}/`;
  const hashtags = tagsToHashtags(input.tags);
  const hashtagText = hashtags.join(' ');

  // 固定部分のウェイトを計算（URL + 改行）
  const separator = '\n\n';
  const fixedWeight =
    X_URL_WEIGHT + // URL は 23 固定
    weightedCharCount(separator) + // URL 前の改行
    weightedCharCount(separator) + // タイトル後の改行
    (hashtagText ? weightedCharCount(separator) + weightedCharCount(hashtagText) : 0);

  const titleWeight = weightedCharCount(input.title);
  const availableForSummary = X_MAX_WEIGHT - fixedWeight - titleWeight;

  let summaryText = '';
  if (availableForSummary > 10) {
    summaryText = trimToWeight(input.summary, availableForSummary - weightedCharCount(separator));
    if (summaryText) {
      // summary 前の改行分を加算
    }
  }

  // テキスト組み立て
  const parts = [input.title];
  if (summaryText) parts.push(summaryText);
  parts.push(url);
  if (hashtagText) parts.push(hashtagText);

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
