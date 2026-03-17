# rick-brick-content

[Rick-Brick](https://oct-rick-brick.com) のコンテンツリポジトリ。記事 Markdown・画像・自動記事生成パイプラインを管理する。

本リポジトリは **rick-brick**（Astro アプリ本体、private リポジトリ）に git submodule としてマウントされる。

[English version / 英語版](./README.md)

## リポジトリ構成

```
rick-brick-content/
├── articles/              ← 記事 Markdown（手動 + 自動生成）
├── images/                ← 記事サムネイル画像
│   └── defaults/          ← フォールバック画像
├── drafts/                ← 下書き
├── ideas/                 ← 記事アイデア
├── src/
│   ├── scripts/           ← 自動記事生成スクリプト
│   ├── providers/         ← LLM プロバイダー（Claude / Gemini / OpenAI）
│   └── types/             ← TypeScript 型定義
├── prompts/
│   ├── base/              ← 記事生成ベースプロンプト
│   └── providers/         ← プロバイダー固有補足プロンプト
└── .github/workflows/
    └── generate-articles.yml  ← 日次自動記事生成ワークフロー
```

## 自動記事生成

GitHub Actions の cron（UTC 20:00 / JST 05:00）で毎日自動実行される。

1. LLM API（Claude / Gemini / OpenAI）で最新 AI 論文・ニュースをリサーチ
2. リサーチ結果をもとに Markdown 記事を生成（paper-review + ai-news-digest）
3. Gemini Imagen API でサムネイル画像を生成
4. 品質チェック（frontmatter 検証等）
5. 成功分を main に push
6. rick-brick に `repository_dispatch` でデプロイをトリガー

### プロバイダー切り替え

`RESEARCH_PROVIDER` 環境変数で LLM プロバイダーを選択する。

| 値 | プロバイダー | デフォルトモデル |
|----|------------|----------------|
| `claude` | Claude API（web_search） | claude-haiku-4-5 |
| `gemini` | Gemini API（Grounding with Google Search） | gemini-2.0-flash |
| `openai` | OpenAI API（web_search_preview） | gpt-4o-mini-search-preview |

### 手動実行

GitHub Actions の「Run workflow」から手動実行可能。プロバイダー・モデルの上書きやドライランを指定できる。

## GitHub Actions Secrets

| Secret 名 | 用途 |
|-----------|------|
| `ANTHROPIC_API_KEY` | Claude API |
| `GEMINI_API_KEY` | Gemini API（リサーチ） |
| `GEMINI_IMAGE_API_KEY` | Gemini Imagen API（サムネイル生成） |
| `OPENAI_API_KEY` | OpenAI API |
| `DEPLOY_TRIGGER_PAT` | rick-brick への deploy トリガー（Fine-grained PAT） |

## ローカル開発

```bash
npm install
npm run research    # リサーチ実行
npm run generate    # 記事 Markdown 生成
npm run thumbnail   # サムネイル生成
npm run validate    # 品質チェック
```

環境変数は `.env` ファイルに設定する（`.gitignore` 対象）。

```env
RESEARCH_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AI...
GEMINI_IMAGE_API_KEY=AI...
```

## 記事の手動投稿

```bash
# 記事を作成
vim articles/YYYY-MM-DD-slug.md

# PR 経由で main にマージ → 自動デプロイ
git checkout -b feat/new-article
git add articles/ images/
git commit -m "feat: add article about ..."
git push origin feat/new-article
```

## 関連リポジトリ

- **rick-brick**（private）— Astro SSG アプリ本体。ビルド・デプロイを担当
