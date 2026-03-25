/**
 * OpenAI API で SNS 投稿用の人間っぽいコメントを生成する
 *
 * 環境変数:
 *   OPENAI_API_KEY — OpenAI API キー
 */

import { callOpenAI } from './sns-post-builder.js';

interface CommentInput {
  title: string;
  summary: string;
  language: 'ja' | 'en';
}

/**
 * 記事のタイトルとサマリから SNS 投稿用の一言コメントを生成する
 * 失敗時は空文字を返す（ワークフローを止めない）
 */
export async function generateSnsComment(input: CommentInput): Promise<string> {
  const languageInstruction =
    input.language === 'ja'
      ? '日本語で、人間が書いたような自然な感想を1文で書いてください。50文字程度の短い感想にしてください。'
      : 'Write a natural, human-like one-sentence comment in English. Keep it around 50 characters.';

  const prompt = `以下の記事について、SNS投稿用の一言コメントを生成してください。

記事タイトル: ${input.title}
記事の要約: ${input.summary}

${languageInstruction}
ハッシュタグや絵文字は含めないでください。記事の内容に対する個人的な感想や注目ポイントを述べてください。`;

  const text = await callOpenAI(prompt);

  if (!text) {
    console.warn('SNS comment generation returned empty text.');
    return '';
  }

  console.log(`Generated SNS comment (${input.language}): ${text}`);
  return text;
}
