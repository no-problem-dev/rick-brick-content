---
title: "Introduction to Spec-Driven Development — Why Specification Documents Have Become Paramount in AI-Driven Development"
slug: "spec-driven-development-ai-coding"
summary: "As the limitations of \"Vibe Coding\" become apparent, Spec-Driven Development (SDD), which treats specifications as \"contracts\" for AI, is emerging as the dominant paradigm for AI-driven development..."
date: "2026-03-18"
tags: ["AI開発","仕様書","SDD","コンテキストエンジニアリング","LLM","Claude Code"]
category: "tech-article"
automated: false
thumbnail: "/images/spec-driven-development.png"
draft: false
---
## Introduction — The Honeymoon of "Vibe Coding" is Over

In early 2025, Andrej Karpathy, co-founder of OpenAI, proposed the concept of "Vibe Coding" – a development style where developers give intuitive prompts to AI and accept the generated code almost as-is. While initially hailed as a productivity revolution, the optimism was short-lived.

Research data paints a grim picture. A 2025 Veracode survey found that **45% of AI-generated code contains security vulnerabilities**. An analysis of 470 open-source PRs by CodeRabbit revealed that AI-assisted code had **1.7 times more "major issues"** than human-written code, with 75% more misconfigurations and 2.74 times more security vulnerabilities. Paradoxically, a study found that experienced developers using AI coding tools experienced a **19% decrease in productivity** (despite their own prediction of a 24% increase).

What is the root cause of this situation, often called "Vibe Coding hangover"? And what is the paradigm emerging as a solution: **Spec-Driven Development (SDD)**? This article will delve into the details, incorporating research papers, corporate case studies, and practical knowledge.

---


## Structural Reasons Why Vibe Coding Fails

### The "Unreadable Mind AI" Problem

A GitHub blog succinctly captures this issue: "**LLMs are great at pattern completion, but they cannot read minds**."

If you ask an AI coding assistant to "create a login feature," it will generate some form of login feature. However, whether it uses OAuth 2.0, how session management is handled, if it aligns with existing DB schemas, or how security requirements are met – without explicit instruction, the AI will simply complete "plausible-looking code."

### Shadow Bugs and Hallucination Loops

The problems created by Vibe Coding can be broadly categorized into two types.

One is **Shadow Bugs** (code that appears correct but contains serious vulnerabilities). The code runs, and tests pass. However, under specific conditions, SQL injection might occur, or authentication bypass might be possible. Cases where problems surface only in production environments are common.

The other is the **Hallucination Loop**. In multi-agent systems where multiple AI agents collaborate, one agent's erroneous output is judged as correct by another agent, creating a vicious cycle that reinforces each other's mistakes. Without a "correct reference point" like a specification document, this chain cannot be broken.

```mermaid
graph LR
    A[Agent A: Incorrect Implementation] --> B[Agent B: Review]
    B --> C[Approved as No Issue]
    C --> D[Incorrect Implementation Deploys to Production]
    D --> E[Too Late When Bug is Discovered]
```

### Context Loss and Architectural Inconsistency

Conversations with AI reset context with each session. The AI in the next session might not know that you decided to "implement authentication with JWT" in the previous one. When multiple conversations or multiple AI agents are involved, the overall architectural design can become fragmented, leading to an inconsistent system where one part uses REST and another uses GraphQL.

---


## What is Spec-Driven Development?

### Definition and Core Principles

Spec-Driven Development (SDD) is a development paradigm that **defines clear specification documents (Specs) as "contracts" for AI, and has AI generate code based on those contracts**.

Thoughtworks explains it as follows: "SDD uses clear requirement specifications as prompts for AI agents to generate executable code. Specifications explicitly define external behavior (input/output mapping, pre/post-conditions, invariants, constraints, interface types)."

The principle of "**Investing an hour in planning can save ten hours of rework later**" (Thoughtworks) is most strongly applicable in AI-driven development.

### Vibe Coding vs. SDD Comparison

| Aspect              | Vibe Coding                | Spec-Driven Development        |
|:--------------------|:---------------------------|:-------------------------------|
| Primary carrier of information | Conversation/Prompts       | Specification Files            |
| Context Persistence | Within Session Only        | Persistent (Saved as Files)    |
| Record of Design Decisions | None (Implicit)            | Explicitly Documented          |
| AI Instruction      | Prompt per Instance        | Referencing Specification      |
| Review Target       | Code (After)               | Specification (First) -> Code (After) |
| Scale               | Individual/Small Scale     | Team/Production Systems        |

### SDD's 4-Phase Process

GitHub's **Spec Kit** (MIT License), released in September 2025, is an open-source toolkit for practicing SDD. Its design defines four phases:

**Specify**: Define user journeys and success criteria. AI generates a draft of requirements.md, but humans review and finalize it.

**Plan**: Declare architecture, technology stack, and constraints. AI proposes design.md, and humans make decisions.

**Tasks**: Break down into small, reviewable units of work. AI generates tasks.md.

**Implement**: AI agents implement tasks, with humans verifying at each checkpoint.

The key takeaway of this process is the **explicit checkpoints** in each phase. It represents a workflow shift from "Prompt and Pray" to "Specify and Verify."

---


## What Research Papers Have Revealed

### Beyond the Prompt: An Empirical Study of Cursor Rules (arXiv:2512.18925)

A study conducted by Microsoft and GitHub researchers Shaokang Jiang and Daye Nam is the first large-scale empirical study analyzing `.cursorrules` files across 401 open-source repositories (scheduled for MSR 2026 presentation).

This study established a taxonomy classifying context provided to AI coding assistants into five themes:

| Theme             | Content                                                                |
|:------------------|:-----------------------------------------------------------------------|
| Conventions       | Code style, naming conventions, formatting                             |
| Guidelines        | Architectural patterns, best practices                                 |
| Project Information | Technology stack, dependencies, directory structure                    |
| LLM Directives    | Direct instructions to the AI (what to do/not to do)                   |
| Examples          | Specific examples of expected code patterns                            |

A significant finding is that "**the effectiveness of AI is influenced not only by prompts but also by persistent, machine-readable directives**." It's not temporary prompts, but persistent context files like `.cursorrules` or `CLAUDE.md` that define the quality of AI coding assistants.

### Promptware Engineering: Lifecycle Management of Specifications (arXiv:2503.02400)

The "Promptware Engineering" paper points out that current prompt development is in a "promptware crisis dependent on trial and error" (accepted by ACM TOSEM).

It proposes treating prompts (specifications) as "software artifacts" and managing them through the following lifecycle:

```
Requirements Definition → Design → Implementation → Testing → Debugging → Evolution → Deployment → Monitoring
```

Specifications, like code, must be treated as subjects of "version control, testing, and continuous improvement."

### 10 Guidelines for Code Generation Prompts (arXiv:2601.13118)

Identified through a survey of 50 practitioners, the most interesting finding of this study is that "**perceived usefulness and actual usage frequency do not align**."

While practitioners know that "explicit input/output specifications" and "definition of pre/post-conditions" are useful, they don't actually use them. SDD attempts to bridge this "know but don't do" gap by incorporating it into the workflow.

### Multi-Agent Task Decomposition and Consistency Protection (arXiv:2511.01149)

The "Modular Task Decomposition and Dynamic Collaboration in Multi-Agent Systems" paper proposes a method for incorporating **constraint analysis and consistency protection mechanisms** during task decomposition.

It preemptively detects contradictions between subtasks and prevents "hallucination loops" in multi-agent environments. This directly aligns with SDD's approach of "making specification documents the common language between agents."

---


## Context Engineering: Beyond Specifications

### From Prompt Engineering to "Context Engineering"

In September 2025, Anthropic defined the evolution of this concept in an article titled "Effective Context Engineering for AI Agents."

**Context Engineering** is defined as "maximizing the probability of desired outcomes with a minimal set of high-signal tokens." While prompt engineering is a technique for "optimizing a single interaction between humans and LLMs," context engineering is the technique for "**designing the information flow between agents and the entire environment**."

Anthropic warns of the "**context corruption**" phenomenon that occurs with the expansion of context windows. As the context grows longer, the risk of LLMs inaccurately recalling information from later parts increases. Simply giving the AI "read the entire specification document" is insufficient; designing the system to **provide necessary information at the necessary time** is crucial.

### Recommended Four Techniques

Anthropic recommends the following four context management techniques:

**Just-in-Time Retrieval**: Dynamically inject only the information needed for a task, rather than providing the entire specification at once.

**Conversation History Compaction**: Summarize and compress long conversations to maintain context quality.

**Structured Note-Taking**: Record important decisions and findings in a structured manner for reference in subsequent AI calls.

**Sub-Agent Architecture**: Divide into specialized agents to minimize each agent's context.

### Design Principles for AGENTS.md / CLAUDE.md

GitHub's "How to Write a Great agents.md" (based on analysis of over 2,500 repositories) defines six core areas for effective context files:

```
1. Commands — Commands for build, test, and lint execution
2. Tests — How to execute tests and expected outputs
3. Project Structure — Directory organization and the role of each file
4. Code Style — Formatting conventions, naming rules
5. Git Workflow — Branching strategies, commit message conventions
6. Boundaries — Always execute / Pre-check / Forbidden
```

However, a caution is needed: research published in 2026 by ETH Zurich indicated that "LLM-generated context files have a slightly negative effect on task success rates." The current best practice is to "limit context files to information that cannot be inferred from tools or existing code."

---


## Practice: Six Elements to Include in SDD Specifications

Specifications created with SDD should include the following six essential elements:

**1. User Stories and Stakeholders**
Clearly describe "who" needs "what" and "for what purpose."

**2. Measurable Success Criteria**
Define quantitatively, not with vague terms like "improved performance," but with specifics like "LCP under 2.5 seconds."

**3. Functional and Non-Functional Requirements**
Describe "what to do" as well as "what not to do" (explicit constraints).

**4. Technical Context and Integration Points**
Clearly state interfaces with existing systems, and the APIs or libraries to be used.

**5. Pre-conditions, Post-conditions, and Invariants**
Formally define the logical constraints that functions, modules, or the system must satisfy.

```markdown
## User Registration API (POST /api/users)

### Pre-conditions
- Email address is not already registered
- Password is 8 characters or longer

### Post-conditions
- User is saved to the database
- Confirmation email is sent
- JWT is included in the response

### Invariants
- Passwords must be stored hashed (never in plain text)
- Email addresses must be normalized to lowercase
```

**6. Acceptance Tests**
Describe "how to know when it's done" in a verifiable manner. AI will use this as a reference point for test code.

### The Importance of Explicitly Stating "Prohibitions"

As pointed out by antirez, the author of Redis, it is important to include "hints about solutions that look good but are bad" in the specification document.

```markdown
## Prohibited Patterns
- Usage of global variables (use dependency injection instead)
- Asynchronous control with setTimeout (use Promises)
- Casting to `any` type (use type inference or union types)
- Direct database access (always go through the repository layer)
```

### Paradigm Shift in Debugging

In SDD, debugging means **modifying the specification document**, not fixing the code. Bugs in the code are symptoms of gaps in the specification. By correcting the specification, the change propagates to all generated code for a consistent fix.

---


## The Future Indicated by Anthropic's 2026 Trend Report

Anthropic's "2026 Agentic Coding Trends Report," released in January 2026, states that software development is undergoing "**the biggest transformation since the GUI**."

The role of engineers is shifting from "code writers" to "AI agent orchestrators." However, the report also offers a crucial caveat: **fully delegable tasks account for only about 0-20% of the total**; the rest require active supervision, verification, and human judgment.

Strategic priorities for 2026 include:
- Mastering multi-agent orchestration
- Scaling human-agent oversight
- Incorporating security architectures

This report suggests that SDD is not just "how to write specifications" but rather an **organizational and technical infrastructure for safe collaboration between AI agents and humans**.

---


## Conclusion: Is the Specification More Important Than Code?

SDD presents a provocative proposition: **the specification document is the most critical engineering deliverable**.

Traditionally, "writing code" was the primary job of an engineer. In a world where AI can write code, "defining what should be written" becomes the engineer's core value.

"AI can write code. However, defining 'what to build' remains a human task." – This shift in perception is the first step to success in AI-driven development.

The principle of "investing an hour in planning can save ten hours of rework later" is one of the highest-return investments in 2026. While the intuitive fun of Vibe Coding may be lost, SDD allows us to regain **trust and predictability** in AI-generated code.

---


## References

| Title                                                                                | Source                         | Date       | URL                                              |
|:-------------------------------------------------------------------------------------|:-------------------------------|:-----------|:-------------------------------------------------|
| Beyond the Prompt: An Empirical Study of Cursor Rules                                | MSR 2026 / arXiv               | 2025-12-21 | https://arxiv.org/abs/2512.18925                 |
| Promptware Engineering: Software Engineering for Prompt-Enabled Systems              | ACM TOSEM / arXiv              | 2025-03-04 | https://arxiv.org/abs/2503.02400                 |
| Guidelines to Prompt LLMs for Code Generation                                        | arXiv                          | 2026-01-19 | https://arxiv.org/abs/2601.13118                 |
| Modular Task Decomposition and Dynamic Collaboration in Multi-Agent Systems          | arXiv                          | 2025-11-03 | https://arxiv.org/abs/2511.01149                 |
| Context Engineering for AI Agents in Open-Source Software                            | arXiv                          | 2025-10-24 | https://arxiv.org/abs/2510.21413                 |
| Effective Context Engineering for AI Agents                                          | Anthropic Engineering          | 2025-09-29 | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents |
| 2026 Agentic Coding Trends Report                                                    | Anthropic                      | 2026-01-21 | https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf |
| Spec-Driven Development with AI: Get Started with a New Open Source Toolkit        | GitHub Blog                    | 2025-09-02 | https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/ |
| How to Write a Great agents.md: Lessons from Over 2,500 Repositories               | GitHub Blog                    | 2025-11-19 | https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/ |
| Spec-Driven Development: Unpacking One of 2025's Key New AI-Assisted Engineering Practices | Thoughtworks                   | 2025-11    | https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices |
| My LLM Coding Workflow Going into 2026                                               | Addy Osmani                    | 2025-12    | https://addyosmani.com/blog/ai-coding-workflow/  |
| How to Write a Good Spec for AI Agents                                               | Addy Osmani                    | 2025-10    | https://addyosmani.com/blog/good-spec/           |
| Coding with LLMs in the Summer of 2025                                               | antirez                        | 2025-07    | https://antirez.com/news/154                     |
| Vibe Coding: Pros, Cons, and 2026 Forecasts                                          | PVS-Studio                     | 2025-12    | https://pvs-studio.com/en/blog/posts/1338/       |
| The Evidence Against Vibe Coding: What Research Reveals About AI Code Quality       | SoftwareSeni                   | 2026       | https://www.softwareseni.com/the-evidence-against-vibe-coding-what-research-reveals-about-ai-code-quality/ |
| Spec-Driven Development with AI Coding Agents: The Workflow Replacing "Prompt and Pray" | Java Code Geeks                | 2026-03    | https://www.javacodegeeks.com/2026/03/spec-driven-developmentwith-ai-coding-agents-the-workflow-replacingprompt-and-pray.html |

---

> This article was automatically generated by LLM. It may contain errors.
