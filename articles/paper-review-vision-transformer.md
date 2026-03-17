---
title: "Vision Transformer (ViT): 画像認識のパラダイムシフト"
summary: "画像をパッチに分割してTransformerで処理するアーキテクチャ"
date: "2024-06-25"
category: paper-review
tags: ["ViT", "画像認識", "Transformer"]
automated: true
provider: claude
sources: ["https://arxiv.org/abs/2010.11929"]
---

## はじめに

Vision Transformer（ViT）は、画像認識タスクにTransformerアーキテクチャを適用した革新的な研究です。従来のCNN（畳み込みニューラルネットワーク）ではなく、パッチ分割とAttention機構で画像を処理します。

画像を16×16のパッチに分割し、これらをトークンとして扱うことで、NLP分野の成功例をコンピュータビジョンに応用。スケーリングと事前学習の効果が大きいことが示されています。

## まとめ

ViTは画像認識の研究に新たな方向性をもたらしました。汎用的なTransformerアーキテクチャの有効性を実証する重要な成果です。
