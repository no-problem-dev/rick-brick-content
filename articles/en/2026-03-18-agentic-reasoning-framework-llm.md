---
title: "Four Axes Redefining LLMs into Autonomous AI Agents — A Systematization of Agentic Reasoning Frameworks"
slug: "agentic-reasoning-framework-llm"
summary: "Systematizing agentic reasoning along four axes: planning, tool use, memory, and self-improvement, based on the 'Large Language Model Agent' survey paper (arXiv:2503.21460). Explores the forefront ..."
date: "2026-03-18"
tags: ["AIエージェント","推論","LLM","マルチエージェント","MCP"]
category: "tech-article"
automated: false
thumbnail: "/images/agentic-reasoning-framework.png"
draft: false
---
### Redefining LLMs as Autonomous AI Agents: Four Axes of Agentic Reasoning

In March 2025, "Large Language Model Agent: A Survey on Methodology, Applications and Challenges" (arXiv:2503.21460) appeared on arXiv. This comprehensive survey synthesizes methodologies, applications, and challenges in LLM agents by examining 329 papers. With 26 researchers involved, led by Junyu Luo, it positions this as a crucial research area towards AGI (Artificial General Intelligence) and provides new guidance for systematizing agentic reasoning.

This article, using this survey as a focal point, organizes agentic reasoning along four axes—planning, tool use, memory, and self-improvement—and explains the forefront of LLM agent research, including Silo-Bench and MC-Search.

## Why is "Agentic Reasoning" Gaining Attention?

### From Scaling Laws to Agentification

From the late 2010s to the early 2020s, LLM performance improvements were driven by scaling laws: increasing model size, data volume, and computation. However, the cost of scaling increases exponentially, making it difficult to achieve equivalent performance gains with the same methods.

As of 2026, the research focus has clearly shifted from "how large to make the model" to "how to use the model." A survey paper organizing the landscape of agentic reinforcement learning (arXiv:2509.02547) describes this transition as "from LLMs as passive sequence generators to autonomous decision-making agents embedded in complex dynamic environments."

### A Paradigm Shift from "Generation" to "Action"

Traditional LLMs were designed as "closed generation systems" that receive prompts and return text. Agentic LLMs fundamentally overturn this design.

- Given a goal, they autonomously formulate an action plan.
- They invoke external tools (search engines, code interpreters, APIs, etc.).
- They incorporate execution results as feedback and revise the plan.
- They maintain long-term memory and adapt across multiple sessions.

This represents a transition from "answering questions" to "completing tasks," a fundamental paradigm shift in AI systems.

## Four Core Axes of Agentic Reasoning

The four axes, as defined by the convergence of multiple surveys including "LLM-based Agentic Reasoning Frameworks: A Survey from Methods to Scenarios" (arXiv:2508.17692) and arXiv:2509.02547, form a common framework within the current research community.

```
┌────────────────────────────────────────┐
│         LLM Agent                │
│                                        │
│  ┌──────────┐    ┌──────────┐          │
│  │  Planning │    │ Tool Use │          │
│  │          │    │          │          │
│  └────┬─────┘    └────┬─────┘          │
│       │               │                │
│  ┌────▼─────┐    ┌────▼─────┐          │
│  │  Memory   │    │ Self-   │          │
│  │          │    │ Improve  │          │
│  └──────────┘    └──────────┘          │
└────────────────────────────────────────┘
```

### Axis 1: Planning

Planning is the starting point of agentic reasoning. It refers to the ability to decompose a given goal into a sequence of executable subtasks.

There has been a gradual evolution in **task decomposition methods**. While Chain-of-Thought (CoT) became popular as a simple planning representation, more sophisticated methods have emerged in recent years.

- **Tree-of-Thoughts (ToT)**: Represents plans in a tree structure, exploring and evaluating multiple candidate paths.
- **Graph-of-Thoughts (GoT)**: Introduces a graph structure, enabling plan reuse and branching.
- **Hierarchical Architectures**: High-level agents formulate strategic plans and delegate specific subtasks to lower-level agents.

The accuracy of planning is the most critical factor influencing the overall performance of the agent. Without appropriate subtask decomposition, subsequent tool use and memory utilization cannot be effective.

### Axis 2: Tool Use

Tool use is the functionality that enables agents to interact with external systems. LLMs autonomously select and invoke various tools, such as issuing queries to search engines, executing code, referencing databases, and calling external APIs.

The advent of the **Model Context Protocol (MCP)** holds historical significance in standardizing this tool use. Proposed by Anthropic in November 2024, this protocol is an open standard for "plug-and-play" connection between LLMs and tool sets, often referred to as the "USB-C for AI applications."

MCP adoption has spread rapidly, with monthly SDK downloads exceeding 97 million by the end of 2025, and major companies like OpenAI, Google, and Microsoft have announced their adoption. In December 2025, Anthropic donated MCP to the Agentic AI Foundation (AAIF) under the Linux Foundation, solidifying its status as a true industry standard.

Methodologies for tool selection can be classified into the following three types:

| Selection Method | Description | Application Scenarios |
|---|---|---|
| Autonomous Selection | LLM selects tools based on situational judgment | General-purpose agents |
| Rule-Based | Selection based on predefined rules | Tasks with clear constraints |
| Learning-Based | Optimizes tool selection through reinforcement learning | Repetitive tasks |

### Axis 3: Memory

Memory is the foundation supporting agent autonomy. Since LLM context windows are finite, external memory mechanisms are necessary for long-term information retention.

"Memory for Autonomous LLM Agents: Mechanisms, Evaluation, and Emerging Frontiers" (arXiv:2603.07670) comprehensively reviews memory research from 2022 to early 2026 and defines a four-layer memory architecture.

| Memory Type | Description | Implementation Examples |
|---|---|---|
| Working Memory | Context of the current task (context window) | LLM input buffer |
| Episodic Memory | Past events and experiences (with timestamps) | Vector databases |
| Semantic Memory | Abstract concepts, knowledge, and facts | Knowledge graphs, RAG |
| Procedural Memory | Executable skills and plan templates | Fine-tuning, code |

A significant finding from the research is the reality that "examples of ideal integration of the four-layer structure are rare." Most current systems effectively implement two layers, with inter-layer transitions handled heuristically. While research like A-Mem (arXiv:2502.12110) explores advanced memory architectures combining vector search and graph structures, complete four-layer integration remains an open research challenge.

### Axis 4: Self-Improvement

The fourth axis is the agent's ability to learn from experience and improve itself. The three paradigms of self-improvement organized by arXiv:2508.17692 are as follows:

**Reflection**: A mechanism by which an agent reviews its past actions and outcomes to extract lessons. Reflexion and Self-Refine are representative frameworks implementing this idea. Reflexion stores the action history as episodic memory and inserts a reflection process before the next trial. Self-Refine generates feedback on the generated output and uses that feedback to iteratively improve the output.

**Iterative Optimization**: An approach that iteratively refines prompts and tool selection strategies rather than updating the weights of the entire model.

**Interactive Learning**: Dynamically adjusting goals through continuous interaction with the environment. This has high affinity with reinforcement learning, and fusion with agentic RL is progressing.

## Agent's Basic Loop from an Implementation Perspective

From an implementation standpoint, the interaction of the four axes can be represented by the agent's basic loop, described as follows:

```python
# Basic loop of agentic reasoning (pseudocode)
def agent_loop(goal, tools, memory):
    while not goal_achieved(goal):
        # 1. Observe from the environment (perception)
        observation = perceive(environment)

        # 2. Retrieve relevant information from memory (memory)
        relevant_context = memory.retrieve(observation, top_k=5)

        # 3. Generate plan (planning)
        plan = llm.plan(goal, observation, relevant_context)

        # 4. Select and execute tool (tool use)
        action = plan.next_action()
        result = tools.execute(action)

        # 5. Update memory (memory -> material for self-improvement)
        memory.store(episode={
            "action": action,
            "result": result,
            "timestamp": now()
        })

        # 6. Reflect and self-correct (self-improvement)
        if result.is_failure():
            reflection = llm.reflect(action, result)
            plan.revise(reflection)
```

In this loop, the four axes do not function as independent modules but form a dynamic system that feeds back into each other.

## Multi-Agent: The Fifth Dimension

Multi-agent systems address challenges that go beyond the capabilities of a single agent. The survey in arXiv:2503.21460 positions inter-agent coordination mechanisms as a crucial pillar of architecture.

### MultiAgentBench: Establishing an Evaluation Framework

Contributing to the acceleration of multi-agent system research is MultiAgentBench (arXiv:2503.01935, accepted to ACL 2025). This framework quantitatively evaluates the cooperation and competition of LLM agent groups and has the following characteristics:

- Measures not only task completion rates but also cooperation quality using milestone-based KPIs.
- Evaluates four types of cooperation topologies: Star, Chain, Tree, and Graph.
- Verifies innovative strategies such as group discussions and cognitive planning.
- **Key Finding**: Graph structure achieves the highest performance in research scenarios, and cognitive planning improves milestone achievement rates by 3%.

### Designing Coordination Topologies

The organizational structure of multi-agent systems can be classified into three types.

```
Centralized          Decentralized             Hierarchical
     A                A  B                   Leader
   / | \              |\/|                  /   |   \
  B  C  D             C  D                Sub1 Sub2 Sub3
                                          / \       / \
                                         E   F     G   H
```

Results from MultiAgentBench indicate that the optimal topology varies depending on the nature of the task. For complex research tasks, Graph is superior, while for simple execution tasks, Star or Chain is more efficient.

## MC-Search: The Forefront of Multimodal Agentic Search

MC-Search (arXiv:2603.00873, submitted to ICLR 2026), released in March 2026, is a framework for evaluating and enhancing agent capabilities in complex information search tasks that span text and images.

**Dataset Scale and Characteristics**:

- Contains 3,333 high-quality examples.
- Step-wise reasoning chains with an average of 3.7 hops.
- Quality assurance through HAVE (Hop-wise Attribution and Verification of Evidence).

**Innovative Evaluation Metrics** (three process-level evaluations beyond traditional answer accuracy):

1. **LLM-as-a-Judge**: Evaluation of open-ended reasoning quality.
2. **Structure-Aware per Step Hit Rate**: Measurement of search accuracy per step.
3. **Rollout Deviation**: Quantification of execution drift (deviation from the plan).

**Search-Align**: A framework that improves the planning and search accuracy of open-source MLLMs through process supervision fine-tuning using verified reasoning chains.

MC-Search's identified eight systematic error patterns (over-search/under-search, modality mismatch planning, etc.) specifically illustrate typical failures that implementers should avoid.

## Challenges and Limitations of Agentic Reasoning

### Amplification of Reliability and Hallucination

When agents act autonomously over multiple steps, errors in intermediate steps can propagate to subsequent steps, risking amplification of the final error.

CARE-RFT (arXiv:2602.00085) directly addresses this trade-off. While reinforcement fine-tuning (RFT) that enhances reasoning performance also tends to amplify hallucinations, this problem can be mitigated by designing a confidence-based penalty using skew inverse KL divergence.

### Cost and Latency

Each time an agent repeats the planning, execution, and reflection loop, LLM inference cost is incurred. Complex tasks may require dozens of LLM calls, posing practical limitations.

### Security and Prompt Injection

Agents that reference external data are vulnerable to "prompt injection" attacks, where malicious content induces unintended actions. Sandbox design and the principle of least privilege are crucial.

### Evaluation Difficulty

As MC-Search demonstrates, evaluating agent performance is significantly more difficult than single-turn question answering. Designing appropriate process-level metrics is itself a critical research challenge.

## Application Domains: How Agents Are Changing Fields

### Software Engineering

One of the most active application areas for agentic reasoning. Agents that autonomously perform code generation, debugging, and refactoring over multiple steps are emerging, with rapid performance improvements recorded on benchmarks like SWE-Bench. The role of engineers is shifting from "people who write code" to "people who give goals to agents and verify their output."

### Scientific Discovery

Agents that autonomously repeat experimental design, literature surveys, hypothesis generation, and result analysis are poised to change the speed of scientific research. Applications in drug discovery and materials science are increasing, and accelerated discovery through collaboration with human researchers is expected.

### Interaction Economy Among AI Agents

Meta's acquisition of the AI agent-exclusive platform "Moltbook" signifies the nascent emergence of an "agent economy" where agents communicate and collaborate. Infrastructure development to realize agent identity verification and linkage to human owners is emerging as the next challenge.

## Conclusion: Design Guidelines Indicated by the Four Axes

The current state of LLM agent research, as organized by arXiv:2503.21460, shows that the four axes of planning, tool use, memory, and self-improvement form a system that complements each other, rather than independent modules.

```
Planning  ──────→ Tool Use
  ↑               │
  │               ↓
Self-Improvement ←──── Memory
```

Insights gained from tool use (external operations based on plans) are stored as memory, accumulated memory becomes material for self-improvement, and improved capabilities refine subsequent plans. This cycle is the core of agentic AI.

While benchmarks like MultiAgentBench and MC-Search are being developed, the four-layer integration of memory, countermeasures against prompt injection, and process-level evaluation methods remain open challenges.

In the post-scaling era, LLM agents are not just a technological advancement but are redefining the very nature of human-AI collaboration. A systematic understanding of the four axes is becoming indispensable foundational knowledge for anyone designing and utilizing agents.

## References

| Title | Source | Date | URL |
|---|---|---|---|
| Large Language Model Agent: A Survey on Methodology, Applications and Challenges | arXiv | 2025/03/27 | https://arxiv.org/abs/2503.21460 |
| LLM-based Agentic Reasoning Frameworks: A Survey from Methods to Scenarios | arXiv | 2025/08 | https://arxiv.org/html/2508.17692v1 |
| The Landscape of Agentic Reinforcement Learning for LLMs: A Survey | arXiv | 2025/09 | https://arxiv.org/abs/2509.02547 |
| Memory for Autonomous LLM Agents: Mechanisms, Evaluation, and Emerging Frontiers | arXiv | 2026/03 | https://arxiv.org/html/2603.07670 |
| MC-Search: Evaluating and Enhancing Multimodal Agentic Search with Structured Long Reasoning Chains | arXiv | 2026/03/01 | https://arxiv.org/abs/2603.00873 |
| MultiAgentBench: Evaluating the Collaboration and Competition of LLM agents | arXiv / ACL 2025 | 2025/03/03 | https://arxiv.org/abs/2503.01935 |
| A-Mem: Agentic Memory for LLM Agents | arXiv | 2025/02 | https://arxiv.org/pdf/2502.12110 |
| Model Context Protocol — Wikipedia | Wikipedia | 2025 | https://en.wikipedia.org/wiki/Model_Context_Protocol |
| A Year of MCP: From Internal Experiment to Industry Standard | Pento Blog | 2025 | https://www.pento.ai/blog/a-year-of-mcp-2025-review |
| Agentic LLMs in 2025: How AI Is Becoming Self-Directed, Tool-Using & Autonomous | Data Science Dojo | 2025 | https://datasciencedojo.com/blog/agentic-llm-in-2025/ |

---

> This article was automatically generated by LLM. It may contain errors.
