---
title: "Extended Paper Review - The Professionalization of AI and its Penetration into Society and Science"
slug: "extended-paper-review-2026-03-20"
summary: "Reviews 5 recent papers on AI for specialized domains: autonomous scientific discovery, physics-informed climate modeling, labor market impacts, and adaptive robotics. AI is entering practical appl..."
date: "2026-03-20"
tags: ["AI","気候科学","労働経済学","ロボティクス","科学的発見"]
category: "extended-paper-review"
automated: true
provider: "gemini"
sources: ["https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEPGNKZuSTQematzLpMombyD3LlIkXabRUh8i07ypflww_UjUgUlcNEXbNE6L3bJbLpM6ueut5EsnbUCtxcE12zSTfstv9VKCU8QY83JM6zj3J_O7lhkB2aySDaNrdwuw==","https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGV7yHWGLNOcKD-J2hPNXDcOPdZOHjOUqzmCP2C0oGdG34BkEuqgHVh1Moo-QOYjbGjFzPr4jCEJE3-asioLwKSe0QVvCCcSlHPhxIflV-9hV5Biub7TxuhI1tC","https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE0sNrzCbq3DuHKL9BRoBLo9UdVr_-MHBQuCh6svQ_O7lDYxVxLPOQSOvkTVDlYJFCvMCYQDidZtN0R4NNgbDIq0MQz1HOBQDKn4e0UfEbqd8Vr5yB833Bxqky49o3LYsKo","https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG5KLhonzN6oEaz4Sr2NXphkQDlG_W5OcIo3ps_3-9HJXAnpvzphocYTELacduu5nZvUKpCoLSNW6oSUkat9bt_ingopnJ-hsCEOS-xbdJg0PiV92DWLf7bo_Mh42pj","https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHdK3XcTqyrFSO3jaJueNCR2rzLcHqaJW3bKb2wtIxlaHnJm06XaFgGtmHfO6QU2HMbk7K9BT7UZh6bg-C-Kr97_gjjk5bQfhBE0fioQgN9otvxRNy44mTr1JOV","https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHFRG2WjWZQGx6Rx8VZ_BapAeX7yd_q100zFBHSaBTEXcxb92rP6PcCxxXd-OSog_KBDlR2elg4BltMcrVYuyGdEqQSbADAkiXw9GAZK-iFKjbcZOZXYL01yyzXQbLIweljxfudFEIjuFChY1B5T-U2syA=","https://arxiv.org/abs/2603.11872","https://arxiv.org/abs/2603.12449","https://arxiv.org/abs/2603.05710","https://arxiv.org/abs/2603.05982","https://arxiv.org/abs/2603.00285"]
thumbnail: "/images/extended-paper-review-2026-03-20.png"
draft: true
---
### 1. Executive Summary

This review analyzes papers published in mid-March 2026 that demonstrate AI moving beyond general-purpose tools to achieve substantial results in specific expert domains. A notable trend is the prevalence of hybrid approaches that combine agents with physical laws, rather than relying on single AI models. While AI is increasingly taking on advanced roles in "discovery," "prediction," and "adaptation" across diverse fields such as climate science, single-cell genomics, robotics, and financial markets, cautionary notes are also sounded regarding the associated disparities and fairness issues in its societal implementation.

---

### 2. Featured Papers

#### Paper 1: ELISA: An Interpretable Hybrid Generative AI Agent for Expression-Grounded Discovery in Single-Cell Genomics (Life Sciences & Drug Discovery AI)

-   **Authors & Affiliation**: Omar Coser (Columbia University, et al.)
-   **Background & Question**: Single-cell gene expression analysis is a powerful method for understanding cellular diversity, but deriving biologically meaningful hypotheses from vast datasets is extremely difficult for humans. This research asks how reliable and interpretable biological discoveries can be automated by combining data analysis with LLM (Large Language Model) reasoning.
-   **Proposed Method**: The agent, named "ELISA," integrates existing knowledge of transcription factors and pathway analysis into an LLM. It goes beyond mere data interpretation, using an iterative reasoning process to self-verify whether generated hypotheses align with existing biological knowledge.
-   **Key Results**: Achieved exceptionally high accuracy in consistency with existing biological knowledge, with an average composite score of 0.90. Pathway coverage reached 0.98, demonstrating its ability to efficiently propose novel biological hypotheses that might be overlooked by conventional analysis methods.
-   **Significance & Limitations**: This technology has the potential to dramatically reduce the time required to predict cellular state changes in drug discovery. However, completely eliminating "hallucinations" (plausible but false generated hypotheses) remains a challenge, and experimental validation is indispensable.

This research positions AI not just as a statistical engine, but as a "collaborator" supporting biologists. For instance, its ability to simulate how a new drug might induce a specific response in certain cell populations and then explain the biological reasons (mechanisms) for that response in natural language is groundbreaking. This is expected to reduce experimental trial-and-error and enable more efficient disease understanding.

Source: [ELISA: An Interpretable Hybrid Generative AI Agent for Expression-Grounded Discovery in Single-Cell Genomics](https://arxiv.org/abs/2603.11872)

---

#### Paper 2: FloeNet: A Mass-Conserving Global Sea Ice Emulator that Generalizes Across Climates (Energy Engineering & Climate Science)

-   **Authors & Affiliation**: Climate Science Research Team (Geophysical Fluid Dynamics Laboratory, et al.)
-   **Background & Question**: Simulating global sea ice models physically for climate prediction is computationally expensive, making thousands of simulations difficult. This research explores whether AI models (emulators) that mimic physical laws can reduce computational cost while maintaining physical consistency (conservation of mass).
-   **Proposed Method**: FloeNet is a machine learning model that conserves mass and area budgets. It reproduces the growth, melt, and movement of snow and sea ice every six hours by learning from physical model data.
-   **Key Results**: Demonstrated high performance even under unknown climate conditions, including a 1% CO2 increase scenario, achieving a correlation value for Antarctic volume anomalies (low deviation between prediction and measurement) of over 0.96, and 0.76 in the Arctic.
-   **Significance & Limitations**: This model is orders of magnitude faster than conventional physical models, enabling immediate risk assessment based on various emission scenarios. Limitations include incomplete resolution of long-term prediction instability during extreme climate anomalies, for which the continued use of physical engines is recommended.

"Climate emulators" are technologies where AI learns and reproduces computationally intensive simulations through "shortcuts." Analogous to learning a recipe for a stew that takes days to cook and producing the "same taste" in seconds, this realization could lower the barrier to predicting climate change impacts in more regions and preparing for natural disasters like floods and droughts.

Source: [FloeNet: A mass-conserving global sea ice emulator that generalizes across climates](https://arxiv.org/abs/2603.12449)

---

#### Paper 3: The Rise of AI in Weather and Climate Information and its Impact on Global Inequality (Computational Social Science)

-   **Authors & Affiliation**: Amirpasha Mozaffari (Barcelona Supercomputing Center) et al.
-   **Background & Question**: While AI-driven climate prediction technology is rapidly advancing, research resources are concentrated in certain regions (Global North), leading to unequal distribution of data and models worldwide. This research analyzes whether AI technology promotes the democratization of the climate field or exacerbates existing inequalities.
-   **Proposed Method**: A systematic investigation into how inequalities are amplified at the three stages of AI models: "input (data)," "process (algorithm)," and "output (prediction results)" is conducted, proposing a scientific evaluation framework.
-   **Key Results**: Points out that, given the current reliance on historically biased datasets, systematic errors are expanding, leading to lower performance in more vulnerable regions. It also emphasizes the risk of "scientific knowledge sharing" transforming into "one-sided consumption" due to AI models themselves depending on the infrastructure of a few corporations or countries.
-   **Significance & Limitations**: This paper advocates for not only technical performance improvements but also for data transparency and ensuring diversity in evaluation metrics. However, policy solutions are outside its scope, requiring bridging discussions with international politics.

AI is often perceived as "neutral," but if the training data is biased towards the climate information of specific regions, the prediction results will also be specific to those regions, leaving residents of other areas behind. This research visualizes the "unequal benefits" hidden behind AI's "accurate predictions." To equitably distribute the fruits of technological advancement, a redesign of "digital public infrastructure" is necessary, encompassing not just algorithmic improvements but also considerations of which countries' data is utilized and who can access the outcomes.

Source: [The Rise of AI in Weather and Climate Information and its Impact on Global Inequality](https://arxiv.org/abs/2603.05710)

---

#### Paper 4: HarvestFlex: Strawberry Harvesting via Vision-Language-Action Policy Adaptation in the Wild (Robotics & Autonomous Agents)

-   **Authors & Affiliation**: Robotics Research Group
-   **Background & Question**: Robot harvesting in unpredictable environments like farms is extremely difficult due to changing light conditions and fruit occlusion. Conventional robots could only move within pre-defined locations; this research explores whether adaptation to unknown environments is possible using a model that integrates vision, language, and action (VLA model).
-   **Proposed Method**: "HarvestFlex" is an adaptive framework that fine-tunes its action policy in real-time according to environmental changes. It visually understands the state of strawberries and translates human-like instructions (e.g., "pick ripe ones") into actions.
-   **Key Results**: In wild (outdoor) environments, it demonstrated significantly higher harvesting success rates and robustness to environmental changes compared to conventional methods. Notably, it succeeded in stabilizing performance through adaptive learning even during periods of drastic changes in lighting conditions.
-   **Significance & Limitations**: While this technology contributes to alleviating labor shortages in agriculture, challenges for large-scale adoption include its generalizability to a wide variety of crops beyond strawberries and reducing the cost of robotic arms.

Robots are evolving from mere machines to "workers who can assess situations." Their ability to adjust their arms by recognizing "this is a strawberry" even when it's slightly hidden or obstructed by leaves, a feat beyond conventional robots confined to repetitive tasks in factory settings, is groundbreaking. This research foreshadows the potential for AI agents to operate in human environments, not only in agriculture but also in domestic chores and elder care.

Source: [HarvestFlex: Strawberry Harvesting via Vision-Language-Action Policy Adaptation in the Wild](https://arxiv.org/abs/2603.05982)

---

#### Paper 5: TraderBench: How Robust Are AI Agents in Adversarial Capital Markets? (Economics & Behavioral Economics)

-   **Authors & Affiliation**: Xiaochuang Yuan et al. (Agents in the Wild Workshop, ICLR2026)
-   **Background & Question**: While AI agents are increasingly participating in financial market trading, their vulnerability to "adversarial environments" such as malicious market manipulation and rapid price fluctuations has not been adequately assessed. This research questions how stable AI agent trading strategies are against intentional attacks.
-   **Proposed Method**: A benchmark called "TraderBench" was constructed. In this benchmark, multiple AI agents compete in managing profitability and risk within an environment where they coexist with market-manipulating agents.
-   **Key Results**: It was found that many AI agents, despite high predictive performance under normal conditions, tend to overreact and amplify losses (panic) when the market is manipulated.
-   **Significance & Limitations**: This can serve as a security checklist for financial institutions adopting AI. Limitations include that it does not fully simulate the complex psychological factors (fear and exuberance of market participants) of actual real-time markets.

While AI agents can trade more efficiently than humans, this also carries the risk of "market collapse." In situations where a human might think, "It's an abnormal situation, let's wait and see," an AI might simply decide based on past data that "price drop = sell," potentially causing a snowball effect leading to a crash. This research quantitatively demonstrates the urgent need for developing "safety mechanisms" for AI deployment in finance.

Source: [TraderBench: How Robust Are AI Agents in Adversarial Capital Markets?](https://arxiv.org/abs/2603.00285)

---

### 3. Cross-Paper Observations

These five papers collectively indicate that AI is entering a phase of "moving outside the lab" to tackle complex and unpredictable real-world challenges.

1.  **Specialization and Knowledge Integration**: As seen in ELISA for life sciences and FloeNet for climate models, the trend is shifting towards "hybrid methods" that incorporate physical laws or biological knowledge as constraints, rather than simply using off-the-shelf deep learning models. This is a crucial step toward making "scientific discoveries" by AI reliable.
2.  **Importance of Adaptability**: The success of the agricultural robot (HarvestFlex) highlights the importance of "flexibility" in unknown environments. Similarly, the challenge for financial agents (TraderBench) lies in how this flexibility reacts when exposed to "adversarial environments," posing a security issue.
3.  **Warning about AI as Social Infrastructure**: The climate modeling research (Mozaffari et al.) points out that while AI is a "solution" for scientific problems, its implementation carries a "power structure" that can exacerbate inequality. The advancement of AI technology is inextricably linked to an ethical perspective that considers not only the developers but also which regions and demographics are affected.

Future research trends are expected to move from merely enhancing AI's reasoning capabilities towards establishing "adaptive and responsible AI" that can perform specialized tasks while adhering to real-world physical constraints and societal ethical demands.

---

### 4. References

| Title                                                                                                | Source | URL                                   |
| :--------------------------------------------------------------------------------------------------- | :----- | :------------------------------------ |
| ELISA: An Interpretable Hybrid Generative AI Agent for Expression-Grounded Discovery in Single-Cell Genomics | arXiv  | https://arxiv.org/abs/2603.11872      |
| FloeNet: A mass-conserving global sea ice emulator that generalizes across climates                      | arXiv  | https://arxiv.org/abs/2603.12449      |
| The Rise of AI in Weather and Climate Information and its Impact on Global Inequality                    | arXiv  | https://arxiv.org/abs/2603.05710      |
| HarvestFlex: Strawberry Harvesting via Vision-Language-Action Policy Adaptation in the Wild            | arXiv  | https://arxiv.org/abs/2603.05982      |
| TraderBench: How Robust Are AI Agents in Adversarial Capital Markets?                                  | arXiv  | https://arxiv.org/abs/2603.00285      |

---

> This article was automatically generated by LLM. It may contain errors.
