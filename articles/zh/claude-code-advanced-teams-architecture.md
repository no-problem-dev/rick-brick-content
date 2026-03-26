---
title: "Claude Code 实践架构 — 通过 Teams/Subagents 加速开发的设计模式"
slug: "claude-code-advanced-teams-architecture"
summary: "讲解基于 Anthropic 官方案例数据的 Claude Code 高级多智能体设计模式，包括 Star 拓扑、DAG 任务管理、80/20 规则、CLAUDE.md 优化和 Hooks 控制等。"
date: "2026-03-26T00:10"
tags: ["Claude Code","AI","Multi-agent","Anthropic","Teams"]
category: "tech-article"
automated: false
thumbnail: "/images/claude-code-advanced-teams-architecture.png"
draft: false
---
# Claude Code 实践架构 — 通过 Teams/Subagents 加速开发的设计模式

每天使用 Claude Code ，终将遇到“单一会话的瓶颈”。在复杂重构过程中，上下文逐渐恶化，导致提出的建议与之前的判断不符。当大量并行任务堆叠，交互变得迟缓，推理准确性下降。打破这一瓶颈的关键，是利用 Subagents 和 Agent Teams 实现的多智能体设计。

本文面向每日熟练操作 Claude Code 的工程师，全面讲解“为何这种设计有效”的理由以及“如何实践设计”。

---

## 1. 为什么需要多智能体设计 — 单一会话的局限

### 上下文恶化的科学根据

Addy Osmani 在其博客中指出：

> "LLMs 在上下文扩展时表现更差"

这不仅是简单的令牌限制问题。当无关信息堆积在上下文窗口中时，模型的“注意力”被分散，推理质量直线下降。长会话中，Claude 提出“与之前判断矛盾的建议”，正是此机制所致。

Anthropic 的多智能体研究也得出类似结论。相比单一 Opus 4 会话，**Opus 4 由领导的 Opus 4 和负责子代理的 Sonnet 4 构成的架构**，表现出**性能提升90.2%**。值得注意的是，“升级到更高级模型”带来的改善远不及“切换到多智能体结构”。

研究还发现，令牌用量、工具调用次数和模型选择三因素，解释了 95% 的性能波动。这意味着，试图在单一会话中存放所有任务，将极大恶化这三项指标。

### 多智能体带来的变化

```
【单一会话】
 全部上下文（探索、实现、测试与调试）堆积在一个窗口
 → 后半段推理质量下降

【多智能体设计】
 各智能体只专注于“自己负责的领域”
 → 每个窗口始终保持最优状态
```

2026 年2月推出的 **Agent Teams** 功能，正是在实践中实现这种架构思想。多个 Claude Code 实例拥有独立的上下文窗口，通过共享任务列表和邮箱协作。

---

## 2. 星型拓扑 — 领导/顾问/队友三层架构

### 设计理念

Agent Teams 最关键的设计决策在于“信息流程的结构”。非扁平的 Mesh 拓扑，而是采用品质优先的**Star 拓扑** — 所有信息通过 Leader 传递，避免信息矛盾与散失。

```
Team Leader (Opus)
    ↕ 查询规格和蒸馏信息
Advisor (Sonnet) ── 阅读并蒸馏设计文档和代码
    ↓
Teammates (Sonnet × N) ── 专注于实现
```

Leader 并非信息的汇聚点，而是“信息交汇处”。保持“持有什么信息”、“舍弃哪些信息”的设计，决定团队整体的性能。

### Leader 的职责 / 避免职责

| Leader 做的事 | Leader 不做的事 |
|---|---|
| 任务拆解 / 依赖管理 | 直接写代码 |
| 质量验证（测试 / 类型检查） | 直读规格文档 |
| 给 Teammate 反馈 | 全局理解代码 |
| 进度控制 / 瓶颈检测 | 允许 Teammate 之间直接协调 |

这种 Star 拓扑带来“逆向的强大”。Leader 不读规格书，使得其上下文窗口专注于管理和验证。

### 顾问层 — 信息蒸馏专家

顾问的角色，本质上就是“信息蒸馏者”。大量规格和代码由其快速读取，只提取 Leader 需要的结构化信息返回。

```
Leader: “T04 实现的规格、类型定义、DoD 详细说明”
          ↓
Advisor: 读取 spec/ 后，提取关键信息
          ↓
Leader: 转发给 Teammates
```

**顾问的限制**：只读不写。写操作会破坏信息流的清晰性。

### Teammates 的原则

最重要的是“不要读规格书”。虽然直觉相反，但原因明确。

若 Teammates 直接读规格，理解可能因人而异。Leader 通过读出蒸馏信息，确保所有 Teammates 在同一理解基础上实现。

Teammate 的实现原则如下：

1. 只执行 Leader 指令（无额外功能）
2. 遇不明点，向 Leader 确认
3. 完成后，反馈变更文件、测试、类型检查和未解问题
4. **不要读** spec/ 内文件（由 Leader 传达必要信息）

### 信息流程约束

```
【允许的通信】
  Leader ↔ Advisor: 规格查询与蒸馏
  Leader → Teammates: 实现指令与反馈
  Teammates → Leader: 完成报告与提问

【禁止的通信】
  Teammates 之间：不得直接交流（通过 Leader）
  Teammates 与 Advisor：不得直接通信（通过 Leader）
  Leader 直接读 spec/文件：不用，交由 Advisor 处理
```

### 为什么这种设计有效

Anthropic 研究表明，“模型选择”对性能影响最大。将 Opus 放在 Leader 位置，Sonnet 多作为 Teammates 并行执行，是成本与效果的理想折中。

Star 拓扑也是“防止信息矛盾”的最小方案，随着智能体数量增加，通信路径指数增长，将其统一集中在 Leader 一点，易于管理。

---

## 3. DAG 驱动任务设计 — 并行化的科学

### 任务使用 DAG 管理

Agent Teams 的任务列表，以**有向非循环图（DAG）**的方式设计，明确依赖关系。

```json
{
  "tasks": [
    { "id": "T01", "name": "认证方案设计", "blocked_by": [] },
    { "id": "T02", "name": "API 接口实现", "blocked_by": ["T01"] },
    { "id": "T03", "name": "前端实现", "blocked_by": ["T01"] },
    { "id": "T04", "name": "集成测试", "blocked_by": ["T02", "T03"] }
  ]
}
```

T02 和 T03 可以并行执行，T04 等待两者完成。DAG 明确表示依赖关系。

### Wave 执行模型

依赖关系定义了任务“Wave”。每个 Wave 独立执行，一方面最大化并行，另一方面确保依赖一致。

**示例**：

- Wave 1：调研与设计（全部并行）
  - 前端调研
  - 后端调研
  - 测试策略
- Wave 2：实现（按文件分割）
  - 前端实现
  - 后端实现
- Wave 3：集成测试（顺序执行）

重点：确保同一 Wave 内的任务没有依赖关系。

### 任务规模原则

| 规模 | 问题 |
|---|---|
| 太小（<1文件） | 调整成本过高，不划算 |
| 太大（>1周） | 复查、手工调试困难 |
| 适中 | 明确成果，易管理 |

每个 Teammate 由5-6个任务组成较为理想，有助于保持上下文清晰。

### 文件锁与冲突避免

在 Anthropic Rust 编译器项目中，采用文件锁机制避免任务冲突。每个 agent 在 `current_tasks/` 目录写入锁文件，用 Git 管理竞合。

```bash
echo "$AGENT_ID" > current_tasks/task-$TASK_ID.lock
git add current_tasks/task-$TASK_ID.lock
git commit -m "claim: task-$TASK_ID"
```

这样无需中央调度，即实现分散式任务竞夺。 

### 品质门控自动化

使用 `TaskCompleted` 和 `TeammateIdle` 钩子，自动检测任务完成与 Teammate 闲置，实现自动品质检测。

```json
{
  "hooks": {
    "TaskCompleted": [{
      "hooks": [{
        "type": "command",
        "command": "./.claude/hooks/quality-gate.sh"
      }]
    }],
    "TeammateIdle": [{
      "hooks": [{
        "type": "command",
        "command": "./.claude/hooks/verify-output.sh"
      }]
    }]
  }
}
```

```bash
#!/bin/bash
# .claude/hooks/quality-gate.sh
set -e
npm test || { echo "测试失败" >&2; exit 2; }
npm run lint || { echo "Lint失败" >&2; exit 2; }
npm run build || { echo "构建失败" >&2; exit 2; }
exit 0
```

返回 `exit 2` 即阻断任务，通知 Claude 反馈信息，确保质量要求。`TeammateIdle` 作用于停止前，发挥“不可停止”的门控作用。

---

## 4. 上下文管理的窍门 — 80/20 规则与未来

### 80/20 规则

上下文管理的核心原则：

> 在复杂多文件任务中，不使用最后 20%的上下文。

针对 200K 令牌窗口，当达到 83.5%（167K）时，自动压缩生效，推理质量突降。应实时监控令牌使用，70-80% 时手动压缩。

### 压缩策略 — 何时何如何

**推荐压缩时机**：

- 主要功能完成后
- 探索转实现阶段前
- Claude 重复问问题、之前判断矛盾时
- Wave 界限点

**避免时机：**

- 调试中
- 复杂重构中（依赖追踪）

### 子代理隔离探索

保护上下文的有效技艺之一，是将探索任务委托给子代理。

```
主上下文
  └─ “调研认证模块的现状”
          ↓ 委托
  子代理上下文（独立）
    ├─ 全读 src/auth/
    ├─ 解析测试文件
    └─ 追踪依赖
          ↓ 只返回摘要
主上下文
  └─ “认证模块为 JWT + Redis，关键函数...”
```

几十个文件的阅读，也能在子代理上下文内完成。主上下文只存摘要信息。

### 30 分钟冲刺策略

实践中，采用“30 分钟冲刺”管理上下文。每半小时切换一次，任务完成后立即压缩或 `/clear`。短周期保持新鲜，用更高质量的输出。

### Leader 上下文设计

| 阶段 | 主要信息 | 忽略详情 |
|---|---|---|
| 已完成 | 任务 ID、状态、成果路径 | 细节调试、往返消息 |
| 进行中 | 指示内容、进展 | 全部定义（可随时问 Advisor） |
| 待处理 | 阻塞状态、Wave | 定义描述（随时更新） |

强调：Leader 只保持“状态摘要”。详细内容由 Advisor 查询，确保上下文清晰且不会被占用。

---

## 5. CLAUDE.md 最优策略 — 300 行预算如何最大化利用

### “少即是多”原则

研究显示：最新大型语言模型，指令最多约150-200例。而 CLAUDE.md 已含约50条指令，剩余预算约100-150。

建议：根文件不超过 300 行，理想 60 行以内。

长 CLAUDE.md 反而会使重要规则难以彰显，失去效果。

### 不写 Claude 已会的内容

避免写“写干净代码”、“别忘了异常处理”等指示。Claude 已经会做，写只浪费令牌。

**判断写入内容的方法**：
1. 不写则 Claude 还能正常？是，删。
2. 是否项目特定或 Claude 已知？是，删。
3. 是否经常变动？变，可写，否则删。

### 代码风格由 Linter 定义，通过 Hooks 强制

> “永远不要让 LLM 执行 Linter 任务。”

格式化、Lint 和类型检查，用确定性工具（Biome、ESLint、tsc）实现。Hooks 自动运行，避免意外差异。

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "npm run lint --fix && npm run format"
      }]
    }]
  }
}
```

删除 CLAUDE.md 中的风格指令，用此配置，节省成本同时保证质量。

### 渐进式披露（Progressive Disclosure）

防止 CLAUDE.md 长度膨胀的策略。核心信息写在根文件，“只在特定场合显示链接”。

```markdown
# CLAUDE.md（限制在60行以内）

## 技术栈
- Astro 5.18.0 + Tailwind CSS 4.2.0 + Cloudflare Pages
- TypeScript 5.9.x（严格模式）

## 常用命令
- 构建：`npm run build`
- 类型检查：`npx tsc --noEmit`
- Lint：`npm run lint`

## 按需详细文档
- API 规范：@.claude/rules/api-conventions.md
- Git 流程：@.claude/rules/branching.md
- 部署流程：@.claude/rules/deployment.md
```

`@路径/文件` 用于按需加载，Claude 仅在需要时读取。

### 分层 CLAUDE.md 体系

```
~/.claude/CLAUDE.md             # 全局配置
  ./CLAUDE.md                   # 项目级（团队共享）
    ./.claude/rules/api.md     # API规范（开发时加载）
    ./.claude/rules/test.md    # 测试规范（需要时加载）
    src/components/CLAUDE.md   # 组件开发（必要时加载）
```

子目录内的 CLAUDE.md 只在对应文件处理时按需加载，保持主文件简洁。

---

> 本文由 LLM 自动生成，内容可能存在错误。
