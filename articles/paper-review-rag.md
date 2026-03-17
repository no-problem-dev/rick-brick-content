---
title: "RAG（検索拡張生成）の最新手法：大規模言語モデルの知識補強"
summary: "RAG（Retrieval-Augmented Generation）の最新サーベイ論文を解説。チャンク分割、埋め込みモデル選択、リランキング手法を比較します。"
date: "2024-05-20"
category: paper-review
tags: ["RAG", "LLM", "検索", "AI"]
automated: true
provider: openai
sources: ["https://arxiv.org/abs/2312.10997"]
---

## はじめに

大規模言語モデル（LLM）はその卓越した言語能力にもかかわらず、**ハルシネーション（存在しない情報を生成すること）**と**知識の陳腐化**という根本的な課題を抱えています。学習データのカットオフ以降の情報を知らず、また自信満々に誤った情報を出力することがあります。

**RAG（Retrieval-Augmented Generation：検索拡張生成）** は、これらの問題を解決するアプローチとして急速に普及しています。外部の知識ベースから関連情報を動的に検索し、プロンプトに追加することで、LLM が最新かつ正確な情報に基づいて回答できるようにします。

2023年末に発表された「Retrieval-Augmented Generation for Large Language Models: A Survey」は、RAG に関する手法を体系的にまとめたサーベイ論文です。本稿ではその内容を中心に、実装上のポイントも加えて解説します。

## 技術解説

### RAG の基本アーキテクチャ

RAG の基本的な処理フローは以下のとおりです。

```
1. ユーザーのクエリを受け取る
2. クエリを埋め込みベクトルに変換する
3. ベクトルDBから類似度の高いチャンクを検索する（Retrieve）
4. 検索結果をコンテキストとしてプロンプトに付加する（Augment）
5. LLM が付加情報を踏まえて回答を生成する（Generate）
```

### チャンク分割戦略

ドキュメントを検索可能な単位に分割する「チャンキング」は、RAG の精度に大きく影響します。サーベイ論文では以下の主要な戦略を分類しています。

**Fixed-size Chunking**：単純に固定文字数で分割する方法。実装が簡単だが、文脈が途中で切れるリスクがある。

**Recursive Character Splitting**：段落→文→単語と優先順位を付けて、意味的な区切り目で分割する方法。LangChain の `RecursiveCharacterTextSplitter` が代表例。

**Semantic Chunking**：文の埋め込み類似度を基に、意味的に近い文をグループ化する方法。チャンクの意味的一貫性が高い反面、計算コストがかかる。

```python
# LangChain での実装例
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n\n", "\n", "。", ""],
)
chunks = splitter.split_text(document)
```

### 埋め込みモデルの選択

クエリとチャンクを同じベクトル空間に埋め込む「埋め込みモデル」も重要な選択肢です。

| モデル | 次元数 | 特徴 |
|--------|-------|------|
| OpenAI text-embedding-3-small | 1536 | バランスが良い。APIコストは比較的安価 |
| text-embedding-3-large | 3072 | 高精度。RAG精度最優先の場合に選択 |
| BGE-M3 | 1024 | オープンソース。多言語対応が強力 |
| Cohere embed-multilingual-v3 | 1024 | 多言語特化。日本語精度が高い |

日本語コンテンツを扱う場合は多言語対応モデルの選択が重要です。

### リランキング（Re-ranking）

ベクトル検索は高速ですが、意味的な類似度計算が粗い場合があります。**リランキング**は、取得した上位N件のチャンクをより精密なモデルで再スコアリングし、LLMに渡すチャンクの質を向上させます。

```python
# Cohere リランキングの例
import cohere

co = cohere.Client(api_key)
results = co.rerank(
    query=user_query,
    documents=retrieved_chunks,
    model="rerank-multilingual-v3.0",
    top_n=3,
)
```

リランキングを追加することで、RAG の精度が大幅に向上することが多くの実験で示されています。

### Advanced RAG の手法

サーベイ論文では、基本的な RAG を発展させた **Advanced RAG** 手法も整理しています。

- **HyDE（Hypothetical Document Embeddings）**: クエリから仮想的な「理想の回答」を生成し、その埋め込みで検索する
- **Multi-Query Retrieval**: 1つのクエリを複数の言い換えに展開し、それぞれで検索して結果を統合する
- **Self-RAG**: LLMが検索の必要性を自己判断し、必要な場合のみ検索を行う

## まとめ

RAG はハルシネーション対策と最新情報の活用を両立させる実用的なアプローチとして、企業での LLM 活用の中心的な技術になっています。本サーベイ論文はその全体像を体系的に整理しており、RAG システムを設計・改善する際の優れたリファレンスです。

チャンク分割・埋め込みモデル・リランキングの3点を適切に選択・チューニングすることが、実用的な RAG システム構築の鍵となります。
