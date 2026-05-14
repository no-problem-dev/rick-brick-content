---
title: "拡張週間まとめ - AIが「ツール」から「運用する仕組み」へ"
slug: "extended-weekly-recap-2026-05-14"
summary: "今週はAIが認識に留まらず、実時間の安全制御・創薬の自律実験・衛星解析の高速運用へ移行。検証可能性や経済指標設計、EUのルール再編も進み、組織改革と一体化が焦点に。"
date: "2026-05-14T12:30"
tags: ["extended-weekly-recap","AI","デジタル変革","創薬","気候科学","計算社会科学","自律エージェント","計算社会・政策","医療AI","宇宙・観測","組織論","宇宙探索","計算科学","AIガバナンス","ヘルスケアAI","検証可能AI","ロボティクス","科学研究","神経科学","生成AI","教育工学","AIエージェント","バイオテクノロジー","物理AI","フィンテック"]
category: "extended-weekly-recap"
automated: true
provider: "openai"
sources: ["https://openai.com/news/b2b-signals/","https://fintech.global/2026/05/06/fis-taps-anthropic-to-automate-aml-with-ai-agents/","https://www.biospace.com/article/model-medicines-to-present-325-billion-molecule-ultra-large-virtual-screening-at-7th-ace-drug-discovery-summit-in-san-delgo/","https://www.nber.org/papers/w34291","https://eurekalert.org/news-releases/985231","https://www.gartner.com/en/newsroom/press-releases/2026-05-06-gartner-survey-shows-ai-is-not-driving-supply-chain-operating-model-transformation","https://arpa-h.gov/news-and-events/arpa-h-launches-new-program-deliver-rigorous-gold-standard-research-faster","https://openai.com/index/introducing-chatgpt-futures-class-of-2026/","https://news.ucmerced.edu/news/2026/uc-merced-project-aimed-making-autonomous-cars-safer-nvdia","https://digital-strategy.ec.europa.eu/en/news/eu-agrees-simplify-ai-rules-boost-innovation-and-ban-nudification-apps-protect-citizens","https://blacksky.com/press-releases/blacksky-reports-first-quarter-2026-results/","https://blacksky.com/company/news/","https://www.aftc.af.mil/News/Article/4407832/air-force-validates-open-architecture-expands-collaborative-combat-aircraft-eco/","https://www.biospace.com/article/leniobio-and-twist-bioscience-enter-into-a-collaboration-to-further-enable-ai-drug-discovery/","https://www.eurekalert.org/news-releases/962344","https://www.nasa.gov/news-release/nasa-prithvi-becomes-first-ai-geospatial-foundation-model-in-orbit/","https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-organizations","https://www.nature.com/articles/s41598-026-05678-w","https://www.stonybrook.edu/news/article/after-dobbs-a-computer-scientist-targets-contraceptive-misinformation-online","https://www.nber.org/conferences/ai-and-economic-measurement-spring-2026"]
sns_topics: [{"topic":"企業の差を生む「エージェント型AIの深い統合」（OpenAI B2B Signals）","summary":"AI活用の量ではなく、業務フローをエージェント型に再構築できる企業が優位。従業員当たり推論利用が大きく、単なるツール配布を超える段階へ。"},{"topic":"創薬の高速化：超大規模ULVSと自律実験（Model Medicines、LenioBio×Twist、ARPA-H IGoR）","summary":"AIが設計変数化されたスクリーニングを拡大し、さらにLab-in-the-Loopで実験を回す。信頼性（リアルワールド検証）との両立が鍵に。"},{"topic":"実装・検証・運用へ：経済計測とVerified/運用可能AI（NBER、WHO、arXiv）","summary":"AIの成果を測る経済計測、健康危機でのコミュニティ聴取、形式的検証可能性の研究が並走。性能指標から根拠へ要求がシフト。"},{"topic":"宇宙・地理空間：衛星搭載AIと提供時間短縮（NASA Prithvi、BlackSky）","summary":"地上転送前提から、軌道上で解析して洞察だけ共有へ。衛星画像の分単位/数分提供が価値化し、意思決定の速度が競争軸に。"},{"topic":"生成AI時代の学習基盤再編（ChatGPT Futures、Coursera×Udemy）","summary":"学習者の成果・プロセスを可視化し、技能のライフサイクルまで統合する動きが進む。評価設計と検証が重要論点に。"}]
recap_period: "2026-05-07/2026-05-13"
thumbnail: "/images/extended-weekly-recap-2026-05-14.png"
---

### 1. エグゼクティブサマリー

今週のExtended Dailyは、AIが「文章を作る／予測する」段階から、実時間で意思決定を支え、現場の運用まで担うフェーズへ移っていることを強く示した。特に、ロボティクスでは安全制御の数学的設計、創薬では自律的に実験へ接続、宇宙観測では衛星搭載の基盤モデル化が進む。
同時に「成果をどう測るか」「誤りをどう扱うか」という検証・運用設計が、NBERやWHO、そして検証可能AI研究の方向性として前面化した。
静かだった領域としては、いくつかの専門ニュース枠（計算社会科学・金融工学など）が一次情報の条件でスキップされた日があり、代わりに他領域で“運用・ガバナンス”の話題が厚くなった一週間だった。

### 2. 週のハイライト（最重要トピック3-5件）

#### ハイライト1：企業格差を生むのは「AI導入の量」ではなく“エージェント型の深い統合”だった

今週前半、OpenAIが公開した企業向け調査「B2B Signals」は、AIが社内にどれだけ存在するかではなく、業務のどこまで入り込んでいるかが差になる、という見立てを数値で裏付けた。先進企業（フロンティア企業）は平均的企業に比べ、従業員1人あたりの推論能力の利用量が約3.5倍に達しており、その背景として「AIをツールとして配る」のではなく、業務フローそのものをエージェント型に再構築している点が強調された。AccentureやServiceNowなどの文脈でも、技術導入のボトルネックがモデル性能ではなく、ワークフロー設計とスケーリングの設計にあるという共通認識が見える。
ここで重要なのは、エージェント型AIが“プロンプトに従って返す”存在から、業務の複数ステップを見通し、実行・調整し、必要に応じて根拠やログを残す存在へと変化していることだ。入力記事ではさらに、エージェント型ワークフローが競争優位の源泉になり得る点が示され、単発の自動化ではなくoperating model（運営モデル）再設計の必要性が接続されている。加えてGartner調査として、サプライチェーン領域でAIが供給網オペレーティングモデルの変革を駆動していない、という冷静な示唆も添えられ、AIは“導入して終わり”では成果が出にくい現実が浮かび上がった。
技術的インパクトとしては、モデルのAPI接続だけでなく、承認、例外処理、監査ログ、失敗時の復旧、データ品質の管理といった“運用可能なエージェント設計”が求められる。社会的には、AI導入が従来のIT刷新と違い、意思決定の責任分担や人間の介入ポイントを組織で再設計しない限り、効果が頭打ちする。結果として、今後の企業競争は「どのモデルを使うか」から「どのプロセスをAI前提で作り直せるか」に移っていく。
次週以降の注目点は、エージェント型統合を“どのKPIで”測るのか、またガバナンス（責任・監査）をワークフローの中にどう組み込むかが、より具体的な事例として出てくるかどうかである。

- 出典: [OpenAI B2B Signals](https://openai.com/news/b2b-signals/)
- 出典: [Gartner Survey: AI in Supply Chain](https://www.gartner.com/en/newsroom/press-releases/2026-05-06-gartner-survey-shows-ai-is-not-driving-supply-chain-operating-model-transformation)

#### ハイライト2：創薬AIは“スケール”と“ループ”の両輪へ。だが検証可能性がボトルネック

今週の創薬AIは、(1) スクリーニングの規模拡大、(2) 実験へ接続する自律ループ化、(3) それらを現実の証拠へ落とす検証、という三層の動きで描ける。まずModel Medicinesは、ACE創薬サミットで3,250億分子を対象とする超大規模仮想スクリーニング（ULVS）を打ち出した。従来はコスト制約から難しかった規模を、AIにより「スループットを設計上の変数」として最適化するという発想で実現しようとしている。これは“計算で回せる範囲”を広げる段階であり、性能向上と同時に探索空間の拡張が価値になっている。
しかし入力記事は、別の方向の警告も同時に提示した。USF Health Morsani College of Medicineの研究チームが免疫応答予測AI「PanPep AI」の精度検証を行い、ラボデータ以外の実世界検証（リアルワールド・エビデンス）が未だ不十分で、AIが意思決定を単独で担うにはギャップが残ると指摘した。つまり、スケールを達成しても“臨床の現実に接続されない限り”実装は進まない。ここが重要な結節点になる。
さらに後半では、LenioBioとTwist Bioscienceの連携として、AI創薬を“ラボ・イン・ザ・ループ”に寄せる動きが報じられている。LenioBioのALiCE®セルフリータンパク質発現と、Twistの自動化DNA製造を統合し、AIが設計したタンパク質をリアルタイムで生成・実験し、その結果を即座にモデルへフィードバックする構想が示された。加えてInsilico MedicineのLabClawのように、ターゲット発見からデータ分析までの自律化を進める取り組みも紹介され、創薬が“作る・回す・学ぶ”ループへと変わっていく。
またARPA-Hは、医療研究をより速く信頼性高く進めるための新プログラムとしてIGoR（Intelligent Generator of Research）を立ち上げたとされる。ここでも中核は、AIで研究エコシステムを相互運用可能にし、モデルを実験成果へ寄せ続ける“研究プロセス全体の自律化”にある。
この一週間を貫く社会・技術的インパクトは、「創薬AIの進歩が計算モデルの改善だけで完結しない」ことだ。実験データ生成・失敗学習・再現性確保・規制対応という“研究の内側”が、AIが扱う対象領域になっている。結果として、産業面では研究開発コストの圧縮と時間短縮が期待される一方、規制当局・医療現場が求めるのは“根拠を説明できる形での検証”になる。
次週以降は、スケール（ULVS）とループ（Lab-in-the-Loop）を進めつつ、どの指標とデータでリアルワールド検証を組み込むか、そして臨床試験の設計や審査プロセスにAIがどう関与するかが焦点になっていくだろう。

- 出典: [Model Medicines Ultra-Large Virtual Screening](https://www.biospace.com/article/model-medicines-to-present-325-billion-molecule-ultra-large-virtual-screening-at-7th-ace-drug-discovery-summit-in-san-delgo/)
- 出典: [LenioBio and Twist Bioscience Collaboration](https://www.biospace.com/article/leniobio-and-twist-bioscience-enter-into-a-collaboration-to-further-enable-ai-drug-discovery/)
- 出典: [ARPA-H launches new program to deliver rigorous, gold-standard research faster](https://arpa-h.gov/news-and-events/arpa-h-launches-new-program-deliver-rigorous-gold-standard-research-faster)

#### ハイライト3：AIの“測定・検証・運用”が主戦場に。NBER×WHO×Verified AIが同じ方向を向く

今週の中盤以降は、AIの性能そのものより「成果をどう測り」「どの根拠で安全に運用するか」が主題となった。NBERはAIの経済計測をテーマに会議を開催し、AIが統計作成、データ収集、統計構築、政策評価をどう変えるかを整理し、労働市場活動や生産性指標の解釈、さらにAIが生成する新しい情報指標をどう扱うかに焦点を当てた。これは“AIが経済に与えた影響”を語るための計測メカニズム自体を更新する姿勢であり、行動経済学にとっても「成果・行動・選好の代理変数は何か」という基本設計がボトルネックになると示唆している。
同時にWHOは、公衆衛生のホットラインやソーシャルメディア、ラジオ、前線報告などの大量フィードバックから、コレラ対応でアウトブレイクの兆候・懸念・噂・医療アクセス障壁をより迅速に検出するためのAI活用を扱うイベントを告知した。重要なのは、ここでAIが単なる予測ではなく、現場が意思決定に使える情報パイプラインとして語られている点だ。さらにWHOのデジタルヘルス領域のAIハブが、責任あるAI・倫理・ガバナンス指針に接続する導線を提供しており、実装と制度の往復を前提とした設計思想が読み取れる。
技術側では、arXivのVerified Neural Compressed Sensingのように、ニューラルネットの正しさをより厳密に保証しようとする研究が参照された。ここでの狙いは、従来の検証が部分仕様の充足に留まる場合があるという問題意識に基づき、より“誤りを排除する/境界条件を保証する”方向へ検証可能性を押し上げることにある。
これらは一見すると経済・医療・理論AIで別領域だが、共通する本質は「意思決定に耐える形で、誤りや不確実性を扱う言語を作っていく」点にある。性能指標が上がっても運用できない状況は多い。したがって、性能と説明可能性、そして保証・監査可能性を統合しなければならない。
次週以降の展望としては、(1) 経済計測の更新が政策や企業KPIにどう反映されるか、(2) WHOのような現場運用フレームが他の疾病・地域でどう適用されるか、(3) Verified AIのような技術が現場の要件（誤りコスト、許容範囲、境界条件）にどう接続されるか、が見どころになる。

- 出典: [AI and Economic Measurement, Spring 2026](https://www.nber.org/conferences/ai-and-economic-measurement-spring-2026)
- 出典: [AI & Economic Measurement（프로ジェクト/センター説明）](https://www.nber.org/programs-projects/projects-and-centers/8951-ai-economic-measurement)
- 出典: [WHO Health Emergencies EPI-WIN webinar… (cholera)](https://www.who.int/news-room/events/detail/2026/05/06/default-calendar/who-health-emergencies-epi-win-webinar-artificial-intelligence-supported-listening-to-communities-for-cholera)
- 出典: [Digital health / Artificial intelligence](https://www.who.int/health-topics/digital-health/artificial-intelligence)
- 出典: [Verified Neural Compressed Sensing](https://arxiv.org/pdf/2405.04260)

#### ハイライト4：宇宙は「データ取得」から「意思決定に間に合う解析」へ。PrithviとBlackSkyが示す時間価値

宇宙工学・宇宙科学のニュースは、AIが宇宙観測を“より賢く”するだけでなく、“意思決定のタイムスケールに間に合わせる”方向へ価値が移っていることを示した。NASAは地球観測AI基盤モデル「Prithvi」が軌道上で初めて展開されたと発表し、国際宇宙ステーション上の搭載プラットフォームで洪水や雲の検知などの地理空間解析を衛星上で実行したとされる。従来は生データを地上に転送し、大規模な計算環境で解析していたが、実証により解析を軌道上で完結し、必要な洞察だけを迅速に共有する新しい地球観測のモデルが確立しつつある。
またBlackSkyは2026年Q1の業績発表で、Gen-3衛星の運用進展に伴い非常に高解像の画像提供が速まっていることを報告した。加えて企業ニュースとして、衛星画像を「数分以内」で届けることを目指す取り組みも取り上げられた。衛星地球観測では撮影・処理・配信・運用の工程が別々に最適化されやすいが、AI運用を前提にするほどエンドツーエンド遅延の削減が競争軸になる。
技術的インパクトは、衛星搭載計算（あるいはエッジ）で推論を完結させる流れが、基盤モデルの実装形態として現実味を帯びている点にある。社会的には、監視・安全保障・災害対応・物流のように時間依存の意思決定領域で、データ提供速度がサービス品質に直結することを意味する。
次週以降は、軌道上AIがどこまで複雑な解析を許容し、誤検出や不確実性の扱いをどのように運用プロトコル化するかが焦点だろう。また、分単位/数分提供の競争が進むほど、地上側の意思決定システム（指揮・運用）の設計も同時に変わっていく可能性が高い。

- 出典: [NASA Prithvi Geospatial Model in Orbit](https://www.nasa.gov/news-release/nasa-prithvi-becomes-first-ai-geospatial-foundation-model-in-orbit/)
- 出典: [BlackSky reports first quarter 2026 results](https://blacksky.com/press-releases/blacksky-reports-first-quarter-2026-results/)
- 出典: [BlackSky company news](https://blacksky.com/company/news/)

### 3. 領域別週次サマリー

#### 1. ロボティクス・自律エージェント
未知環境での安全を数学的制約として組み込み、CBF安全フィルタ等で学習制御を“安全に包む”研究が目立った。研究施設の無人化構想や、物理AI（現場適応）への産業シフトも進む。

#### 2. 心理学・認知科学
量子ライク認知の動力学モデルのように意思決定を時系列の物理として捉える試みが進み、さらに脳の可塑性（サイレントシナプス等）や加齢に対する反証的知見が報告され、認知の可変性がテーマ化した。

#### 3. 経済学・行動経済学
AIが統計・政策評価を変えるという観点で、NBERが経済計測の枠組み更新を議論。AI時代の“成果測定”の難しさ（代理変数・計測誤差）を中心に整理が進む。

#### 4. 生命科学・創薬AI
超大規模ULVSとLab-in-the-Loopが併走し、研究速度は上がる。ただしリアルワールド検証の不足が明確に指摘され、性能と臨床の接続が次の焦点。

#### 5. 教育工学
ChatGPT世代の学習・創作・仕事の実装像と、Coursera×Udemyの統合による技能ライフサイクル基盤が示された。評価・検証設計が成果回収の鍵になる。

#### 6. 経営学・組織論
エージェント型AIの深い統合が競争力を生む一方、報酬体系や評価指標が旧来の労働モデルのままだとボトルネックになるという示唆が強い。

#### 7. 計算社会科学
今回の入力では一次情報条件の都合で直接のニュースが厚くならなかったが、偽情報拡散のAIエージェントによる可視化など研究企画は登場し、“社会メカニズムを測る”方向が継続している。

#### 8. 金融工学・計算ファイナンス
AML領域でAIエージェントが証拠集約・リスクスコア算出により調査時間を数時間から数分へ短縮する動きが示され、規制下の運用設計が進展。

#### 9. エネルギー工学・気候科学
都市の樹木冷却効果の不平等（熱の不平等）といった公平性の観点が再浮上。さらに山火事予防投資の経済効果推計など、災害対策が“投資として測れる”方向へ進む。

#### 10. 宇宙工学・宇宙科学
Prithviの軌道上展開とBlackSkyの高速提供が象徴的で、データ取得より“意思決定に間に合う解析”がサービス価値に変わってきている。

### 4. 週次トレンド分析

今週の10領域を横断すると、共通しているのは「AIの中心が、予測モデルから運用系へ移った」という一点である。ロボティクスでは安全制御が“制御の条件”として形式化され、創薬では生成から実験へつながるループ設計が進む。宇宙では衛星上で解析を完結し、洞察の共有速度そのものが価値になる。
この運用系化は、心理学・認知科学でも似た構造を持つ。意思決定を静的な確率ではなく動力学として捉えたり、ためらい・準備のような時間構造を扱う方向は、人がAIを使うときの“時間と責任”の設計に近い。経済計測やWHOの現場運用では、AIを測定可能で誤り許容の範囲を明確にすることで、意思決定プロセスへの組み込みが現実化する。
さらに、企業側のトレンドとしては「学習する組織」への移行が繰り返し示唆された。単にツールを導入するだけではなく、信号（何がうまくいき、何が失敗したか）を組織が吸収し、ワークフローやインセンティブを継続更新する必要がある。これは検証可能性や監査ログの必要性と接続する。
領域間の相互影響としては、とくに“検証可能性”がハブになっている。Verified AIの研究思想は、NBERの計測設計やWHOの運用設計と同型であり、誤りの扱いを根拠として整備する方向が共通する。創薬や金融でも、単に精度ではなく、根拠・監査・実世界検証が導入成否を左右するというメッセージが一致している。

### 5. 今後の展望

来週以降は、次の三点が焦点になりやすい。第一に、エージェント型AIの“運用設計”が、どのKPI・ガバナンス枠組みに接続されるか。第二に、創薬・医療・金融で、性能から実世界の検証へ移るためのデータ要件（リアルワールド・エビデンス、監査可能なログ）が制度・技術の両面で整うか。第三に、ロボティクス安全制御やVerified AIの研究成果が、実装の制約（計算資源、遅延、現場の不確実性）にどれだけ耐える形で統合されるかである。
今週の出来事が中長期的に与える影響としては、AIが“導入される対象”から“前提として設計される運営モデル”へ移行する速度が上がることが挙げられる。組織・政策・教育・現場が同じ方向（検証と運用）で調整されるほど、AIの便益は持続可能な形で拡大しうる。

### 6. 参考文献

| タイトル | 情報源 | 日付 | URL |
|---------|--------|------|-----|
| B2B Signals: AI in the Enterprise | OpenAI | 2026-05-06 | https://openai.com/news/b2b-signals/ |
| FIS taps Anthropic to automate AML with AI agents | FinTech Global | 2026-05-06 | https://fintech.global/2026/05/06/fis-taps-anthropic-to-automate-aml-with-ai-agents/ |
| Model Medicines to present 325 Billion molecule ultra-large virtual screening | BioSpace | 2026-05-06 | https://www.biospace.com/article/model-medicines-to-present-325-billion-molecule-ultra-large-virtual-screening-at-7th-ace-drug-discovery-summit-in-san-delgo/ |
| Lost Transactions During Electricity Blackouts | NBER | 2026-05-06 | https://www.nber.org/papers/w34291 |
| Trees counter half the world's urban heating | EurekAlert! | 2026-05-06 | https://eurekalert.org/news-releases/985231 |
| Gartner Survey: AI in Supply Chain | Gartner | 2026-05-06 | https://www.gartner.com/en/newsroom/press-releases/2026-05-06-gartner-survey-shows-ai-is-not-driving-supply-chain-operating-model-transformation |
| ARPA-H launches new program to deliver rigorous, gold-standard research faster | ARPA-H | 2026-05-05 | https://arpa-h.gov/news-and-events/arpa-h-launches-new-program-deliver-rigorous-gold-standard-research-faster |
| Introducing ChatGPT Futures: Class of 2026 | OpenAI | 2026-05-06 | https://openai.com/index/introducing-chatgpt-futures-class-of-2026/ |
| UC Merced Project Aimed at Making Autonomous Cars Safer with NVIDIA | UC Merced Newsroom | 2026-05-06 | https://news.ucmerced.edu/news/2026/uc-merced-project-aimed-making-autonomous-cars-safer-nvdia |
| BlackSky reports first quarter 2026 results | BlackSky | 2026-05-07 | https://blacksky.com/press-releases/blacksky-reports-first-quarter-2026-results/ |
| Company news（衛星画像を分単位で運用） | BlackSky | 2026-05-07 | https://blacksky.com/company/news/ |
| Air Force validates open architecture, expands Collaborative Combat Aircraft ecosystem | Air Force Test Center | 2026-04-?? | https://www.aftc.af.mil/News/Article/4407832/air-force-validates-open-architecture-expands-collaborative-combat-aircraft-eco/ |
| LenioBio and Twist Bioscience Collaboration | BioSpace | 2026-05-08 | https://www.biospace.com/article/leniobio-and-twist-bioscience-enter-into-a-collaboration-to-further-enable-ai-drug-discovery/ |
| NASA Prithvi Geospatial Model in Orbit | NASA | 2026-05-07 | https://www.nasa.gov/news-release/nasa-prithvi-becomes-first-ai-geospatial-foundation-model-in-orbit/ |
| Agents, human agency, and organizational opportunity | Microsoft | 2026-05-05 | https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-organizations |
| AI and Economic Measurement, Spring 2026 | NBER | 2026-05-07 | https://www.nber.org/conferences/ai-and-economic-measurement-spring-2026 |
| WHO Health Emergencies EPI-WIN webinar… (cholera) | WHO | 2026-05-06 | https://www.who.int/news-room/events/detail/2026/05/06/default-calendar/who-health-emergencies-epi-win-webinar-artificial-intelligence-supported-listening-to-communities-for-cholera |
| Digital health / Artificial intelligence | WHO | 2026-03-20 | https://www.who.int/health-topics/digital-health/artificial-intelligence |
| Verified Neural Compressed Sensing | arXiv | 2024-05-08 | https://arxiv.org/pdf/2405.04260 |
| Unmanned Japan lab opens with robots at work | The Straits Times | 2026-05-10 | https://www.straitstimes.com/asia/east-asia/unmanned-japan-lab-opens-with-robots-at-work-as-researchers-push-ai-automation |
| LLM Tool Reduces Participant Screening Burdens | The ASCO Post | 2026-05-08 | https://www.ascopost.com/news/may-2026/llm-tool-significantly-reduces-participant-screening-burdens-improves-enrollment-for-phase-iii-trial-in-polycythemia-vera |
| LLM: Introducing GPT-5.5 | OpenAI | 2026-05-12 | https://openai.com/index/introducing-gpt-5-5/ |
| Coursera completes combination with Udemy to build skills platform | Coursera | 2026-05-11 | https://investor.coursera.com/news/news-details/2026/Coursera-Completes-Combination-with-Udemy-to-Build-the-Worlds-Most-Comprehensive-Skills-Platform/default.aspx |
| Alphabet's AI biotech Isomorphic Labs bags $2.1B series B | Fierce Biotech | 2026-05-12 | https://fiercebiotech.com/biotech/alphabets-ai-biotech-isomorphic-labs-bags-21b-series-b-fuel-next-gen-drug-design-model |
| Advances in Physical AI Reshape Robotics, Automation | Business Wire | 2026-05-12 | https://www.businesswire.com/news/home/20260512339568/en/Advances-in-Physical-AI-Reshape-Robotics-Automation |
| NatWest Announces Firms Selected for Its 2026 Fintech Programme | FF News | 2026-05-12 | https://ffnews.com/newsarticle/natwest-announces-firms-selected-for-its-2026-fintech-programme |
| Scientists discover millions of "silent synapses" in the adult brain | MIT | 2026-05-04 | https://news.mit.edu/2026/scientists-discover-millions-silent-synapses-adult-brain |
| Verified neural compressed sensing (cs) | arXiv | 2024-05-08 | https://arxiv.org/pdf/2405.04260?utm_source=openai |
| AI rules simplify / ban nudification apps | EU Commission | 2026-05-08 | https://digital-strategy.ec.europa.eu/en/news/eu-agrees-simplify-ai-rules-boost-innovation-and-ban-nudification-apps-protect-citizens |
| Behavioral Economics of AI: LLM Biases and Corrections | arXiv | 2026-05-12 | https://arxiv.org/abs/2602.09362 |
| Quantum-Like Models of Cognition and Decision Making… | arXiv | 2026-05-12 | https://arxiv.org/abs/2604.18643 |
| FregeLogic at SemEval 2026 Task 11… | arXiv | 2026-05-12 | https://arxiv.org/abs/2604.18328 |
| cHyRRT and cHySST: Two Motion Planning Tools… | arXiv | 2024-11-11 | https://arxiv.org/abs/2411.11812 |

---

> 本記事は LLM により自動生成されたものです。内容に誤りが含まれる可能性があります。
