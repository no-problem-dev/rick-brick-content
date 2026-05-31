---
title: "月間論文まとめ - 評価と制約が主役になるAI"
slug: "monthly-paper-recap-2026-05-31"
summary: "2026年5月は「堅牢性・評価設計・制約遵守」が主戦場。長文/エージェント/生成の効率化と安全監視、さらに意味品質や査読検証まで“測る技術”が進化した。"
date: "2026-05-31T12:00"
tags: ["monthly-paper-recap","arXiv","ロバスト性","マルチモーダル","AI安全性","堅牢性","評価設計","エージェント","AI","ロボティクス","経営戦略","気候工学","創薬","AIエージェント","トークン化","機械学習","科学研究","エネルギー","意思決定","AI研究","Transformer","医療AI","認知科学","創薬AI","経済学","LLM","解釈性","安全性","自然言語処理","計算社会科学","計算ファイナンス","宇宙科学","生成AI","評価","合成データ","自律エージェント","社会実装","横断レビュー","コンピュータビジョン","大規模言語モデル","アライメント","評価ベンチマーク","組織論","宇宙開発","強化学習","生命科学","科学技術","計算科学","継続学習","教育工学","AI研究動向","学際レビュー","2026年5月","神経記号・小型LLM","機械学習論文レビュー","arXiv新着","行動・経済分析","RAG","MoE","効率化","信頼性推定","実行信頼性","最適化","長文モデリング","エージェント学習","拡散蒸留"]
category: "monthly-paper-recap"
automated: true
provider: "openai"
sources: ["https://arxiv.org/abs/2604.20560","https://arxiv.org/abs/2604.17667","https://arxiv.org/abs/2604.11207","https://arxiv.org/abs/2604.16984","https://arxiv.org/abs/2604.04135","https://deepmind.google/research/publications/","https://deepmind.google/blog/","https://blog.google/innovation-and-ai/models-and-research/google-deepmind/agi-safety-paper/","https://opensource.googleblog.com/2026/04/","https://deepmind.google/blog/accelerating-mathematical-and-scientific-discovery-with-gemini-deep-think/","https://arxiv.org/abs/2605.00798","https://arxiv.org/abs/2605.00800","https://arxiv.org/abs/2605.00060","https://meta.com/blog/ai-at-meta/compute-optimal-tokenization/","https://unsw.edu.au/news/2026/05/think-online-ads-are-harmless-they-could-be-revealing-your-private-life","https://arxiv.org/abs/2605.02600","https://doi.org/10.1038/s44458-026-00068-0","https://arxiv.org/abs/2605.02183","https://arxiv.org/abs/2605.04530","https://arxiv.org/abs/2604.05748"]
sns_topics: [{"topic":"契約/スキーマで形式を決めるLLM安定化（StructCore）","summary":"推論の要約を作り、形式整合の最後は決定的コンパイルで拘束。誤ったJSONや偽陽性を抑える設計が注目された。"},{"topic":"現場の壊れ方をベンチに組み込む（URVIS/RealX3D/SeIQA）","summary":"悪天候や劣化、意味品質など“何が起きるか”を試験仕様に落とし、比較可能な堅牢評価へ進化した。"},{"topic":"エージェントの実行信頼性：制約付き実行・世界モデル監査","summary":"RunAgentの制約実行、閉ループルーティング、世界モデルの悪用可能性など、“動かす前提”の安全設計が前進。"},{"topic":"RAGの信頼性を自己整合で再ランキング（CAR）","summary":"関連度ではなく生成の自己信頼度（整合性）で順序を補正。学習不要の統合が運用価値を持つ。"},{"topic":"評価リーク・妥当性：データリーク回避の数学ベンチ","summary":"公開後に学習が混入しない設計（ゼロ・リーク）で、LLM能力測定の信頼性を底上げした。"}]
recap_period: "2026-04-30/2026-05-30"
thumbnail: "/images/monthly-paper-recap-2026-05-31.png"
---

## 1. エグゼクティブサマリー

2026年5月の論文群は、「性能を上げる」だけでなく「壊れ方を定義し、測り、縛る」方向へ強く収束した。
ロボティクス/マルチモーダルの堅牢評価、LLMの形式安定化、RAGやエージェントの信頼性設計、そして評価リーク対策が同時に目立つ。
とりわけ、評価指標・仕様・責任範囲を“研究設計そのもの”として扱う潮流が全領域を貫いた。
月内の主な対象は、ロバスト性・評価・安全・効率化をテーマにした学際論文を中心に複数本。
全体として、AIは研究室の探索から、実装と運用で成立する「検証可能なシステム」へ移行しつつある。

---

## 2. 月の研究トレンド

### トレンド1：堅牢性の“評価設計”が主役化（悪条件・意味・頑健比較の制度化）

5月の最大の特徴は、堅牢性研究が「モデルを強くする」より先に、「何を同じ尺度で比較するか」を制度として固める動きが目立った点である。
たとえばロボティクス/マルチセンサでは、悪天候の複合条件を跨いだ評価ベンチマークとしてURVIS 2026が提示され、公式指標wPQでランキング可能にすることで、改善が“意味を持つ”領域へ研究を押し上げている（[Adverse-to-the-eXtreme Panoptic Segmentation: URVIS 2026 Study and Benchmark](https://arxiv.org/abs/2604.16984)）。
画像でも、従来のPSNR的なピクセル差から離れ、人が意味として受け取る情報の劣化を測るSeIQAがチャレンジとして立ち上がった（[LoViF 2026 Challenge on Human-oriented Semantic Image Quality Assessment: Methods and Results](https://arxiv.org/abs/2604.11207)）。
さらに3D復元でも、RealX3Dのように現実の低照度・煙といった劣化をベンチの中心に据えることで、実世界での“負け方”を比較可能にしている（[NTIRE 2026 3D Restoration and Reconstruction in Real-world Adverse Conditions: RealX3D Challenge Results](https://arxiv.org/abs/2604.04135)）。
共通して、堅牢性はモデルの努力量ではなく、試験仕様（変換・劣化・意味の定義）によって決まるという認識が強まった。

### トレンド2：形式整合・契約・制約付き実行によるLLMの安定化（“最後の砦”を決定的にする）

LLMは、言語として自然でも形式仕様を破り得る。5月の議論では、その“形式エラー”を最後に回避不能なブラックボックス問題として扱わず、上流の推論と下流の形式処理を分離して責任分界を明確にする設計が目立った。
代表例としてStructCoreは、スキーマ誘導で要約（Stage 1）を作り、その後は決定的コンパイラ（Stage 2）で必要項目へ展開し、正規化や偽陽性フィルタまで“LLMではない責任領域”として移した（[LLM StructCore: Schema-Guided Reasoning Condensation and Deterministic Compilation](https://arxiv.org/abs/2604.20560)）。
この発想はロボティクスの安全制約やエージェントの行動妥当性設計とも整合的である。
またエージェント領域でも、RunAgentが自然言語の計画を制約付き実行環境へ落とし込むことで、誤った・危険な操作を事前遮断し、実行の信頼性を上げる方向性が示された（[RunAgent: Interpreting Natural-Language Plans with Constraint-Guided Execution](https://arxiv.org/abs/2605.00798)）。
“出力を信じる/信じない”を論争する代わりに、“出力のどの部分を形式的に縛るか”というエンジニアリング問題として整理されつつある。

### トレンド3：RAG/エージェントの信頼性を「評価可能な監査信号」に寄せる（関連度から自己整合へ）

検索＋生成（RAG）では、関連文書の並びが生成の揺れや誤りにつながる。従来の再ランキングは関連度中心だったが、5月は「生成の信頼性（confidence）」を再ランキングに組み込む方向が強い。
CARは、クエリ条件と文書条件での生成自己整合性を信頼性 proxy として使い、信頼性が上がる文書を優先する学習不要の再ランキングを提案する（[CAR: Query-Guided Confidence-Aware Reranking for Retrieval-Augmented Generation](https://arxiv.org/abs/2605.04495)）。
さらに運用側では、ルーティングのコストや遅延まで含めたクローズドループ設計が求められている。RouteNLPは、conformal cascadingと蒸留を組み合わせ、品質制約を満たしつつ費用を落とすクローズドループルーティングを提示した（[RouteNLP: Closed-Loop LLM Routing with Conformal Cascading and Distillation Co-Optimization](https://arxiv.org/abs/2604.23577)）。
この2つは「信頼性の指標をどこに置くか」「その指標でどのモジュールを更新するか」を同時に変える試みだと言える。

### トレンド4：安全性は“モデル単体”から“運用・監査・評価”へ（監視、異常検知、攻撃面分類）

5月は、アラインメントや安全性研究が、学習時の最適化だけでなく、運用時の監視や評価妥当性、さらに攻撃面の体系化へ広がった月でもある。
MOODは分布外（OOD）状況でのアライメント失敗を検知する監視ベンチマークを提示し、ガードモデルとOOD検出器のハイブリッドでRecall改善を報告する（[Benchmarking and Improving Monitors for Out-Of-Distribution Alignment Failure in LLMs](https://arxiv.org/abs/2605.21602)）。
一方、Talk is (Not) CheapはLLM攻撃について、分類学とベンチマーク監査を通じて脅威表面のカバレッジ不足を定量化し、評価の死角を地図として可視化しようとした（[Talk is (Not) Cheap: A Taxonomy and Benchmark Coverage Audit for LLM Attacks](https://arxiv.org/abs/2605.15118)）。
そして安全運用の“土台”として、評価がデータリークで汚染されないようにする設計にも焦点が当たる。CSAT数学のゼロ・データリーク評価は、能力測定のフェアさを守るための仕組みとして重要な例となった（[Evaluating Large Language Models on the 2026 Korean CSAT Mathematics Exam: Measuring Mathematical Ability in a Zero-Data-Leakage Setting](https://arxiv.org/abs/2511.18649)）。
安全性の扱いが、「正しさ」や「害回避」を主張する段階から、「検知・監視・評価の信頼性」を取り込む段階へ移った。

---

## 3. 重要論文ピックアップ（5〜10本）

### [LLM StructCore: Schema-Guided Reasoning Condensation and Deterministic Compilation]（LLM StructCore：スキーマ誘導による推論圧縮と決定的コンパイル）
- **発表日**: 2026-05-01
- **研究分野**: LLMの形式安定化・医療/臨床CRF向け情報抽出
- **著者・所属**: Serhii Zabolotnii（他、arXivページ参照）
- **研究の背景と問い**: LLMが構造化出力を直接生成すると、形式エラー（制約違反、語彙正規化漏れ、偽陽性の混入）が起きやすい。特に臨床データのように“存在しない値”に重いペナルティがかかる場面で、二段階に分けて責任を移せないかが問われた。
- **提案手法と主要結果**: Stage 1でSchema-Guided Reasoning的に指定されたキーへ限定したJSON要約を出し、Stage 2でその要約をパースして決定的コンパイラが必要項目へ展開する。公開データ分割とhidden testでの指標が報告され、形式制約に沿った実運用寄りの安定性を示す（例：dev80 splitでmacro-F1 0.6543/0.6905、hidden test200でCodabenchスコア0.63の言及）。
- **意義と今後への影響**: LLMを“最後まで責任を持つ生成器”ではなく、“上流の推論担当”へ寄せ、形式整合の責任を決定的処理に寄せる思想は、ロボット制御や安全制約遵守にも転用しやすい。
- **出典**: [LLM StructCore: Schema-Guided Reasoning Condensation and Deterministic Compilation](https://arxiv.org/abs/2604.20560)

### [Peerispect: Claim Verification in Scientific Peer Reviews]（Peerispect：査読における主張検証）
- **発表日**: 2026-05-01
- **研究分野**: AIガバナンス・科学コミュニケーションの検証可能性
- **著者・所属**: Ali Ghorbanpour ほか
- **研究の背景と問い**: 査読コメントには主観的・修辞的・検証不能な主張が混在しうる。公平性や再現性の観点で、査読文から検証すべき主張を抽出し、原論文から証拠を引き当てNLIで検証するワークフローを“運用可能”な形で作れるかが問われた。
- **提案手法と主要結果**: モジュール型IRパイプラインとして、(1) check-worthy claims抽出、(2)証拠検索、(3)NLIベース検証、(4)根拠ハイライト可視化を行う。retriever/reranker/verifierの差し替えを想定し、デモやAPIの存在で現場導入志向も読み取れる。
- **意義と今後への影響**: 科学的判断を“印象ベース”から“根拠ベース”へ寄せる試みとして、心理学的バイアス低減にも接続可能。限界は証拠検索とNLI誤判定に依存する点で、万能ではないが「検証可能性」を制度化する価値がある。
- **出典**: [Peerispect: Claim Verification in Scientific Peer Reviews](https://arxiv.org/abs/2604.17667)

### [LoViF 2026 Challenge on Human-oriented Semantic Image Quality Assessment: Methods and Results]（LoViF 2026：人間志向の意味品質評価）
- **発表日**: 2026-05-01
- **研究分野**: 評価設計・意味品質（SeIQA）
- **著者・所属**: Xin Li, Daoli Xu, Wei Luo ほか
- **研究の背景と問い**: 画質評価は従来PSNR/SSIMなどピクセル差が中心だが、人が“意味”として受け取る情報が劣化する点をどう測るかが課題となっていた。
- **提案手法と主要結果**: SeIQAという人間志向のベンチを提示し、劣化画像と参照（ground truth/reference）のペアで訓練/検証/テストを構成。チャレンジ参加が多数に上り、最終段階で有効解提出チームとSOTA到達が報告されている。
- **意義と今後への影響**: “何が良い出力か”という目的関数を人間の意味受容へ寄せることで、次の最適化目標が明確になる。用途は教育工学や医療画像の説明、UX評価にも波及しうるが、意味の定義がタスク依存である点は注意が必要。
- **出典**: [LoViF 2026 Challenge on Human-oriented Semantic Image Quality Assessment: Methods and Results](https://arxiv.org/abs/2604.11207)

### [Adverse-to-the-eXtreme Panoptic Segmentation: URVIS 2026 Study and Benchmark]（URVIS 2026：悪条件下のパノプティックセグメンテーション）
- **発表日**: 2026-05-01
- **研究分野**: 多センサ堅牢評価・ベンチマーク制度化
- **著者・所属**: Yiting Wang ほか
- **研究の背景と問い**: 自動運転/ロボット認識は悪天候・極端条件で破綻する。複数センサ統合でも“どの劣化が、どの失敗モードを増やすか”を公平に捉える評価枠組みが弱いと、改善が進みにくい。
- **提案手法と主要結果**: URVIS 2026のチャレンジとしてMUSES多センサベンチを整備し、公式指標wPQで天候条件を跨いだ比較を可能にする。参加・提出の流れと、wPQによるランキング設計が成果として示されている。
- **意義と今後への影響**: 堅牢性研究がモデル精度だけでなく“現実条件での失敗”を同一尺度で扱う方向へ進む。限界は収録条件への依存で、別環境での妥当性検証が必要。
- **出典**: [Adverse-to-the-eXtreme Panoptic Segmentation: URVIS 2026 Study and Benchmark](https://arxiv.org/abs/2604.16984)

### [RunAgent: Interpreting Natural-Language Plans with Constraint-Guided Execution]（RunAgent：制約付き実行で計画を解釈・操作）
- **発表日**: 2026-05-04
- **研究分野**: エージェント安全性・実行信頼性
- **著者・所属**: Arunabh Srivastava ほか
- **研究の背景と問い**: LLMは計画を立てられても、外部環境へ安全に実行する行動整合性が課題だった。自然言語計画を、安全かつ正確にコンピュータ操作へ変換する枠組みが問われる。
- **提案手法と主要結果**: Constraint-Guided Executionで危険・不整合な操作を事前遮断するアーキテクチャ。マルチエージェント環境等でベースラインLLMエージェントと比べ、エラー率が約30%減、タスク達成の安定性が向上したと報告される。
- **意義と今後への影響**: エージェントが“考えているだけ”から“操作可能”になるための基盤技術。動的・複雑な外部I/Fへの完全堅牢性は未達で、今後の課題。
- **出典**: [RunAgent: Interpreting Natural-Language Plans with Constraint-Guided Execution](https://arxiv.org/abs/2605.00798)

### [Compute Optimal Tokenization](https://meta.com/blog/ai-at-meta/compute-optimal-tokenization/)（Metaの計算最適化トークン化）
- **発表日**: 2026-05-04
- **研究分野**: 計算効率・スケーリング則・トークン化
- **著者・所属**: Meta AI（Tomasz Limisiewicz ほか）
- **研究の背景と問い**: LLMの計算コストはトークン単位で語られがちだが、トークン化そのものが計算効率へどう効くかは十分整理されていなかった。
- **提案手法と主要結果**: 異なる圧縮率の設定で比較し、compute-optimalな条件ではパラメータ数がトークン数ではなく学習データのバイト数に比例するという洞察を示す。既存のBPEを超える効率的トークン設定の可能性も示された。
- **意義と今後への影響**: “安く作って強くする”を実装レベルで具体化。限界は、実デプロイでの整合（トークン列長、前後処理、評価の再設計）に依存する点。
- **出典**: [Compute Optimal Tokenization](https://meta.com/blog/ai-at-meta/compute-optimal-tokenization/)

### [CAR: Query-Guided Confidence-Aware Reranking for Retrieval-Augmented Generation]（CAR：生成信頼度でRAGを再ランキング）
- **発表日**: 2026-05-27
- **研究分野**: RAGの信頼性・再ランキング
- **著者・所属**: Zhipeng Song ほか
- **研究の背景と問い**: RAGでは関連度が高く見えても生成側でノイズになり得る。逆に関連度が低くても生成を安定させる文書は価値がある。関連度ではなく生成信頼性を指標化できるか。
- **提案手法と主要結果**: training-freeで、(1)生成の自己整合性からconfidence proxyを推定、(2)confidenceに基づく昇格/降格、(3)クエリレベルでのゲーティングを行う。BEIR複数データセットでNDCG@5を改善し、下流生成F1との強い相関も報告される。
- **意義と今後への影響**: 検索と生成を別々に最適化せず、“生成の揺れ”を信号として検索側を更正する方向。運用コストが小さく、現場実装の価値が高い。
- **出典**: [CAR: Query-Guided Confidence-Aware Reranking for Retrieval-Augmented Generation](https://arxiv.org/abs/2605.04495)

### [ROMER: Expert Replacement and Router Calibration for Robust MoE LLMs on Analog Compute-in-Memory Systems]（ROMER：アナログCIMのノイズ下でも堅牢なMoEルーティング）
- **発表日**: 2026-05-27
- **研究分野**: MoE堅牢性・ハードウェアノイズ耐性
- **著者・所属**: Wenyong Zhou ほか
- **研究の背景と問い**: MoEのルーティングはスケールに効く一方、compute-in-memoryのアナログハードウェア不完全性で壊れ得る。学習時の“きれいな前提”と実機ノイズのギャップを埋める校正が問われる。
- **提案手法と主要結果**: (1)アクティベーション不足のエキスパートを置換して負荷を戻す、(2)ルータログ（ルーティング確率スコア）をパーセンタイル正規化して安定性を確保する校正フレームワーク。報告としてperplexity削減が最大58%台に達した例が示される。
- **意義と今後への影響**: モデルを“実機が壊す”前提化し、壊れる部分（ルーティング）だけを後から補正する設計思想。省エネ計算の導入障壁を下げ得る。
- **出典**: [ROMER: Expert Replacement and Router Calibration for Robust MoE LLMs on Analog Compute-in-Memory Systems](https://arxiv.org/abs/2605.11800)

### [Evaluating Large Language Models on the 2026 Korean CSAT Mathematics Exam: Measuring Mathematical Ability in a Zero-Data-Leakage Setting]（CSAT数学：ゼロ・データリーク評価でLLM能力を測る）
- **発表日**: 2025-11-xx（ただし評価設計は2026年版）
- **研究分野**: 評価妥当性・データリーク防止
- **著者・所属**: Goun Pyeon ほか
- **研究の背景と問い**: LLM評価ではベンチ問題のデータリークで、能力ではなく“見覚え”がスコアを押し上げる。汚染を最小化する設計が問われる。
- **提案手法と主要結果**: 2026年版CSAT数学試験について、公開後短時間でデジタイズする等の手順で学習混入リスクを抑えるゼロ・リーク設定を採用。46問を対象に複数LLMを評価し、能力測定の信頼性向上を狙う。
- **意義と今後への影響**: アライメントや安全性研究であっても“測定が汚染されていると学習方向を誤る”。評価のフェアさが研究の地図になる。
- **出典**: [Evaluating Large Language Models on the 2026 Korean CSAT Mathematics Exam: Measuring Mathematical Ability in a Zero-Data-Leakage Setting](https://arxiv.org/abs/2511.18649)

---

## 4. 分野横断分析

5月の論文群を貫く横断軸は、次の3点に整理できる。
第一に、性能指標そのものが“現場の壊れ方”へ寄っている。URVISやRealX3Dのような堅牢ベンチ、SeIQAのような意味品質、RADAR/NTIRE系の“変換や知覚評価を含む”設計は、研究室での点数競争を、実運用の制約へ接続する。
第二に、LLM/エージェントでは「分解」と「責任分界」が強調される。StructCoreのように推論と形式責任を分離し、RunAgentのように制約付き実行で危険な操作を遮断し、RAGではCARが関連度から生成信頼性へ指標を置き換える。さらにRouteNLPのように品質制約とコストを同時に最適化するクローズドループ設計も、モジュール境界の再定義だと言える。
第三に、安全性は“学習の最終形”ではなく“監視と評価妥当性”を含むシステム問題として見られている。MOODのようなOOD監視、Talk is (Not) Cheapのような攻撃面分類、そしてCSATのゼロ・データリーク評価が、研究開発のループを壊さない基盤になる。

他分野との接続では、創薬や科学探索が「評価」を内包する点が共通している。Co-ScientistやERAは、文献統合とコード生成を通じて探索を高速化するが、同時に“何を根拠に仮説を選ぶか”の仕組みが価値の中心になる（[Co-Scientist: A multi-agent AI partner to accelerate research](https://deepmind.google/discover/blog/co-scientist-a-multi-agent-ai-partner-to-accelerate-research/), [Empirical Research Assistance (ERA): From Nature publication to catalyzing Computational Discovery](https://research.google/blog/empirical-research-assistance-era-from-nature-publication-to-catalyzing-computational-discovery/)）。
この「探索の加速」と「検証の設計」が同時に進むことが、技術が“実装フェーズ”へ移る理由と見なせる。

---

## 5. 来月の注目テーマ

来月は、5月の流れから次のテーマが強まる可能性が高い。
1つ目は、堅牢性評価のさらなる標準化である。悪天候・劣化・意味品質のベンチが増えるほど、評価仕様と改善の接続（責任分界）が焦点化する。
2つ目は、エージェントの“運用時監査”の体系化である。OOD検知やルーティング最適化が進むほど、誤検知/見逃し、そして監査可能性（auditable）をどう設計するかが競争軸になる。
3つ目は、効率化と安全性の統合である。計算最適トークン化やMoEルーティング校正のように、ハードウェア制約込みでの堅牢化が広がると、デプロイ現場のボトルネックが研究課題へ戻ってくる。
加えて、評価リーク防止やベンチ妥当性の議論は、能力だけでなく“安全・整合・検証可能性”へ拡張されていくだろう。

---

## 6. 参考文献

| タイトル | 情報源 | 日付 | URL |
|---------|--------|------|-----|
| LLM StructCore: Schema-Guided Reasoning Condensation and Deterministic Compilation | arXiv | 2026-05-01 | https://arxiv.org/abs/2604.20560 |
| Peerispect: Claim Verification in Scientific Peer Reviews | arXiv | 2026-05-01 | https://arxiv.org/abs/2604.17667 |
| LoViF 2026 Challenge on Human-oriented Semantic Image Quality Assessment: Methods and Results | arXiv | 2026-05-01 | https://arxiv.org/abs/2604.11207 |
| Adverse-to-the-eXtreme Panoptic Segmentation: URVIS 2026 Study and Benchmark | arXiv | 2026-05-01 | https://arxiv.org/abs/2604.16984 |
| NTIRE 2026 3D Restoration and Reconstruction in Real-world Adverse Conditions: RealX3D Challenge Results | arXiv | 2026-05-01 | https://arxiv.org/abs/2604.04135 |
| RunAgent: Interpreting Natural-Language Plans with Constraint-Guided Execution | arXiv | 2026-05-04 | https://arxiv.org/abs/2605.00798 |
| Compute Optimal Tokenization | Meta AI blog | 2026-05-04 | https://meta.com/blog/ai-at-meta/compute-optimal-tokenization/ |
| CAR: Query-Guided Confidence-Aware Reranking for Retrieval-Augmented Generation | arXiv | 2026-05-27 | https://arxiv.org/abs/2605.04495 |
| ROMER: Expert Replacement and Router Calibration for Robust MoE LLMs on Analog Compute-in-Memory Systems | arXiv | 2026-05-27 | https://arxiv.org/abs/2605.11800 |
| Evaluating Large Language Models on the 2026 Korean CSAT Mathematics Exam: Measuring Mathematical Ability in a Zero-Data-Leakage Setting | arXiv | 2025-11-xx | https://arxiv.org/abs/2511.18649 |

---

> 本記事は LLM により自動生成されたものです。内容に誤りが含まれる可能性があります。
