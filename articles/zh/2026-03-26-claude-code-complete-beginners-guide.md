---
title: "Claude Code 完全入门指南 — 系统理解 AI 编码代理的全部功能"
slug: "claude-code-complete-beginners-guide"
summary: "从Claude Code的安装到CLAUDE.md、Skills、Subagents、Agent Teams、Hooks、MCP、上下文管理，本指南全面解读所有功能。涵盖2026年3月最新信息。"
date: "2026-03-26T00:10"
tags: ["Claude Code","AI","開発ツール","Anthropic","エージェント"]
category: "tech-article"
automated: false
thumbnail: "/images/claude-code-complete-beginners-guide.png"
draft: false
---
## 引言 — 什么是Claude Code

2025年2月，Anthropic 发布的 **Claude Code**，彻底革新了AI编码工具的概念。它不仅能补全和提案代码，还能自主完成文件读写、命令执行、git操作、PR创建等开发任务，提供代理型工具。

### 仅仅是代码补全的区别

以往的AI编码工具主流是“代码补全”。预测光标位置后的代码，让开发者决定采用与否。虽然补全效果佳，但仅是**建议**。

Claude Code 超越了此模型。当开发者“写测试、运行、修正失败”时，Claude Code 会读取文件、生成测试、执行、分析错误、修复代码，并重复这个循环——实现自主闭环。

```bash
# 自动生成并修正测试
claude "为auth模块写测试，运行并修正"

# 实时监控日志异常
tail -200 app.log | claude -p "如果发现异常，通知Slack"

# 安全审查
git diff main --name-only | claude -p "审查这些变更文件的安全问题"
```

### 运行环境

Claude Code 支持多种环境使用：

| 环境 | 方法 |
|------|------|
| 终端 | `claude` 命令（CLI） |
| VS Code / Cursor | 插件 |
| JetBrains IDE | 插件 |
| 桌面应用 | Claude桌面版 |
| 浏览器 | claude.ai |

通常开发者在终端使用`claude`命令，在项目根目录启动即可无缝访问全部代码。 

### 功能发展历程

自2025年2月发布后，Claude Code功能快速扩展：

| 功能 | 时代 |
|------|-------|
| 公布 | 2025年2月 |
| MCP 集成 | 2024年11月 |
| Subagents（子代理） | 2025年7月 |
| Hooks（钩子） | 2025年9月 |
| Skills（技能） | 2025年10月 |
| Agent Teams（代理团队） | 2026年2月 |

截止到2026年3月，Claude Code已成长为“AI编码操作系统”。本文系统解析这些功能。

---

## 安装与初始配置

### 安装方式

#### macOS / Linux / WSL（推荐）

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

此方法实现原生安装，后台自动更新。

#### Windows PowerShell

```powershell
irm https://claude.ai/install.ps1 | iex
```

Windows用户需安装 Git for Windows。

#### Homebrew（macOS）

```bash
brew install --cask claude-code
```

通过Homebrew安装不会自动更新，需定期运行`brew upgrade claude-code`。

### 首次启动与认证

安装后，进入项目目录，执行：

```bash
cd your-project
claude
```

首次启动会要求登录，登录后将出现交互式聊天界面，可指示Claude Code进行操作。

### 常用命令

| 命令 | 说明 |
|--------|------|
| `claude` | 开始交互式会话 |
| `claude -p "prompt"` | 非交互执行（CI/CD 场景） |
| `claude --continue` | 续用上次会话 |
| `claude --resume` | 选择历史会话重新开启 |
| `/init` | 自动生成CLAUDE.md |
| `/clear` | 重置上下文 |
| `/compact` | 压缩上下文 |
| `/memory` | 查看/编辑CLAUDE.md和内存文件 |
| `/agents` | 管理子代理 |
| `/hooks` | 查看钩子设置 |
| `/permissions` | 权限管理 |
| `/skills` | 查看技能 |

---

## CLAUDE.md — 设计项目“记忆”

### CLAUDE.md 是什么

Claude Code启动时必读的Markdown文件，记载编码规范、工作流程、架构决策。作为“持续性上下文”，避免每次重复说明。

就像给新人提前准备好团队规则文档。Claude Code会阅读此文档开始工作。

### 三级存放位置

| 作用域 | 位置 | 作用对象 | 团队共享 |
|---------|-------|----------|---------|
| 组织政策 | `/etc/claude-code/CLAUDE.md`（Linux） | 全体用户 | IT管理 |
| 项目 | `./CLAUDE.md` 或 `./.claude/CLAUDE.md` | 项目成员 | Git管理 |
| 个人 | `~/.claude/CLAUDE.md` | 个人 | 私人 |

存在多个CLAUDE.md时，优先级从具体到广泛，团队规则写项目根部，个人偏好写用户目录。

### 内容编写指南

| 内容 | 禁忌 |
|--------|---------|
| Claude无法猜测的bash命令 | 代码应能理解 |
| 非默认代码风格 | Claude已知即无需重复 |
| 测试策略与测试框架 | API文档（链接替代） |
| 分支命名、PR规则 | 频繁变化信息 |
| 项目架构判定 | 自明原则（如“写优雅代码”） |
| 必要环境变量 | 文件结构列表 |

示例：

```markdown
# 示例 CLAUDE.md

## 代码风格
- 使用ES modules（import/export），禁止使用CommonJS
- 导入尽可能使用解构赋值

## 工作流程
- 改动后必须运行类型检查：`npx tsc --noEmit`
- 测试只在单一文件上运行

## 脚本命令
- 构建：`npm run build`
- 测试：`npm test`
- Lint：`npm run lint`

## 注意事项
- 把秘密写入 `.env.local`，绝不提交
- PR 的目标分支是 develop（禁止直接push到main）
```

### 通过 /init 自动生成

项目已有，可用 `/init` 让Claude Code解析代码并生成CLAUDE.md草稿。用户据此编辑，删除多余，补充缺失内容。

### 拆分管理规则

项目大时，CLAUDE.md会变长。可在 `.claude/rules/` 目录拆分不同话题。

```
.claude/
  CLAUDE.md
  rules/
    code-style.md
    testing.md
    security.md
    branching.md
```

特定文件模式规则还可以单独定义。

```markdown
---
paths:
  - "src/api/**/*.ts"
---
# API开发规范
- 所有端点需验证输入
- 错误返回遵守RFC 7807
```

此文件只会在匹配路径的文件操作时读取。

### 自动记忆（Auto Memory）

v2.1.59后加入**Auto Memory**，Claude在工作中学到的内容：调试发现的问题、设计决策、常用命令，自动保存到 `~/.claude/projects/<project>/memory/MEMORY.md` 。通过 `/memory` 查看和编辑，保证下一次会话“学到的内容”得以延续。

---

## Skills — 封装可重用的工作流

### Skills 概念

Skills是将重复使用的知识和工作流程打包成 `SKILL.md`，通过 `/skill-name` 调用或Claude自动加载关联技能。例如“修复GitHub Issue”——确认Issue、修改代码、运行测试、提出PR，定义为Skill后，只需输入 `/fix-issue 123` 即自动完成一系列操作。

Claude.md为全局指令，“常时启用”；Skills为“按需调用”。

### SKILL.md结构

YAML前导和正文共同组成。

```yaml
---
name: fix-issue
description: >
  修复GitHub Issue。指定编号时启用。
disable-model-invocation: true
user-invocable: true
allowed-tools: Read, Grep, Bash, Write, Edit
---

获取issue信息，分析，修正，测试，提交PR。
```

`$ARGUMENTS` 替换调用参数，`/fix-issue 123`触发时， `$ARGUMENTS=123`。多个参数用 `$ARGUMENTS[0]`、`$1` 访问。

### 关键字段

| 字段 | 作用 |
|--------|--------|
| `name` | 命令名（小写、短横线、最大64字符） |
| `description` | 判断是否自动启用的说明 |
| `disable-model-invocation` | `true` 后仅用户启动，防止误操作 |
| `user-invocable` | 是否在菜单中显示 |
| `allowed-tools` | 允许使用的工具 |
| `context` | 独立子代理，否则共享上下文 |
| `model` | 模型选择（`sonnet`、`opus`等） |
| `effort` | 思考强度（`low`/`medium`/`high`/`max`） |

### 参考技能 vs 任务技能

**Reference技能**：按需注入规范书或文档，保持CLAUDE.md简洁，仅必要时加载。 如API规范。

**任务技能**：定义具体操作，如代码评审、部署、Issue处理。

### 调用控制

前导控制字段：

| 控制字段 | 作用 |
|--------------|--------------|
| `disable-model-invocation` | 后设置为true，只允许人类调用 |
| `user-invocable` | 是否在菜单显示 |

### 内置技能

Claude内置：

| 技能 | 用途 |
|--------|--------|
| `/batch` | 批量操作整个仓库 |
| `/claude-api` | 载入API参考 |
| `/debug` | 分析调试日志 |
| `/loop` | 循环执行命令 |
| `/simplify` | 简化代码 |

### CLAUDE.md与Skills区别

| | CLAUDE.md | Skills |
|-----------|--------------|--------------|
| 加载时机 | 会话开始连续加载 | 按需调用或自动判断 |
| 适用内容 | 全局规则与指令 | 专业技能或流程 |
| 占用上下文 | 永远消耗 | 按需消耗 |

---

## Subagents — 委托专家处理任务

### 概念

Subagents（子代理）是可以委托专业任务的独立AI助手，每个都有自己的上下文、提示和工具权限。适用于大量文件分析、只读操作、降低成本等。

### 四大优势

**1. 上下文隔离**：子代理内部探索不污染主会话，只返回摘要。

**2. 工具限制**：限定只读工具，避免误写文件。

**3. 专业定制**：配置特定领域的系统提示，便于专业审查、性能优化等。

**4. 降低成本**：用轻量模型处理大量工作；重要判定由重模型执行。

### 内置子代理

- **Explore**：用Haiku（高速）只读探索
- **Plan**：规划中使用
- **general-purpose**：多任务处理

### 定义方法

编写带YAML前导的Markdown文件。

```markdown
---
name: code-reviewer
description: 代码审查专家。常用
tools: Read, Grep, Glob, Bash
model: sonnet
---

请作为高级开发者，审核以下内容：代码质量、错误处理、安全、测试覆盖、性能。优先级（Critical/Warning/Suggestion），提供具体修正建议。
```

存放路径：`.claude/agents/`
或者`~/.claude/agents/`。

关键字段：

| 字段 | 作用 |
|--------|----------|
| `name` | 唯一标识名 |
| `description` | 简述任务 |
| `tools` | 工具权限 |
| `disallowedTools` | 禁用工具 |
| `model` | 模型 |
| `permissionMode` | 权限设置 |
| `maxTurns` | 最大轮次 |
| `isolation` | 独立环境 |

调用方式：

```bash
# 自然语言（Claude判断委托）
"code-reviewerで最近の変更をレビューして"

# @提及（明确指定代理）
@"code-reviewer" reviewの変更点

# 完整会话以代理模式启动
claude --agent code-reviewer
```

---

## Agent Teams — 多代理协作

### 区别

2026年2月，发布的Agent Teams是在Subagents基础上，支持多个AI代理同时协作。

| | Subagents | Agent Teams |
|---|-----------|--------------|
| 通信 | 主→子（单向） | 代理间（双向） |
| 适用 | 单个任务委托 | 大规模并行合作 |
| 会话 | 单一会话 | 独立合作 |

### 四大组成

- **Lead（领队）**：统筹调度，拆分任务，控制质量
- **Teammates（队友）**：专业子代理，执行任务
- **Task List（任务清单）**：任务依赖管理，识别并行任务
- **Mailbox（信箱）**：异步通信，报告/提问

### 何时用

```
任务复杂？
  否 → 一般Claude
  是
任务能放入上下文？
  是 → 使用子代理
  否
是否有独立任务可以并行？
  否 → 顺序接力
  是 → 代理团队
```

典型用例：大规模重构、多模块变更、数据管道、多仓库一致性。

---

## Hooks — 必然执行的自动化脚本

### 概念

Hooks（钩子）是在Claude Code生命周期中在特定节点必执行的脚本，确保关键操作执行。即使Claude在指示中遗漏，Hooks也会完整触发。

### 事件类型

| 事件 | 触发时机 | 主要用途 |
|--------|-----------|----------|
| `SessionStart` | 会话开始 | 初始化环境变量 |
| `UserPromptSubmit` | 用户提交 | 输入过滤 |
| `PreToolUse` | 执行前 | 权限验证、风险屏蔽 |
| `PostToolUse` | 成功后 | 代码检测、日志 Record |
| `PostToolUseFailure` | 失败时 | 错误处理 |
| `Stop` | 结束响应 | 质量控制 |
| `SubagentStart` | 子代理启动 | 设置 |
| `SubagentStop` | 关闭 | 清理 |
| `SessionEnd` | 会话结束 | 统计记录 |

### 配置方法

`.claude/settings.json`：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "npm run lint --fix" }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "./.claude/hooks/check-dangerous-command.sh" }
        ]
      }
    ]
  }
}
```
执行：将在写入后自动执行`npm run lint --fix`等操作。可自定义危险命令拦截脚本。Autocmd、Exit codes定义了操作的成功/阻断等规则。

示例（阻止危险命令）：

```bash
#!/bin/bash
# .claude/hooks/block-dangerous.sh
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
if echo "$COMMAND" | grep -q 'rm -rf'; then
  echo "阻止危险命令：$COMMAND" >&2
  exit 2 # 阻断
fi
exit 0 # 允许
```
Exit Code：
- 0：允许
- 2：阻断（Claude知晓）
- 其他：错误

### 类型支持

| 类型 | 说明 |
|-------|--------|
| `command` | shell命令 |
| `http` | 远程HTTP请求 |
| `prompt` | 对Claude模型提问 |
| `agent` | 生成子代理执行更复杂验证 |

### 配置存放位置

| 位置 | 作用域 |
|--------|---------|
| `~/.claude/settings.json` | 全局 |
| `.claude/settings.json` | 项目 |
| `.claude/settings.local.json` | 本地（不提交） |

---

## MCP服务器集成 — 连接外部服务

### 什么是MCP

Model Context Protocol（MCP），由Anthropic在2024年11月公布，是支持连接外部数据源和工具的行业标准。Claude Code基于MCP，可接入GitHub、Slack、数据库等。

### 支持的服务示例

- **开发工具**：GitHub / GitLab、Jira
- **通信**：Slack
- **文档**：Google Drive、Notion
- **数据库**：PostgreSQL、SQLite
- **设计**：Figma
- **云服务**：AWS / GCP / Azure

### 配置方法

可以通过命令添加MCP：

```bash
claude mcp add
```
也可在`.mcp.json`中配置：

```json
{
  "playwright": { "type": "stdio", "command": "npx", "args": ["-y", "@playwright/mcp@latest"] },
  "github": { "type": "stdio", "command": "uvx", "args": ["mcp-server-github"], "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" } }
}
```

可以限制某些子代理只使用部分MCP，例如：

```yaml
---
name: browser-tester
description: 浏览器测试
mcpServers:
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
  - github
---
```
保证主会话不暴露敏感信息，只让特定子代理访问。

### 推荐的MCP服务

*开发和代码管理*

| MCP |用途 | 推荐度 |
|---|---|---|
| GitHub |Issue、PR管理及代码检视 | ★★★ |
| GitLab |Issue、MR管理 | ★★★ |
| Playwright |浏览器自动化测试 | ★★★ |
| Sentry |错误监控 | ★★☆ |

*文档与知识库*

| MCP |用途 | 推荐度 |
|-------|-------|-------|
| Context7 |实时获取API文档 | ★★★ |
| Notion |企业内部文档 | ★★☆ |
| Google Drive |文档读取 | ★★☆ |

*数据库与基础设施*

| MCP |用途 | 推荐度 |
|-------|--------|--------|
| PostgreSQL |SQL查询、优化建议 | ★★★ |
| Supabase |数据库管理 | ★★☆ |
| AWS |日志、资源 | ★★☆ |

*沟通与协作*

| MCP |用途 | 推荐度 |
|-------|--------|--------|
| Slack |消息通知 | ★★☆ |
| Jira/Linear |任务管理 | ★★☆ |
| Google Calendar |日程管理 | ★☆☆ |

### 最初建议配置的三个MCP

- GitHub：PR/Issue全流程（工作流核心）
- Context7：引用最新API
- Playwright：UI变化自动截图

```bash
# 添加GitHub MCP
claude mcp add github -- uvx mcp-server-github

# 添加Context7
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

---

## 上下文管理 — 性能核心

### 为什么重要

Claude Code性能，关键是“上下文窗口利用率”。最大200k tokens，长会话会堆积大量信息，满时提取旧信息会出错。良好的上下文管理是提升效率的关键。

### /clear、/compact、/btw的区别

| 指令 | 用途 | 何时用 |
|---------|------------|---------|
| `/clear` | 完全清空 | 新任务开始 |
| `/compact` | 压缩重要信息 | 继续相同任务 |
| `/compact Focus on the API changes` | 指定压缩内容 | 特定信息优先保留 |
| `/btw` | 插入次要问句 | 不存入历史 |
| `Esc+Esc` / `/rewind` | 撤销操作 | 取消上次 |

上下文满95%时会自动压缩，阈值可通过环境变量`CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`调节。

### 规划探索（Plan 模式）

Plan模式适合“先探索、后实现”。只读不写；切换方法：`Shift+Tab`或设置默认。

```json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

建议流程：

1. 探索：阅读目录或代码，理解架构
2. 规划：列出改造方案，例如“加入OAuth”
3. 实现：根据计划重构代码，编写测试
4. 提交：提交PR

此模式节省计算成本，快速掌握任务。

### 常见问题&解决方案

| 模式 | 症状 | 解决措施 |
|--------|------|---------|
| 混乱会话 | 记忆信息杂乱 | `/clear` 重启会话 |
| 无限修正 | 反复修正相同错误 | 连续修正两次后，执行 `/clear` |
| 变大CLAUDE.md | 内容变多，漏规则 | 定期清理 |
| 跳过验证 | 只看输出不测 | 结合测试/截图验证 |
| 无限探索 | 记忆爆满 | 限制探索范围，委托子代理 |

### 高效管理建议

- CLAUDE.md控制在200行以内
- 规则拆分Skills，按主题存放
- 30分钟快节奏，设定时间点压缩
- 利用子代理大量探索

---

## 结语 — 功能比较与应用建议

### 全功能对比

| 功能 | 目标 | 时机 | 决定性 |
|--------|--------------|--------------|--------|
| CLAUDE.md | 长期指令 | 会话开始 | 80%遵守 |
| Skills | 重用流程 | 需要时 | — |
| Hooks | 自动化强制 | 特定事件 | 100%执行 |
| Subagents | 分离任务 | 需求强 | — |
| Agent Teams | 多代理合作 | 任务开始 | — |
| MCP | 接入外部 | 工具调用 | — |

### 使用策略

1. 先写CLAUDE.md，设定规则与指南
2. 常用任务封装Skills
3. 关键操作用Hooks自动化
4. 复杂任务用Subagents分离
5. 融合MCP连接工具
6. 需要并行时，用Agent Teams

入门建议：先用 `/init` 生成CLAUDE.md，逐步优化设置，让Claude Code成为最贴合项目的智能帮手。

持续使用，积累经验，定制最佳开发流程。

---

> 本文由 LLM 自动生成，内容可能存在错误。
