---
title: "Spec-Driven Development 入门 — AI 驱动开发中规范书为何变得最重要"
slug: "spec-driven-development-ai-coding"
summary: "随着 Vibe Coding 的局限性显现，将规范书视为 AI “契约”的 Spec-Driven Development (SDD) 正在成为 2025-2026 年 AI 驱动开发的主流范式。本文将结合论文和企业案例，阐述其背景、原则和实践方法。"
date: "2026-03-18"
tags: ["AI開発","仕様書","SDD","コンテキストエンジニアリング","LLM","Claude Code"]
category: "tech-article"
automated: false
thumbnail: "/images/spec-driven-development.png"
draft: false
---
## 前言 — “Vibe Coding” 的蜜月期已结束

2025 年初，OpenAI 联合创始人 Andrej Karpathy 提出了“Vibe Coding”的概念，这是一种向 AI 抛出感觉式提示（prompt），并几乎照单全收生成代码的开发风格。尽管起初受到生产力革命的欢迎，但这种乐观情绪并未持续太久。

研究数据显示的现实是严峻的。Veracode 的 2025 年调查发现，AI 生成的代码中 **45% 存在安全漏洞**。CodeRabbit 对 470 个开源 PR 的分析显示，AI 协同编写的代码比人类编写的代码**“主要问题”多 1.7 倍**，配置错误多 75%，安全漏洞多 2.74 倍。更具反讽意味的是，一项研究发现，熟练的开发者在使用 AI 编码工具时，生产力反而**下降了 19%**（尽管他们自己预测会提高 24%）。

是什么导致了这种被称作“Vibe Coding 的宿醉”的局面？作为解决方案应运而生的 **Spec-Driven Development（SDD）** 又是什么样的范式？本文将结合论文、企业案例和实践经验进行详细阐述。

--- 

## Vibe Coding 失败的结构性原因

### “读不懂 AI” 的问题

GitHub 的一篇博客文章一针见血地指出了这个问题：“**LLM 擅长模式补全，但无法读懂人心。**”

如果你让 AI 编码助手“创建一个登录功能”，它会生成某种登录功能。但它使用的是 OAuth 2.0 吗？会如何处理会话管理？是否与现有的数据库 schema 匹配？如何满足安全要求？—— 如果不明确这些，AI 就只会补全“看起来像”的代码。

### Shadow Bug 问题与幻觉循环

Vibe Coding 产生的问题主要分为两类。

第一类是 **Shadow Bug**（看起来正确但包含严重漏洞的代码）。代码可以运行，测试也能通过。但特定条件下可能会出现 SQL 注入，或者认证绕过。问题往往在进入生产环境后才显现。

另一类是 **幻觉循环**。在多个 AI 代理协同工作的多代理系统中，一个代理的错误输出可能会被另一个代理误判为正确，从而形成相互强化错误、恶性循环。如果没有规范书这个“正确参考点”，就无法打破这种链条。

```mermaid
graph LR
    A[Agent A: 错误实现] --> B[Agent B: 评审]
    B --> C[判定无误]
    C --> D[错误实现进入生产]
    D --> E[发现 Bug 时为时已晚]
```

### 上下文丢失与架构不一致

与 AI 的对话在每个会话结束后都会重置上下文。上一会话中决定的“认证使用 JWT 实现”在下一个会话中 AI 可能并不知晓。当涉及多次对话或多个 AI 代理时，整体架构设计会变得零散，可能出现一部分使用 REST，另一部分使用 GraphQL 的情况，导致系统缺乏统一性。

--- 

## Spec-Driven Development 是什么

### 定义与基本原则

Spec-Driven Development（SDD）是一种开发范式，它将**清晰的规范书（Spec）定义为 AI 的“契约”，并基于该契约让 AI 生成代码**。

Thoughtworks 如此解释：“SDD 使用清晰的需求规范作为提示，让 AI 代理生成可执行代码。规范书需要明确定义外部行为（输入输出映射、前置条件/后置条件、不变条件、约束、接口类型）”。

“**在规划上投入一小时，可以节省后续十小时的返工时间**”（Thoughtworks）这一原则，在 AI 驱动开发中尤为适用。

### Vibe Coding vs SDD 的比较

| 方面 | Vibe Coding | Spec-Driven Development |
|:-----|:------------|:------------------------|
| 信息主要载体 | 对话・提示 | 规范书文件 |
| 上下文持久性 | 仅在会话内 | 永续（保存为文件） |
| 设计决策记录 | 无（隐式） | 明确文档化 |
| 对 AI 的指令 | 每次单独提示 | 引用规范书 |
| 评审对象 | 代码 | 规范书（优先）→ 代码（次之） |
| 规模 | 个人・小型 | 团队・生产系统 |

### SDD 的 4 阶段流程

GitHub 于 2025 年 9 月发布的 **Spec Kit**（MIT License）是一个用于实践 SDD 的开源工具包。其设计定义了 4 个阶段：

**Specify（规范定义）**: 定义用户旅程和成功标准。AI 会生成 requirements.md 的草稿，但需要人工评审确定。

**Plan（技术规划）**: 声明架构、技术栈和约束。AI 会提出 design.md，由人工判断。

**Tasks（任务分解）**: 将任务分解为小型的、可评审的工作单元。AI 会生成 tasks.md。

**Implement（实现）**: AI 代理在实现任务的同时，人工会在每个检查点进行验证。

该流程的关键在于每个阶段都有**明确的检查点**。这可以看作是工作流从“Prompt and Pray（提示然后祈祷）”向“Specify and Verify（规范然后验证）”的转变。

--- 

## 论文揭示了什么

### Beyond the Prompt: Cursor Rules 实证研究（arXiv:2512.18925）

Microsoft 和 GitHub 的研究人员 Shaokang Jiang 和 Daye Nam 进行的研究，是对 401 个开源存储库中 `.cursorrules` 文件进行的首次大规模实证研究（MSR 2026 预定发表）。

该研究确立的分类法将向 AI 编码助手提供上下文的信息分为 5 个主题：

| 主题 | 内容 |
|:-----|:-----|
| Conventions | 代码风格、命名约定、格式 |
| Guidelines | 架构模式、最佳实践 |
| Project Information | 技术栈、依赖关系、目录结构 |
| LLM Directives | 对 AI 的直接行为指令（做什么/不做什么） |
| Examples | 预期代码模式的具体示例 |

一个重要发现是“**不仅提示，持久化的机器可读指令也决定了 AI 的效果。**” 相对于一次性的提示，`.cursorrules` 或 `CLAUDE.md` 这样的持久化上下文文件才决定了 AI 编码助手的质量。

### Promptware Engineering: 规范书的生命周期管理（arXiv:2503.02400）

“Promptware Engineering” 论文指出，当前的提示开发处于“依赖试错的 Promptware 危机”中（ACM TOSEM 采纳）。

作为解决方案，论文提出将提示（规范书）视为“软件构件”，并对其进行以下生命周期管理：

```
需求定义 → 设计 → 实现 → 测试 → 调试 → 演进 → 部署 → 监控
```

规范书需要像代码一样，被视为“版本控制、测试和持续改进”的对象。

### 代码生成提示的 10 条指南（arXiv:2601.13118）

这项研究通过对 50 名从业者的调查，得出的最有趣的发现是“**感知到的有用性与实际使用频率不一致**”。

从业者知道“明确输入输出规范”和“定义前置/后置条件”是有用的，但实际上并未去使用。SDD 试图通过将它们纳入工作流程来解决这种“知道但做不到”的差距。

### 多代理任务分解与一致性保护（arXiv:2511.01149）

“Modular Task Decomposition and Dynamic Collaboration in Multi-Agent Systems” 论文提出了一种在任务分解时**结合约束分析和一致性保护机制**的方法。

它能提前检测子任务间的矛盾，并防止多代理环境中的“幻觉循环”。这与 SDD 提出的“将规范书作为代理间的通用语言”的方法直接对应。

--- 

## 上下文工程：走向规范书的未来

### 从 Prompt Engineering 到“Context Engineering”

Anthropic 于 2025 年 9 月在其文章“Effective Context Engineering for AI Agents” 中定义了这一概念的演进。

**上下文工程（Context Engineering）**是指“通过最少的高信号 token 集合，最大化期望结果的可能性”。如果说 Prompt Engineering 是“优化人与 LLM 的单次对话”的技术，那么上下文工程就是“**设计代理与整个环境的信息流**”的技术。

Anthropic 警告了随着上下文窗口扩大而出现的“**上下文腐败**”现象。上下文越长，LLM 越有可能无法准确回忆起后面的信息。仅仅将“请阅读所有规范书”交给 AI 是不够的，**在需要的时间提供需要的信息**的设计至关重要。

### 推荐的 4 种技术

Anthropic 推荐的上下文管理技术如下：

**Just-in-Time Retrieval（即时检索）**: 不一次性提供所有规范书，而是动态注入任务所需信息。

**对话历史压缩**: 总结和压缩长对话，保持上下文质量。

**结构化笔记**: 结构化地记录重要决策和发现，以便后续 AI 调用时引用。

**子代理架构**: 分割为专业化的代理，最小化每个代理的上下文。

### AGENTS.md / CLAUDE.md 的设计原则

GitHub 的“How to Write a Great agents.md”（分析了超过 2,500 个存储库）定义了有效上下文文件的 6 个核心领域：

```
1. 命令 — 执行构建、测试、lint 的命令
2. 测试 — 测试执行方法和预期输出
3. 项目结构 — 目录结构和各文件作用
4. 代码风格 — 格式规范、命名约定
5. Git 工作流 — 分支策略、提交信息规范
6. 边界线 — 始终执行 / 事前确认 / 禁止
```

但需要注意，2026 年 ETH Zurich 的一项研究指出，“LLM 生成的上下文文件对任务成功率有微小的负面影响”。目前最佳实践是**将上下文文件内容限制在“仅包含工具或现有代码无法推断的信息”**。

--- 

## 实践：SDD 规范书中应包含的 6 个要素

SDD 中创建的规范书必须包含以下 6 个要素：

**1. 用户故事和利益相关者**
清晰描述“谁”出于“什么目的”需要“什么”。

**2. 可衡量的成功标准**
定义为“LCP 低于 2.5 秒”，而不是“性能更好”。

**3. 功能需求和非功能需求**
描述“做什么”，同时也要描述“不做什么”（明确的约束）。

**4. 技术上下文和集成点**
明确与现有系统的接口、使用的 API 和库。

**5. 前置条件、后置条件、不变条件**
形式化定义函数、模块、系统必须满足的逻辑约束。

```markdown
## 用户注册 API（POST /api/users）

### 前置条件
- 邮箱未注册
- 密码长度至少 8 位

### 后置条件
- 用户已保存到数据库
- 确认邮件已发送
- 响应中包含 JWT

### 不变条件
- 密码必须哈希存储（不允许明文）
- 邮箱地址应规范化为小写
```

**6. 可接受测试**
以可验证的方式描述“何为完成”。AI 将以此作为测试代码的参考点。

### 明确“禁止事项”的重要性

正如 Redis 作者 antirez 指出的，在规范书中包含“看起来不错但错误的解决方案的提示”很重要。

```markdown
## 禁止模式
- 使用全局变量（改用依赖注入）
- 使用 setTimeout 进行异步控制（使用 Promise）
- any 类型转换（使用类型推断或 union）
- 直接访问数据库（必须通过 Repository 层）
```

### 调试范式的转变

在 SDD 中，调试意味着**修改规范书**，而不是修改代码。代码中的 Bug 是规范书差距的症状，修改规范书即可将改动传播到所有生成的代码，实现一致性修复。

--- 

## Anthropic 的 2026 年趋势报告预示的未来

Anthropic 于 2026 年 1 月发布的“2026 Agentic Coding Trends Report” 报告称，软件开发正迎来“**GUI 以来的最大变革**”。

工程师的角色正从“写代码的人”转向“AI 代理的协调者”。但报告也给出了重要的提醒：**完全可委托的任务仅占总数的 0-20%**，其余部分需要积极的监督、验证和人工判断。

2026 年的战略优先事项包括：

- 掌握多代理协调
- 扩展人-代理监督能力
- 整合安全架构

该报告表明，SDD 不仅仅是“如何写规范书”，而是**AI 代理与人类安全协作的组织和技术基础设施**。

--- 

## 总结：规范书比代码更重要吗？

SDD 提出的论点颇具挑战性：**规范书才是最重要的工程产物**。

传统上，“编写代码”是工程师的主要工作。在 AI 能够编写代码的世界里，“定义写什么”才是工程师的核心价值。

“代码可以由 AI 编写。但‘应该做什么’的定义，仍然是人类的工作。”—— 这种认识的转变，是 AI 驱动开发成功的关键第一步。

“在规划上投入一小时，可以节省后续十小时的返工时间”这一原则，在 2026 年成为回报率最高的投资方式之一。Vibe Coding 的直观乐趣或许会消失。但通过 SDD，我们可以找回对 AI 生成代码的**可信赖性和可预测性**。

--- 

## 参考文献

| 标题 | 信息源 | 日期 | URL |
|:---------|:-------|:-----|:----|
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

> 本文由 LLM 自动生成，内容可能存在错误。
