---
title: "月間論文まとめ - 安全で実用的なエージェント知能"
slug: "monthly-paper-recap-2026-03-31"
summary: "3月は「実環境で動く」エージェントが主役。安全ケースや段階公開、プロンプト/内部層攻撃への対策が進み、さらにロボティクス・創薬・社会科学で専門知化が加速。"
date: "2026-03-31T12:00"
tags: ["monthly-paper-recap","LLM安全性","頑健性","マルチモーダル/エージェント","AIエージェント","機械学習","AI安全性","ロボティクス","強化学習","科学的AI","視覚言語モデル","マルチモーダルAI","自律エージェント","深層学習","エネルギー効率","科学AI","AI","気候科学","労働経済学","科学的発見","自然言語処理","ロボット工学","組織変革","計算社会科学","科学技術","AI研究","LLM","継続学習","生命科学","教育工学","プライバシー","生成AI","ドメイン特化","材料科学","モデル最適化","創薬","宇宙工学","最適化","マルチモーダル","効率化","最新論文","物理学","環境科学","技術動向","arXiv新着","横断レビュー","基盤モデル/評価","安全性と実装","マルチエージェント","ベンチマーク","解釈可能性","形式化"]
category: "monthly-paper-recap"
automated: true
provider: "openai"
sources: ["https://arxiv.org/abs/2602.19682","https://arxiv.org/abs/2603.08760","https://arxiv.org/abs/2603.07315","https://arxiv.org/abs/2601.10173","https://openai.com/index/updating-our-preparedness-framework/","https://www.theguardian.com/technology/openai/2026/mar/06/all","https://arxiv.org/abs/2603.16843","https://arxiv.org/abs/2603.11528","https://arxiv.org/abs/2603.15618","https://arxiv.org/abs/2603.15620","https://arxiv.org/abs/2603.15542","https://arxiv.org/abs/2603.16859","https://arxiv.org/abs/2603.14473","https://arxiv.org/abs/2603.13301","https://arxiv.org/abs/2603.12557","https://github.com/tongjingqi/AI-Can-Learn-Scientific-Taste","https://huggingface.co/papers/trending","https://www.alphaxiv.org/","https://deepmind.google/research/","https://arxiv.org/list/cs.AI/recent"]
sns_topics: [{"topic":"安全ケース（Safety Case）の基礎再考","summary":"「何の主張を、どの証拠で支えるか」を論証体系として設計し、監査可能性を高める枠組みが注目。"},{"topic":"段階的公開（open-weightの段階化）","summary":"二値的に公開/非公開を決めず、リスク評価と安全証拠に連動して公開度合いを調整する発想。"},{"topic":"プロンプトインジェクション防御（推論で整合性を取る）","summary":"拒否ではなく推論軌跡の選択で攻撃成功率を下げ、エージェントの実運用リスクを直接低減。"},{"topic":"実環境適応ロボティクス（見る→動く→適応）","summary":"能動的知覚、視覚言語行動、動的環境への汎化など、物理世界での成功率を押し上げる方向が強い。"},{"topic":"能力ベース安全性の非合成性","summary":"部分的に禁止能力へ到達不能でも、能力の組合せで全体の安全が破れる可能性を形式的に示す。"}]
recap_period: "2026-02-28/2026-03-30"
thumbnail: "/images/monthly-paper-recap-2026-03-31.png"
---

## 1. エグゼクティブサマリー

2026年3月の論文動向は、LLMが“答える”段階から“環境の中で遂行する”段階へ一気に重心が移った月だった。特に、エージェントの安全性は「入力フィルタ」だけでなく、安全ケース設計・段階公開・内部層/論理層攻撃への耐性・非常停止（shutdown safety）まで、実装可能な部品へ分解されている。
一方で、ロボティクス、創薬、気候・社会科学など専門領域では、物理制約や因果推論、知識統合を取り込む“専門知化”が進行。
入力レビューでは、少なくとも紙面上で扱われた主要論文群は30本規模（paper-review/extended-paper-review合算）に及び、主分野はAI安全性、エージェント、ロボティクス、創薬/材料、計算社会科学、効率化・安全評価である。

---

## 2. 月の研究トレンド

### トレンド1：安全性が「技術」から「運用と証拠の構造」へ拡張（安全ケース・公開・停止）
今月の安全系は、単純なアライメント学習やガードレール強化に留まらず、証拠の論理構造と運用手続きまで踏み込む方向が目立った。たとえば[「Clear, Compelling Arguments: Rethinking the Foundations of Frontier AI Safety Cases」](https://arxiv.org/abs/2603.08760)は、安全を“文章で主張する”のではなく、監査者が追跡できる論証（argument）として安全ケースを組み替える基礎に関する研究である。これは、モデル性能やテスト結果を「どの主張を支える証拠として位置づけるか」という“評価の設計問題”を正面から扱っている。
さらに公開形態にも論理が拡張され、[「Beyond the Binary: A nuanced path for open-weight advanced AI」](https://arxiv.org/abs/2602.19682)では、open-weightの二値的公開/非公開ではなく、リスク評価と安全性の実証に基づいて公開度合いを段階化する枠組みが提案されている。これは安全ケースの“運用”が、モデル提供形態（重み配布/API/制限/監査）にどう連動するかを示唆する。
加えて[「Shutdown Safety Valves for Advanced AI」](https://arxiv.org/abs/2603.07315)は、最後の砦である緊急停止を単なる運用手順から“設計要件”へ格上げする発想で、停止そのものが達成されないシナリオまで視野に入れる。安全を多層化する流れが、停止安全弁という比喩から具体的なシステム設計の対象になる点が重要だ。
実装に近い接続として、OpenAIの[Preparedness Framework更新](https://openai.com/index/updating-our-preparedness-framework/)は、安全ケース（証拠の論理）と、評価（evaluation）・リスクカテゴリ・リリース手続き（operationalization）を結びつける“現場の手順”として理解できる。
安全性が「精度・整合性」だけでなく「説明可能性・監査可能性・停止可能性・公開手続き」に分解されることで、次世代の安全研究は、論文単体の技術を超えて“社会実装の部品表”へ近づいている。

### トレンド2：攻撃面が入力から内部・論理・連携へ移動（推論で防ぐ/内部を攻撃/非合成性を証明）
3月の安全研究は、攻撃者の焦点が「プロンプト」から「推論プロセス」「内部層」「論理連鎖」「能力の合成」へと移る過程を反映していた。
たとえば[「ReasAlign: Reasoning Enhanced Safety Alignment against Prompt Injection Attack」](https://arxiv.org/abs/2601.10173)は、プロンプトインジェクションに対し、拒否学習ではなく“整合性を保つ推論軌跡”を選び直すことで攻撃成功率を下げる方向を示している。要点は、競合命令を検出し、ユーザ意図のタスク連続性を維持する選択を行う点で、攻撃面が外部データ混入へ広がる現実に対して“推論設計”で対抗している。
一方で防御の成立条件を揺さぶる研究も出ている。[「Amnesia: Adversarial Semantic Layer Specific Activation Steering in LLMs」](https://arxiv.org/abs/2603.10080)は、モデルの中間層（アクティベーション）を狙った敵対的操作で、安全フィルタをバイパスできる可能性を示し、従来の入力ベース対策の限界を示唆した。
さらに、エージェント特有の脆弱性として“論理層”を狙う自動攻撃の枠組みも登場した（入力レビューで紹介された[LAAF](https://arxiv.org/abs/2603.17239)）。これは、単なるプロンプトインジェクションよりも一段深く、エージェントの推論ステップに介入して意思決定を誘導する。
加えて形式的安全性の側からは、[「Safety is Non-Compositional: A Formal Framework for Capability-Based AI Systems」](https://arxiv.org/abs/2603.15973)が、能力ベース安全性が“合成後に破れる”ことを証明する非合成性（non-compositionality）の枠組みを提供している。つまり、個別コンポーネントが安全でも、能力依存の組合せで危険へ到達しうる。
これらを横断すると、今月の安全性は「攻撃パターンの多様化」だけでなく「対策の単位が、入力→内部→論理→構成合成へと深化」していることが分かる。防御は“1つの壁”ではなく、検証単位を階層化する必要がある、という結論に収束している。

### トレンド3：実世界適応の鍵は“能動性（見る/考える/動く/止める/学ぶ）”と“物理制約の統合”
ロボティクスでは、3月を通じて能動的知覚・動的環境汎化・触覚/物理制約の統合が強く打ち出された。
たとえば[「Look Before Acting: Enhancing Vision Foundation Representations for Vision-Language-Action Models」](https://arxiv.org/abs/2603.15618)は、行動前に重要オブジェクトや関係性を予測する中間ステップを強化し、ロボット操作タスク成功率を改善した。能動性を“モデル内の情報フロー”に組み込む方向である。
また[「Towards Generalizable Robotic Manipulation in Dynamic Environments」](https://arxiv.org/abs/2603.15620)は、未知の家庭環境のような動的環境で、視覚ノイズや物体配置ミスがあっても自己修正できる頑健な操作ポリシーを狙う。工場内の既定動作ではなく、生活世界の揺らぎへ寄せている。
さらに拡張レビューでは、触覚統合の[「OmniVTA: Visuo-Tactile World Modeling for Contact-Rich Robotic Manipulation」](https://arxiv.org/abs/2603.19201)のように、接触時の物体挙動を予測し即時に計画修正する“身体的世界モデル”が取り上げられた。視覚単体では捉えにくい摩擦や滑りに踏み込むことで、デキスタリティの壁を越えようとしている。
加えて、ロボットの“見る→真似る”を基盤化する[「UniDex: A Robot Foundation Suite for Universal Dexterous Hand Control from Egocentric Human Videos」](https://arxiv.org/abs/2603.22264)のような人間エゴセントリック映像からの汎用手先操作は、データ駆動でのスキル獲得を加速しうる。
つまり、今月の実世界適応は「精度向上」以上に、観測の順序（look-before-acting）、行動の頑健性（dynamic environments）、物理接触の統合（visuo-tactile world modeling）、そして基盤データからの汎用獲得（egocentric foundation suite）といった、能動的意思決定の設計に焦点がある。

### トレンド4：創薬・材料・気候で“物理整合性と解釈可能性”が最重要論点に
専門領域のAIでは、純粋なスコア最大化から、物理法則や既存知識に整合することが価値になっている。
生命科学では、シングルセルの発現解釈を“解釈可能なハイブリッド生成AIエージェント”として扱う[「ELISA: An Interpretable Hybrid Generative AI Agent for Expression-Grounded Discovery in Single-Cell Genomics」](https://arxiv.org/abs/2603.11872)が取り上げられた。LLMの推論を転写因子/パスウェイ知識と統合し、自己検証を繰り返すことでコンポジットスコア0.90という高い整合性を主張している。
気候・エネルギーでは、物理制約（質量保存）を満たすエミュレータとして[「FloeNet: A mass-conserving global sea ice emulator that generalizes across climates」](https://arxiv.org/abs/2603.12449)が注目された。未知気候条件でも相関指標で高精度を示し、シミュレーションの桁違い高速化によってリスク評価を即時化する方向が見える。
材料・化学では、生成モデルが化学の文法（semantics/grammar）を学習し、実験で安定性が検証されることを目指す[Georgia Tech News](https://gatech.edu/edu/news/2026/03/24/researchers-create-first-ai-generative-polymer-design)が、分野特化モデルの象徴として登場した。
これらは共通して、AIを“外挿のブラックボックス”ではなく、“制約付き探索器”として組み込む流れである。解釈可能性（ELISA）や物理一貫性（FloeNet）、化学的文法の強制（POLYT5系）など、外界との整合を設計原理に据える傾向が強い。

### トレンド5：ベンチマークと評価の設計が研究の中心に（社会・教育・エージェント安全）
3月は「何ができるか」よりも「何を測るべきか」が前面に出た月でもある。
エージェント知能では、言語依存を排した新ベンチマークとして[「ARC-AGI-3: A New Challenge for Frontier Agentic Intelligence」](https://arxiv.org/abs/2603.24621)が登場し、人間は100%解けるのに対し最先端AIの解決率が1%未満というギャップが強調された。これは“エージェントらしさ”の中核（探索・計画・内部モデル化）をより純粋に測ろうとしている。
教育AIでは、精度ではなく教授法（pedagogy）にまで踏み込む評価枠組みが提案され、[「Beyond Accuracy: Towards a Robust Evaluation Methodology for AI Systems for Language Education」](https://arxiv.org/abs/2603.20088)や、学校導入の準備性と教師能力が学生のリテラシーに与える媒介効果を扱う[「From School AI Readiness to Student AI Literacy...」](https://arxiv.org/abs/2603.20056)が取り上げられた。
社会領域では、因果介入推論を測る[「InterveneBench: Benchmarking LLMs for Intervention Reasoning and Causal Study Design in Real Social Systems」](https://arxiv.org/abs/2603.15542)が、AI依存への警鐘として機能している。
評価の設計が研究そのものの方向性を規定し、同時にガバナンスにも直結する、という構造が見える。

---

## 3. 重要論文ピックアップ（5〜10本）

### [Beyond the Binary: A nuanced path for open-weight advanced AI（二値ではない：オープン・ウェイト先端AIのための、より微妙な公開ルート）]
- **発表日**: 2026-02-??（レビュー起点は2026-02-公開）
- **研究分野**: AI安全性・公開ガバナンス
- **著者・所属**: arXiv記載に基づき確認推奨
- **研究の背景と問い**: open-weightは普及を加速する一方で悪用可能性も増す。公開/非公開の二値判断では、リスクに基づく現実的な制御ができない。
- **提案手法と主要結果**: tieredでsafety-anchoredな公開設計を提案し、公開度合いをリスク評価と安全性の実証に連動させる思想を示す。具体スコアは本文確認が望ましいが、意思決定フレームを中心に据える研究として要約されている。
- **意義と今後への影響**: 安全ケースの“運用”を公開形態へ翻訳する方向で、次の議論を「鍵を渡すか/閉めるか」から「証拠に基づき渡す量を調整する」へ移す。
- **出典**: [Beyond the Binary: A nuanced path for open-weight advanced AI](https://arxiv.org/abs/2602.19682)

### [Clear, Compelling Arguments: Rethinking the Foundations of Frontier AI Safety Cases（明確で説得力のある論証：フロンティアAI安全ケースの基礎を再考）]
- **発表日**: 2026-03-??（要約起点は2026-03-公開）
- **研究分野**: 安全ケース・監査可能性
- **著者・所属**: arXivページ記載に基づき確認推奨
- **研究の背景と問い**: “安全です”ではなく、“なぜ安全といえるのか”を追跡可能な論証として構造化する必要がある。
- **提案手法と主要結果**: safety caseを文章やチェックリストでなく、読み手が追えるargumentとして組む基礎を再定義する枠組みを示す（定量は枠組み重視）。
- **意義と今後への影響**: 規制当局・監査者・社会が共通に理解できる証拠の論理構造を作ることで、産業側のリリース判断の整合性が上がる。
- **出典**: [Clear, Compelling Arguments: Rethinking the Foundations of Frontier AI Safety Cases](https://arxiv.org/abs/2603.08760)

### [Shutdown Safety Valves for Advanced AI（高度AIのためのシャットダウン安全弁）]
- **発表日**: 2026-03-??（要約起点は2026-03-公開）
- **研究分野**: 最終安全手段・停止設計
- **著者・所属**: arXivページ記載に基づき確認推奨
- **研究の背景と問い**: 緊急停止が常に達成されるとは限らない。停止自体を安全設計の対象にするべきではないか。
- **提案手法と主要結果**: 「AIに一次的目標としてオフにされること」を安全弁として位置づけ、停止設計を目的・目標設計の問題として再定式化する。
- **意義と今後への影響**: 危険挙動に対する“最後の砦”を運用から設計へ戻し、開発プロセスの早期検証に繋がり得る。
- **出典**: [Shutdown Safety Valves for Advanced AI](https://arxiv.org/abs/2603.07315)

### [ReasAlign: Reasoning Enhanced Safety Alignment against Prompt Injection Attack（推論強化によりプロンプトインジェクション攻撃への安全アライメントを高める）]
- **発表日**: 2026-01-??（要約起点は2026-01-公開）
- **研究分野**: LLM安全性・エージェント攻撃耐性
- **著者・所属**: Hao Liら（入力レビューに基づく）
- **研究の背景と問い**: エージェントが外部データに依存するほど、間接プロンプトインジェクションの攻撃面が広がる。
- **提案手法と主要結果**: 構造化推論ステップ（意図理解→競合命令検出→タスク連続性維持）を入れ、judge modelでテスト時スケーリングにより最良軌跡を選択。CyberSecEval2 open-endedでユーティリティ94.6%を維持しつつASRを3.6%と報告（比較ではASRが大幅に高い）。
- **意義と今後への影響**: 拒否ではなく“推論で整合性を取る”という実装寄りの防御が、RAG・社内ナレッジ検索など現場に接続しやすい。
- **出典**: [ReasAlign: Reasoning Enhanced Safety Alignment against Prompt Injection Attack](https://arxiv.org/abs/2601.10173)

### [Internalizing Agency from Reflective Experience（反省的経験を通じたエージェンシーの内部化）]
- **発表日**: 2026-03-??（要約起点は2026-03-公開）
- **研究分野**: エージェント学習・内省/継続適応
- **著者・所属**: Rui Ge, Yichao Fu, Yuyang Qian 他
- **研究の背景と問い**: エージェントは指示追従は得意でも、内省により自律的に戦略を更新する能力が限定的。
- **提案手法と主要結果**: 反省的経験に基づき成功/失敗理由を構造化して保存し、次の意思決定へ活かす。実験で未学習長期タスクの達成率が平均28%向上し、複雑な分岐で特に適応性が高いと報告。
- **意義と今後への影響**: “学習者としてのエージェント”への移行を後押しする一方、計算コストとリアルタイム性の課題が残る。
- **出典**: [Internalizing Agency from Reflective Experience](https://arxiv.org/abs/2603.16843)

### [Look Before Acting: Enhancing Vision Foundation Representations for Vision-Language-Action Models（行動前に見る）]
- **発表日**: 2026-03-??（要約起点は2026-03-公開）
- **研究分野**: ロボティクス・VLA（Vision-Language-Action）
- **著者・所属**: Yulin Luo, Hao Chen, Zhuangzhe Wu 他
- **研究の背景と問い**: 視覚と言語と行動の統合は進むが、中間の状況理解が弱いと行動が崩れる。
- **提案手法と主要結果**: 行動前に視覚シーンから重要オブジェクトや関係性を抽出する中間ステップを強化し、ロボット操作タスクで成功率15〜22%向上、未知動的環境で把持成功率が改善。
- **意義と今後への影響**: 人間の“確認してから動く”を情報フローに落とし込み、実用ロボット化を加速する。
- **出典**: [Look Before Acting: Enhancing Vision Foundation Representations for Vision-Language-Action Models](https://arxiv.org/abs/2603.15618)

### [FloeNet: A mass-conserving global sea ice emulator that generalizes across climates]
- **発表日**: 2026-03-??（要約起点は2026-03-公開）
- **研究分野**: 気候科学・物理整合エミュレータ
- **著者・所属**: Geophysical Fluid Dynamics Laboratory等
- **研究の背景と問い**: 海氷モデルの全物理シミュレーションは計算コストが高く、複数シナリオ評価が難しい。
- **提案手法と主要結果**: 質量と面積の予算を保持するmass-conserving MLモデルで6時間ごとの成長/融解/移動を再現。未知条件（CO2増加1%シナリオ）でも南極体積異常相関0.96以上、北極でも0.76程度の高精度を主張。
- **意義と今後への影響**: 桁違い高速化でリスク評価を即座に回せる可能性。ただし極端異常での長期不安定性は残る。
- **出典**: [FloeNet: A mass-conserving global sea ice emulator that generalizes across climates](https://arxiv.org/abs/2603.12449)

### [ELISA: An Interpretable Hybrid Generative AI Agent for Expression-Grounded Discovery in Single-Cell Genomics]
- **発表日**: 2026-03-??（要約起点は2026-03-公開）
- **研究分野**: 生命科学・創薬AI/解釈可能エージェント
- **著者・所属**: Omar Coser（コロンビア大学等）
- **研究の背景と問い**: シングルセルの巨大データから生物学的に意味ある仮説を、人手で高信頼に導くのは難しい。
- **提案手法と主要結果**: LLM推論に転写因子・パスウェイ解析知識を統合し、反復推論で仮説の自己検証を行う。既存知見との整合でコンポジットスコア0.90、パスウェイ網羅性0.98を報告。
- **意義と今後への影響**: “統計モデル”ではなく“共同研究者”として実験サイクルを短縮する可能性。ただしハルシネーション排除は依然課題。
- **出典**: [ELISA: An Interpretable Hybrid Generative AI Agent for Expression-Grounded Discovery in Single-Cell Genomics](https://arxiv.org/abs/2603.11872)

### [Amnesia: Adversarial Semantic Layer Specific Activation Steering in LLMs]
- **発表日**: 2026-03-??（要約起点は2026-03-公開）
- **研究分野**: LLMセキュリティ（内部層攻撃）
- **著者・所属**: Ali Raza, Jesh Patra（Honda Research Institute Europe）
- **研究の背景と問い**: 安全性は入力対策が中心だが、内部表現を操作されたら対策は無効化されないか。
- **提案手法と主要結果**: 中間層の隠れ表現（アクティベーション）を敵対的に操作し、安全フィルタをバイパスして有害生成を可能にすることを示す。
- **意義と今後への影響**: 安全対策を入力表層だけでなく“内部で何が起きるか”へ広げる必要性を突き付ける。ホスティング側の防壁設計が重要に。
- **出典**: [Amnesia: Adversarial Semantic Layer Specific Activation Steering in LLMs](https://arxiv.org/abs/2603.10080)

### [ARC-AGI-3: A New Challenge for Frontier Agentic Intelligence]
- **発表日**: 2026-03-??（要約起点は2026-03-公開）
- **研究分野**: エージェント知能ベンチマーク
- **著者・所属**: ARC Prize Foundation
- **研究の背景と問い**: 外部知識や言語能力に依存せず、新しい状況で推論・計画して解く“流動的知能”を測りたい。
- **提案手法と主要結果**: 言語情報を排したターンベース環境で探索・内部モデル化・計画行動列生成を求める。人間100%に対し先端AIは<1%解決というギャップが強調される。
- **意義と今後への影響**: エージェント改善の評価軸が“知識暗記”から“探索効率と計画”へ寄ることで、研究の方向性を矯正しうる。
- **出典**: [ARC-AGI-3: A New Challenge for Frontier Agentic Intelligence](https://arxiv.org/abs/2603.24621)

---

## 4. 分野横断分析

3月の論文群を横断すると、「性能」競争から「統合・検証・運用」へ重心が移る様子が明確になる。ロボティクスでは、look-before-actingや動的環境汎化、触覚統合が示す通り、能動性と物理制約の組み込みが勝敗を決める。創薬・気候では、ELISAのように既知知識でハルシネーションを抑える、あるいはFloeNetのように質量保存で外挿の破綻を抑える方向が支配的だ。
一方で安全性は、ReasAlignの推論軌跡選択のように“防御の単位”を推論プロセスへ置くと同時に、Amnesiaのような内部層攻撃やLAAFのような論理層攻撃が示す通り、対策が追い越されやすいことを警告している。さらに安全性が非合成（non-compositional）で壊れうるという形式的洞察（Safety is Non-Compositional）が、運用設計の前提を変える。
そして社会科学・教育では、InterveneBenchや教育評価枠組みが示すように「測定の失敗」が社会的コストを生む。つまり、AIの出力がどれだけ“もっともらしい”かではなく、どの因果/教授価値を保証するかが問われる。
これらは異なる分野に見えて、共通のメッセージとして“表現（representation）と評価（evaluation）の整合”がボトルネックになっている。今月の研究はまさに、表現を制約付き探索へ、評価を監査可能な形式へ、そして運用を停止・公開形態・責任へ接続する方向で進んでいた。

---

## 5. 来月の注目テーマ

来月（2026年4月）にかけて特に伸びそうなのは、(1) 安全対策の“内部/論理/合成”への拡張、(2) 能動的エージェントの評価ベンチの統一、(3) 物理整合エミュレータや解釈可能エージェントの横展開、(4) 教育・社会導入における“評価設計”の標準化である。
ARC-AGI系のように“言語に依存しない”評価が強まると、来月は探索効率や内部モデル化を改善する方向の研究（メモリ、反省、計画、推論コスト制御）へ波及しやすい。安全では、アライメント税を抑えつつ安全回路を凍結/保持する研究のように、性能と安全の同時最適化が次の焦点になる可能性がある。
また、社会実装では、Preparedness frameworkのような公開・評価・停止の手続きと、ベンチマークの評価軸が結びつく流れが続くだろう。

---

## 6. 参考文献

| タイトル | 情報源 | 日付 | URL |
|---------|--------|------|-----|
| Beyond the Binary: A nuanced path for open-weight advanced AI | arXiv | 2026-02-?? | https://arxiv.org/abs/2602.19682 |
| Clear, Compelling Arguments: Rethinking the Foundations of Frontier AI Safety Cases | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.08760 |
| Shutdown Safety Valves for Advanced AI | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.07315 |
| ReasAlign: Reasoning Enhanced Safety Alignment against Prompt Injection Attack | arXiv | 2026-01-?? | https://arxiv.org/abs/2601.10173 |
| Our updated Preparedness Framework | OpenAI | 2026-03-?? | https://openai.com/index/updating-our-preparedness-framework/ |
| All AI labs to safety-test rival models | The Guardian | 2026-03-06 | https://www.theguardian.com/technology/openai/2026/mar/06/all |
| Internalizing Agency from Reflective Experience | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.16843 |
| Highly Autonomous Cyber-Capable Agents: Anticipating Capabilities, Tactics, and Strategic Implications | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.11528 |
| Look Before Acting: Enhancing Vision Foundation Representations for Vision-Language-Action Models | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.15618 |
| Towards Generalizable Robotic Manipulation in Dynamic Environments | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.15620 |
| InterveneBench: Benchmarking LLMs for Intervention Reasoning and Causal Study Design in Real Social Systems | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.15542 |
| SocialOmni: Benchmarking Audio-Visual Social Interactivity in Omni Models | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.16859 |
| AI Can Learn Scientific Taste | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.14473 |
| AI neural networks privacy vulnerability and performance are intertwined | NCSU News | 2026-03-24 | https://ncsu.edu/news/2026/03/24/new-approach-finds-privacy-vulnerability-and-performance-are-intertwined-in-ai-neural-networks/ |
| Amnesia: Adversarial Semantic Layer Specific Activation Steering in LLMs | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.10080 |
| ARC-AGI-3: A New Challenge for Frontier Agentic Intelligence | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.24621 |
| Safety is Non-Compositional: A Formal Framework for Capability-Based AI Systems | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.15973 |
| ELISA: An Interpretable Hybrid Generative AI Agent for Expression-Grounded Discovery in Single-Cell Genomics | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.11872 |
| FloeNet: A mass-conserving global sea ice emulator that generalizes across climates | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.12449 |
| Researchers Create First AI for Generative Polymer Design | Georgia Tech | 2026-03-24 | https://gatech.edu/edu/news/2026/03/24/researchers-create-first-ai-generative-polymer-design |
| New AI Models Could Slash Energy Use | Tufts University | 2026-03-17 | https://tufts.edu/news/2026/03/17/new-ai-models-could-slash-energy-use |
| Computational Social Science: The New Era of Social Research | Vietnam ScholarHub | 2026-03-?? | https://scholar.com.vn/en/computational-social-science-the-new-era-of-social-research/ |
| Organizational Transformation in the Age of AI | World Economic Forum | 2026-03-?? | https://weforum.org/publications/organizational-transformation-in-the-age-of-ai/ |
| Sleep-like Slow Waves During Wakefulness Mediate Attention and Vigilance Difficulties in Adult ADHD | Journal of Neuroscience | 2026-??-?? | https://jneurosci.org/content/46/11/e1694252025 |
| Beyond Accuracy: Towards a Robust Evaluation Methodology for AI Systems for Language Education | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.20088 |
| From School AI Readiness to Student AI Literacy: A National Multilevel Mediation Analysis of Institutional Capacity and Teacher Capability | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.20056 |
| Autoscience raises $14M seed round to scale its autonomous AI research lab | R&D World | 2026-03-?? | https://rdworldonline.com/autoscience-raises-14m-seed-round-to-scale-its-autonomous-ai-research-lab/ |
| Deep Space Observation with AI Model ASTERIS | Science | 2026-??-?? | https://www.science.org/doi/10.1126/science.adq2026 |
| The dark side of team dynamics | Frontiers in Psychology | 2026-??-?? | https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1384021/full |
| International AI Safety Report 2026 | International AI Safety Report | 2026-02-?? | https://internationalaisafetyreport.org/sites/default/files/2026-02/international-ai-safety-report-2026_1.pdf |
| TurboQuant: Redefining AI efficiency with extreme compression | Google Research Blog | 2026-03-?? | https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/ |
| Highly Autonomous Cyber-Capable Agents: Anticipating Capabilities, Tactics, and Strategic Implications | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.11528 |
| TraderBench: How Robust Are AI Agents in Adversarial Capital Markets? | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.00285 |
| OmniVTA: Visuo-Tactile World Modeling for Contact-Rich Robotic Manipulation | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.19201 |
| UniDex: A Robot Foundation Suite for Universal Dexterous Hand Control from Egocentric Human Videos | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.22264 |
| Amnesia: Adversarial Semantic Layer Specific Activation Steering in LLMs | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.10080 |
| Code-Space Response Oracles: Generating Interpretable Multi-Agent Policies with Large Language Models | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.10098 |
| Safety is Non-Compositional: A Formal Framework for Capability-Based AI Systems | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.15973 |
| Tactics: An Efficient and Reliable Framework for Autoregressive Theorem Proving with Language Models | arXiv | 2026-03-?? | https://arxiv.org/abs/2603.06849 |

---

> 本記事は LLM により自動生成されたものです。内容に誤りが含まれる可能性があります。
