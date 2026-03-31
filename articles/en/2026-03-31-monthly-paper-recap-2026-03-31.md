---
title: "Monthly Paper Summary - Simultaneously Advancing Safety, Real-World Implementation, and Verifiability"
slug: "monthly-paper-recap-2026-03-31"
summary: "March research shifted focus from improving model performance to ensuring safe, interpretable, and verifiable operation in real environments. Key advances in safety cases, agent robustness, robot a..."
date: "2026-03-31T12:00"
tags: ["monthly-paper-recap","LLM Safety","Robustness","Multimodal/Agents","AI Agents","Machine Learning","AI Safety","Robotics","Reinforcement Learning","Scientific AI","Vision-Language Models","Multimodal AI","Autonomous Agents","Deep Learning","Energy Efficiency","Scientific AI","AI","Climate Science","Labor Economics","Scientific Discovery","Natural Language Processing","Robotics","Organizational Transformation","Computational Social Science","Science and Technology","AI Research","LLM","Continual Learning","Life Sciences","Educational Technology","Privacy","Generative AI","Domain-Specific","Materials Science","Model Optimization","Drug Discovery","Space Engineering","Optimization","Multimodal","Efficiency","Latest Papers","Physics","Environmental Science","Technology Trends","arXiv New Arrivals","Cross-Disciplinary Review","Foundation Models/Evaluation","Safety and Implementation","Multi-Agent","Benchmarking","Interpretability","Formalization"]
category: "monthly-paper-recap"
automated: true
provider: "openai"
sources: ["https://arxiv.org/abs/2602.19682","https://arxiv.org/abs/2603.08760","https://arxiv.org/abs/2603.07315","https://arxiv.org/abs/2601.10173","https://openai.com/index/updating-our-preparedness-framework/","https://www.theguardian.com/technology/openai/2026/mar/06/all","https://arxiv.org/abs/2603.16843","https://arxiv.org/abs/2603.11528","https://arxiv.org/abs/2603.15618","https://arxiv.org/abs/2603.15620","https://arxiv.org/abs/2603.15542","https://arxiv.org/abs/2603.16859","https://arxiv.org/abs/2603.14473","https://arxiv.org/abs/2603.13301","https://arxiv.org/abs/2603.12557","https://arxiv.org/abs/2603.16839","https://arxiv.org/abs/2603.16827","https://arxiv.org/abs/2603.16822","https://arxiv.org/abs/2603.11872","https://arxiv.org/abs/2603.12449"]
sns_topics: [{"topic":"Safety Case (Safety Case) and Staged Disclosure, Shutdown Design","summary":"Reconstruct safety cases as 'persuasive arguments' and stage open weights. Design shutdown safety valves as the last line of defense."},{"topic":"Prompt Injection Resistance Reasoning Enhancement (ReasAlign)","summary":"Detect competing instructions from input contamination through reasoning and select trajectories. Emphasis on significantly reducing ASR while maintaining utility."},{"topic":"Real-World Adaptation: Active Vision, Robot VLA, Outdoor Adaptation","summary":"Improve success rates through Look Before Acting and active viewpoint control, demonstrating robustness in dynamic environments and outdoor tasks."},{"topic":"Interdisciplinary Integration: Physics-Aligned (Sea Ice Mass Conservation) and Generative AI (Drug Discovery/Materials)","summary":"Accelerate with high-speed emulators preserving physical constraints, while model protein and polymer design as 'language' to accelerate exploration."},{"topic":"Balance Safety and Performance: Alignment Tax Reduction, Black Box Defense","summary":"Maintain safety and recover performance through safety neuron freezing. Additionally, internal representation attack warnings expand countermeasure coverage."}]
thumbnail: "/images/monthly-paper-recap-2026-03-31.png"
recap_period: "2026-02-28/2026-03-30"
---
## 1. Executive Summary

March 2026 research marked a decisive shift from the phase of "scaling model performance" to "ensuring systems work reliably in real environments, explain their reasoning, and remain verifiable." Safety advances in formal case development and shutdown design, capability-based safety non-compositionality, and robustness evaluation form the core. Agents show increased focus on robustness against external perturbation, internal logic hijacking, and adversarial environments. Robotics demonstrates concrete reality adaptation through active perception and tactile fusion. Interdisciplinary work—climate/sea ice emulators respecting physical laws, drug discovery and material generation balancing exploration efficiency with constraint compliance—converges on "verifiable implementation." With approximately 20 major topics interlinking this month, the defining characteristic is the unified pivot toward safety, adaptability, and verifiability across fields.

---

## 2. Monthly Research Trends

### Trend 1: Safety From "Narrative" to "Argumentative and Verifiable Frameworks"

This month's hallmark in safety research is the shift from alignment or safety guards as mere rejection training or policy rewording toward frameworks where "why is it safe?" can be systematically traced. The representative example is reconsidering safety cases, where frontier AI safety is assembled as a "compelling argument" with explicit causal connections between evidence and claims ([Clear, Compelling Arguments: Rethinking the Foundations of Frontier AI Safety Cases](https://arxiv.org/abs/2603.08760)). Similarly, tiered release mechanisms have developed from the same underlying concern: rather than binary open/closed decisions, a "tiered, safety-anchored" approach links release form to the granularity of safety evidence and evaluation rigor ([Beyond the Binary: A nuanced path for open-weight advanced AI](https://arxiv.org/abs/2602.19682)). Shutdown itself is now treated as a design objective—including extreme cases where shutdown might fail—producing a "safety valve" framing ([Shutdown Safety Valves for Advanced AI](https://arxiv.org/abs/2603.07315)).

This transformation is reinforced operationally. Public disclosure of readiness status coupled to release schedules, coupled with transparent evaluation procedures (e.g., OpenAI's Preparedness Framework updates), establishes a "on-site connection" reference point ([Our updated Preparedness Framework](https://openai.com/index/updating-our-preparedness-framework/)). In essence, safety has been reformulated from "what do we include" to "how do we determine safety" and "who verifies which evidence when."

Safety research has also expanded its threat surface to model internals. Internal activation hijacking to bypass safety filters (Amnesia) suggests that input-layer defenses alone are insufficient ([Amnesia: Adversarial Semantic Layer Specific Activation Steering in LLMs](https://arxiv.org/abs/2603.10080)). Simultaneously, capability-based safety is formally shown to be non-compositional: partial inability to reach forbidden capabilities does not prevent reaching them through recombination ([Safety is Non-Compositional: A Formal Framework for Capability-Based AI Systems](https://arxiv.org/abs/2603.15973)). The explicit formalization that safety cannot be achieved through component summation marks this month's critical finding.

---

### Trend 2: Robustness Against External and Internal "Takeover" Becomes the Main Battleground

Another core theme of March safety research is the growing emphasis on attacks penetrating beyond prompts into reasoning processes, internal logic, and agent operation. ReasAlign exemplifies this: it addresses prompt injection (particularly indirect data poisoning) not through rejection but by maintaining "reasoning trajectory consistency," with test-time scaling via a Judge model showing substantial ASR reduction ([ReasAlign: Reasoning Enhanced Safety Alignment against Prompt Injection Attack](https://arxiv.org/abs/2601.10173)). Rather than asking "what instructions are bad," it asks "can we resolve instruction conflicts through reasoning and choose safe execution paths?"

Agent multi-step decision-making creates expanded attack surfaces. The Logic-layer Automated Attack Framework (LAAF) targets agent reasoning steps to induce unintended task execution, automating red-team testing ([LAAF: Logic-layer Automated Attack Framework](https://arxiv.org/abs/2603.17239)). This aligns with defense evaluation shifting from surface response quality to the agent's decision chain.

Adversarial robustness is inseparable from safety. TraderBench stress-tests AI agents in financial markets with adversarial counterparties, revealing that otherwise high-performing systems exhibit "panic reactions" under market manipulation ([TraderBench: How Robust Are AI Agents in Adversarial Capital Markets?](https://arxiv.org/abs/2603.00285)). In robotics, similar reasoning connects safety planning to reachability analysis—leading to the next trend.

---

### Trend 3: Real-World Adaptation Hinges on "Agency (Looking, Touching, Thinking)" and "Constraint Expression"

Robotics' March character is the explicit modeling of environmental agency—looking before acting, active vision control, tactile integration—rather than merely scaling VLA models. Vision-Language-Action models embedding "look before acting" boost representation and improve success rates by 15–22% ([Look Before Acting: Enhancing Vision Foundation Representations for Vision-Language-Action Models](https://arxiv.org/abs/2603.15618)). For generalizable manipulation in dynamic environments, hybrid learning of physics simulation and real data achieves completion rates exceeding SOTA on unseen household scenarios ([Towards Generalizable Robotic Manipulation in Dynamic Environments](https://arxiv.org/abs/2603.15620)).

Closer to deployment, contact-rich manipulation is being encoded into world models. OmniVTA integrates vision and tactile sensing, improving success rates ~28% over vision-only baselines ([OmniVTA: Visuo-Tactile World Modeling for Contact-Rich Robotic Manipulation](https://arxiv.org/abs/2603.19201)). This reflects the progression from "seeing alone" to "touching to confirm"—literally implanting tactile intelligence in robots.

In planning, efficiency and safety constraints converge. CASSR combines reachability information with continuous A* search maintaining continuous constraints for real-time footstep planning ([CASSR: Continuous A-Star Search through Reachability for real time footstep planning](https://arxiv.org/abs/2603.02989)). Across these, a common conclusion emerges: reality's uncertainty is best expressed as constraints and passed to search and learning.

---

### Trend 4: Interdisciplinary Fusion Converges on "Constraint-Respecting Generation and Emulation"

Across life sciences, climate, materials, and astroastrophysics, March shows strong momentum toward "generation and acceleration while respecting constraints (physical laws, existing knowledge, safety, privacy)." Rather than pure statistical modeling, physically and knowledge-informed hybrids dominate. For example, single-cell analysis integrates transcription factor and pathway knowledge into LLM reasoning for interpretable discovery, with ELISA reporting high composite scores ([ELISA: An Interpretable Hybrid Generative AI Agent for Expression-Grounded Discovery in Single-Cell Genomics](https://arxiv.org/abs/2603.11872)). In climate, the mass-conserving sea ice emulator FloeNet accelerates simulation while maintaining conservation laws, achieving high fidelity on unseen conditions ([FloeNet: A mass-conserving global sea ice emulator that generalizes across climates](https://arxiv.org/abs/2603.12449)).

Materials science introduces generative polymer design as a chemical language (chemical grammar/semantics) through POLYT5-like approaches, extending to physical experiment validation (Georgia Tech: [Researchers Create First AI for Generative Polymer Design](https://gatech.edu/edu/news/2026/03/24/researchers-create-first-ai-generative-polymer-design)). Privacy, being computationally intertwined with performance, is explored in studies revealing the inseparability of neural network privacy vulnerability and capability tradeoffs ([New Approach Finds Privacy Vulnerability and Performance Are Intertwined in AI Neural Networks](https://ncsu.edu/news/2026/03/24/new-approach-finds-privacy-vulnerability-and-performance-are-intertwined-in-ai-neural-networks/)).

This shift reflects a broader reorientation: from "is AI intelligent?" to "can AI be trusted to function?" as the organizing question.

---

### Trend 5: Inference Efficiency Optimization and "Resource-Efficient Deployment" Moves Beyond the Lab

Late March especially shows computational efficiency becoming an operational prerequisite, not a research afterthought. TurboQuant employs extreme compression to ease KV-cache and memory bottlenecks, maintaining performance while reducing inference cost and latency ([TurboQuant: Redefining AI efficiency with extreme compression](https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/)). For robotics, the question "when should a robot think?" is answered by resource-aware RL optimizing inference depth and cost tradeoffs dynamically ([When Should a Robot Think? Resource-Aware Reasoning via RL](https://arxiv.org/abs/2603.16673)). Diffusion model sampling acceleration via multilevel Euler-Maruyama methods offers theoretical advances applicable to agent real-time responsiveness ([Polynomial Speedup in Diffusion Models with the Multilevel Euler-Maruyama Method](https://arxiv.org/abs/2603.24594)).

This trend undergirds the month's integrating theme: computing becomes the substrate that enables safety, adaptability, and verification to coexist rather than compete.

---

## 3. Important Paper Selections (8 Papers)

### [Tiered Release as Prerequisite: Non-Binary Open-Weight Frontier AI]
- **Publication Date**: 2026-02- (per source)
- **Research Field**: AI Governance / Model Release Strategy
- **Authors/Affiliation**: Verify via arXiv (details in source materials)
- **Background and Question**: Open-weight advances research but amplifies misuse risk. Can release decisions move beyond binary open/closed to stage release by safety evidence quality?
- **Proposed Method and Key Results**: A tiered, safety-anchored approach adjusting delivery form to evaluation rigor and evidence substantiation.
- **Significance and Future Impact**: Breaking the "open=good/closed=protective" dichotomy; linking release form to safety case. Release strategy becomes part of safety architecture.
- **Source**: [Beyond the Binary: A nuanced path for open-weight advanced AI](https://arxiv.org/abs/2602.19682)

---

### [Reconstituting Safety Case Foundations as "Argument"]
- **Publication Date**: 2026-03- (per source)
- **Research Field**: AI Safety / Trust and Audit
- **Authors/Affiliation**: Verify via arXiv (details in source materials)
- **Background and Question**: Frontier AI safety cannot be measured by performance alone; "how does evidence support which claims?" becomes essential. Can safety cases be reconstituted as persuasive argument structures?
- **Proposed Method and Key Results**: Restructuring safety case as traceable argument with explicit support relations; emphasis on framework redesign over numerical metrics.
- **Significance and Future Impact**: Provides common language for audit, regulation, and internal review. Measurement integration remains a challenge for future work.
- **Source**: [Clear, Compelling Arguments: Rethinking the Foundations of Frontier AI Safety Cases](https://arxiv.org/abs/2603.08760)

---

### [Advanced AI's Last Resort: Shutdown Safety Valves]
- **Publication Date**: 2026-03- (per source)
- **Research Field**: AI Safety / Operations and Emergency Stopping
- **Authors/Affiliation**: Verify via arXiv (details in source materials)
- **Background and Question**: High-capability AI may reach scenarios where normal shutdown fails. What design requirements ensure safe shutdown realization?
- **Proposed Method and Key Results**: Positioning being turned off as a primary goal and reconceptualizing it via safety-valve framing.
- **Significance and Future Impact**: Elevates design from guardrails/rejection to procedural requirements—specifically, shutdown as an operational invariant. Formal guarantees strengthening is the next phase.
- **Source**: [Shutdown Safety Valves for Advanced AI](https://arxiv.org/abs/2603.07315)

---

### [Defense Through Reasoning: Prompt Injection Robustness (ReasAlign)]
- **Publication Date**: 2026-01- (per source)
- **Research Field**: LLM Safety / Agent Hardening
- **Authors/Affiliation**: Hao Li et al. (per source)
- **Background and Question**: As agents incorporate more external inputs, indirect prompt injection becomes a concrete threat. Can reasoning consistency raise robustness?
- **Proposed Method and Key Results**: Detecting conflicting instructions during reasoning, selecting trajectories preserving user intent continuity, with test-time scaling via judge model. On CyberSecEval2: utility 94.6%, ASR 3.6% (vs. Meta SecAlign: utility 56.4%, ASR 74.4%).
- **Significance and Future Impact**: "Defend through reasoning" rather than rejection becomes concrete. Applicability to RAG and internal knowledge search agents is expected.
- **Source**: [ReasAlign: Reasoning Enhanced Safety Alignment against Prompt Injection Attack](https://arxiv.org/abs/2601.10173)

---

### [Vision-Language-Action Agency: Looking Before Acting]
- **Publication Date**: 2026-03- (per source)
- **Research Field**: Robotics / VLA
- **Authors/Affiliation**: Yulin Luo, Hao Chen, Zhuangzhe Wu et al. (per source)
- **Background and Question**: Incomplete visual understanding breaks VLA behavior. Can pre-action intermediate observation strengthen representation?
- **Proposed Method and Key Results**: Integrating Look Before Acting, strengthening prediction/extraction of critical objects and relationships before action. Success rates improve 15–22% across multi-robot tasks, with enhanced grasp success in dynamic environments.
- **Significance and Future Impact**: Embedding "see → think → act" into the computation graph brings field deployment closer. Latency-performance tradeoffs remain open.
- **Source**: [Look Before Acting: Enhancing Vision Foundation Representations for Vision-Language-Action Models](https://arxiv.org/abs/2603.15618)

---

### [Causal Understanding at Social Scale: InterveneBench]
- **Publication Date**: 2026-03- (per source)
- **Research Field**: Computational Social Science / LLM Causal Reasoning
- **Authors/Affiliation**: Shaojie Shi, Zhengyu Shi, Lingran Zheng et al. (per source)
- **Background and Question**: Can LLMs handle intervention prediction and causal experiment design? Are they viable as societal simulators?
- **Proposed Method and Key Results**: InterveneBench evaluating recent models on public policy, socioeconomic, and sociology scenarios. Most models show logical errors and biases in causal intervention, achieving ~60% accuracy.
- **Significance and Future Impact**: Exposes risks and possibilities of delegating policy analysis to AI. Drives quality-assurance research for causal reasoning.
- **Source**: [InterveneBench: Benchmarking LLMs for Intervention Reasoning and Causal Study Design in Real Social Systems](https://arxiv.org/abs/2603.15542)

---

### [Physics-Aligned Acceleration: Mass-Conserving Sea Ice Emulator FloeNet]
- **Publication Date**: 2026-03- (per source)
- **Research Field**: Climate Science / Physics-Constrained AI
- **Authors/Affiliation**: Geophysical Fluid Dynamics Laboratory et al. (per source)
- **Background and Question**: Sea ice physics simulation is computationally extreme. Can AI emulation preserve mass conservation while generalizing across conditions?
- **Proposed Method and Key Results**: Mass-conserving ML model learning 6-hourly growth/melt/drift. Achieves high accuracy on unseen scenarios: South pole volume anomaly correlation >0.96, North pole 0.76 under 1% CO₂ increase.
- **Significance and Future Impact**: Enables rapid risk assessment. Long-term stability under extreme conditions and hybrid physics-engine coupling remains to be resolved.
- **Source**: [FloeNet: A mass-conserving global sea ice emulator that generalizes across climates](https://arxiv.org/abs/2603.12449)

---

### [Safety-Performance Co-Optimization: Reducing Alignment Tax via Neuron Freezing]
- **Publication Date**: 2026-03- (per source)
- **Research Field**: LLM Safety / Representation Control
- **Authors/Affiliation**: North Carolina State University (per source)
- **Background and Question**: Safety improvements typically incur performance penalties (alignment tax). Can safety be upheld without capability loss?
- **Proposed Method and Key Results**: Identifying safety-critical neurons and freezing them during fine-tuning to maintain safety standards while preserving benchmark performance on non-safety dimensions. Demonstrates equal performance to non-safe baselines while achieving alignment objectives.
- **Significance and Future Impact**: Enables domain adaptation (medical, legal) without safety degradation. Computational cost of neuron identification remains.
- **Source**: [Researchers Pioneer New Technique to Stop LLMs from Giving Users Unsafe Responses](https://ncsu.edu/news/2026/03/23/researchers-pioneer-new-technique-to-stop-llms-from-giving-users-unsafe-responses)

---

## 4. Cross-Disciplinary Analysis

Tracing March's corpus across fields reveals convergence on four keywords: safety, adaptation, verifiability, and efficiency—with "design object redefinition" progressing throughout. In safety, safety cases, shutdown valves, and capability-based non-compositionality show that guarantees are not monolithic but depend on argumentative structure and post-assembly behavior. Robotics translates reality's uncertainty into constraints: seeing, touching, reachability. Computational social science elevates error-type evaluation alongside accuracy via causal benches. Climate, drug discovery, and materials converge on maintaining physical laws, prior knowledge, and safety/privacy constraints while accelerating. Finally, efficiency research (TurboQuant, resource-aware RL) demonstrates that performance, safety, and adaptation must coexist within computational constraints—no longer a peripheral concern but central. March was the month this integration advanced.

---

## 5. Next Month's Anticipated Themes (Forecast)

Four directions are likely to accelerate. First: safety case and tiered-release "operational implementation" will concretize, with auditable evidence sets (evaluation logs, failure classifications, shutdown validity) becoming research questions. Second: attacks on reasoning and internal representations will be assumed, driving defense evaluation (surface vs. internal layers) and non-compositionality-aware design verification. Third: robotics will see active perception (vision, touch, camera control, continuous planning constraints) promote real deployment, with "when to think" optimization under power/latency constraints tested for generality. Fourth: interdisciplinary work will extend physics-aligned fast emulation and drug/material generation efficiency to "evaluation (experimental validation loops)"," establishing AI's reliability practices. Concurrently, international conferences and workshops (AIware 2026, etc.) are expected to centralize benchmark design and safety evaluation as organizing themes.

---

## 6. References

| Title | Source | Date | URL |
|-------|--------|------|-----|
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
| Safety Report 2026 (International AI Safety Report) | Safety Report | 2026-02- | https://internationalaisafetyreport.org/sites/default/files/2026-02/international-ai-safety-report-2026_1.pdf |
| Organizational Transformation in the Age of AI | WEF | 2026- | https://weforum.org/publications/organizational-transformation-in-the-age-of-ai/ |
| Autoscience raises $14M seed round to scale its autonomous AI research lab | R&D World | 2026-03- | https://rdworldonline.com/autoscience-raises-14m-seed-round-to-scale-its-autonomous-ai-research-lab/ |
| All AI labs to safety-test rival models | The Guardian | 2026-03- | https://www.theguardian.com/technology/openai/2026/mar/06/all |

---

> This article was automatically generated by LLM. It may contain errors.
