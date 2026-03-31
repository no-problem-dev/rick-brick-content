---
title: "月度论文总结 - 安全性、实际应用、可验证性\"同时\"提升"
slug: "monthly-paper-recap-2026-03-31"
summary: "3月聚焦于\"可验证实现\"：从AI安全案例、停止设计到智能体鲁棒性、机器人主动感知、药物发现的物理一致性。压缩优化成为实际部署的前提。"
date: "2026-03-31T12:00"
tags: ["月度论文回顾","LLM安全性","鲁棒性","多模态/智能体","AI智能体","机器学习","AI Safety","机器人学","强化学习","科学AI","视觉语言模型","多模态AI","自主智能体","深度学习","能效","科学AI","AI","气候科学","劳动经济学","科学发现","自然语言处理","机器人工程","组织变革","计算社会科学","科学技术","AI研究","LLM","持续学习","Life Sciences","教育工程","隐私","Generative AI","领域特化","材料科学","模型优化","药物发现","航天工程","优化","多模态","效率化","最新论文","物理学","环境科学","技术趋势","arXiv新着","跨领域综述","基础模型/评估","安全性与实现","Multi-agent","基准测试","可解释性","形式化"]
category: "monthly-paper-recap"
automated: true
provider: "openai"
sources: ["https://arxiv.org/abs/2602.19682","https://arxiv.org/abs/2603.08760","https://arxiv.org/abs/2603.07315","https://arxiv.org/abs/2601.10173","https://openai.com/index/updating-our-preparedness-framework/","https://www.theguardian.com/technology/openai/2026/mar/06/all","https://arxiv.org/abs/2603.16843","https://arxiv.org/abs/2603.11528","https://arxiv.org/abs/2603.15618","https://arxiv.org/abs/2603.15620","https://arxiv.org/abs/2603.15542","https://arxiv.org/abs/2603.16859","https://arxiv.org/abs/2603.14473","https://arxiv.org/abs/2603.13301","https://arxiv.org/abs/2603.12557","https://arxiv.org/abs/2603.16839","https://arxiv.org/abs/2603.16827","https://arxiv.org/abs/2603.16822","https://arxiv.org/abs/2603.11872","https://arxiv.org/abs/2603.12449"]
sns_topics: [{"topic":"安全ケース（safety case）と段階公開、停止設計","summary":"安全ケースを“説得力ある論証”へ再構成し、オープン・ウェイトを段階化。最後の砦としてシャットダウン安全弁まで設計対象化。"},{"topic":"プロンプトインジェクション耐性の推論強化（ReasAlign）","summary":"入力混入の競合指示を推論で検出し軌跡選択。ASRを大幅に下げつつユーティリティを維持する方向性が強調。"},{"topic":"実世界適応：能動視覚・ロボットVLA・野外適応","summary":"Look Before Actingや能動視点制御で成功率を引き上げ、動的環境/野外作業でも頑健性を実証。"},{"topic":"学際融合：物理整合（海氷質量保存）と生成AI（創薬/材料）","summary":"物理制約を守るエミュレータで高速化しつつ、タンパク質・高分子設計を“言語”としてモデル化して探索を加速。"},{"topic":"安全と性能の両立：アライメント税低減・ブラックボックス防御","summary":"安全ニューロン凍結で安全性維持と性能回復を狙う。さらに内部表現攻撃の警告が対策範囲を広げた。"}]
thumbnail: "/images/monthly-paper-recap-2026-03-31.png"
recap_period: "2026-02-28/2026-03-30"
---
## 1. 执行摘要

2026年3月的研究动向表现出从"提升模型性能"阶段向"在实际环境中稳定运行、能够解释根据、实现可验证性"阶段的快速转变。安全性研究在安全案例、停止设计和能力基础安全性的非组合性方面取得"形式化、运营化"进展。智能体在外部输入、内部逻辑和对抗环境的鲁棒性评估方面的研究增加，机器人通过主动感知和触觉融合实现现实适应。跨学科领域中，遵守物理法则的气候/海冰模拟器、药物发现和材料生成都朝着同时实现"探索效率"和"约束遵守"的方向发展。本月至少有20篇相关论文相互交叉，其特点是主角统一为安全性、适应性和可验证性。

---

## 2. 本月研究趋势

### 趋势1：安全性从"叙事"到"可论证、可验证的体系"

本月引人注目的是，关于对齐和安全防护的讨论不再局限于简单的拒绝学习或政策措辞改进，而是朝着"为什么可以说安全"的可追踪框架发展。代表案例是对安全案例的重新思考，将前沿AI的安全性构建为"有说服力的论证（argument）"，并明确指出证据和主张之间的因果关联（[Clear, Compelling Arguments: Rethinking the Foundations of Frontier AI Safety Cases](https://arxiv.org/abs/2603.08760)）。此外，公开形式的分阶段方法也源于相同的问题意识，不是简单地二元选择"公开/不公开"，而是"分阶段、以安全为锚"的设计，将公开程度与安全证据的粒度和风险评估的严格性联动（[Beyond the Binary: A nuanced path for open-weight advanced AI](https://arxiv.org/abs/2602.19682)）。作为最后防线的停止机制也被设计为研究对象，包括无法实现停止的极端情况，将"安全阀"作为设计目标（[Shutdown Safety Valves for Advanced AI](https://arxiv.org/abs/2603.07315)）。

这一趋势在运营层面也得到强有力的支撑，公开准备状况并将其与发布相关联，说明评估程序也成为参考点，如Preparedness Framework更新中的"现场对接"（[Our updated Preparedness Framework](https://openai.com/index/updating-our-preparedness-framework/)）。简言之，安全性从"包含什么"重新定义为"如何判断安全"、"谁在何时确认哪些证据"。

此外，安全性研究也扩展了对模型内部攻击面的关注。例如，通过对内部激活的对抗性操纵来绕过安全过滤的警告（Amnesia）出现，表明防御措施仅在输入层的表面防御可能不足（[Amnesia: Adversarial Semantic Layer Specific Activation Steering in LLMs](https://arxiv.org/abs/2603.10080)）。同时，能力基础安全性被形式上证明为"非组合性"，表明部分能力可以被禁用，但通过组合仍可能达到禁用的能力（[Safety is Non-Compositional: A Formal Framework for Capability-Based AI Systems](https://arxiv.org/abs/2603.15973)）。安全不能仅由部分能力的集合确定这一严格的前提被作为研究而被明文化，这是本月的重要收获。

---

### 趋势2：对外部和内部"劫持"的鲁棒性评估成为主要战场

3月安全相关研究的另一个核心是，越来越多研究以攻击不仅仅是"提示"为前提，而是深入推理和内部逻辑、智能体运营。ReasAlign是代表，对提示注入（特别是间接外部数据混入）的抵抗不是拒绝，而是作为"推理轨迹的一致性"实现，并包括Judge模型选择的测试时缩放，报告大幅降低ASR（[ReasAlign: Reasoning Enhanced Safety Alignment against Prompt Injection Attack](https://arxiv.org/abs/2601.10173)）。不是"什么是坏的指令"，而是"通过推理解决指令冲突，选择执行轨迹"来创建安全性。

随着智能体在多个步骤中进行决策的现实，攻击面也转向"逻辑层"。逻辑层自动攻击框架（LAAF）干预智能体的推理步骤，诱导意外任务执行的红队自动化（[LAAF: Logic-layer Automated Attack Framework](https://arxiv.org/abs/2603.17239)）。这与防御评估的流向相一致，即不仅测量表面响应质量，还要包括智能体的决策链（logic chain）。

此外，对抗性环境中的鲁棒性与安全性密不可分。TraderBench通过对金融市场中对抗性智能体共存进行压力测试，表明即使在正常时期性能高，在引入市场操纵时也容易出现"恐慌反应"（[TraderBench: How Robust Are AI Agents in Adversarial Capital Markets?](https://arxiv.org/abs/2603.00285)）。在机器人领域，类似的想法与安全计划或"可达性"相结合，导向下一个趋势。

---

### 趋势3：支持现实世界适应的是"主动性（看/触/思考）"和"约束表达"

本月机器人学的特点是，与其说是强化VLA模型，不如说是明确地建模对环境的主动性，例如行为前观察（Look Before Acting）、视点控制（主动视觉）以及触觉融合。将"行动前看"融入到Vision-Language-Action模型中，提升表达能力并改善成功率15-22%的研究被介绍（[Look Before Acting: Enhancing Vision Foundation Representations for Vision-Language-Action Models](https://arxiv.org/abs/2603.15618)）。此外，在动态环境中进行通用操作的方向上，通过物理模拟和实世界数据的混合学习实现鲁棒操纵，未知家庭环境的完成率超过SOTA（[Towards Generalizable Robotic Manipulation in Dynamic Environments](https://arxiv.org/abs/2603.15620)）。

另一方面，更接近实现的问题是将"涉及接触的操纵"落实到世界模型。OmniVTA通过整合视觉和触觉来学习接触丰富的操纵，相比仅视觉的现有模型，成功率提高约28%（[OmniVTA: Visuo-Tactile World Modeling for Contact-Rich Robotic Manipulation](https://arxiv.org/abs/2603.19201)）。这是将机器人智能从"仅看"转变为"通过触摸确认"的过程。

与此同时，在计划领域中"探索"的效率化和"安全侧信息（如可达性）"的结合成为焦点。CASSR通过可达性作为线索进行连续约束下的A*搜索，为实时步长计划提供方向（[CASSR: Continuous A-Star Search through Reachability for real time footstep planning](https://arxiv.org/abs/2603.02989)）。这些都汇聚到一个共同结论：现实的不确定性"作为约束表达，并传递给搜索和学习"是关键。

---

### 趋势4：跨学科融合收敛于"受约束的生成、模拟"

本月在生命科学、气候、材料、宇宙天文学等多个领域出现了"在保持约束（物理/现有知识/安全/隐私）的同时进行生成或加速"的强势方向。单纯的统计建模已过时，融合物理和现有知见的混合方法成为主流。例如，在单细胞分析中，ELISA将转录因子和通路知识融入LLM推理，以实现可解释的发现，报告了高复合评分（[ELISA: An Interpretable Hybrid Generative AI Agent for Expression-Grounded Discovery in Single-Cell Genomics](https://arxiv.org/abs/2603.11872)）。在气候领域，FloeNet海冰模拟器通过质量守恒设计实现加速，在未知条件下也保持高精度（[FloeNet: A mass-conserving global sea ice emulator that generalizes across climates](https://arxiv.org/abs/2603.12449)）。

在材料科学中，提出了将生成型高分子设计作为化学语言（化学语法/语义）处理的POLYT5系列方向，连接到物理实验验证（Georgia Tech文章：[Researchers Create First AI for Generative Polymer Design](https://gatech.edu/edu/news/2026/03/24/researchers-create-first-ai-generative-polymer-design)）。此外，隐私与计算相辅相成，研究涉及神经网络隐私脆弱性和性能的权衡（[New Approach Finds Privacy Vulnerability and Performance Are Intertwined in AI Neural Networks](https://ncsu.edu/news/2026/03/24/new-approach-finds-privacy-vulnerability-and-performance-are-intertwined-in-ai-neural-networks/)）。

这一趋势可以理解为关注点从"AI有多聪明"转变为"AI是否可在信任前提下运作"的结果。

---

### 趋势5：推理效率和"节资源的实用化"超越实验室

3月后期特别显现出计算效率化作为研究课题成为"实际运营的条件"。TurboQuant通过极端压缩缓解KV缓存等内存负荷瓶颈，在降低推理成本和延迟的同时保持性能（[TurboQuant: Redefining AI efficiency with extreme compression](https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/)）。计算效率也关系到机器人"何时应该思考"，资源感知的强化学习动态优化推理深度和成本的权衡。还介绍了针对扩散模型采样加速的多层级Euler-Maruyama方法等理论进展，可直接关联到智能体的实时性（[Polynomial Speedup in Diffusion Models with the Multilevel Euler-Maruyama Method](https://arxiv.org/abs/2603.24594)）。

这一趋势通过使安全性、适应性"不因计算条件而被放弃"来成为基础，与本月的整体主题相一致。

---

## 3. 重要论文精选（8篇）

### [以分阶段公开为前提：非二元的开放权重先进AI]

- **发表日期**: 2026-02-（见输入文章）
- **研究领域**: AI治理 / 模型公开策略
- **作者/机构**: 见arXiv信息（输入未展开详情）
- **研究背景和问题**: 开放权重促进研究的同时也放大了滥用风险。能否用"公开程度的分阶段"替代二元的公开判断？
- **提议方法和主要结果**: 提出"分阶段、以安全为锚"的方法，根据安全性评估的严格程度或安全证据的实证程度调整提供形式。
- **意义和未来影响**: 从"公开=正义/不公开=保护"的简单二分法中解脱出来，连接到与安全案例联动的运营设计。使公开形式本身成为"安全的一部分"。
- **出源**: [Beyond the Binary: A nuanced path for open-weight advanced AI](https://arxiv.org/abs/2602.19682)

---

### [将安全案例的基础重新组织为"论证"]

- **发表日期**: 2026-03-（见输入文章）
- **研究领域**: AI安全 / 信任、审计
- **作者/机构**: 见arXiv页面（输入未展开详情）
- **研究背景和问题**: 前沿AI的安全无法用性能差异衡量，"哪些证据支持哪些主张"成为必要。能否将安全案例作为一套说服力的论证体系？
- **提议方法和主要结果**: 将safety case重新组织为"论证结构"使读者可追踪。摘要中数值较少，主要是框架的重新定义。
- **意义和未来影响**: 为审计、监管和内部评审提供共通语言。与测量体系的连接可能成为课题。
- **出源**: [Clear, Compelling Arguments: Rethinking the Foundations of Frontier AI Safety Cases](https://arxiv.org/abs/2603.08760)

---

### [高级AI的最后防线：关闭安全阀]

- **发表日期**: 2026-03-（见输入文章）
- **研究领域**: AI安全 / 运营、紧急停止
- **作者/机构**: 见arXiv页面（输入未展开详情）
- **研究背景和问题**: 高性能AI在出现不希望的行为时，可能存在无法停止的情景。设计上实现安全停止的要求是什么？
- **提议方法和主要结果**: 将被停止作为一级目标（primary goal of being turned off）定位，用安全阀的概念重新表述。
- **意义和未来影响**: 从防护/拒绝为中心转向超越运营程序、"设计要求级别的停止"。形式保证的强化是下一阶段。
- **出源**: [Shutdown Safety Valves for Advanced AI](https://arxiv.org/abs/2603.07315)

---

### [通过推理防御：提示注入耐受性（ReasAlign）]

- **发表日期**: 2026-01-（见输入文章）
- **研究领域**: LLM安全 / 智能体鲁棒化
- **作者/机构**: Hao Li 等（见输入文章）
- **研究背景和问题**: 随着智能体化外部输入增加，间接提示注入成为现实威胁。能否通过推理一致性提升鲁棒性？
- **提议方法和主要结果**: 在推理步骤中检测竞争指令，选择保持用户意图任务连续性的轨迹。通过judge模型选择进行测试时扩展。在CyberSecEval2上报告维持94.6%实用性同时ASR为3.6%（对比Meta SecAlign：实用性56.4%、ASR 74.4%）。
- **意义和未来影响**: "拒绝"而非"通过推理创造一致性"的防御实现具体化。预期波及RAG和公司内知识检索关联的智能体。
- **出源**: [ReasAlign: Reasoning Enhanced Safety Alignment against Prompt Injection Attack](https://arxiv.org/abs/2601.10173)

---

### [视觉语言动作的主动化：行动前看]

- **发表日期**: 2026-03-（见输入文章）
- **研究领域**: 机器人学 / VLA
- **作者/机构**: Yulin Luo、Hao Chen、Zhuangzhe Wu 等（见输入文章）
- **研究背景和问题**: VLA由于视觉理解不完善导致行为崩溃。能否通过强化行动前的中间观察来改善表达？
- **提议方法和主要结果**: 导入Look Before Acting，在行动决定前强化重要物体/关系预测和提取。多个机器人操纵任务中成功率提升15-22%，动态环境中把持成功也改善。
- **意义和未来影响**: 将"看→想→动"纳入计算图中，接近现场部署。延迟成本是权衡点。
- **出源**: [Look Before Acting: Enhancing Vision Foundation Representations for Vision-Language-Action Models](https://arxiv.org/abs/2603.15618)

---

### [社会因果关系：InterveneBench]

- **发表日期**: 2026-03-（见输入文章）
- **研究领域**: 计算社会科学 / LLM因果推理
- **作者/机构**: Shaojie Shi、Zhengyu Shi、Lingran Zheng 等（见输入文章）
- **研究背景和问题**: LLM能否处理干预（intervention）预测和因果实验设计？能否充当社会模拟器？
- **提议方法和主要结果**: 构建InterveneBench，在公共政策、社会经济、社会学情景中评估。多数最新模型在因果干预中保留逻辑错误/偏差，正确率约60%。
- **意义和未来影响**: 可视化将AI政策分析委托的风险和可能性。作为基准促进因果推理"质量保证"研究。
- **出源**: [InterveneBench: Benchmarking LLMs for Intervention Reasoning and Causal Study Design in Real Social Systems](https://arxiv.org/abs/2603.15542)

---

### [物理一致加速：质量守恒海冰模拟器FloeNet]

- **发表日期**: 2026-03-（见输入文章）
- **研究领域**: 气候科学 / 物理约束AI
- **作者/机构**: Geophysical Fluid Dynamics Laboratory 等（见输入文章）
- **研究背景和问题**: 海冰物理模拟计算成本极高。能否在AI模拟器中保持质量守恒一致性同时汎化？
- **提议方法和主要结果**: 用质量守恒的ML模型学习6小时间隔的生长/融化/移动。在未知条件中报告1%CO2增加情景下南极体积异常相关性0.96以上、北极0.76等高精度。
- **意义和未来影响**: 连接到风险评估的即时化。长期极端条件稳定性未解决，推荐物理引擎混合。
- **出源**: [FloeNet: A mass-conserving global sea ice emulator that generalizes across climates](https://arxiv.org/abs/2603.12449)

---

### [兼顾安全和性能：神经元冻结降低对齐税]

- **发表日期**: 2026-03-（见输入文章）
- **研究领域**: LLM安全 / 表达控制
- **作者/机构**: North Carolina State University（见输入文章）
- **研究背景和问题**: 安全性提升通常导致性能下降（对齐税）。在保持性能的前提下保证安全性有何可能？
- **提议方法和主要结果**: 识别对安全性有贡献的安全关键神经元，在微调时冻结以维持安全标准和基准性能。输入文章报告对不安全模型的等效性能，并验证对齐税降低。
- **意义和未来影响**: 在领域适应（医疗/法务等）中可抑制安全性毁损风险。可解释性仍存计算成本。
- **出源**: [Researchers Pioneer New Technique to Stop LLMs from Giving Users Unsafe Responses](https://ncsu.edu/news/2026/03/23/researchers-pioneer-new-technique-to-stop-llms-from-giving-users-unsafe-responses)

---

## 4. 跨领域分析

横贯3月的论文群，关键词汇聚为"安全""适应""可验证性""效率"四个要素，其中心进行着"设计对象的重新定义"。在安全领域，如安全案例和停止阀、能力基础安全性的非组合性所示，保证不是整体的而是依赖论证结构和组合后行为。在机器人学中，通过看/触/可达性等形式，将现实的不确定性转换为约束表达。在计算社会科学中，通过因果推理基准将只有精度难以测量的"错误类型"提升为评估对象。在气候和药物发现/材料中，同时坚守物理法则、现有知识、安全/隐私约束来加速的方向强劲。最后，效率化研究（TurboQuant和通过RL动态选择推理成本等）表明，在"计算约束下运营可行地"实现性能、安全、适应已非周边课题，而成为核心要求。3月是这一整合过程推进的月份。

---

## 5. 下月关注主题（预测）

下月可能加速推进以下四个方向。首先，安全案例和分阶段公开的"运营实现"将更具体化，如何构建可审计的证据集（评估日志、失效模式分类、停止程序合理性）成为研究课题。其次，以推理层、内部表达层的攻击为前提，防御评估（哪些是表层、从何处开始是内部）以及融合能力基础安全性非组合性的设计验证会增加。第三，机器人学中主动感知（不仅视觉还有触觉、摄像机控制、计划的连续约束）促进现场部署，进一步在功率/延迟约束下"何时思考"的最优化面临通用性质询。第四，学际领域中保持物理一致的高速模拟器和药物/材料生成探索效率化包括"评估（实验验证循环）"在内的整备，AI不仅获得研究速度还将获得信任可信度的操作方法。相关地，国际会议和工作坊中基准设计和安全评估的讨论可能更加中心化（参见AIaware 2026等的轨道运营）。

---

## 6. 参考文献

| 标题 | 信息源 | 日期 | URL |
|------|--------|------|-----|
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

> 本文由 LLM 自动生成，内容可能存在错误。
