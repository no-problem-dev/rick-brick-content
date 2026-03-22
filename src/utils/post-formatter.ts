/**
 * 英語 SNS 投稿テキスト整形
 * Bluesky (300 graphemes) と Mastodon (500 chars) の両方に対応
 */

export interface PostInput {
  title: string;
  summary: string;
  tags: string[];
  articleId: string;
}

/**
 * frontmatter から SNS 投稿テキストを生成する
 * maxLength で各プラットフォームの文字数上限に対応
 */
export function formatPost(
  input: PostInput,
  siteUrl: string,
  maxLength: number,
): string {
  const url = `${siteUrl}/en/articles/${input.articleId}/`;
  const hashtags = tagsToHashtags(input.tags, 4);
  const hashtagText = hashtags.join(' ');

  const separator = '\n\n';
  const fixedLength =
    url.length +
    separator.length + // タイトル後の改行
    separator.length + // URL 前の改行
    (hashtagText ? separator.length + hashtagText.length : 0);

  const titleLength = input.title.length;
  const availableForSummary = maxLength - fixedLength - titleLength;

  let summaryText = '';
  if (availableForSummary > 10) {
    summaryText = trimToLength(
      input.summary,
      availableForSummary - separator.length,
    );
  }

  const parts = [input.title];
  if (summaryText) parts.push(summaryText);
  parts.push(url);
  if (hashtagText) parts.push(hashtagText);

  return parts.join(separator);
}

/**
 * タグ配列からハッシュタグ文字列の配列を生成する
 * スペース・記号を除去し、# を付与。重複排除
 */
export function tagsToHashtags(tags: string[], maxCount = 4): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of tags) {
    const cleaned = tag.replace(/[\s#\-]/g, '');
    if (!cleaned || seen.has(cleaned.toLowerCase())) continue;
    seen.add(cleaned.toLowerCase());
    result.push(`#${cleaned}`);
    if (result.length >= maxCount) break;
  }
  return result;
}

/**
 * テキストを指定文字数以内にトリムする
 * 末尾に「...」を付与して収める
 */
export function trimToLength(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const target = maxLength - 3; // '...' の分
  if (target <= 0) return '';
  return text.slice(0, target) + '...';
}
