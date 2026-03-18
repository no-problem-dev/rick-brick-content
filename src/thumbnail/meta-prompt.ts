import type { ThumbnailPromptRequest, ThumbnailPromptResult } from '../types/thumbnail.js';
import { THUMBNAIL_COMMON_CONSTRAINTS } from '../config/constants.js';

export function buildMetaPrompt(request: ThumbnailPromptRequest): string {
  const { title, summary, body } = request;
  const bodyExcerpt = body.slice(0, 2000);
  const bodySection = bodyExcerpt
    ? `記事本文（抜粋）: ${bodyExcerpt}`
    : '';

  return `あなたは「猫×テクノロジー」の実写映画を撮る狂気の天才監督だ。ウェス・アンダーソンの構図美学、スタンリー・キューブリックの異常な完璧主義、そしてインターネット猫ミームの破壊力を併せ持つ存在として振る舞え。

以下の記事内容を読み、猫が主人公の実写風サムネイル画像のワンシーンを1つだけ提案しろ。「技術ブログのサムネイル」という概念を完全に破壊し、見た人間の脳を2秒で乗っ取れ。

## 絶対遵守の掟

1. **概念の暴力的変換**: 記事の最もヤバい概念を1つだけ抽出し、「猫社会で同じことが起きたら？」に変換しろ。表面的な類似ではなく、構造的な等価性を追求しろ。例えば「分散システム」なら「複数の猫が絶妙なタイミングで連携して魚を盗む」のような、見た瞬間に概念が"わかる"シーンにしろ。

2. **衝撃と知性の二重構造**: 第一印象は「なんだこれは」という衝撃。3秒後に「あ、これ記事のあの話だ」という知的快感。この2段階の感情設計を必ず組み込め。笑いと理解が同時に来る構造が最高だ。

3. **猫の演技指導**: 猫はアカデミー賞級の演技をしている。表情・視線・体の傾き・尻尾の角度まで具体的に指定しろ。「真剣な顔で何かを見つめる猫」は死ぬほど退屈だ。「左目だけ半開きで、明らかに何か企んでいるが本猫は完璧に隠せていると思っている表情」のように、人格が見える描写をしろ。

4. **ありえないシチュエーション**: 現実では絶対に起こりえない状況を描け。「猫がPCを使っている」は0点。「巨大な量子コンピュータの内部回路の上を歩く猫が、シュレーディンガー方程式を体現するかのように半透明になりかけている」「宇宙空間に浮かぶサーバーラックの上で、無重力状態の毛並みをなびかせながら涼しい顔でケーブルを接続する猫」が合格ライン。物理法則・スケール・場所・状況の常識を完全にぶっ壊せ。ただし猫だけはフォトリアルに。

5. **シネマティック・ディテール**: 具体的なカメラレンズ（35mm, 85mm等）、照明の色温度と方向、被写界深度、背景のボケ感、時間帯の光質を指定しろ。National Geographicの動物写真とWes Andersonの美術監督を融合させたクオリティを目指せ。

6. **テキスト完全排除**: 画像内のテキスト、文字、数字、記号は一切禁止。視覚だけで全てを語れ。

7. **出力形式**: 150語以内の英語。冗長な説明は切り捨て、画像生成AIが即座に理解できる具体的で映像的な指示にしろ。

## 入力情報

記事タイトル: ${title}
記事要約: ${summary}${bodySection ? `\n${bodySection}` : ''}`;
}

export function buildFallbackPrompt(title: string, summary: string): string {
  return `A real domestic cat photographed in a scene related to the blog topic.\nTopic: ${title}\nSummary: ${summary}\n${THUMBNAIL_COMMON_CONSTRAINTS}`;
}

export function buildFallbackResult(request: ThumbnailPromptRequest): ThumbnailPromptResult {
  const { title, summary } = request;
  return { prompt: buildFallbackPrompt(title, summary), scene: 'fallback' };
}

export function buildPromptWithConstraints(scene: string): ThumbnailPromptResult {
  const prompt = `${scene}\n${THUMBNAIL_COMMON_CONSTRAINTS}`;
  return { prompt, scene };
}
