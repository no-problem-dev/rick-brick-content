---
title: "扩展论文回顾 - AI加速科学发现与下一代机器人控制技术"
slug: "extended-paper-review-2026-05-20"
summary: "本文基于5项研究，探讨了AI在加速科学发现（如\"Co-Scientist\"、\"ERA\"）和机器人领域生成模型方面的最新进展，涵盖2026年5月中旬的学术热点。"
date: "2026-05-20T18:30"
tags: ["AI","机器人学","Life Sciences","科学技术","计算科学"]
category: "extended-paper-review"
automated: true
provider: "gemini"
sources: ["https://deepmind.google/discover/blog/co-scientist-enabling-breakthroughs-in-liver-disease-research/","https://research.google/blog/empirical-research-assistance-era-from-nature-publication-to-catalyzing-computational-discovery/","https://arxiv.org/abs/2605.13925","https://arxiv.org/abs/2605.14950","https://www.fsu.edu/news/2026/05/19/fsu-chemists-use-sea-sponge-bacteria-to-create-new-molecules-for-drug-discovery/"]
sns_topics: [{"topic":"人工智能加速科学研究","summary":"随着DeepMind的Co-Scientist和Google的ERA等技术的出现，人工智能正以前所未有的方式分析学术论文，生成和验证医学和生物学领域的未知假设，开启了科学研究的新纪元。"},{"topic":"机器人控制的演进","summary":"关于机器人灵巧手操作和视觉语言动作模型（VLA）的最新论文已发布，利用扩散模型等生成技术，机器人控制的先进性正在快速发展。"},{"topic":"药物发现的突破","summary":"佛罗里达州立大学的研究人员宣布了一项成果，他们利用深海海绵衍生的细菌合成复杂分子，为开发新型药物（如抗癌药物）开辟了道路。"}]
thumbnail: "/images/extended-paper-review-2026-05-20.png"
---
### 1. 执行摘要

本文重点介绍2026年5月19日至20日发布的最新学术成果，涵盖AI在科学发现的民主化与自动化，以及生成模型在机器人学领域的应用。值得一提的是，Google DeepMind的"Co-Scientist"和Google Research的"ERA"等AI系统，通过专家级推理和编码能力解决了科学难题，标志着AI在科学研究中的重要突破。此外，机器人学领域在整合视觉、语言和行为的模型方面持续进步，提高了物理交互的精度。

### 2. 注目论文

#### 论文 1: Co-Scientist加速肝脏疾病机制研究（生命科学・药物发现AI）

- **作者・所属**: Google DeepMind 研究团队
- **研究背景与问题**: 医学研究产生海量信息，人类难以完全掌握。尤其在肝脏疾病（MASH）等复杂病症中，寻找涵盖多个生物过程的靶点具有挑战性。
- **提出方法**: 开发了名为"Co-Scientist"的代理系统。该系统能够横向分析大量科学文献，并生成连接现有知识体系的新假设。
- **主要结果**: 提出了关于肝脏疾病治疗药物"resmetirom"奏效有限的假设，认为NLRP3炎症小体是炎症与代谢的分子桥梁。该假设已通过实验验证，有望加速未来双靶点疗法的开发。
- **意义与局限**: 展示了AI能像为科学家装上“喷气背包”一样加速研究。局限在于，AI生成的假设仍需人类实验验证其有效性。

[Co-Scientist: Enabling breakthroughs in liver disease research](https://deepmind.google/discover/blog/co-scientist-enabling-breakthroughs-in-liver-disease-research/)

#### 论文 2: 加速科学发现的AI编码工具"ERA"（计算社会科学・其他）

- **作者・所属**: Google Research, Lizzie Dorfman, Michael Brenner 等
- **研究背景与问题**: 开发科学计算模型需要高级编码技能，成为许多研究者的瓶颈。
- **提出方法**: 开发了名为"Empirical Research Assistance (ERA)"的AI工具。ERA采用树搜索方法，为给定科学目标生成和优化代码。
- **主要结果**: 在基因组学、公共卫生、卫星图像分析、数学等多个基准测试中达到专家级表现。特别是在使用CDC指标预测呼吸道病毒住院率方面，展现了顶尖精度。
- **意义与局限**: 实现了对高级计算工具的普及化访问，使各领域研究者都能将AI作为“合作者”。代码执行环境和数据可靠性仍是未来的操作挑战。

[Empirical Research Assistance (ERA): From Nature publication to catalyzing Computational Discovery](https://research.google/blog/empirical-research-assistance-era-from-nature-publication-to-catalyzing-computational-discovery/)

#### 论文 3: 机器人灵巧手操作的智能研究（机器人学）

- **作者・所属**: Weiguang Zhao, Xihao Guo, Tian Liang 等
- **研究背景与问题**: 机器人实现人类般复杂精细的物体操作（“灵巧手操作”）是机器人学的一大难题。
- **提出方法**: 系统性地调查和分类了使用生成策略（如扩散模型、流匹配）的最新控制方法。特别是，阐明了如"WarmPrior"等考虑历史行为的方法如何提高成功率。
- **主要结果**: 提出了超越简单模仿学习（Behavior Cloning）的概率方法，显著提高了任务成功率。通过将视觉表示与触觉流形对齐，暗示了基于触觉的反射性交互的可能性。
- **意义与局限**: 展示了机器人获得接近“感知”的反射性行为的途径。模拟与现实世界之间的差距（Sim-to-Real）仍是持续的挑战。

[Towards Robotic Dexterous Hand Intelligence: A Survey](https://arxiv.org/abs/2605.13925)

#### 论文 4: 轻量级深度增强型视觉语言动作模型"Evo-Depth"（机器人学）

- **作者・所属**: Tao Lin, Yuxin Du, Jiting Liu 等
- **研究背景与问题**: 近年机器人学习领域关注视觉与语言结合的模型，但深度（距离）信息处理和计算成本是实用化的障碍。
- **提出方法**: 提出了名为"Evo-Depth"的深度信息增强型轻量级VLA（视觉-语言-动作）模型。采用路由网络，抑制了不必要的背景噪声，并专注于任务必需的区域。
- **主要结果**: 在17种机器人任务中达到SOTA（顶尖性能）。参数量轻量，同时显著减少了与任务无关区域的误差。
- **意义与局限**: 证明了在功耗和计算资源受限的机器人设备上也能实现高级AI控制。模型的通用性，尤其是在未知环境中的适应能力，仍需进一步验证。

[Evo-Depth: A Lightweight Depth-Enhanced Vision-Language-Action Model](https://arxiv.org/abs/2605.14950)

#### 论文 5: 利用海绵衍生的细菌合成新分子（生命科学）

- **作者・所属**: Florida State University, Zackary Firestone 等
- **研究背景与问题**: 天然来源的化合物在新药开发中至关重要，但从自然环境中提取存在数量和成本限制。
- **提出方法**: 分析了太平洋海绵衍生的细菌，并以其分子结构为线索，开发了从市售廉价材料在实验室合成复杂分子的方法。
- **主要结果**: 成功以低成本、可重复的方式合成了潜在的临床重要抗癌药物前体等复杂结构，大大简化了生物测试的可及性。
- **意义与局限**: 提出了避免过度开采天然资源，同时加速药物发现的可持续研究模式。合成过程的进一步优化是下一步。

[FSU chemists use sea sponge bacteria to create new molecules for drug discovery](https://www.fsu.edu/news/2026/05/19/fsu-chemists-use-sea-sponge-bacteria-to-create-new-molecules-for-drug-discovery/)

### 3. 论文间横向考察

本次选定的论文群展现了一个共同点：即“AI抽象推理能力的增强”与“物理世界的适应性”的融合。Co-Scientist和ERA等工具负责科学假设的生成和计算的自动化，而机器人学相关的论文则探索将这些结果转化为物理动作的精确控制模型（如灵巧手操作和VLA模型）。

这些跨学科的进展正在构建一个“科学自动化循环”，极大地缩短了从研究到实施的延迟。特别是，DeepMind所展示的AI假设生成能力，与FSU在实验室合成分子等“硬件侧的进化”同步进行，预示着过去需要数年才能完成的药物发现研究，未来可能在数周内完成迭代。

### 4. 参考文献

| 标题 | 信息源 | URL |
|---|---|---|
| Co-Scientist: Enabling breakthroughs in liver disease research | Google DeepMind | https://deepmind.google/discover/blog/co-scientist-enabling-breakthroughs-in-liver-disease-research/ |
| Empirical Research Assistance (ERA) | Google Research | https://research.google/blog/empirical-research-assistance-era-from-nature-publication-to-catalyzing-computational-discovery/ |
| Towards Robotic Dexterous Hand Intelligence: A Survey | arXiv | https://arxiv.org/abs/2605.13925 |
| Evo-Depth: A Lightweight Depth-Enhanced VLA Model | arXiv | https://arxiv.org/abs/2605.14950 |
| FSU chemists use sea sponge bacteria to create new molecules | Florida State University | https://www.fsu.edu/news/2026/05/19/fsu-chemists-use-sea-sponge-bacteria-to-create-new-molecules-for-drug-discovery/ |

---

> 本文由 LLM 自动生成，内容可能存在错误。
