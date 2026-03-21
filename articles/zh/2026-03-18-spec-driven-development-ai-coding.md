---
title: "Spec-Driven Development 入门 — AI驱动开发中，为什么规范书变得最重要"
slug: "spec-driven-development-ai-coding"
summary: "随着Vibe Coding的局限性显现，将规范书视为AI“契约”的Spec-Driven Development（SDD）正崛起为2025-2026年AI驱动开发的主流范式。本文将结合论文和企业案例，阐述其背景、原则和实践方法。"
date: "2026-03-18"
tags: ["AI开发","规范书","SDD","上下文工程","LLM","Claude Code"]
category: "tech-article"
automated: false
thumbnail: "/images/spec-driven-development.png"
draft: false
---
## 前言 — “Vibe Coding”的蜜月期结束

2025年初，OpenAI联合创始人Andrej Karpathy提出了“Vibe Coding”的概念。这是一种向AI抛出感觉式提示，并几乎原封不动地接受生成代码的开发风格。起初，它被誉为生产力革命，但乐观情绪并未持续多久。

研究数据揭示的现实严峻。Veracode的2025年调查发现，AI生成的代码中**45%包含安全漏洞**。CodeRabbit对470个开源PR的分析显示，AI协作编写的代码比人类编写的代码“主要问题”多1.7倍，配置错误多75%，安全漏洞多2.74倍。更具悖论的是，一项调查结果表明，熟练的开发人员在使用AI编码工具时，生产力反而**下降了19%**（尽管他们自己预测会提高24%）。

这种被称为“Vibe Coding宿醉”的现象，其根本原因是什么？而作为解决方案兴起的**Spec-Driven Development（SDD）**又是一种怎样的范式？本文将结合论文、企业案例和实践经验进行详细阐述。

---

## Vibe Coding失败的结构性原因

### “无法读心的AI”问题

GitHub博客精辟地概括了这个问题：“**LLM擅长模式补全，但无法读懂人心**”。

如果你让AI编码助手“创建一个登录功能”，它会生成某种形式的登录功能。但它会使用OAuth 2.0吗？会如何处理会话管理？是否符合现有的数据库模式？如何满足安全要求？——如果不明确这些，AI只会补全“看起来像那么回事的代码”。

### 影子Bug问题和幻觉循环

Vibe Coding引发的问题大致可分为两类。

一类是**影子Bug**（代码看起来正确但包含严重漏洞）。代码能运行，测试也能通过。但特定条件下可能会发生SQL注入，或者绕过认证。很多情况下，问题直到部署到生产环境后才显现。

另一类是**幻觉循环**。在多个AI代理协作的多代理系统中，一个代理的错误输出被另一个代理误判为正确，从而形成相互强化错误的恶性循环。如果没有像“规范书”这样的“正确答案参照点”，就无法打破这种链条。

```mermaid
graph LR
    A[Agent A: 错误实现] --> B[Agent B: 评审]
    B --> C[判定无误]
    C --> D[错误实现进入生产]
    D --> E[发现Bug时为时已晚]
```

### 上下文丢失与架构不一致

与AI的对话会话结束后，上下文会重置。AI不知道上次决定“使用JWT实现认证”的事情。如果涉及多次对话或多个AI代理，整体架构设计会变得零散，形成一个部分使用REST、部分使用GraphQL等不统一的系统。

---

## Spec-Driven Development是什么

### 定义与基本原则

Spec-Driven Development（SDD）是一种将**清晰的规范书（Spec）定义为AI的“契约”，并基于此契约生成代码**的开发范式。

Thoughtworks如此解释：“SDD使用清晰的需求规范作为提示，让AI代理生成可执行代码。规范书应明确定义外部行为（输入/输出映射、前置条件/后置条件、不变量、约束、接口类型）”。

“**在计划上投入一小时，可节省后续十小时的返工**”（Thoughtworks）的原则，在AI驱动开发中尤为适用。

### Vibe Coding vs SDD对比

| 方面 | Vibe Coding | Spec-Driven Development |
|:-----|:------------|:------------------------|
| 主要信息载体 | 对话・提示 | 规范书文件 |
| 上下文持续性 | 仅在会话内 | 永久（保存为文件） |
| 设计决策记录 | 无（隐式） | 明确文档化 |
| 对AI的指示 | 每次都通过提示 | 引用规范书 |
| 评审对象 | 代码 | 规范书（先）→ 代码（后） |
| 规模 | 个人・小型 | 团队・生产系统 |

### SDD的4阶段流程

GitHub于2025年9月发布的**Spec Kit**（MIT License）是实践SDD的开源工具集。其设计定义了4个阶段：

**Specify（规范定义）**: 定义用户旅程和成功标准。AI会生成requirements.md草稿，但由人工评审并确定。

**Plan（技术规划）**: 声明架构、技术栈和约束。AI会提出design.md，由人工判断。

**Tasks（任务分解）**: 将任务分解为小型、可评审的工作单元。AI会生成tasks.md。

**Implement（实现）**: AI代理实现任务，人工在每个检查点进行验证。

该流程的关键在于每个阶段都有**明确的检查点**。这是一种从“Prompt and Pray（提示并祈祷）”到“Specify and Verify（定义规范并验证）”的工作流转变。

---

## 论文揭示的内容

### Beyond the Prompt: Cursor Rules的实证研究（arXiv\:2512.18925）

Microsoft和GitHub的研究员Shaokang Jiang和Daye Nam进行的研究，是对401个开源仓库中`.cursorrules`文件进行的首次大规模实证研究（MSR 2026即将发表）。

该研究确立的分类法将提供给AI编码助手的上下文分为5个主题：

| 主题 | 内容 |
|:-----|:-----|
| Conventions | 代码风格、命名约定、格式 |
| Guidelines | 架构模式、最佳实践 |
| Project Information | 技术栈、依赖关系、目录结构 |
| LLM Directives | 对AI的直接行为指令（做什么/不做什么） |
| Examples | 期望的代码模式的具体示例 |

关键发现是“**不仅仅是提示，持久的机器可读指令决定了AI的效果**”。并非一次性提示，而是`.cursorrules`或`CLAUDE.md`这类持久上下文文件，才决定了AI编码助手的质量。

### Promptware Engineering: 规范书的生命周期管理（arXiv\:2503.02400）

“Promptware Engineering”论文指出，当前的提示开发处于“依赖试错的Promptware危机”中（ACM TOSEM已录用）。

作为解决方案，提倡将提示（规范书）视为“软件构件”，并按以下生命周期进行管理：

```
需求定义 → 设计 → 实现 → 测试 → 调试 → 演进 → 部署 → 监控
```

规范书也应像代码一样，被视为“版本控制、测试和持续改进”的对象。

### 代码生成提示的10个指南（arXiv\:2601.13118）

这项通过对50名从业者进行调查而确定的研究，最有趣的发现是“**感知到的有用性与实际使用频率不一致**”。

从业者虽然知道“明确输入输出规范”和“定义前置/后置条件”很有用，但实际上并未这么做。SDD试图通过将其纳入工作流来解决这种“知道但做不到”的差距。

### 多代理任务分解与一致性保护（arXiv\:2511.01149）

“Modular Task Decomposition and Dynamic Collaboration in Multi-Agent Systems”论文提出了一种在任务分解时**结合约束分析和一致性保护机制**的方法。

它能提前检测子任务间的矛盾，防止多代理环境中的“幻觉循环”。这与SDD提倡的“将规范书作为代理间的通用语言”的做法直接对应。

---

## 上下文工程：超越规范书

### 从提示工程到“上下文工程”

Anthropic于2025年9月在其文章“Effective Context Engineering for AI Agents”中定义了这一概念的演进。

**上下文工程**是指“最大化最小高信号Token集产生期望结果的可能性”。如果说提示工程是“优化人与LLM的单次交互”的技术，那么上下文工程就是“**设计代理与整个环境的信息流**”的技术。

Anthropic警告了随着上下文窗口扩大而出现的“**上下文腐败**”现象。上下文越长，LLM越有可能无法准确回忆起后半部分的信息。仅仅让AI“阅读所有规范书”是不够的，**在需要的时候提供需要的信息**的设计至关重要。

### 推荐的4种技术

Anthropic推荐的上下文管理技术包括以下4种：

**Just-in-Time检索**: 不一次性提供所有规范书，而是动态注入任务所需信息。

**对话历史压缩**: 总结和压缩长对话，保持上下文质量。

**结构化笔记**: 结构化记录重要决策和发现，以便后续AI调用时参考。

**子代理架构**: 分解为专业化代理，最小化每个代理的上下文。

### AGENTS.md / CLAUDE.md 的设计原则

GitHub的“How to Write a Great agents.md”（分析了2,500多个仓库）定义了有效上下文文件的6个核心领域：

```
1. 命令        — 构建、测试、Lint的执行命令
2. 测试          — 测试执行方法和预期输出
3. 项目结构 — 目录结构和各文件作用
4. 代码风格   — 格式规范、命名约定
5. Git工作流  — 分支策略、提交消息约定
6. 边界线          — 始终执行 / 事前确认 / 禁止
```

但需要注意的是，ETH Zurich于2026年发表的研究指出，“LLM生成的上下文文件对任务成功率有微小的负面影响”。目前最佳实践是“将上下文文件限制在工具或现有代码无法推断出的信息”。

---

## 实践：SDD规范书应包含的6个要素

SDD创建的规范书必须包含以下6个要素：

**1. 用户故事与利益相关者**
清晰描述“谁”“为什么”“需要什么”。

**2. 可衡量的成功标准**
定义为“LCP在2.5秒以下”，而非“性能更好”。

**3. 功能需求与非功能需求**
不仅要写“做什么”，还要写“不做什么”（明确的约束）。

**4. 技术上下文与集成点**
明确与现有系统的接口、使用的API或库。

**5. 前置条件・后置条件・不变量**
形式化定义函数、模块或系统必须满足的逻辑约束。

```markdown
## 用户注册 API（POST /api/users）

### 前置条件
- 邮箱未注册
- 密码长度至少8位

### 后置条件
- 用户已保存到数据库
- 已发送确认邮件
- 响应包含JWT

### 不变量
- 密码必须哈希存储（禁止明文）
- 邮箱地址必须转换为小写进行规范化
```

**6. 可接受测试**
以可验证的方式描述“何时算完成”。AI以此为参考生成测试代码。

### 明确“禁止事项”的重要性

正如Redis作者antirez所指出的，在规范书中包含“看起来不错但实则有害的解决方案提示”很重要。

```markdown
## 禁止模式
- 使用全局变量（改为使用依赖注入）
- 使用setTimeout进行异步控制（使用Promise）
- any类型转换（使用类型推断或union）
- 直接访问数据库（必须通过Repository层）
```

### 调试范式的转变

在SDD中，调试意味着**修改规范书**，而不是修改代码。代码中的Bug是规范书缺陷的症状，修改规范书后，会传播到所有生成代码，实现一致性修复。

---

## Anthropic的2026年趋势报告揭示的未来

Anthropic于2026年1月发布的“2026 Agentic Coding Trends Report”报告称，软件开发正经历“**GUI以来的最大变革**”。

工程师的角色正从“写代码的人”转向“AI代理的协调者”。但报告也指出重要注意事项：**完全可委托的任务仅占总任务的0%-20%**，其余任务需要积极的监督、验证和人工判断。

2026年的战略重点包括：
- 掌握多代理协调
- 扩展人-代理监控
- 整合安全架构

该报告表明，SDD不仅是“如何编写规范书”，更是**AI代理与人类安全协作的组织和技术基础设施**。

---

## 总结：规范书比代码更重要吗

SDD提出的命题颇具挑衅性：**规范书才是最重要的工程产物**。

传统上，“编写代码”是工程师的主要工作。在AI能够编写代码的世界里，“定义应该写什么”才成为工程师的核心价值。

“代码可以由AI编写。但‘应该做什么’的定义，依然是人类的工作。”——这种认知转变，是AI驱动开发成功的关键第一步。

“在计划上投入一小时，可节省后续十小时的返工”的原则，在2026年已成为回报率最高的投资方式之一。Vibe Coding的直观乐趣或许会消失。但通过SDD，我们可以恢复对AI生成代码的**可靠性和可预测性**。

---

## 参考文献

| 标题 | 信息源 | 日期 | URL |
|:-----|:-------|:-----|:----|
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
