---
title: "Mamba: 状態空間モデルによるTransformerの代替"
summary: "線形複雑性で長列列処理を実現する新しいアーキテクチャ"
date: "2024-06-10"
category: paper-review
tags: ["SSM", "Mamba", "ディープラーニング"]
automated: true
provider: claude
paper_url: "https://arxiv.org/abs/2312.00752"
paper_title: "Mamba: Linear-Time Sequence Modeling with Selective State Spaces"
sources: ["https://arxiv.org/abs/2312.00752"]
draft: true
---

## はじめに

Mambaは、Transformerの二次複雑性の問題を解決するために提案された状態空間モデル（SSM）です。選択的状態空間を用いることで、線形時間での系列処理が実現されます。

従来のTransformerではシーケンス長に対して二次の計算量が必要でしたが、Mambaではこれを線形に削減。これにより、より長い文脈での処理が効率的に可能になります。

## まとめ

Mambaは状態空間モデルの新たな可能性を示す重要な研究です。今後の自然言語処理と系列モデリングの発展に大きな影響を与える可能性があります。
