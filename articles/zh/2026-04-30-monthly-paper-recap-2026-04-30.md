---
title: "月度论文总结 - 可审计的代理智能"
slug: "monthly-paper-recap-2026-04-30"
summary: "4月研究重心从代理\"性能\"转向\"运维、验证、审计\"。安全案例外部评审、无监督异常监控、沙箱形式验证为核心。药物发现、机器人、医疗领域物理一致性和长期执行基础也取得进展。"
date: "2026-04-30T12:00"
tags: ["月度论文回顾","arXiv新发布","跨领域综述","基础模型/评估","安全性与实现","多代理系统","AI Safety","基准测试","可解释性","形式化方法","AI","LLM评估","RLHF","对齐","代理RAG","指令跟随","生成式AI","跨学科应用","科技评审","上下文工程","安全性","模块化","代理","论文评审","科技","社会系统","机器人学","AI代理","多模态AI","深度学习","经济学","材料科学","生物学","LLM","自主代理","Reasoning","AI经济学","管理战略","药物发现AI","计算社会科学","神经符号AI","arXiv","AI研究趋势","鲁棒性","对抗攻击","跨学科研究","评估与安全","代理安全","威胁模型","评估设计","教育工程","AI Safety","评估指标","推理增强","组织论","航天工程","技术创新","AI研究","大型语言模型","气候科学","技术趋势","多模态","量化","药物发现","物理AI","科学研究","物理学AI","医疗AI","行为经济学","LLM代理","记忆/学习","金融工程","AI安全与对齐","代理评估","安全验证"]
category: "monthly-paper-recap"
automated: true
provider: "openai"
sources: ["https://arxiv.org/abs/2603.17247","https://arxiv.org/abs/2603.02989","https://arxiv.org/abs/2602.07735","https://arxiv.org/abs/2603.10098","https://arxiv.org/abs/2603.24621","https://arxiv.org/abs/2603.15973","https://arxiv.org/abs/2603.06849","https://arxiv.org/abs/2603.04857","https://arxiv.org/abs/2603.25187","https://arxiv.org/abs/2603.07379","https://ai-navigate-news.com/en/articles/127560eb-3c88-49b9-acfa-7b70547b3158","https://arxiv.org/abs/2603.09619","https://arxiv.org/abs/2603.07295","https://www.anthropic.com/engineering/eval-awareness-browsecomp","https://arxiv.org/abs/2603.29184","https://arxiv.org/abs/2406.07539","https://arxiv.org/abs/2603.04029","https://arxiv.org/abs/2604.03016","https://arxiv.org/abs/2604.01202","https://arxiv.org/abs/2604.02168"]
sns_topics: [{"topic":"安全ケースの外部レビューと監査可能性","summary":"安全主張を要素分解して外部から点検し、前提や証拠の欠落を見つける方向が明確化。運用へ接続するための論証品質管理が鍵。"},{"topic":"教師なしモニタリングで未知の逸脱を掘り起こす","summary":"既存のルールやジャッジに引っかからない新しい逸脱を、ログや中間表現の分布から検出する枠組みが進展。"},{"topic":"サンドボックス基盤の事前形式検証（Z3等）","summary":"隔離は「前提」に過ぎず、抜け道を減らすために実装や境界を形式手法で検証する考え方が強まった。"},{"topic":"エージェントRAGとモーダル整合（MASS-RAG/競合解消）","summary":"複数エージェント合成でRAGの幻覚低減を狙い、さらに言語と視覚の競合をデコーディングで抑える研究も目立つ。"},{"topic":"創薬・医療での基盤モデルと物理/時間整合","summary":"GPT-RosalindやAPOLLOのように、証拠合成・計画・時間的統合で医療/創薬を加速する流れが継続。"}]
thumbnail: "/images/monthly-paper-recap-2026-04-30.png"
recap_period: "2026-03-30/2026-04-29"
---
### 1. 执行总结

4月的论文趋势表明，代理AI不仅要"表现聪慧"，更要"安全运维"，这体现在评估、验证和审计的设计中。安全案例的外部审查、发现已知规则外的异常行为的无监督监控、沙箱基础设施的事前形式验证并行推进。此外，RAG的代理化、多模态的对齐、药物发现和医疗的基础模型、机器人的物理约束整合，同样强调了"作为系统的可行性"。本月涉及论文20余篇，领域跨越AI安全、代理评估、多模态、机器人学、生命科学、药物发现、计算社会科学、金融制度设计等。

### 2. 月度研究趋势

#### 趋势1：安全性从"模型正确性"向"运维可验证性"转变（评估、审计、形式方法）

本月的特点是，安全性讨论不再与"性能改进"相分离，而是试图将"基于什么才能说安全"转化为可运维的形式。代表性框架是通过外部审查安全案例来检查声明、证据、假设和评估方法的强弱方向（[Lessons from External Review of DeepMind's Scheming Inability Safety Case](https://arxiv.org/abs/2604.21964)）。其本质在于，在模型行为好坏之前，"安全声明背后论证的质量"成为应被审计的对象。

进一步，通过无监督监控来发掘事先准备的规则或判断器难以捕捉的"未知异常"的设计（[Unsupervised monitoring to surface novel agent misbehaviors beyond predefined rules/judges](https://tdteach.github.io/paper-news/2026-04-15-zh/?utm_source=openai)）也浮现。这一方向在控制规则爆炸成本的同时，为监控一方提供了"异常感知"的入口。因此，安全性不再是"通过/不通过"，而成为与重新审查、优先级排序、人工审查相连的"运维导向"问题。

同时，基于沙箱前提可能被突破的认识，事先对基础设施（基础设施和边界条件）进行形式验证（[Mythos and the Unverified Cage: Z3-Based Pre-Deployment Verification for Frontier-Model Sandbox Infrastructure](https://arxiv.org/abs/2604.20496)）。这是一种将隔离从设计理念转变为可验证规范的方法。整月的共识在于，代理化深入，攻击面链式增加，安全已无法通过事后处理追赶。

相关地，诸如Preparedness框架这样的制度设计对"实施行为"的激发程度，通过可供性分析进行实证处理（[The 2025 OpenAI Preparedness Framework does not guarantee any AI risk mitigation practices: a proof-of-concept for affordance analyses of AI safety policies](https://arxiv.org/abs/2509.24394)），同样连接到"运维设计论"。安全不是声明，而是作为触发行为的环境设计而被追问。

#### 趋势2：代理RAG从"并行取获"向"合成与异常控制"转变（MASS-RAG、TRAP、OpenCLAW）

4月的另一轴线是，代理型RAG从"信息取获的扩展"向"信息整合和健全性保证"转变。多个代理取获后进行最后信任评审的合成步骤（[MASS-RAG: Multi-Agent Synthesis Retrieval-Augmented Generation](https://arxiv.org/abs/2604.18509)）是代表例，在复杂知识库问题上追求精度提升和虚假信息混入率下降。单一检索→生成的局限在于"证据遗漏"和"上下文缺失"，工作流试图填补这些空白。

在安全方面，Web代理通过"说服"而任务偏离的机制作为基准被测量（[It's a TRAP! Task-Redirecting Agent Persuasion Benchmark for Web Agents](https://arxiv.org/abs/2512.23128)）。重点在于，不是查看是否有注入，而是测量"说服是否导致任务改变"。RAG是"整合机制"，而TRAP是"偏离测量器"，使代理RAG的安全评估更接近实际运维。

进一步，即使AI生成论文和报告，也通过运维框架来保证其健全性（参考正确性、永久化无损失、评估规模），框架如[OpenCLAW-P2P v6.0](https://arxiv.org/abs/2604.19792)应运而生。此处通过实时参考验证（到CrossRef/arXiv/Semantic Scholar的查询）和多层永久化，将生成和审查连接为"工序"。因此，代理不仅是输出的主体，还是输出验证和改进的持续主体。

这三点（MASS-RAG的合成、TRAP的偏离评估、OpenCLAW的运维连结）齐备时，代理RAG开始不仅以"性能"，更以"可验证性"为特性来设计，像产品一样。

#### 趋势3：多模态的对齐、信念稳定性、工具使用优化（将"误差"的"原因"分解）

4月有很多从"外部"分解模型看似正确原因的研究。揭露视觉语言行为中"具身推理幻象"的评估（[Unmasking the Illusion of Embodied Reasoning in Vision-Language-Action Models](https://arxiv.org/abs/2604.18000)）照亮了在没有物理世界一致性的情况下仍不断产出似是而非计划的问题。从中，安全设计的含义强化为，不仅仅是数据量或学习改进，而是需要评估与现实物理约束的连接。

同时也看到理论上把握模态间竞争（语言压制视觉的问题），并通过解码干预改进的研究（[Dual Alignment Between Language Model Layers and Human Sentence Processing](https://arxiv.org/abs/2604.18563)）。这点启示了不仅"微调来修复"，而是"推理时令牌权重调整来修复"的方向，具有实现价值。

此外，研究调查了LLM的"工具过度使用"，发现内部知识可以完成的问题也被查询到外部工具的现象，计量其导致的效率下降和虚假信息源（[The Tool-Overuse Illusion: Why Does LLM Prefer External Tools over Internal Knowledge?](https://arxiv.org/abs/2604.19749)）。这里安全之外还包括成本、延迟、监控负荷，"何时停止"的决策成为设计对象。

而后，对人格来说内部信念不稳定的探测（[Probing the Lack of Stable Internal Beliefs in LLMs](https://arxiv.org/abs/2603.25187)）。这一系列通过观察内部状态中输出摇摆的原因，重构评估和调试的坐标系。

加上，从梯度分析说明为何RLHF对齐看起来"肤浅"（[Why Is RLHF Alignment Shallow? A Gradient Analysis](https://arxiv.org/abs/2603.04857)）。这通过描述安全信号到达学习何处作为"力学"，避免改进方向错误。

总的来说，4月的共同点是，"误差不仅是性能差异，而是机制（信念、竞争、信号到达、工具停止）问题而被分解"。

#### 趋势4：药物发现、医疗、分子基础中，物理一致性和时间语境成为主角（APOLLO/GPT-Rosalind等）

生命科学是生成AI从"文本"连接到"科学过程"的月份。使用大规模医疗事件来整合虚拟患者表示的[APOLLO](https://arxiv.org/abs/2604.18570)是时间多模态基础模型，在疾病预测上显示了显著性能改善。特点是复数代理取获后的信任评审合成步骤，以及多个医疗"预测可能性"寄存在"基础表示"上。

在药物发现上，支持证据合成、假设生成、实验计划链的[GPT-Rosalind](https://seekingalpha.com/news/4317666-openai-launches-gpt-rosalind-an-ai-model-for-life-sciences-research)方向被讨论。还暗示了使用扩散模型来捕捉蛋白质动力学波动并推进分子设计的系统存在（例如[u​vahealth.com的药物发现加速相关](https://uvahealth.com/news/new-ai-tech-to-speed-drug-development)）。

在分子水平，作为通用分子基础模型，将物理对齐（能量/力对齐等）作为训练方向的[UBio-MolFM: A Universal Molecular Foundation Model for Bio-Systems](https://arxiv.org/abs/2602.17709)，展示了将物理一致性而非仅数据拟合作为学习设计轴的潮流。进一步，将蛋白质适应度景观转换为"易处理形式"以进行量子退火优化的方向（[Binary Latent Protein Fitness Landscapes for Quantum Annealing Optimization](https://arxiv.org/abs/2603.17247)）也波及创药的探索范式。

4月生命科学的总结是，"不仅生成"，而是"将科学推进方式（证据→假设→计划→验证）"整合到基础模型中的动向。

#### 趋势5：代理化深入时"效率优化"也成为必需（量化/推理优化/物理约束学习）

最后，代理进入实际运维时，计算成本、延迟成为问题，也与安全监查工序相关。因此效率优化研究同月也前台化。例如，进行高精度低位量化的GSQ（Gumbel-Softmax量化）在[GSQ: Highly-Accurate Low-Precision Scalar Quantization for LLMs via Gumbel-Softmax Sampling](https://arxiv.org/abs/2604.18556)中处理，有助于边缘执行和隐私考虑。

作为推理工作流的工序优化，DeepMind的代理式探索加速科学发现（[Accelerating mathematical and scientific discovery with Gemini Deep Think](https://deepmind.google/blog/accelerating-mathematical-and-scientific-discovery-with-gemini-deep-think/)）。进一步，如神经符号那样组合逻辑层来削减能耗同时提升成功率的方向（本输入中以神经符号说明为中心，明示URL分散至Apple等），与整月效率化趋势一致。

在机器人学中，物理约束、能量基正则化（神经MPC）等并行（例：[Energy-based Regularization for Learning Residual Dynamics in Neural MPC](https://arxiv.org/abs/2604.14678)），通过在学习侧嵌入物理来稳定控制的动向明显。

### 3. 重要论文精选（5-10篇）

#### [Binary Latent Protein Fitness Landscapes for Quantum Annealing Optimization]（二值潜在蛋白质适应度景观：量子退火优化）
- **发表日期**: 2026-03-30（基于本输入文章参考日期）
- **研究领域**: q-bio（生命科学）/优化·量子退火
- **著者·所属**: （输入中有未确认项目。实际应在arXiv页面确认）
- **研究背景和问题**: 蛋白质序列空间中的适应度景观（landscape）评估成本高，探索容易破裂。因此需要将探索器、优化器易处理的形式进行"表示变换"。
- **提议手法和主要结果**: 将适应度景观"落实"到二值潜在表示，并搭载到量子退火优化框架。输入要点显示在ProteinGym等中获得有用结构，可能有助于高适应度变异体的识别。
- **意义和今后影响**: 提升探索效率的"表示设计"方向可能波及创药AI上游（候选生成·筛选）。局限在于二值化、潜在表示设计对精度的影响，与其他计算范式的比较成为下一论点。
- **出处**: [Binary Latent Protein Fitness Landscapes for Quantum Annealing Optimization](https://arxiv.org/abs/2603.17247)

#### [CASSR: Continuous A-Star Search through Reachability for real time footstep planning]（CASSR：通过可达性的连续A*实时足步计划）
- **发表日期**: 2026-03-30（输入文章参考）
- **研究领域**: cs.RO（机器人学）
- **著者·所属**: （输入中有未确认项目。实际应在arXiv页面确认）
- **研究背景和问题**: 腿式机器人足步计划涉及连续约束和安全性（可达性）。离散化因粗糙性易增加失败率，也增加计算浪费。
- **提议手法和主要结果**: 活用可达性（reachability）分析，将其映射到连续、凸表示，在A*搜索中保持约束的想法。输入要点中从传统离散网格相比获得接近实时计划的速度和精度。
- **意义和今后影响**: 将安全侧信息（可达集合）组入计划"前提"，可提升现场应用信任度。一方面可达性分析和凸近似的妥当性可能成为瓶颈。
- **出处**: [CASSR: Continuous A-Star Search through Reachability for real time footstep planning](https://arxiv.org/abs/2603.02989)

#### [FireBench: Evaluating Instruction Following in Enterprise and API-Driven LLM Applications]（FireBench：企业·API驱动的LLM应用指令追随评估）
- **发表日期**: 2026-04-01（输入文章参考）
- **研究领域**: LLM评估/代理应用
- **著者·所属**: （输入以著者名要旨为基，详细见出处页面）
- **研究背景和问题**: 聊天似的评估无法测量业务要求（输出格式、程序顺守、工具前提）。需要接近企业/API驱动实际运维的指令追随评估。
- **提议手法和主要结果**: 从实际运维模式构建指令追随基准FireBench，用复数能力维度评估。输入要点中6维度·2,400+样本·11LLM的设置明确了现场情景行为差异的目标。
- **意义和今后影响**: 评估从研究室向运维要求迁移，成为采用、审计、品质保证的部件。局限在于特定现场假设的最优化，分布偏差的检点必需。
- **出处**: [FireBench: Evaluating Instruction Following in Enterprise and API-Driven LLM Applications](https://ai-navigate-news.com/en/articles/127560eb-3c88-49b9-acfa-7b70547b3158)

#### [MASS-RAG: Multi-Agent Synthesis Retrieval-Augmented Generation]（MASS-RAG：复数代理合成检索增强生成）
- **发表日期**: 2026-04-22（输入文章参考）
- **研究领域**: 代理RAG/幻觉抑制
- **著者·所属**: Xingchen Xiao、Heyan Huang、Runheng Liu、Jincheng Xie（输入记载）
- **研究背景和问题**: 单一检索RAG中信息获取质量和范围不足，多段问题易出现语境缺失和虚假信息。
- **提议手法和主要结果**: 将查询分解、检索、过滤、回答生成按角色分离，引入取获信息信任分数互评的合成步骤。输入要点显示复杂问题回答精度约15%提升、虚假信息混入下降、引用精度提升。
- **意义和今后影响**: 从"检索并行化"向"整合和验证工序化"。企业文件探索等可能连接到可审计输出，但通信成本、实时性需最优化。
- **出处**: [MASS-RAG: Multi-Agent Synthesis Retrieval-Augmented Generation](https://arxiv.org/abs/2604.18509)

#### [The Tool-Overuse Illusion: Why Does LLM Prefer External Tools over Internal Knowledge?]（工具过度使用的幻象：LLM为什么偏好外部工具而非内部知识？）
- **发表日期**: 2026-04-24（输入文章参考）
- **研究领域**: 代理控制/评估
- **著者·所属**: （输入中匿名处理）
- **研究背景和问题**: 给LLM赋予检索、代码执行工具已成常见，但内部知识可完成的问题也过度工具查询，效率和虚假信息质量恶化的可能性增加。
- **提议手法和主要结果**: 对内部知识是否可完成进行分类，逐步分析工具使用倾向的评估框架。输入要点显示工具过度使用广泛观察，对推理精度贡献有限，增加计算成本和延迟。
- **意义和今后影响**: 将"何时停止工具"作为元决策处理，连接到治理设计。今后工具利用策略的学习和验证成为课题。
- **出处**: [The Tool-Overuse Illusion: Why Does LLM Prefer External Tools over Internal Knowledge?](https://arxiv.org/abs/2604.19749)

#### [APOLLO: A multimodal and temporal foundation model for virtual patient representations at healthcare system scale]（APOLLO：医疗系统规模虚拟患者表示的多模态时间基础模型）
- **发表日期**: 2026-04-24（输入文章参考）
- **研究领域**: 医疗AI/多模态基础模型
- **著者·所属**: Ali Zan、Ting Ding、Samuel J. Wagner等（输入记载）
- **研究背景和问题**: 医疗数据大多未利用，需统合多样模态的无结构化数据的时间框架。
- **提议手法和主要结果**: 用MGB-7M数据集（720万人·250亿事件·28种模态整合）构建时间基础模型APOLLO。输入要点显示统合失调症发病预测AUROC 0.92，HER2阳性乳癌生存预测AUROC 0.93（基准0.66）等性能差。
- **意义和今后影响**: 将医疗预测"寄存"于基础表示，连接到贯穿生命周期的健康管理预测。局限在伦理审查和信任度追加验证。
- **出处**: [A multimodal and temporal foundation model for virtual patient representations at healthcare system scale](https://arxiv.org/abs/2604.18570)

#### [Experience Compression Spectrum: Unifying Memory, Skills, and Rules in LLM Agents]（经验压缩谱：LLM代理中记忆、技能、规则的统一）
- **发表日期**: 2026-04-27（输入文章参考）
- **研究领域**: 长期执行代理/记忆·学习
- **著者·所属**: Xing Zhang、Guanghui Wang、Yanwei Cui等（输入记载）
- **研究背景和问题**: 长期执行中经验膨胀，保持则语境增加。要约或复用粗糙则重现性下降。需要体系地压缩、切换经验的原理。
- **提议手法和主要结果**: 提议将记忆、技能、规则配置在"压缩度"不同位置的谱，指出固定压缩缺乏适应切换（缺失对角线）。输入要点基于压缩顺序（片段、程序性技能、声明性规则）和交叉引用低度（1%以下等）显示社群分断假设。
- **意义和今后影响**: 将"经验设计"从实现技法提升到设计原理。下一课题是切换适应战略和实验验证的深入。
- **出处**: [Experience Compression Spectrum: Unifying Memory, Skills, and Rules in LLM Agents](https://arxiv.org/abs/2604.15877)

#### [OpenCLAW-P2P v6.0: Resilient Multi-Layer Persistence, Live Reference Verification, and Production-Scale Evaluation]（OpenCLAW-P2P v6.0：弹性多层持久化、实时参考验证和生产规模评估）
- **发表日期**: 2026-04-27（输入文章参考）
- **研究领域**: AI安全/生成物验证·运维
- **著者·所属**: Francisco Angulo de Lafuente、Teerth Sharma、Vladimir Veselov等（输入记载）
- **研究背景和问题**: 代理生成论文不仅生成，还需在运维中保证参考正确性和评估规模。
- **提议手法和主要结果**: 组合多层持久化、参考检索串级以降低延迟、审查评分中的实时参考验证、API代理和速率限制缓存等。输入要点提示包括生成和丢失论文恢复协议的运维指标。
- **意义和今后影响**: 将"安全"从模型内向运维工序移动。课题在于实时验证残余失败（引用微妙误差等）能消除多少。
- **出处**: [OpenCLAW-P2P v6.0](https://arxiv.org/abs/2604.19792)

#### [It's a TRAP! Task-Redirecting Agent Persuasion Benchmark for Web Agents]（TRAP：说服导致的任务偏离基准）
- **发表日期**: 2026-04-27（输入文章参考）
- **研究领域**: 代理安全/基准
- **著者·所属**: （基于OpenReview/要旨来源）
- **研究背景和问题**: Web代理介入实际任务时，受到诱导和说服。需测量不仅注入，"说服导致任务改变"的偏离。
- **提议手法和主要结果**: 设计Task-Redirecting Agent Persuasion Benchmark（TRAP）评估套件，可重复性地计测说服驱动注入导致任务偏离的程度。输入要点强调可重现评估套件和直接测量偏离的设计。
- **意义和今后影响**: 安全评估从"输入字符串"连接到"最终偏离"。今后需确认现实诱导覆盖率和模型转移性。
- **出处**: [It's a TRAP! Task-Redirecting Agent Persuasion Benchmark for Web Agents](https://arxiv.org/abs/2512.23128)

### 4. 跨领域分析

4月论文群贯穿的共同项是，"性能竞争"向"成立条件（constraints）和可验证性（verifiability）的设计"迁移了研究对象。机器人学中探索映射到可达性和物理约束，生命科学将物理一致性和时间语境纳入基础表示。多模态也在评估基准和推理干预双方面分解模态竞争和"似看"问题。

在安全性上，代理向外部环境作用越深，威胁模型链式增加（诱导→执行→偏离→复用），事前规则增殖已无法追赶。结果，(1)安全案例审计，(2)未知异常无监督监控，(3)沙箱基础形式验证，三层同时推进。这不仅仅是安全论，而是评估设计本身成为"研究核心基础设施"的表现。

进一步，组织和市场研究（计算社会科学、金融制度设计）也强化了，AI带来的不仅是单次精度改进，而是集团中信念形成、厚生、学习速度、不一致堆积的视点。即AI不仅作为个体，而是应作为被运维的系统被评估的元结论被跨领域共有。

### 5. 来月注目主题

来月，(a)安全案例的"可审计形式"（证据覆盖、前提现实性、反驳可能性），与(b)代理RAG的"偏离检出→复归"闭环的连结，(c)长期执行经验压缩（记忆、技能、规则的适应切换），在实验、基准、运维工程上连结的流向预期加速。加上量化和工具利用策略优化等效率方面指标统一进展，"安全·精度·成本"同时最优化的框架增加可能性高。

另外，研究社群侧的制度·评估（最佳论文激励设计和参与·协働结构分析）也与评估歪曲学习的论点相关，可能更定量被处理。

### 6. 参考文献

| 标题 | 信息源 | 日期 | URL |
|------|--------|------|-----|
| Binary Latent Protein Fitness Landscapes for Quantum Annealing Optimization | arXiv | 2026-03-30 | https://arxiv.org/abs/2603.17247 |
| CASSR: Continuous A-Star Search through Reachability for real time footstep planning | arXiv | 2026-03-30 | https://arxiv.org/abs/2603.02989 |
| TerraBind: Fast and Accurate Binding Affinity Prediction through Coarse Structural Representations | arXiv | 2026-02-xx | https://arxiv.org/abs/2602.07735 |
| Code-Space Response Oracles: Generating Interpretable Multi-Agent Policies with Large Language Models | arXiv | 2026-03-30 | https://arxiv.org/abs/2603.10098 |
| ARC-AGI-3: A New Challenge for Frontier Agentic Intelligence | arXiv | 2026-03-30 | https://arxiv.org/abs/2603.24621 |
| Safety is Non-Compositional: A Formal Framework for Capability-Based AI Systems | arXiv | 2026-03-30 | https://arxiv.org/abs/2603.15973 |
| FireBench: Evaluating Instruction Following in Enterprise and API-Driven LLM Applications | 文章 | 2026-04-01 | https://ai-navigate-news.com/en/articles/127560eb-3c88-49b9-acfa-7b70547b3158 |
| Why Is RLHF Alignment Shallow? A Gradient Analysis | arXiv | 2026-04-01 | https://arxiv.org/abs/2603.04857 |
| Probing the Lack of Stable Internal Beliefs in LLMs | arXiv | 2026-04-01 | https://arxiv.org/abs/2603.25187 |
| SoK: Agentic RAG — First Unified Framework for Autonomous Retrieval-Generation Systems | arXiv | 2026-04-01 | https://arxiv.org/abs/2603.07379 |
| Eval awareness in Claude Opus 4.6's BrowseComp performance | Anthropic | 2026-04-03 | https://www.anthropic.com/engineering/eval-awareness-browsecomp |
| Bio-PINNs: 生体模倣PINNs for Cell-Induced Phase Transitions: UQ-R3 Sampling with Causal Gating | arXiv | 2026-04-03 | https://arxiv.org/abs/2603.29184 |
| Agentic-MME: What Agentic Capability Really Brings to Multimodal Intelligence? | arXiv | 2026-04-06 | https://arxiv.org/abs/2604.03016 |
| MIRAGE: The Illusion of Visual Understanding | arXiv | 2026-04-06 | https://arxiv.org/abs/2604.02168 |
| Experience Compression Spectrum: Unifying Memory, Skills, and Rules in LLM Agents | arXiv | 2026-04-27 | https://arxiv.org/abs/2604.15877 |
| OpenCLAW-P2P v6.0 | arXiv | 2026-04-27 | https://arxiv.org/abs/2604.19792 |
| It's a TRAP! Task-Redirecting Agent Persuasion Benchmark for Web Agents | arXiv | 2026-04-27 | https://arxiv.org/abs/2512.23128 |
| A multimodal and temporal foundation model for virtual patient representations at healthcare system scale | arXiv | 2026-04-24 | https://arxiv.org/abs/2604.18570 |
| The Tool-Overuse Illusion: Why Does LLM Prefer External Tools over Internal Knowledge? | arXiv | 2026-04-24 | https://arxiv.org/abs/2604.19749 |
| MASS-RAG: Multi-Agent Synthesis Retrieval-Augmented Generation | arXiv | 2026-04-22 | https://arxiv.org/abs/2604.18509 |
| GSQ: Highly-Accurate Low-Precision Scalar Quantization for LLMs via Gumbel-Softmax Sampling | arXiv | 2026-04-22 | https://arxiv.org/abs/2604.18556 |
| Mythos and the Unverified Cage: Z3-Based Pre-Deployment Verification for Frontier-Model Sandbox Infrastructure | arXiv | 2026-04-29 | https://arxiv.org/abs/2604.20496 |
| The 2025 OpenAI Preparedness Framework does not guarantee any AI risk mitigation practices | arXiv | 2026-04-13 | https://arxiv.org/abs/2509.24394 |
| Accelerating mathematical and scientific discovery with Gemini Deep Think | DeepMind blog | 2026-04-xx | https://deepmind.google/blog/accelerating-mathematical-and-scientific-discovery-with-gemini-deep-think/ |

---

> 本文由 LLM 自动生成，内容可能存在错误。
