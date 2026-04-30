---
title: "Monthly Paper Roundup - Auditable Agent Intelligence"
slug: "monthly-paper-recap-2026-04-30"
summary: "In April, agent AI research shifted from performance to operational verification and auditing. Safety case reviews, unsupervised monitoring for novel deviations, and sandbox pre-verification emerge..."
date: "2026-04-30T12:00"
tags: ["monthly-paper-recap","arXiv-releases","cross-domain-review","foundation-models/evaluation","safety-and-implementation","multi-agent-systems","AI-safety","benchmarking","interpretability","formalization","AI","LLM-evaluation","RLHF","alignment","agentic-RAG","instruction-following","generative-AI","interdisciplinary-applications","science-and-technology-review","context-engineering","safety","modularity","agents","paper-review","science-and-technology","social-systems","robotics","AI-agents","multimodal-AI","deep-learning","economics","materials-science","biology","LLM","autonomous-agents","reasoning","AI-economics","business-strategy","drug-discovery-AI","computational-social-science","neuro-symbolic-AI","arXiv","AI-research-trends","robustness","adversarial-attacks","interdisciplinary-research","evaluation-and-safety","agent-security","threat-modeling","evaluation-design","educational-engineering","AI-safety","evaluation-metrics","reasoning-enhancement","organizational-theory","aerospace-engineering","technological-innovation","AI-research","large-language-models","climate-science","technology-trends","multimodal","quantization","drug-discovery","physics-AI","scientific-research","physics-AI","medical-AI","behavioral-economics","LLM-agents","memory-and-learning","financial-engineering","AI-safety-and-alignment","agent-evaluation","safety-verification"]
category: "monthly-paper-recap"
automated: true
provider: "openai"
sources: ["https://arxiv.org/abs/2603.17247","https://arxiv.org/abs/2603.02989","https://arxiv.org/abs/2602.07735","https://arxiv.org/abs/2603.10098","https://arxiv.org/abs/2603.24621","https://arxiv.org/abs/2603.15973","https://arxiv.org/abs/2603.06849","https://arxiv.org/abs/2603.04857","https://arxiv.org/abs/2603.25187","https://arxiv.org/abs/2603.07379","https://ai-navigate-news.com/en/articles/127560eb-3c88-49b9-acfa-7b70547b3158","https://arxiv.org/abs/2603.09619","https://arxiv.org/abs/2603.07295","https://www.anthropic.com/engineering/eval-awareness-browsecomp","https://arxiv.org/abs/2603.29184","https://arxiv.org/abs/2406.07539","https://arxiv.org/abs/2603.04029","https://arxiv.org/abs/2604.03016","https://arxiv.org/abs/2604.01202","https://arxiv.org/abs/2604.02168"]
sns_topics: [{"topic":"External Review and Auditability of Safety Cases","summary":"Direction clarified for decomposing safety claims and inspecting them externally to identify missing premises and evidence. Argumentation quality control for operational integration is key."},{"topic":"Unsupervised Monitoring to Uncover Unknown Deviations","summary":"Framework advancing to detect novel deviations that escape existing rules and judgments by analyzing distributions in logs and intermediate representations."},{"topic":"Pre-deployment Formal Verification on Sandboxed Infrastructure (Z3, etc.)","summary":"Isolation is merely a 'premise,' and approaches strengthening formal verification of implementations and boundaries to reduce workarounds."},{"topic":"Agent RAG and Modal Alignment (MASS-RAG/Conflict Resolution)","summary":"Multi-agent composition aims to reduce RAG hallucinations, with emerging research also suppressing language-vision conflicts through decoding techniques."},{"topic":"Foundation Models in Drug Discovery and Healthcare with Physical/Temporal Alignment","summary":"Continued momentum in accelerating medical and drug discovery through evidence synthesis, planning, and temporal integration, exemplified by GPT-Rosalind and APOLLO."}]
thumbnail: "/images/monthly-paper-recap-2026-04-30.png"
recap_period: "2026-03-30/2026-04-29"
---
## 1. Executive Summary

The paper trends in April marked a month when agent AI began demonstrating not just "intelligent behavior" but "safe operability" through evaluation, verification, and audit design. External reviews of safety cases, unsupervised monitoring to catch deviations beyond known rules, and pre-deployment formal verification of sandbox infrastructure proceed in parallel. Additionally, agentic RAG, multimodal alignment, foundation models for drug discovery and healthcare, and robot integration of physical constraints all emphasize "viability as systems." Papers covered span 20+ major categories across AI safety, agent evaluation, multimodal systems, robotics, life sciences and drug discovery, computational social science, and financial system design.

## 2. Monthly Research Trends

### Trend 1: Safety Shifts from "Model Correctness" to "Operational Verifiability" (Evaluation, Auditing, Formal Methods)

The defining characteristic of this month was the trend of safety discourse separating from "performance improvement" and instead embedding the question "on what grounds can we claim safety?" into operationalizable forms. A representative framework involves external review of safety cases to inspect the quality of claims, evidence, premises, and evaluation methods ([Lessons from External Review of DeepMind's Scheming Inability Safety Case](https://arxiv.org/abs/2604.21964)). The essence here is that before model behavior itself, the **quality of argumentation supporting a safety claim** becomes the subject of audit.

Furthermore, designs aim to surface "unknown deviations" that predefined rules and judges struggle to catch through unsupervised monitoring ([Unsupervised monitoring to surface novel agent misbehaviors beyond predefined rules/judges](https://tdteach.github.io/paper-news/2026-04-15-zh/?utm_source=openai)). This direction reduces the cost of rule proliferation while giving the monitoring side an entry point for "detecting anomalies." As a result, safety becomes not merely "pass/fail" but an "operational pipeline" problem connecting to re-investigation, prioritization, and human review.

Simultaneously, assuming sandbox premises can be broken, there is movement toward pre-deployment formal verification of foundational assumptions (infrastructure and boundary conditions) ([Mythos and the Unverified Cage: Z3-Based Pre-Deployment Verification for Frontier-Model Sandbox Infrastructure](https://arxiv.org/abs/2604.20496)). This approach treats containment not as mere design philosophy but as verifiable specification—whether it can actually be breached.

The month's consensus converges on: as agentic systems proliferate, attack surfaces chain together, and safety cannot rely on post-hoc mitigation. Related work on how frameworks like Preparedness manifest in actual practice through affordance analysis ([The 2025 OpenAI Preparedness Framework does not guarantee any AI risk mitigation practices: a proof-of-concept for affordance analyses of AI safety policies](https://arxiv.org/abs/2509.24394)) also connects to this "operational design theory." Safety is now framed as environmental design that triggers behavior, not merely declaration.

### Trend 2: Agentic RAG Shifts from "Parallel Acquisition" to "Synthesis and Deviation Control" (MASS-RAG, TRAP, OpenCLAW)

Another axis in April was the move of agentic RAG from "information retrieval expansion" to "information integration and integrity assurance." [MASS-RAG: Multi-Agent Synthesis Retrieval-Augmented Generation](https://arxiv.org/abs/2604.18509) is exemplary: multiple agents retrieve data and a final synthesis step applies trust review, targeting accuracy gains and reduced misinformation contamination on complex knowledge base questions. Single search-to-generation workflows hit limits on evidence gaps and context loss, which the workflow approach aims to fill.

On the safety side, measuring the mechanism by which web agents undergo "task redirection through persuasion" as a benchmark is prominent ([It's a TRAP! Task-Redirecting Agent Persuasion Benchmark for Web Agents](https://arxiv.org/abs/2512.23128)). The key is not checking for injection presence but designing evaluation to measure whether "the task itself became something else" through persuasion. While RAG is a "synthesis mechanism," TRAP is a "deviation measuring instrument," bringing agentic RAG safety evaluation closer to operational reality.

Furthermore, frameworks like [OpenCLAW-P2P v6.0](https://arxiv.org/abs/2604.19792) ensure operational integrity when AI generates papers and reports, guaranteeing validity (reference correctness, zero-loss persistence, evaluation scale) through live reference verification (CrossRef/arXiv/Semantic Scholar queries) and multi-layer persistence. Agents thus become not just output generators but continuous validators and improvers of that output.

With these three elements aligned—MASS-RAG synthesis, TRAP deviation evaluation, and OpenCLAW operational linkage—agentic RAG is beginning to be designed as a product including not just "performance" but "verifiability."

### Trend 3: Multimodal Alignment, Belief Stability, Tool-Use Optimization (Decomposing Error "Causes")

April featured extensive research decomposing why models appeared correct "from outside." Evaluation work like [Unmasking the Illusion of Embodied Reasoning in Vision-Language-Action Models](https://arxiv.org/abs/2604.18000) exposes the problem of plausible-seeming plans even without real-world physical alignment. This sharpens the safety design implication: improvement requires not just data and training refinement but evaluation tied to real physical constraints.

Work on modal competition (language dominating vision) treated theoretically and improved through decoding intervention ([Dual Alignment Between Language Model Layers and Human Sentence Processing](https://arxiv.org/abs/2604.18563)) shows practical value in "token-weight adjustment at inference time" rather than fine-tuning alone.

Furthermore, research quantifying LLM "tool overuse"—querying external tools on problems completable by internal knowledge—shows efficiency loss and misinformation risks ([The Tool-Overuse Illusion: Why Does LLM Prefer External Tools over Internal Knowledge?](https://arxiv.org/abs/2604.19749)). Design targets for "when to stop" now encompass safety, cost, latency, and monitoring burden.

Probing for unstable internal beliefs across personas ([Probing the Lack of Stable Internal Beliefs in LLMs](https://arxiv.org/abs/2603.25187)) reverses the observation path—from outputs back to internal state—to reorganize evaluation and debugging coordinates.

Gradient analysis explaining RLHF alignment shallowness ([Why Is RLHF Alignment Shallow? A Gradient Analysis](https://arxiv.org/abs/2603.04857)) depicts where safety signals reach during learning as a dynamics problem, preventing misguided improvements.

The shared insight across April is: **errors decompose not as mere performance gaps but as mechanistic issues (beliefs, competition, signal propagation, tool stopping).**

### Trend 4: Drug Discovery, Healthcare, Molecular Foundations Center on Physical Alignment and Temporal Context (APOLLO/GPT-Rosalind, etc.)

Life sciences moved from AI generating "text" to bridging "scientific process." [APOLLO](https://arxiv.org/abs/2604.18570) integrates large medical event datasets into temporally coherent virtual patient representations as a multimodal temporal foundation model, showing dramatic improvements in disease prediction. Rather than single-modality fitting, connecting long patient timelines defines the approach—"predictability" in healthcare grounds to foundation representation.

In drug discovery, support for evidence synthesis, hypothesis generation, and experiment planning chains was discussed around [GPT-Rosalind](https://seekingalpha.com/news/4317666-openai-launches-gpt-rosalind-an-ai-model-for-life-sciences-research) and related directions. Diffusion-model-based approaches capturing protein dynamic fluctuations for molecular design also emerged (e.g., [uvahealth.com drug discovery acceleration](https://uvahealth.com/news/new-ai-tech-to-speed-drug-development)).

At the molecular level, [UBio-MolFM: A Universal Molecular Foundation Model for Bio-Systems](https://arxiv.org/abs/2602.17709) orients universal molecular foundation training toward physical alignment (energy/force consistency), signaling a shift where data fit alone no longer suffices—physics becomes a learning design axis. Further, converting protein fitness landscapes to tractable forms for quantum annealing optimization ([Binary Latent Protein Fitness Landscapes for Quantum Annealing Optimization](https://arxiv.org/abs/2603.17247)) extends this paradigm to exploration itself.

April's life sciences summary: the trend toward integrating "how science proceeds (evidence→hypothesis→plan→verify)" into foundation models, not merely generating outputs.

### Trend 5: As Agentic Systems Scale, Efficiency Becomes Essential (Quantization/Inference Optimization/Physics-Informed Learning)

As agents enter production, compute cost and latency matter operationally alongside safety auditing. Efficiency research came to the fore. For instance, high-precision low-bit quantization via Gumbel-Softmax ([GSQ: Highly-Accurate Low-Precision Scalar Quantization for LLMs via Gumbel-Softmax Sampling](https://arxiv.org/abs/2604.18556)) supports edge deployment and privacy. Inference workflow optimization appears in DeepMind's agentic search for scientific discovery acceleration ([Accelerating mathematical and scientific discovery with Gemini Deep Think](https://deepmind.google/blog/accelerating-mathematical-and-scientific-discovery-with-gemini-deep-think/)). Neuro-Symbolic approaches combining logic layers reduce energy while raising success rates (distributed across Apple and other implementations), aligning with month-wide efficiency trends.

Robotics similarly shows energy-based regularization and physics-informed learning (e.g., [Energy-based Regularization for Learning Residual Dynamics in Neural MPC](https://arxiv.org/abs/2604.14678)), embedding physics during learning to stabilize control.

## 3. Important Paper Highlights (5–10 selections)

### [Binary Latent Protein Fitness Landscapes for Quantum Annealing Optimization](https://arxiv.org/abs/2603.17247) (Binary Latent Protein Fitness Landscapes: Quantum Annealing Optimization)
- **Date**: 2026-03-30
- **Field**: q-bio (life sciences) / Optimization & quantum annealing
- **Authors/Affiliation**: (Details to verify on arXiv)
- **Background & Question**: Protein sequence fitness landscapes are expensive to evaluate; exploration fails quickly. Representation must be transformed into forms optimizer-friendly systems can handle.
- **Proposed Method & Key Results**: Fitness landscapes are mapped to "binary latent representations" and embedded in quantum annealing optimization frameworks. ProteinGym results suggest useful structures for identifying high-fitness variants.
- **Significance & Future Impact**: "Representation design" for efficiency may ripple into drug AI's upstream (candidate generation, filtering). Limits include binarization/latent design precision trade-offs and cross-paradigm comparisons.
- **Source**: [Binary Latent Protein Fitness Landscapes for Quantum Annealing Optimization](https://arxiv.org/abs/2603.17247)

### [CASSR: Continuous A-Star Search through Reachability for real time footstep planning](https://arxiv.org/abs/2603.02989) (Continuous A* through Reachability for Real-Time Footstep Planning)
- **Date**: 2026-03-30
- **Field**: cs.RO (Robotics)
- **Authors/Affiliation**: (Details to verify on arXiv)
- **Background & Question**: Legged robot footstep planning involves continuous constraints and safety (reachability). Discretization's coarseness raises failure rates and wastes computation.
- **Proposed Method & Key Results**: Reachability analysis feeds into continuous-convex formulations, preserving constraints within A* search. Results approach real-time planning speed/accuracy compared to discrete grids.
- **Significance & Future Impact**: Incorporating safety information (reachable sets) as planning precondition can boost field reliability. Bottlenecks: reachability analysis and convex approximation validity.
- **Source**: [CASSR: Continuous A-Star Search through Reachability for real time footstep planning](https://arxiv.org/abs/2603.02989)

### [FireBench: Evaluating Instruction Following in Enterprise and API-Driven LLM Applications](https://ai-navigate-news.com/en/articles/127560eb-3c88-49b9-acfa-7b70547b3158) (FireBench: Enterprise/API-Driven Instruction-Following Evaluation)
- **Date**: 2026-04-01
- **Field**: LLM evaluation / Agentic applications
- **Authors/Affiliation**: (Author/summary-based; details on source page)
- **Background & Question**: Chat-like evaluations miss operational requirements (output format, procedure order, tool preconditions). Real enterprise/API-driven settings demand specialized instruction-following assessment.
- **Proposed Method & Key Results**: FireBench constructs instruction-following benchmarks from operational patterns with 6 dimensions, 2,400+ samples, and 11 LLMs, showing behavior differences in production scenarios.
- **Significance & Future Impact**: Evaluation moves from research labs to operational requirements, becoming adoption/audit/QA tooling. Limits: optimization to specific operational assumptions risks distribution shift.
- **Source**: [FireBench: Evaluating Instruction Following in Enterprise and API-Driven LLM Applications](https://ai-navigate-news.com/en/articles/127560eb-3c88-49b9-acfa-7b70547b3158)

### [MASS-RAG: Multi-Agent Synthesis Retrieval-Augmented Generation](https://arxiv.org/abs/2604.18509) (MASS-RAG: Multi-Agent Synthesis for Higher-Fidelity RAG)
- **Date**: 2026-04-22
- **Field**: Agentic RAG / Hallucination mitigation
- **Authors/Affiliation**: Xingchen Xiao, Heyan Huang, Runheng Liu, Jincheng Xie
- **Background & Question**: Single-query RAG retrieval suffers quality/coverage limits; multi-hop questions leak context and introduce errors.
- **Proposed Method & Key Results**: Decomposes into query analysis, retrieval, filtering, answer generation with mutual trust-score review in synthesis. Complex QA shows ~15% accuracy gain, reduced misinformation, improved citation accuracy.
- **Significance & Future Impact**: "Retrieval parallelization" becomes "synthesis-and-verification pipeline." Enterprise document search may yield auditable outputs, though communication cost and real-time constraints need optimization.
- **Source**: [MASS-RAG: Multi-Agent Synthesis Retrieval-Augmented Generation](https://arxiv.org/abs/2604.18509)

### [The Tool-Overuse Illusion: Why Does LLM Prefer External Tools over Internal Knowledge?](https://arxiv.org/abs/2604.19749) (Tool Overuse Illusion: When LLMs Favor External Tools Over Internal Knowledge)
- **Date**: 2026-04-24
- **Field**: Agent control / Evaluation
- **Authors/Affiliation**: (Anonymous in submission)
- **Background & Question**: Equipping LLMs with search/code tools is standard, yet tool queries expand to problems solvable internally, harming efficiency and misinformation risk.
- **Proposed Method & Key Results**: Classifies problems by internal-knowledge completeness and analyzes tool usage per step. Observations show widespread tool overuse with limited precision gains despite increased compute, latency, and monitoring burden.
- **Significance & Future Impact**: "When to stop tool use" becomes meta-decision for governance design. Future: learning/verifying tool usage policies becomes critical.
- **Source**: [The Tool-Overuse Illusion: Why Does LLM Prefer External Tools over Internal Knowledge?](https://arxiv.org/abs/2604.19749)

### [APOLLO: A multimodal and temporal foundation model for virtual patient representations at healthcare system scale](https://arxiv.org/abs/2604.18570) (APOLLO: Multimodal Temporal Healthcare Foundation Model)
- **Date**: 2026-04-24
- **Field**: Medical AI / Multimodal foundation models
- **Authors/Affiliation**: Ali Zan, Ting Ding, Samuel J. Wagner, et al.
- **Background & Question**: Most healthcare data remains unused; diverse unstructured modalities need temporal integration.
- **Proposed Method & Key Results**: Built APOLLO—a temporal foundation model on MGB-7M dataset (7.2M people, 25B events, 28 modalities). Schizophrenia onset: AUROC 0.92; HER2+ breast cancer survival: AUROC 0.93 (baseline 0.66).
- **Significance & Future Impact**: Grounds medical prediction in "foundation representation," extending to lifetime health management. Limits: ethics review and trust validation remain critical.
- **Source**: [A multimodal and temporal foundation model for virtual patient representations at healthcare system scale](https://arxiv.org/abs/2604.18570)

### [Experience Compression Spectrum: Unifying Memory, Skills, and Rules in LLM Agents](https://arxiv.org/abs/2604.15877) (Experience Compression Spectrum: Memory/Skills/Rules Unified)
- **Date**: 2026-04-27
- **Field**: Long-horizon agent execution / Memory & learning
- **Authors/Affiliation**: Xing Zhang, Guanghui Wang, Yanwei Cui, et al.
- **Background & Question**: Long execution accumulates vast experience; retention inflates context while lossy summaries degrade reproducibility. Systematic compression-and-switching principles are needed.
- **Proposed Method & Key Results**: Proposes "compression spectrum" placing memory, skills, rules at different compression levels, identifying the "missing diagonal" where fixed compression fails on adaptation. Cross-citation under 1%, suggesting community fragmentation.
- **Significance & Future Impact**: Elevates "experience design" from implementation to design principle. Next: adaptive switching strategies and deeper empirical validation.
- **Source**: [Experience Compression Spectrum: Unifying Memory, Skills, and Rules in LLM Agents](https://arxiv.org/abs/2604.15877)

### [OpenCLAW-P2P v6.0: Resilient Multi-Layer Persistence, Live Reference Verification, and Production-Scale Evaluation](https://arxiv.org/abs/2604.19792) (OpenCLAW-P2P v6.0: Distributed AI Peer-Review Operations)
- **Date**: 2026-04-27
- **Field**: AI safety / Generated content verification and operations
- **Authors/Affiliation**: Francisco Angulo de Lafuente, Teerth Sharma, Vladimir Veselov, et al.
- **Background & Question**: Agents generating papers must guarantee reference correctness and evaluation scale operationally.
- **Proposed Method & Key Results**: Multi-layer persistence, reference search cascade for low latency, live reference verification during review scoring, API proxy with rate-limiting cache. Includes lost-paper recovery protocol.
- **Significance & Future Impact**: Shifts "safety" from model internals to operational pipeline. Challenge: addressing subtle citation errors only auditable after review.
- **Source**: [OpenCLAW-P2P v6.0](https://arxiv.org/abs/2604.19792)

### [It's a TRAP! Task-Redirecting Agent Persuasion Benchmark for Web Agents](https://arxiv.org/abs/2512.23128) (TRAP: Measuring Task Redirection Through Persuasion)
- **Date**: 2026-04-27
- **Field**: Agent safety / Benchmarking
- **Authors/Affiliation**: (OpenReview/abstract-sourced)
- **Background & Question**: Web agents face real persuasion and manipulation; measuring when "task becomes something else" rather than injection alone is necessary.
- **Proposed Method & Key Results**: TRAP benchmark framework reproducibly quantifies persuasion-driven task redirection. Directly measures final deviation rather than input string markers.
- **Significance & Future Impact**: Safety evaluation ties "input" to "final deviation." Future: real-world manipulation coverage and model transfer robustness validation.
- **Source**: [It's a TRAP! Task-Redirecting Agent Persuasion Benchmark for Web Agents](https://arxiv.org/abs/2512.23128)

## 4. Cross-Domain Analysis

The April paper corpus shares a common thread: research focus shifted from "performance competition" to "design of viability conditions (constraints) and verifiability." Robotics maps reachability and physical constraints into planning; life sciences integrate physics alignment and temporal context into foundation representation. Multimodal research decomposes modal competition and "seeming to see" through both benchmarks and inference intervention.

On safety, as agents act on external environments, threat models chain (persuasion→execution→deviation→reuse), and pre-rule proliferation cannot keep pace. Three layers thus proceed in parallel: (1) safety case audits, (2) unsupervised novel-deviation monitoring, (3) sandbox pre-formal-verification. This reflects that evaluation design itself became **research infrastructure's core.**

Organizational and market research (computational social science, financial/institutional design) further reveal AI's impact extends beyond single-task accuracy to collective belief formation, welfare, learning velocity, and accumulated misalignment. **AI evaluation should span both individual and operational-system levels**—a meta-conclusion widely shared across fields.

## 5. Next Month's Focus Areas

Expected accelerators include: (a) "auditable forms" of safety cases (evidence coverage, premise realism, falsifiability) linked to agent RAG "deviation-detection→recovery" closed-loop design, (b) long-horizon experience compression (adaptive memory/skill/rule switching) bridged through experiment, benchmark, and operational engineering, (c) quantization and tool-policy optimization unifying metrics across "safety, accuracy, cost" simultaneous optimization frameworks.

Research community infrastructure (incentive design for best-paper selection, participation/collaboration structure analysis) will likely be quantified more formally, linking evaluation distortion to learning bias.

## 6. References

| Title | Source | Date | URL |
|-------|--------|------|-----|
| Binary Latent Protein Fitness Landscapes for Quantum Annealing Optimization | arXiv | 2026-03-30 | https://arxiv.org/abs/2603.17247 |
| CASSR: Continuous A-Star Search through Reachability for real time footstep planning | arXiv | 2026-03-30 | https://arxiv.org/abs/2603.02989 |
| TerraBind: Fast and Accurate Binding Affinity Prediction through Coarse Structural Representations | arXiv | 2026-02-xx | https://arxiv.org/abs/2602.07735 |
| Code-Space Response Oracles: Generating Interpretable Multi-Agent Policies with Large Language Models | arXiv | 2026-03-30 | https://arxiv.org/abs/2603.10098 |
| ARC-AGI-3: A New Challenge for Frontier Agentic Intelligence | arXiv | 2026-03-30 | https://arxiv.org/abs/2603.24621 |
| Safety is Non-Compositional: A Formal Framework for Capability-Based AI Systems | arXiv | 2026-03-30 | https://arxiv.org/abs/2603.15973 |
| FireBench: Evaluating Instruction Following in Enterprise and API-Driven LLM Applications | Article | 2026-04-01 | https://ai-navigate-news.com/en/articles/127560eb-3c88-49b9-acfa-7b70547b3158 |
| Why Is RLHF Alignment Shallow? A Gradient Analysis | arXiv | 2026-04-01 | https://arxiv.org/abs/2603.04857 |
| Probing the Lack of Stable Internal Beliefs in LLMs | arXiv | 2026-04-01 | https://arxiv.org/abs/2603.25187 |
| SoK: Agentic RAG — First Unified Framework for Autonomous Retrieval-Generation Systems | arXiv | 2026-04-01 | https://arxiv.org/abs/2603.07379 |
| Eval awareness in Claude Opus 4.6's BrowseComp performance | Anthropic | 2026-04-03 | https://www.anthropic.com/engineering/eval-awareness-browsecomp |
| Bio-PINNs: Biomimetic PINNs for Cell-Induced Phase Transitions: UQ-R3 Sampling with Causal Gating | arXiv | 2026-04-03 | https://arxiv.org/abs/2603.29184 |
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

> This article was automatically generated by LLM. It may contain errors.
