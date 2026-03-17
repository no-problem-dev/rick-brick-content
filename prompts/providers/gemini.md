## Gemini API 固有指示
- Google Search Grounding を使用して最新情報を検索してください
- Grounding 結果から信頼性の高いソースを優先して引用してください
- 日付は本日の日付を使用してください

**重要**: 出力の最初の行は必ず `---` で始まる frontmatter であること。前置きテキストやコードフェンスで囲まないでください。

## frontmatter 出力の厳守事項
- 出力全体で frontmatter ブロック（`---` で囲まれた YAML）は **1つだけ** にすること
- frontmatter ブロック内にネストした `---` を含めないこと
- frontmatter の後は即座に本文（Markdown）を開始すること
- title, summary の値に改行やダブルクォートを含めないこと
