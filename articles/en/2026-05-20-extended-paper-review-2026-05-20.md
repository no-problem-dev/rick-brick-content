---
title: "Extended Paper Review - Accelerating Scientific Discovery with AI and Next-Generation Robot Control Technology"
slug: "extended-paper-review-2026-05-20"
summary: "This article reviews key academic trends from mid-May 2026, focusing on AI for scientific discovery (Co-Scientist, ERA) and generative models in robotics, based on five studies."
date: "2026-05-20T18:30"
tags: ["AI","Robotics","Life Science","Science and Technology","Computational Science"]
category: "extended-paper-review"
automated: true
provider: "gemini"
sources: ["https://deepmind.google/discover/blog/co-scientist-enabling-breakthroughs-in-liver-disease-research/","https://research.google/blog/empirical-research-assistance-era-from-nature-publication-to-catalyzing-computational-discovery/","https://arxiv.org/abs/2605.13925","https://arxiv.org/abs/2605.14950","https://www.fsu.edu/news/2026/05/19/fsu-chemists-use-sea-sponge-bacteria-to-create-new-molecules-for-drug-discovery/"]
sns_topics: [{"topic":"AI Accelerates Scientific Research","summary":"With DeepMind's Co-Scientist and Google's ERA, a new era is dawning where AI can comprehensively analyze academic papers, generating and validating novel hypotheses in medicine and biology."},{"topic":"Advancements in Robot Control","summary":"Recent papers on dexterous robotic hand manipulation and Visual-Language Action models (VLA) have been released, showcasing rapid progress in sophisticated control using generative technologies like diffusion models."},{"topic":"Breakthroughs in Drug Discovery","summary":"Researchers at Florida State University have announced a breakthrough using bacteria from deep-sea sponges to synthesize complex molecules, paving the way for the development of new pharmaceuticals, such as anti-cancer drugs."}]
thumbnail: "/images/extended-paper-review-2026-05-20.png"
---
### 1. Executive Summary

This article provides an overview of recent academic achievements, primarily from May 19-20, 2026, focusing on the democratization and automation of scientific discovery through AI, and the application of generative models in robotics. Notably, there has been a surge of publications showcasing AI solving scientific challenges through expert-level reasoning and coding, such as Google DeepMind's "Co-Scientist" and Google Research's "ERA." These developments have the potential to fundamentally transform the traditional human-centric hypothesis-testing process. Furthermore, in robotics, advancements in models integrating vision, language, and action continue, leading to improved precision in physical interactions.

### 2. Featured Papers

#### Paper 1: Accelerating Liver Disease Mechanism Research with Co-Scientist (Life Science & Drug Discovery AI)

- **Authors/Affiliation**: Google DeepMind Research Team
- **Background and Research Question**: It is impossible for humans to grasp all the vast knowledge generated in biomedical research, and in complex conditions like liver disease (MASH), it is challenging to comprehensively search for targets that cover multiple relevant biological processes.
- **Proposed Method**: Developed an agent-based system called "Co-Scientist." This system is equipped with the ability to comprehensively analyze vast scientific literature and generate novel hypotheses by navigating the existing web of knowledge.
- **Key Results**: Generated the hypothesis that the NLRP3 inflammasome is a molecular bridge between inflammation and metabolism, explaining the limited efficacy of the liver disease treatment drug "resmetirom." This hypothesis has been experimentally validated and will accelerate the development of future dual-target therapies.
- **Significance and Limitations**: Demonstrated the potential to accelerate research as if scientists were wearing "jetpacks." Limitations include the fact that human experimental validation is still indispensable for evaluating the validity of AI-generated hypotheses.

[Co-Scientist: Enabling breakthroughs in liver disease research](https://deepmind.google/discover/blog/co-scientist-enabling-breakthroughs-in-liver-disease-research/)

#### Paper 2: "ERA", an AI Coding Tool Accelerating Scientific Discovery (Computational Social Science & Others)

- **Authors/Affiliation**: Google Research, Lizzie Dorfman, Michael Brenner, et al.
- **Background and Research Question**: Developing scientific computational models requires advanced coding skills, which has been a bottleneck for many researchers.
- **Proposed Method**: Developed an AI tool called "Empirical Research Assistance (ERA)." ERA uses a tree-search approach to generate and modify code optimized for given scientific goals.
- **Key Results**: Achieved expert-level performance across benchmarks in diverse fields including genomics, public health, satellite image analysis, and mathematics. Notably, it showed top-tier accuracy in predicting respiratory virus hospitalizations using CDC indicators.
- **Significance and Limitations**: Democratizes access to advanced computational tools, allowing researchers in all fields to use AI as a "collaborator." Dependence on code execution environments and data reliability remains an operational challenge for the future.

[Empirical Research Assistance (ERA): From Nature publication to catalyzing Computational Discovery](https://research.google/blog/empirical-research-assistance-era-from-nature-publication-to-catalyzing-computational-discovery/)

#### Paper 3: Investigating Intelligence for Dexterous Hand Manipulation in Robots (Robotics)

- **Authors/Affiliation**: Weiguang Zhao, Xihao Guo, Tian Liang, et al.
- **Background and Research Question**: "Dexterous Hand Manipulation," enabling robots to perform complex and delicate object manipulations like humans, is one of the greatest challenges in robotics.
- **Proposed Method**: Systematically surveyed and classified the latest trends in control approaches using generative policies (such as diffusion models and flow matching). It particularly elucidates how methods like "WarmPrior," which incorporates past action history, improve success rates.
- **Key Results**: Presented findings that significantly improve task success rates using probabilistic approaches, going beyond simple imitation learning (Behavior Cloning). It also suggested the possibility of reflexive responses using tactile information by aligning visual representations with tactile manifolds.
- **Significance and Limitations**: Showed a path towards robots acquiring reflexive behaviors akin to "feeling" rather than just "touching." Overcoming the Sim-to-Real gap remains an ongoing challenge.

[Towards Robotic Dexterous Hand Intelligence: A Survey](https://arxiv.org/abs/2605.13925)

#### Paper 4: Lightweight Depth-Enhanced Vision-Language-Action Model "Evo-Depth" (Robotics)

- **Authors/Affiliation**: Tao Lin, Yuxin Du, Jiting Liu, et al.
- **Background and Research Question**: In recent robot learning, models combining vision and language have garnered attention, but the handling of depth (distance) information and computational cost have been barriers to practical application.
- **Proposed Method**: Proposed "Evo-Depth," a lightweight Vision-Language-Action (VLA) model enhanced with depth information. It employs a routing network that suppresses noise from irrelevant background information and focuses on areas essential for the task.
- **Key Results**: Achieved SOTA (State-of-the-Art) performance in 17 robot tasks. Despite a very lightweight parameter count, it succeeded in dramatically reducing errors in regions irrelevant to the task.
- **Significance and Limitations**: Demonstrated that advanced AI control is possible even for robot devices with limited power consumption and computational resources. Further verification of the model's adaptability in unknown environments is needed regarding its generalization capabilities.

[Evo-Depth: A Lightweight Depth-Enhanced Vision-Language-Action Model](https://arxiv.org/abs/2605.14950)

#### Paper 5: Synthesis of Novel Molecules Using Sponge-Derived Bacteria (Life Science)

- **Authors/Affiliation**: Florida State University, Zackary Firestone, et al.
- **Background and Research Question**: Naturally derived compounds are extremely important in new drug development, but extraction from natural environments has quantitative limitations and cost issues.
- **Proposed Method**: Analyzed bacteria derived from sponges inhabiting the Pacific Ocean and developed a method to synthesize complex molecules in the laboratory from commercially available, inexpensive materials, inspired by their molecular structures.
- **Key Results**: Successfully synthesized complex structures that can be precursors to clinically important anti-cancer drugs, etc., in a cost-effective and reproducible manner. This has significantly facilitated access to biological testing.
- **Significance and Limitations**: Presented a model for sustainable research methods that accelerates drug discovery speed while preventing over-exploitation of natural resources. Further improving the efficiency of the synthesis process is the next step.

[FSU chemists use sea sponge bacteria to create new molecules for drug discovery](https://www.fsu.edu/news/2026/05/19/fsu-chemists-use-sea-sponge-bacteria-to-create-new-molecules-for-drug-discovery/)

### 3. Cross-Paper Analysis

Looking at the selected papers collectively, a common theme emerges: the fusion of "AI's enhanced abstract reasoning capabilities" with "adaptation to the physical world." Tools like Co-Scientist and ERA handle the generation of scientific hypotheses and automation of computations, while robotics-related papers explore sophisticated control models (hand manipulation and VLA models) to translate these results into physical actions.

These interdisciplinary advancements aim to build an "automated science loop" that dramatically shortens the time lag from research to implementation. In particular, the synergy between AI-driven hypothesis generation, as demonstrated by DeepMind, and "hardware-side evolution" like laboratory molecule synthesis by FSU, strongly suggests the possibility that drug discovery research, which once took years, could now iterate in weeks.

### 4. References

| Title                                                                 | Source                 | URL                                                                                                          |
| --------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------|
| Co-Scientist: Enabling breakthroughs in liver disease research         | Google DeepMind        | https://deepmind.google/discover/blog/co-scientist-enabling-breakthroughs-in-liver-disease-research/         |
| Empirical Research Assistance (ERA)                                   | Google Research        | https://research.google/blog/empirical-research-assistance-era-from-nature-publication-to-catalyzing-computational-discovery/ |
| Towards Robotic Dexterous Hand Intelligence: A Survey                 | arXiv                  | https://arxiv.org/abs/2605.13925                                                                             |
| Evo-Depth: A Lightweight Depth-Enhanced VLA Model                       | arXiv                  | https://arxiv.org/abs/2605.14950                                                                             |
| FSU chemists use sea sponge bacteria to create new molecules          | Florida State University | https://www.fsu.edu/news/2026/05/19/fsu-chemists-use-sea-sponge-bacteria-to-create-new-molecules-for-drug-discovery/ |

---

> This article was automatically generated by LLM. It may contain errors.
