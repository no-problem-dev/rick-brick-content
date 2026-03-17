---
title: "Rick-Brick 初投稿テスト：ブログ基盤が動き出しました"
summary: "Rick-Brick ブログの初投稿テスト記事です。Astro SSG + Cloudflare Pages + git submodule 構成が正常に動作するか確認します。"
date: "2026-03-16"
category: tech-article
tags: ["Astro", "Cloudflare Pages", "SSG", "テスト"]
automated: false
draft: true
---

## はじめに

これは **Rick-Brick** ブログの初投稿テスト記事です。記事の投稿からビルド、デプロイまでのパイプラインが正常に機能するかを確認する目的で作成しました。

## 技術スタック

Rick-Brick は以下の技術で構成されています。

- **Astro (SSG)** — 静的サイト生成フレームワーク
- **Tailwind CSS** — ユーティリティファーストの CSS フレームワーク
- **Cloudflare Pages** — ホスティング・CDN
- **Pagefind** — ビルド時検索インデックス生成
- **git submodule** — 記事リポジトリの分離管理

## リポジトリ構成

記事コンテンツは `rick-brick-content` リポジトリ（public）に格納し、アプリケーションコードの `rick-brick` リポジトリ（private）から git submodule として参照しています。

```
rick-brick/                 ← アプリケーション（private）
└── rick-brick-content/     ← 記事コンテンツ（public, submodule）
    ├── articles/           ← Markdown 記事
    └── images/             ← 記事画像
```

この分離により、記事の自動生成を public リポジトリの GitHub Actions 無料枠で実行できます。

## まとめ

この記事が正常に表示されていれば、投稿パイプラインは問題なく動作しています。今後は AI 論文解説やニュースまとめ記事を定期的に発信していきます。
