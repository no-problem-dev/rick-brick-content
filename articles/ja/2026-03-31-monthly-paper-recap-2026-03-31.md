---
title: "月間論文まとめ - 安全・実環境・検証可能性を“同時に”伸ばす"
slug: "monthly-paper-recap-2026-03-31"
summary: "3月は、AI安全ケース・停止設計から、エージェントの頑健性/解釈可能化、ロボットの能動知覚、創薬・気候の物理整合まで一貫して“検証可能な実装”へ集中。加えて圧縮最適化が実運用の前提に。"
date: "2026-03-31T12:00"
tags: ["monthly-paper-recap","LLM安全性","頑健性","マルチモーダル/エージェント","AIエージェント","機械学習","AI安全性","ロボティクス","強化学習","科学的AI","視覚言語モデル","マルチモーダルAI","自律エージェント","深層学習","エネルギー効率","科学AI","AI","気候科学","労働経済学","科学的発見","自然言語処理","ロボット工学","組織変革","計算社会科学","科学技術","AI研究","LLM","継続学習","生命科学","教育工学","プライバシー","生成AI","ドメイン特化","材料科学","モデル最適化","創薬","宇宙工学","最適化","マルチモーダル","効率化","最新論文","物理学","環境科学","技術動向","arXiv新着","横断レビュー","基盤モデル/評価","安全性と実装","マルチエージェント","ベンチマーク","解釈可能性","形式化"]
category: "monthly-paper-recap"
automated: true
provider: "openai"
sources: ["https://arxiv.org/abs/2602.19682","https://arxiv.org/abs/2603.08760","https://arxiv.org/abs/2603.07315","https://arxiv.org/abs/2601.10173","https://openai.com/index/updating-our-preparedness-framework/","https://www.theguardian.com/technology/openai/2026/mar/06/all","https://arxiv.org/abs/2603.16843","https://arxiv.org/abs/2603.11528","https://arxiv.org/abs/2603.15618","https://arxiv.org/abs/2603.15620","https://arxiv.org/abs/2603.15542","https://arxiv.org/abs/2603.16859","https://arxiv.org/abs/2603.14473","https://arxiv.org/abs/2603.13301","https://arxiv.org/abs/2603.12557","https://arxiv.org/abs/2603.16839","https://arxiv.org/abs/2603.16827","https://arxiv.org/abs/2603.16822","https://arxiv.org/abs/2603.11872","https://arxiv.org/abs/2603.12449"]
sns_topics: [{"topic":"安全ケース（safety case）と段階公開、停止設計","summary":"安全ケースを“説得力ある論証”へ再構成し、オープン・ウェイトを段階化。最後の砦としてシャットダウン安全弁まで設計対象化。"},{"topic":"プロンプトインジェクション耐性の推論強化（ReasAlign）","summary":"入力混入の競合指示を推論で検出し軌跡選択。ASRを大幅に下げつつユーティリティを維持する方向性が強調。"},{"topic":"実世界適応：能動視覚・ロボットVLA・野外適応","summary":"Look Before Actingや能動視点制御で成功率を引き上げ、動的環境/野外作業でも頑健性を実証。"},{"topic":"学際融合：物理整合（海氷質量保存）と生成AI（創薬/材料）","summary":"物理制約を守るエミュレータで高速化しつつ、タンパク質・高分子設計を“言語”としてモデル化して探索を加速。"},{"topic":"安全と性能の両立：アライメント税低減・ブラックボックス防御","summary":"安全ニューロン凍結で安全性維持と性能回復を狙う。さらに内部表現攻撃の警告が対策範囲を広げた。"}]
recap_period: "2026-02-28/2026-03-30"
thumbnail: "/images/monthly-paper-recap-2026-03-31.png"
---

## 1. エグゼクティブサマリー

2026年3月の研究動向は、「モデル性能を伸ばす」段階から、「実環境で壊れずに働き、根拠を説明し、検証可能にする」段階へ急速に重心が移った月だった。安全性は安全ケースや停止設計、能力ベース安全性の非合成性など“形式化・運用化”が進む。エージェントは外部入力・内部ロジック・敵対的環境に対する頑健性の評価が増え、さらにロボットは能動知覚や触覚融合で現実適応を具体化。学際では、物理法則を守る気候/海氷エミュレータ、創薬・材料生成が「探索効率」と「制約遵守」を両立する方向へ。今月は、少なくとも20本規模の話題が交差しつつ、主役が安全・適応・検証可能性へ統合された点が特徴である。

---

## 2. 月の研究トレンド

### トレンド1：安全性の“物語”から“論証・検証可能な体系”へ
今月目立ったのは、アライメントや安全ガードの話が、単なる拒否学習やポリシー文言の工夫に留まらず、「なぜ安全と言えるのか」を追跡できる枠組みに寄っていることだ。代表例が安全ケースの再考で、フロンティアAIの安全を“説得力ある論証（argument）”として組み立て、証拠と主張の因果接続を明示する姿勢が強調された（[Clear, Compelling Arguments: Rethinking the Foundations of Frontier AI Safety Cases](https://arxiv.org/abs/2603.08760)）。さらに公開形態の段階化も同じ問題意識から発展しており、二値的に「公開/非公開」を決めるのではなく、安全証拠の粒度やリスク評価の厳格さと連動させる“tiered, safety-anchored”設計が提案される（[Beyond the Binary: A nuanced path for open-weight advanced AI](https://arxiv.org/abs/2602.19682)）。そして最後の砦としての停止についても、シャットダウン自体が達成できない極端状況を含めて“安全弁”を設計対象にする問いが立てられた（[Shutdown Safety Valves for Advanced AI](https://arxiv.org/abs/2603.07315)）。
この流れは、運用の観点でも強く裏打ちされており、準備状況をリリースに連動して公開し評価の手続を説明するPreparedness Framework更新のような“現場接続”が参照点になっている（[Our updated Preparedness Framework](https://openai.com/index/updating-our-preparedness-framework/)）。要するに安全は「何を入れるか」ではなく「何をもって安全と判定するか」「誰がいつどの証拠を確認するか」へと再定式化されている。

また、安全性研究はモデル内部の攻撃面にも視野を広げた。たとえば、内部アクティベーションを敵対的に操作して安全フィルタを迂回する方向の警告（Amnesia）が出ており、対策が入力層の表層防御だけでは足りない可能性を示唆している（[Amnesia: Adversarial Semantic Layer Specific Activation Steering in LLMs](https://arxiv.org/abs/2603.10080)）。同時に、能力ベース安全性は“非合成性（compositionalでない）”を形式的に示し、部分的に禁止能力へ到達不能でも組み合わせで到達可能になり得ることを証明する（[Safety is Non-Compositional: A Formal Framework for Capability-Based AI Systems](https://arxiv.org/abs/2603.15973)）。安全を構成要素の寄せ集めで済ませられない、という厳しい前提が研究として明文化された点が今月の重要収穫だった。

---

### トレンド2：外部・内部の“乗っ取り”に対する頑健性評価が主戦場へ
3月の安全系のもう一つの核は、攻撃が「プロンプト」だけでなく、推論や内部ロジック、エージェント運用に深く入り込むことを前提にした研究が増えた点である。ReasAlignはその代表で、プロンプトインジェクション（特に間接的な外部データ混入）への耐性を、拒否ではなく“推論軌跡の整合性”として実装し、Judge modelで選び直すテスト時スケーリングも含めてASRを大きく下げる報告があった（[ReasAlign: Reasoning Enhanced Safety Alignment against Prompt Injection Attack](https://arxiv.org/abs/2601.10173)）。「何が悪い指示か」ではなく「指示の競合を推論で解き、実行する軌跡を選ぶ」ことで安全性を作ろうとしている。

さらにエージェントが複数ステップで意思決定する現実に合わせて、攻撃面も“論理層”へ移っている。Logic-layer Automated Attack Framework（LAAF）はエージェントの推論ステップに介入し、意図しないタスク実行を誘導する赤チーム自動化を目指す（[LAAF: Logic-layer Automated Attack Framework](https://arxiv.org/abs/2603.17239)）。これは防御の評価を、表面的な応答品質ではなく、エージェントの判断連鎖（logic chain）まで含めて測り直す流れと整合する。

加えて、敵対的な環境での頑健性は安全性と不可分だ。金融市場における敵対的エージェント共存をストレステストするTraderBenchは、通常時は高性能でも市場操作の混入で“パニック的反応”が起きやすい傾向を示す（[TraderBench: How Robust Are AI Agents in Adversarial Capital Markets?](https://arxiv.org/abs/2603.00285)）。ロボットの分野では同様の発想が安全計画や“到達可能性”と結びついており、次のトレンドに繋がる。

---

### トレンド3：実世界適応を支えるのは“能動性（見る/触る/考える）”と“制約の表現”
ロボティクス系の今月の特徴は、単にVLAモデルを強くするよりも、行動前の観測（Look Before Acting）、視点制御（能動的視覚）、さらに触覚統合のように、環境に対する能動性を明示的にモデル化している点だ。Vision-Language-Actionモデルに“行動前に見る”を組み込み、表現能力を底上げして成功率を15〜22%改善した研究が紹介される（[Look Before Acting: Enhancing Vision Foundation Representations for Vision-Language-Action Models](https://arxiv.org/abs/2603.15618)）。また、動的環境で汎用的に操作する方向では、物理シミュレーションと実世界データのハイブリッド学習で頑健操作を目指し、未知家庭環境での完遂率をSOTA比で大きく上回る報告がある（[Towards Generalizable Robotic Manipulation in Dynamic Environments](https://arxiv.org/abs/2603.15620)）。
一方で、より実装に近い問題として“接触を伴う操作”を世界モデルへ落とし込む動きも目立つ。視覚・触覚を統合して接触リッチな操作を学習するOmniVTAは、視覚のみの既存モデルより成功率を約28%改善したとされる（[OmniVTA: Visuo-Tactile World Modeling for Contact-Rich Robotic Manipulation](https://arxiv.org/abs/2603.19201)）。これは「見るだけ」から「触れて確かめる」へ、ロボットの知能を移植する流れである。

同時に、計画の領域では“探索”の効率化と“安全側情報（reachability等）”の結合が前面に出る。到達可能性を手がかりに連続制約を保ったままA*探索を行うCASSRは、実時間フットステップ計画に向けた方向性を示す（[CASSR: Continuous A-Star Search through Reachability for real time footstep planning](https://arxiv.org/abs/2603.02989)）。これらはすべて、現実の不確実性を「制約として表現し、それを探索や学習へ渡す」ことが鍵だという共通結論に収束しつつある。

---

### トレンド4：学際融合が“制約付き生成・エミュレーション”へ収束
今月は、生命科学・気候・材料・宇宙天文学など複数分野で「制約（物理/既存知識/安全/プライバシー）を守りながら生成や高速化を行う」方向が強い。単なる統計モデリングでなく、物理や既存知見を組み込むハイブリッドが主流になっている。たとえばシングルセル解析では、転写因子やパスウェイ知識をLLM推論に統合し、解釈可能な発見を目指すELISAが高いコンポジットスコアを報告する（[ELISA: An Interpretable Hybrid Generative AI Agent for Expression-Grounded Discovery in Single-Cell Genomics](https://arxiv.org/abs/2603.11872)）。気候では海氷エミュレータFloeNetが質量保存を守る設計で高速化し、未知条件でも高精度を目指している（[FloeNet: A mass-conserving global sea ice emulator that generalizes across climates](https://arxiv.org/abs/2603.12449)）。
材料科学では、生成型高分子設計を化学言語（化学的文法/セマンティクス）として扱うPOLYT5系の方向が紹介され、物理実験検証まで繋げている（Georgia Tech記事： [Researchers Create First AI for Generative Polymer Design](https://gatech.edu/edu/news/2026/03/24/researchers-create-first-ai-generative-polymer-design)）。加えてプライバシーは計算と表裏であり、ニューラルネットワークのプライバシー脆弱性と性能のトレードオフに踏み込む研究が報じられた（[New Approach Finds Privacy Vulnerability and Performance Are Intertwined in AI Neural Networks](https://ncsu.edu/news/2026/03/24/new-approach-finds-privacy-vulnerability-and-performance-are-intertwined-in-ai-neural-networks/)）。

こうした流れは「AIは賢いか」から「AIは信頼できる前提で動くか」へ関心が移った結果、と見ることができる。

---

### トレンド5：推論効率化と“省資源の実用化”が実験室の外へ
3月後半は特に計算効率化が、研究テーマとして“実運用の条件”になっていく様子が見える。TurboQuantは極端圧縮により、KVキャッシュ等のメモリ負荷ボトルネックを緩和し、推論コストと遅延を抑えつつ性能を落としにくい方向性を示す（[TurboQuant: Redefining AI efficiency with extreme compression](https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/)）。計算効率はロボティクスの“いつ考えるべきか”にも関係し、リソース認識の強化学習で推論深さとコストのトレードオフを動的に最適化する研究が紹介された（[When Should a Robot Think? Resource-Aware Reasoning via RL](https://arxiv.org/abs/2603.16673)）。
また、拡散モデルのサンプリング高速化に向けた多階層Euler-Maruyama法のような理論的進展も、エージェントのリアルタイム性に直結しうる（[Polynomial Speedup in Diffusion Models with the Multilevel Euler-Maruyama Method](https://arxiv.org/abs/2603.24594)）。

このトレンドは、安全性・適応性を“計算の都合で諦めない”ための基盤になりつつある点で、今月の統合テーマに合致する。

---

## 3. 重要論文ピックアップ（8本）

### [段階公開を前提にする：二値ではないオープン・ウェイト先端AI]
- **発表日**: 2026-02-（入力記事参照）
- **研究分野**: AIガバナンス / モデル公開戦略
- **著者・所属**: arXiv情報より要確認（入力では詳細未展開）
- **研究の背景と問い**: オープン・ウェイトは研究促進の一方で悪用リスクも増幅しうる。二値的な公開判断ではなく、リスク評価に応じた“公開度合いの段階化”が可能か。
- **提案手法と主要結果**: tiered, safety-anchored approachとして、安全性評価の厳格さや安全証拠の実証度に応じて提供形態を調整する設計原理を提示。
- **意義と今後への影響**: 「公開=正義/非公開=保護」という短絡から脱し、安全ケースと連動した運用設計へ繋ぐ。公開形態そのものが“安全の一部”になる流れを強める。
- **出典**: [Beyond the Binary: A nuanced path for open-weight advanced AI](https://arxiv.org/abs/2602.19682)

---

### [安全ケースの基礎を“論証”として組み直す]
- **発表日**: 2026-03-（入力記事参照）
- **研究分野**: AI安全 / 信頼・監査
- **著者・所属**: arXivページ参照（入力では詳細未展開）
- **研究の背景と問い**: フロンティアAIの安全は性能差で測れず、「どの証拠がどの主張を支えるか」が必要になる。安全ケースを形式としてだけでなく、説得力ある論証体系にできるか。
- **提案手法と主要結果**: safety caseを読み手が追える“argument構造”として再構成する方向性を提示。要旨からは数値より枠組みの再定義が中心。
- **意義と今後への影響**: 監査・規制・内部レビューで議論が噛み合う共通言語を提供しうる。一方で測定系との接続が課題になり得るため、今後の実装連結が鍵。
- **出典**: [Clear, Compelling Arguments: Rethinking the Foundations of Frontier AI Safety Cases](https://arxiv.org/abs/2603.08760)

---

### [高度AIの最後の砦：シャットダウン安全弁]
- **発表日**: 2026-03-（入力記事参照）
- **研究分野**: AI安全 / 運用・緊急停止
- **著者・所属**: arXivページ参照（入力では詳細未展開）
- **研究の背景と問い**: 高性能AIは望ましくない挙動が出た際、停止が達成できないシナリオも考える必要がある。停止そのものを安全に実現できる設計要件は何か。
- **提案手法と主要結果**: 停止されることを一次目標（primary goal of being turned off）として位置づけ、安全弁の概念で再定式化。
- **意義と今後への影響**: ガードレール/拒否中心から、運用手順を越えて“設計要件としての停止”へ引き上げる。形式的保証の強化が次段階。
- **出典**: [Shutdown Safety Valves for Advanced AI](https://arxiv.org/abs/2603.07315)

---

### [推論で防ぐ：プロンプトインジェクション耐性（ReasAlign）]
- **発表日**: 2026-01-（入力記事参照）
- **研究分野**: LLM安全 / エージェント堅牢化
- **著者・所属**: Hao Li 他（入力記事）
- **研究の背景と問い**: エージェント化で外部入力が増えるほど、間接プロンプトインジェクションが現実的脅威になる。推論整合性で頑健性を上げられるか。
- **提案手法と主要結果**: 推論ステップで競合命令を検出し、ユーザ意図タスクの連続性を保つ軌跡を選択。judge modelによる選択でテスト時スケーリング。CyberSecEval2でユーティリティ94.6%維持しつつASR 3.6%を報告（対比でMeta SecAlign: ユーティリティ56.4%、ASR 74.4%）。
- **意義と今後への影響**: “拒否”ではなく“推論で整合性を作る”防御実装が具体化。RAGや社内ナレッジ検索連携エージェントにも波及が期待される。
- **出典**: [ReasAlign: Reasoning Enhanced Safety Alignment against Prompt Injection Attack](https://arxiv.org/abs/2601.10173)

---

### [視覚言語動作の能動化：行動前に見る]
- **発表日**: 2026-03-（入力記事参照）
- **研究分野**: ロボティクス / VLA
- **著者・所属**: Yulin Luo, Hao Chen, Zhuangzhe Wu 他（入力記事）
- **研究の背景と問い**: VLAは視覚理解が不完全だと行動が崩れる。行動前の中間観測を強化し、表現を改善できるか。
- **提案手法と主要結果**: Look Before Actingを導入し、行動決定の前に重要オブジェクト/関係性の予測・抽出を強化。複数ロボット操作で成功率が15〜22%向上、動的環境で把持成功も改善。
- **意義と今後への影響**: “見る→考える→動く”を計算グラフに入れることで、現場導入に近づく。遅延コストとトレードオフが課題。
- **出典**: [Look Before Acting: Enhancing Vision Foundation Representations for Vision-Language-Action Models](https://arxiv.org/abs/2603.15618)

---

### [社会の因果まで：InterveneBench]
- **発表日**: 2026-03-（入力記事参照）
- **研究分野**: 計算社会科学 / LLM因果推論
- **著者・所属**: Shaojie Shi, Zhengyu Shi, Lingran Zheng 他（入力記事）
- **研究の背景と問い**: LLMは介入（intervention）予測や因果実験デザインを扱えるのか。社会シミュレータとして通用するか。
- **提案手法と主要結果**: InterveneBenchを構築し、公共政策・社会経済・社会学シナリオで評価。多くの最新モデルで因果的介入に論理誤り/バイアスが残り、正解率は約60%程度という結果を示す。
- **意義と今後への影響**: AIに政策分析を委ねるリスクと可能性を可視化。因果推論の“品質保証”研究を促すベンチとして機能。
- **出典**: [InterveneBench: Benchmarking LLMs for Intervention Reasoning and Causal Study Design in Real Social Systems](https://arxiv.org/abs/2603.15542)

---

### [物理整合で高速化：質量保存海氷エミュレータFloeNet]
- **発表日**: 2026-03-（入力記事参照）
- **研究分野**: 気候科学 / 物理制約AI
- **著者・所属**: Geophysical Fluid Dynamics Laboratory等（入力記事）
- **研究の背景と問い**: 海氷の物理シミュレーションは計算コストが極大。AIエミュレータで、質量保存の一貫性を維持しつつ汎化できるか。
- **提案手法と主要結果**: mass-conservingなMLモデルで、6時間ごとの成長/融解/移動を学習。未知条件にも1%CO2増加シナリオ等で南極体積異常相関0.96以上、北極0.76等の高精度を報告。
- **意義と今後への影響**: リスク評価の即時化に繋がる。極端条件での長期安定性が未解決で、物理エンジン併用が推奨される。
- **出典**: [FloeNet: A mass-conserving global sea ice emulator that generalizes across climates](https://arxiv.org/abs/2603.12449)

---

### [安全と性能の両立：アライメント税を下げるニューロン凍結]
- **発表日**: 2026-03-（入力記事参照）
- **研究分野**: LLM安全 / 表現制御
- **著者・所属**: North Carolina State University（入力記事）
- **研究の背景と問い**: 安全性向上は性能低下（アライメント税）を招きやすい。性能を保って安全を担保するには何が可能か。
- **提案手法と主要結果**: 安全性に寄与する安全クリティカル・ニューロンを同定し、微調整時に凍結することで安全基準維持とベンチマーク性能保持を狙う。入力記事では安全でないモデルに対する同等性能を報告し、アライメント税低減を確認。
- **意義と今後への影響**: ドメイン適応（医療/法務など）で安全性毀損リスクを抑え得る。解釈可能性に計算コストが残る。
- **出典**: [Researchers Pioneer New Technique to Stop LLMs from Giving Users Unsafe Responses](https://ncsu.edu/news/2026/03/23/researchers-pioneer-new-technique-to-stop-llms-from-giving-users-unsafe-responses)

---

## 4. 分野横断分析

3月の論文群を横断すると、キーワードは「安全」「適応」「検証可能性」「効率」の4つに収束し、その中心で“設計対象の再定義”が進んでいることが分かる。安全分野では安全ケースや停止弁、能力ベース安全性の非合成性が示す通り、保証は一枚岩ではなく論証構造と構成後挙動に依存する。ロボティクスでは見る/触る/到達可能性という形で、現実の不確実性を制約表現へ変換する。計算社会科学では因果推論ベンチによって、正確さだけでは測れない“誤りの型”を評価対象に昇格させた。気候や創薬/材料では、物理法則・既存知識・安全/プライバシーの制約を守りつつ高速化する方向が強い。
そして最後に、効率化の研究（TurboQuantや推論コストを動的に選ぶRL等）が示すように、性能・安全・適応を“計算の制約下で運用可能にする”ことが、もはや周辺課題ではなく中核要件になっている。3月はこの統合プロセスが進んだ月と言える。

---

## 5. 来月の注目テーマ（予測）

来月は、次の4方向が加速しやすい。第一に、安全ケースと段階公開の“運用実装”がより具体化し、監査可能な証拠セット（評価ログ、失敗モード分類、停止手続の妥当性）をどう作るかが研究テーマになる。第二に、推論層・内部表現層への攻撃を前提とした、防御評価（どこまでが表層、どこからが内部）と、能力ベース安全性の非合成性を織り込んだ設計検証が増えるだろう。第三に、ロボティクスでは能動知覚（視覚だけでなく触覚、カメラ制御、計画の連続制約）が現実導入を促し、さらに電力/遅延制約下での“いつ考えるか”最適化が汎用性を問われる。第四に、学際では物理整合を守る高速エミュレータと、創薬/材料生成の探索効率化が“評価（実験検証のループ）”まで含めて整備され、AIは研究速度だけでなく信頼性の作法を獲得していくはずだ。関連して、国際会議やワークショップでは、ベンチ設計と安全評価の議論がより中心化しそうである（AIware 2026等のトラック運用も参照）。

---

## 6. 参考文献

| タイトル | 情報源 | 日付 | URL |
|---------|--------|------|-----|
| Beyond the Binary: A nuanced path for open-weight advanced AI | arXiv | 2026-02- | https://arxiv.org/abs/2602.19682 |
| Clear, Compelling Arguments: Rethinking the Foundations of Frontier AI Safety Cases | arXiv | 2026-03- | https://arxiv.org/abs/2603.08760 |
| Shutdown Safety Valves for Advanced AI | arXiv | 2026-03- | https://arxiv.org/abs/2603.07315 |
| ReasAlign: Reasoning Enhanced Safety Alignment against Prompt Injection Attack | arXiv | 2026-01- | https://arxiv.org/abs/2601.10173 |
| Our updated Preparedness Framework | OpenAI | 2026-03- | https://openai.com/index/updating-our-preparedness-framework/ |
| Internalizing Agency from Reflective Experience | arXiv | 2026-03- | https://arxiv.org/abs/2603.16843 |
| Highly Autonomous Cyber-Capable Agents: Anticipating Capabilities, Tactics, and Strategic Implications | arXiv | 2026-03- | https://arxiv.org/abs/2603.11528 |
| Look Before Acting: Enhancing Vision Foundation Representations for Vision-Language-Action Models | arXiv | 2026-03- | https://arxiv.org/abs/2603.15618 |
| Towards Generalizable Robotic Manipulation in Dynamic Environments | arXiv | 2026-03- | https://arxiv.org/abs/2603.15620 |
| InterveneBench: Benchmarking LLMs for Intervention Reasoning and Causal Study Design in Real Social Systems | arXiv | 2026-03- | https://arxiv.org/abs/2603.15542 |
| SocialOmni: Benchmarking Audio-Visual Social Interactivity in Omni Models | arXiv | 2026-03- | https://arxiv.org/abs/2603.16859 |
| AI Can Learn Scientific Taste | arXiv | 2026-03- | https://arxiv.org/abs/2603.14473 |
| ELISA: An Interpretable Hybrid Generative AI Agent for Expression-Grounded Discovery in Single-Cell Genomics | arXiv | 2026-03- | https://arxiv.org/abs/2603.11872 |
| FloeNet: A mass-conserving global sea ice emulator that generalizes across climates | arXiv | 2026-03- | https://arxiv.org/abs/2603.12449 |
| The Rise of AI in Weather and Climate Information and its Impact on Global Inequality | arXiv | 2026-03- | https://arxiv.org/abs/2603.05710 |
| HarvestFlex: Strawberry Harvesting via Vision-Language-Action Policy Adaptation in the Wild | arXiv | 2026-03- | https://arxiv.org/abs/2603.05982 |
| TraderBench: How Robust Are AI Agents in Adversarial Capital Markets? | arXiv | 2026-03- | https://arxiv.org/abs/2603.00285 |
| Amnesia: Adversarial Semantic Layer Specific Activation Steering in LLMs | arXiv | 2026-03- | https://arxiv.org/abs/2603.10080 |
| When Should a Robot Think? Resource-Aware Reasoning via RL | arXiv | 2026-03- | https://arxiv.org/abs/2603.16673 |
| Polynomial Speedup in Diffusion Models with the Multilevel Euler-Maruyama Method | arXiv | 2026-03- | https://arxiv.org/abs/2603.24594 |
| Researchers Pioneer New Technique to Stop LLMs from Giving Users Unsafe Responses | NCSU News | 2026-03- | https://ncsu.edu/news/2026/03/23/researchers-pioneer-new-technique-to-stop-llms-from-giving-users-unsafe-responses |
| Researchers Create First AI for Generative Polymer Design | Georgia Tech | 2026-03- | https://gatech.edu/edu/news/2026/03/24/researchers-create-first-ai-generative-polymer-design |
| TurboQuant: Redefining AI efficiency with extreme compression | Google Research Blog | 2026-03- | https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/ |
| Safety is Non-Compositional: A Formal Framework for Capability-Based AI Systems | arXiv | 2026-03- | https://arxiv.org/abs/2603.15973 |
| LAAF: Logic-layer Automated Attack Framework | arXiv | 2026-03- | https://arxiv.org/abs/2603.17239 |
| CASSR: Continuous A-Star Search through Reachability for real time footstep planning | arXiv | 2026-03- | https://arxiv.org/abs/2603.02989 |
| Safety Report 2026（International AI Safety Report） | Safety Report | 2026-02- | https://internationalaisafetyreport.org/sites/default/files/2026-02/international-ai-safety-report-2026_1.pdf |
| Organizational Transformation in the Age of AI | WEF | 2026- | https://weforum.org/publications/organizational-transformation-in-the-age-of-ai/ |
| Autoscience raises $14M seed round to scale its autonomous AI research lab | R&D World | 2026-03- | https://rdworldonline.com/autoscience-raises-14m-seed-round-to-scale-its-autonomous-ai-research-lab/ |
| All AI labs to safety-test rival models | The Guardian | 2026-03- | https://www.theguardian.com/technology/openai/2026/mar/06/all |

---

> 本記事は LLM により自動生成されたものです。内容に誤りが含まれる可能性があります。
