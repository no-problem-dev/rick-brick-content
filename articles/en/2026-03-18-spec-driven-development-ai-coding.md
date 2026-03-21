---
title: "Introduction to Spec-Driven Development — Why Specifications Became Paramount in AI-Driven Development"
slug: "spec-driven-development-ai-coding"
summary: "As the limitations of 'Vibe Coding' become clear, Spec-Driven Development (SDD), which treats specifications as 'contracts' for AI, is emerging as the dominant paradigm in AI-driven development for..."
date: "2026-03-18"
tags: ["AI Development","Specifications","SDD","Context Engineering","LLM","Claude Code"]
category: "tech-article"
automated: false
thumbnail: "/images/spec-driven-development.png"
draft: false
---
## Introduction — The Honeymoon of "Vibe Coding" Has Ended

In early 2025, Andrej Karpathy, co-founder of OpenAI, proposed the concept of "Vibe Coding" – a development style where developers throw intuitive prompts at AI and accept the generated code almost as-is. Initially hailed as a productivity revolution, the optimism was short-lived.

The reality, according to research data, is stark. A 2025 Veracode survey found that **45% of AI-generated code contains security vulnerabilities**. An analysis of 470 open-source PRs by CodeRabbit revealed that AI-assisted code had **1.7 times more "major issues"**, 75% more misconfigurations, and 2.74 times more security vulnerabilities than human-written code. Paradoxically, a study showed that experienced developers experienced a **19% drop in productivity** when using AI coding tools (despite their own prediction of a 24% increase).

What is the root cause behind this situation, often called the "Vibe Coding hangover"? And what is the paradigm emerging as a solution: **Spec-Driven Development (SDD)**? This article will delve into the details with research papers, corporate case studies, and practical knowledge.

---

## Structural Reasons Why Vibe Coding Fails

### The "Unreadable AI Mind" Problem

GitHub's blog succinctly captures this problem: "**LLMs are good at pattern completion, but they cannot read minds.**"

If you ask an AI coding assistant to "create a login function," it will generate some form of login function. However, it won't know whether it should use OAuth 2.0, how session management will be handled, if it fits the existing DB schema, or how to meet security requirements – unless explicitly stated, the AI will simply complete "plausible-looking code."

### Shadow Bugs and Hallucination Loops

Vibe Coding gives rise to two broad categories of problems:

One is **Shadow Bugs** (code that looks correct but contains serious vulnerabilities). The code runs, and tests pass. However, under specific conditions, SQL injection might occur, or authentication bypass might be possible. Cases where the problem surfaces only in production are common.

The other is **Hallucination Loops**. In multi-agent systems where multiple AI agents collaborate, one agent might incorrectly judge another agent's erroneous output as correct, creating a vicious cycle that amplifies their mutual errors. Without a "correct reference point" like a specification, this chain cannot be broken.

```mermaid
graph LR
    A[Agent A: Incorrect Implementation] --> B[Agent B: Review]
    B --> C[Approved as No Issue]
    C --> D[Incorrect Implementation to Production]
    D --> E[Too Late When Bug is Found]
```

### Context Loss and Architectural Inconsistency

Conversations with AI reset context for each session. The AI in the next session won't know that you decided "implement authentication with JWT" in the previous one. When multiple conversations or AI agents are involved, the overall architectural design can become fragmented, leading to a system with inconsistencies, where some parts use REST and others use GraphQL.

---

## What is Spec-Driven Development?

### Definition and Core Principles

Spec-Driven Development (SDD) is a development paradigm where **clear specifications (Specs) are defined as "contracts" for AI, and code is generated based on those contracts**.

Thoughtworks describes it as: "SDD is a paradigm that uses explicit requirement specifications as prompts for AI agents to generate executable code. Specifications explicitly define external behavior (input/output mapping, pre/postconditions, invariants, constraints, interface types)."

The principle of "**An hour invested in planning can save 10 hours of rework later**" applies most strongly in AI-driven development.

### Vibe Coding vs. SDD Comparison

| Aspect | Vibe Coding | Spec-Driven Development |
|:---|:---|:---|
| Primary Carrier of Information | Conversation / Prompts | Specification Files |
| Context Persistence | Session-bound only | Persistent (saved as files) |
| Record of Design Decisions | None (implicit) | Explicitly documented |
| Instruction to AI | Per-prompt | Reference to specification |
| Review Target | Code | Specification (first) -> Code (second) |
| Scale | Individual / Small-scale | Team / Production Systems |

### The 4-Phase Process of SDD

GitHub's **Spec Kit** (MIT License), released in September 2025, is an open-source toolkit for practicing SDD. Its design defines four phases:

**Specify**: Define user journeys and success criteria. AI generates a draft of `requirements.md`, which humans review and finalize.

**Plan**: Declare architecture, tech stack, and constraints. AI proposes `design.md`, which humans approve.

**Tasks**: Break down into small, reviewable units of work. AI generates `tasks.md`.

**Implement**: AI agents implement tasks, with humans verifying at each checkpoint.

The key to this process is the **explicit checkpoints** in each phase. It can be described as a workflow shift from "Prompt and Pray" to "Specify and Verify."

---

## What Research Papers Have Revealed

### Beyond the Prompt: An Empirical Study of Cursor Rules (arXiv:2512.18925)

A study by Microsoft and GitHub researchers Shaokang Jiang and Daye Nam, this is the first large-scale empirical study analyzing `.cursorrules` files across 401 open-source repositories (scheduled for MSR 2026 presentation).

This study's established taxonomy classifies context provision to AI coding assistants into five themes:

| Theme | Content |
|:---|:---|
| Conventions | Code style, naming conventions, formatting |
| Guidelines | Architectural patterns, best practices |
| Project Information | Tech stack, dependencies, directory structure |
| LLM Directives | Direct instructions to the AI (what to do/not to do) |
| Examples | Specific examples of expected code patterns |

The crucial finding is "**the effectiveness of AI is influenced not only by prompts but also by persistent, machine-readable directives.**" It's not transient prompts but persistent context files like `.cursorrules` or `CLAUDE.md` that define the quality of AI coding assistants.

### Promptware Engineering: Lifecycle Management of Specifications (arXiv:2503.02400)

The "Promptware Engineering" paper points out that current prompt development is in a "promptware crisis dependent on trial and error" (accepted by ACM TOSEM).

It proposes a solution: treating prompts (specifications) as "software artifacts" and managing them through the following lifecycle:

```
Requirements Definition → Design → Implementation → Testing → Debugging → Evolution → Deployment → Monitoring
```

Specifications, like code, must be treated as subjects of "version control, testing, and continuous improvement."

### 10 Guidelines for Code Generation Prompts (arXiv:2601.13118)

Identified through a survey of 50 practitioners, the most interesting finding of this study is "**perceived usefulness does not align with actual usage frequency.**"

Practitioners know that "explicit input/output specifications" and "definition of pre/postconditions" are useful, but they don't actually use them. SDD attempts to solve this "know but don't do" gap by incorporating it into the workflow.

### Multi-Agent Task Decomposition and Consistency Protection (arXiv:2511.01149)

The paper "Modular Task Decomposition and Dynamic Collaboration in Multi-Agent Systems" proposes a method that incorporates **constraint analysis and consistency protection mechanisms** during task decomposition.

It detects contradictions between subtasks in advance, preventing "hallucination loops" in multi-agent environments. This directly corresponds to SDD's approach of "making specifications the common language between agents."

---

## Context Engineering: Beyond Specifications

### From Prompt Engineering to "Context Engineering"

In September 2025, Anthropic defined this concept's evolution in an article titled "Effective Context Engineering for AI Agents."

**Context Engineering** is "maximizing the probability of desirable outcomes with a minimal set of high-signal tokens." If Prompt Engineering is a technique for "optimizing single-turn interactions between humans and LLMs," Context Engineering is the technique for "**designing the information flow for agents and the entire environment.**"

Anthropic warns of the "**context corruption**" phenomenon that occurs with expanding context windows. As the context grows longer, the risk increases that LLMs will fail to accurately recall later information. Simply telling the AI "read the entire specification" is insufficient; designing for **providing the right information at the right time** is crucial.

### Recommended 4 Techniques

The four context management techniques recommended by Anthropic are:

**Just-in-Time Retrieval**: Dynamically inject only the information needed for a task, rather than passing the entire specification at once.

**Conversation History Compaction**: Summarize and compress long conversations to maintain context quality.

**Structured Note-Taking**: Record important decisions and findings in a structured format for reference by subsequent AI calls.

**Sub-Agent Architecture**: Divide into specialized agents to minimize the context for each agent.

### Design Principles for AGENTS.md / CLAUDE.md

GitHub's "How to Write a Great agents.md" (analyzing over 2,500 repositories) defines six core areas for effective context files:

```
1. Commands — Commands for build, test, lint execution
2. Tests — How to run tests and expected output
3. Project Structure — Directory organization and role of each file
4. Code Style — Formatting conventions, naming rules
5. Git Workflow — Branching strategy, commit message conventions
6. Boundaries — Always run / Pre-check / Prohibited
```

However, a note of caution: research presented by ETH Zurich in 2026 indicated that "LLM-generated context files have a minor negative effect on task success rates." The current best practice is to limit context files to "information that cannot be inferred from tools or existing code."

---

## Practice: 6 Elements to Include in SDD Specifications

The specifications created with SDD are required to include the following six elements:

**1. User Stories and Stakeholders**
Clearly describe "who" needs "what" and "for what purpose."

**2. Measurable Success Criteria**
Define quantitatively, e.g., "LCP under 2.5 seconds," rather than "performance improves."

**3. Functional and Non-Functional Requirements**
Describe "what to do" as well as "what NOT to do" (explicit constraints).

**4. Technical Context and Integration Points**
Specify interfaces with existing systems, APIs, and libraries to be used.

**5. Preconditions, Postconditions, and Invariants**
Formally define the logical constraints that functions, modules, or systems must satisfy.

```markdown
## User Registration API (POST /api/users)

### Preconditions
- Email address is not already registered
- Password is at least 8 characters long

### Postconditions
- User is saved in the database
- A confirmation email is sent
- JWT is included in the response

### Invariants
- Passwords must be stored hashed (never in plaintext)
- Email addresses must be normalized to lowercase
```

**6. Acceptance Tests**
Describe "what constitutes completion" in a verifiable manner. AI uses this as a reference for test code.

### The Importance of Explicitly Stating "Prohibitions"

As Redis author antirez points out, it's important to include "hints about good-looking but bad solutions" in specifications.

```markdown
## Prohibited Patterns
- Use of global variables (use dependency injection instead)
- Asynchronous control with setTimeout (use Promises)
- Casting to any type (use type inference or unions)
- Direct database access (always go through the repository layer)
```

### A Shift in Debugging Paradigm

In SDD, debugging means **modifying the specification** rather than fixing the code. Code bugs are symptoms of specification gaps; modifying the specification propagates a consistent fix to all generated code.

---

## The Future as Shown by Anthropic's 2026 Trends Report

Anthropic's "2026 Agentic Coding Trends Report," published in January 2026, reports that software development is undergoing "**the biggest transformation since the GUI**."

The engineer's role is shifting from "code writer" to "AI agent coordinator." However, the report also offers a crucial caveat: **only about 0-20% of tasks are fully delegatable**; the rest require active supervision, verification, and human judgment.

Listed as strategic priorities for 2026 are:
- Mastering multi-agent coordination
- Scaling human-agent oversight
- Integrating security architectures

This report indicates that SDD is not merely "how to write specifications" but **the organizational and technical infrastructure for safe collaboration between AI agents and humans**.

---

## Conclusion: Are Specifications More Important Than Code?

The proposition presented by SDD is provocative: **specifications are the most critical engineering artifact**.

Traditionally, "writing code" was the primary job of an engineer. In a world where AI can write code, "defining what to write" becomes the engineer's core value.

"AI can write code. However, defining 'what to build' remains a human task." – This shift in perception is the first step to success in AI-driven development.

The principle "An hour invested in planning can save 10 hours of rework later" is one of the highest return investments in 2026. The intuitive fun of Vibe Coding might be lost. However, with SDD, we can regain **trust and predictability** in AI-generated code.

---

## References

| Title | Source | Date | URL |
|:---|:---|:---|:---|
| Beyond the Prompt: An Empirical Study of Cursor Rules | MSR 2026 / arXiv | 2025-12-21 | https://arxiv.org/abs/2512.18925 |
| Promptware Engineering: Software Engineering for Prompt-Enabled Systems | ACM TOSEM / arXiv | 2025-03-04 | https://arxiv.org/abs/2503.02400 |
| Guidelines to Prompt LLMs for Code Generation | arXiv | 2026-01-19 | https://arxiv.org/abs/2601.13118 |
| Modular Task Decomposition and Dynamic Collaboration in Multi-Agent Systems | arXiv | 2025-11-03 | https://arxiv.org/abs/2511.01149 |
| Context Engineering for AI Agents in Open-Source Software | arXiv | 2025-10-24 | https://arxiv.org/abs/2510.21413 |
| Effective Context Engineering for AI Agents | Anthropic Engineering | 2025-09-29 | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents |
| 2026 Agentic Coding Trends Report | Anthropic | 2026-01-21 | https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf |
| Spec-Driven Development with AI: Get Started with a New Open Source Toolkit | GitHub Blog | 2025-09-02 | https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/ |
| How to Write a Great agents.md: Lessons from Over 2,500 Repositories | GitHub Blog | 2025-11-19 | https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/ |
| Spec-Driven Development: Unpacking One of 2025's Key New AI-Assisted Engineering Practices | Thoughtworks | 2025-11 | https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices |
| My LLM Coding Workflow Going into 2026 | Addy Osmani | 2025-12 | https://addyosmani.com/blog/ai-coding-workflow/ |
| How to Write a Good Spec for AI Agents | Addy Osmani | 2025-10 | https://addyosmani.com/blog/good-spec/ |
| Coding with LLMs in the Summer of 2025 | antirez | 2025-07 | https://antirez.com/news/154 |
| Vibe Coding: Pros, Cons, and 2026 Forecasts | PVS-Studio | 2025-12 | https://pvs-studio.com/en/blog/posts/1338/ |
| The Evidence Against Vibe Coding: What Research Reveals About AI Code Quality | SoftwareSeni | 2026 | https://www.softwareseni.com/the-evidence-against-vibe-coding-what-research-reveals-about-ai-code-quality/ |
| Spec-Driven Development with AI Coding Agents: The Workflow Replacing "Prompt and Pray" | Java Code Geeks | 2026-03 | https://www.javacodegeeks.com/2026/03/spec-driven-developmentwith-ai-coding-agents-the-workflow-replacingprompt-and-pray.html |

---

> This article was automatically generated by LLM. It may contain errors.
