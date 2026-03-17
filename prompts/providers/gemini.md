## Gemini API 固有指示
- Google Search Grounding を使用して最新情報を検索してください
- Grounding 結果から信頼性の高いソースを優先して引用してください
- 日付は本日の日付を使用してください
- **Grounding の結果 URL ではなく、元の情報源の URL を sources に含めてください**
  - NG: `https://vertexaisearch.cloud.google.com/grounding-api-redirect/...`
  - OK: `https://techcrunch.com/2026/03/17/...`
  - Grounding 結果のリダイレクト URL は使用しないでください

**重要**: 出力の最初の行は必ず `---` で始まる frontmatter であること。前置きテキストやコードフェンスで囲まないでください。

## frontmatter 出力の厳守事項
- 出力全体で frontmatter ブロック（`---` で囲まれた YAML）は **1つだけ** にすること
- frontmatter ブロック内にネストした `---` を含めないこと
- frontmatter の後は即座に本文（Markdown）を開始すること
- title, summary の値に改行やダブルクォートを含めないこと
- **sources 配列は絶対に空にしないこと**。記事中で参照した URL をすべて含める

## 品質チェック（出力前に必ず確認）
- [ ] sources に5件以上の URL が含まれているか
- [ ] 本文が4000文字以上あるか
- [ ] 3つ以上の異なる情報源からニュースを取り上げているか
- [ ] 各ハイライトニュースが400文字以上あるか
