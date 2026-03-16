---
title: "Attention Is All You Need: Transformer アーキテクチャの革命"
summary: "Transformerアーキテクチャを提案した画期的な論文を解説。Self-Attentionメカニズムがどのように自然言語処理を変革したかを詳しく見ていきます。"
date: "2024-03-10"
category: paper-review
tags: ["Transformer", "自然言語処理", "ディープラーニング"]
automated: false
paper_url: "https://arxiv.org/abs/1706.03762"
paper_title: "Attention Is All You Need"
sources: ["https://arxiv.org/abs/1706.03762"]
---

## はじめに

2017年にGoogle Brain チームが発表した「Attention Is All You Need」は、自然言語処理の歴史において間違いなく最も影響力のある論文のひとつです。それまで主流だったRNN（再帰型ニューラルネットワーク）やLSTMに代わり、**Self-Attention（自己注意機構）のみ**でシーケンスを処理する「Transformer」アーキテクチャを提案しました。

この論文が登場するまで、翻訳や文章生成などのタスクはRNN系のモデルが担っていました。しかしRNNには致命的な弱点がありました。それは「時系列に沿って順番に処理しなければならない」という逐次処理の制約です。長い文章になるほど、最初のトークンに関する情報が薄れていく「長期依存性の問題」も深刻でした。

Transformerはこの問題を根本から解決しました。シーケンス全体を一度に見渡し、トークン間の関連度を並列に計算することで、長距離の依存関係も効率的に捉えられるようになったのです。

## 技術解説

### Self-Attention メカニズム

Self-Attentionの核心は、入力シーケンスの各トークンが他のすべてのトークンとの関連度（Attention Weight）を計算する仕組みです。具体的には、各トークンをQuery（Q）、Key（K）、Value（V）という3つのベクトルに変換し、以下の式でスコアを計算します。

```
Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V
```

`d_k` はキーベクトルの次元数で、スケーリングによって勾配の消失を防ぎます。このスコアが高いほど、そのトークンペアの関連が強いことを意味します。

### Multi-Head Attention

論文のもうひとつの重要な貢献が **Multi-Head Attention** です。Single の Attention では捉えられる関係性が限られますが、複数のヘッドに分けて並列にAttentionを計算し、その結果を結合することで、構文的関係・意味的関係・長距離依存など多様なパターンを同時に学習できます。

```python
# PyTorch での簡略実装イメージ
import torch
import torch.nn as nn

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
```

### Positional Encoding

RNNと異なり、Transformerはトークンの順序情報を自然に持ちません。そこで **Positional Encoding** を入力埋め込みに加算することで、位置情報を注入します。論文ではサイン・コサイン関数を使った固定エンコーディングが採用されています。

### エンコーダ・デコーダ構成

オリジナルのTransformerは機械翻訳を念頭に設計されており、エンコーダとデコーダの2部構成です。エンコーダが入力文を内部表現に変換し、デコーダがその表現をもとに出力文を生成します。後のGPTはデコーダのみ、BERTはエンコーダのみを採用した派生モデルです。

## まとめ

「Attention Is All You Need」はTransformerという普遍的なアーキテクチャをもたらし、NLPのみならずコンピュータビジョン、音声認識、科学計算に至るまで幅広い分野に革命を起こしました。GPT-4、Claude、Geminiといった現代の大規模言語モデルはすべてTransformerの直系の子孫です。

Self-Attentionによる並列処理能力と長距離依存性の捕捉は、現代AIの基盤技術となっています。この論文を読むことは、現代AI技術の原点に立ち返る最良の手段といえるでしょう。
