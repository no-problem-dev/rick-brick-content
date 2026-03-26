---
title: "Claude Code Complete Beginner's Guide — Systematically Understanding All Features of the AI Coding Agent"
slug: "claude-code-complete-beginners-guide"
summary: "A comprehensive beginner's guide covering installation, CLAUDE.md, Skills, Subagents, Agent Teams, Hooks, MCP, and context management as of March 2026."
date: "2026-03-26T00:10"
tags: ["Claude Code","AI","開発ツール","Anthropic","エージェント"]
category: "tech-article"
automated: false
thumbnail: "/images/claude-code-complete-beginners-guide.png"
draft: false
---
## Introduction — What is Claude Code

In February 2025, Anthropic released **Claude Code**, a revolutionary AI coding tool that fundamentally redefines the concept of AI-assisted development. It not only predicts and suggests code but autonomously handles tasks like file reading/writing, executing commands, git operations, and PR creation.

### Difference from Simple Code Completion

Traditional AI coding tools mainly performed "code completion": predicting the next segment based on cursor position, which developers then review and accept. While effective, it remains purely a "suggestion".

Claude Code surpasses this. When a developer instructs it to "write tests for this authentication system, run them, and fix any issues," Claude Code reads files, generates and runs tests, analyzes errors, modifies code, and re-tests—all autonomously.

```bash
# Automate test generation and fixing
yet="write tests for the auth module, run them, and fix any failures"
claude "$yet"

# Monitor logs for anomalies in real-time
tail -200 app.log | claude -p "Slack me if you see any anomalies"

# Security review
git diff main --name-only | claude -p "review these changed files for security issues"
```

### Operating Environment

Claude Code can be used in various environments:

| Environment | Method |
|--------------|---------|
| Terminal | `claude` command (CLI) |
| VS Code / Cursor | Extension |
| JetBrains IDE | Plugin |
| Desktop App | Claude Desktop |
| Browser | claude.ai |

Most developers access it via the terminal using the `claude` command. Starting in the project root initiates a session with access to the entire codebase.

### Feature Development Timeline

Since its release in February 2025, Claude Code has rapidly expanded its capabilities:

| Feature | Release Date |
|---------|--------------|
| Release of Claude Code | Feb 2025 |
| MCP Integration | Nov 2024 |
| Subagents | Jul 2025 |
| Hooks | Sep 2025 |
| Skills | Oct 2025 |
| Agent Teams | Feb 2026 |

As of March 2026, Claude Code has evolved into a platform that can be called an "AI Coding OS." This article systematically explains these features.

---

## Installation and Initial Setup

### Installation Methods

#### macOS / Linux / WSL (Recommended)

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

This installs natively with automatic updates in the background.

#### Windows PowerShell

```powershell
irm https://claude.ai/install.ps1 | iex
```

Windows requires Git for Windows.

#### Homebrew (macOS)

```bash
brew install --cask claude-code
```

Note: When installed via Homebrew, it does not auto-update; run `brew upgrade claude-code` periodically.

### First Launch and Authentication

Navigate to your project directory and run:

```bash
cd your-project
claude
```

On first launch, login authentication is required. Once authenticated, an interactive chat interface appears, allowing you to give instructions.

### Basic Commands

Remember these common commands:

| Command | Description |
|---------|--------------|
| `claude` | Start interactive session |
| `claude -p "prompt"` | Non-interactive execution (for CI/CD) |
| `claude --continue` | Resume last session |
| `claude --resume` | Choose and resume past session |
| `/init` | Auto-generate CLAUDE.md |
| `/clear` | Reset context |
| `/compact` | Compress context |
| `/memory` | View/edit CLAUDE.md and memory files |
| `/agents` | Manage subagents |
| `/hooks` | Check hook settings |
| `/permissions` | Manage permissions |
| `/skills` | Check skills |

---

## CLAUDE.md — Designing the "Memory" of the Project

### What is CLAUDE.md?

Claude Code always loads a Markdown file called **CLAUDE.md** at session start. It documents coding standards, workflows, architecture decisions, serving as a "persistent context" to prevent repeatedly explaining the same information.

It’s akin to giving a new engineer a document summarizing team rules beforehand. Claude Code reads this document before starting work.

### 3 Levels of Placement

CLAUDE.md can be managed across three scopes:

| Scope | Path | Target | Shared in Team |
|---------|------------------------------|--------------------------|------------------|
| Organization Policy | `/etc/claude-code/CLAUDE.md` (Linux) | All users | IT Admin |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Project members | Git-managed |
| User Personal | `~/.claude/CLAUDE.md` | All projects | Personal only |

When multiple CLAUDE.md files exist, specific scopes take precedence. For shared rules, use the project-level CLAUDE.md. For personal preferences like editor setups, use the user-level one.

### What to Write or Not

Guidelines for effective CLAUDE.md:

| What to Write | What Not to Write |
|----------------|-------------------|
| Bash commands Claude cannot predict | Readable from code |
| Non-default code styles | Known language conventions |
| Testing policies and frameworks | Detailed API docs (use links) |
| Branch and PR naming conventions | Frequently changing info |
| Project-specific architecture | Obvious instructions like "write clean code" |
| Essential environment variables | List of files in codebase |

Sample:

```markdown
# Example CLAUDE.md for Project

## Style
- Use ES modules (`import`/`export`); no CommonJS (`require`)
- Prefer destructuring imports

## Workflow
- Run type checks after changes: `npx tsc --noEmit`
- Run tests only on specific files

## Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`

## Security
- Secrets in `.env.local`; do not commit
- PR base branch: develop (no direct push to main)
```

### `/init` Auto-generation

For existing projects, `/init` is handy. Claude Code analyzes the codebase, detects build/test commands, project rules, and generates an initial CLAUDE.md. Review, delete unnecessary parts, add missing info.

### Managing Rules with `.claude/rules/`

For large projects, CLAUDE.md can grow too long, so split rules into files under `.claude/rules/`:

```
.claude/
  CLAUDE.md
  rules/
    code-style.md
    testing.md
    security.md
    branching.md
```

Rules can also be applied selectively to specific files with frontmatter:

```markdown
---
paths:
  - "src/api/**/*.ts"
---
# API Development Rules
- Include input validation for all endpoints
- Use RFC 7807 for error responses
```

This applies only when editing files under `src/api/`.

### Auto Memory (Learning Support)

Version 2.1.59 and above introduces **Auto Memory**. Claude Code automatically saves what it learns—discovered bugs, design decisions, frequently used build commands—into a memory file.

Stored at `~/.claude/projects/<project>/memory/MEMORY.md`. Use `/memory` to view/edit. This lets the session remember previous insights and resume work seamlessly.

---

## Skills — Packaging Reusable Workflows

### Concept of Skills

**Skills** are packaged workflows or knowledge stored in SKILL.md files. Invoke them with slash commands (`/skill-name`) or let Claude automatically load relevant skills.

For example, defining a "Fix GitHub Issue" skill can enable `/fix-issue 123` to perform the entire process: review details, modify code, run tests, create PR.

While CLAUDE.md commands are always active and apply broadly, Skills are invoked only when needed, acting as reusable units.

### Structure of SKILL.md

Skills include YAML frontmatter and content:

```yaml
---
name: fix-issue
description: >
  Fix GitHub issue. Used when issue number is specified.
disable-model-invocation: true
user-invocable: true
allowed-tools: Read, Grep, Bash, Write, Edit
---

Fix the GitHub issue $ARGUMENTS.

1. Use `gh issue view $ARGUMENTS` to understand details
2. Identify related files and implement fixes
3. Write and run tests, ensure passing
4. Commit with descriptive message and create PR
```

Arguments are filled via `$ARGUMENTS`, e.g., `/fix-issue 123`. Multiple arguments accessible via `$ARGUMENTS[0]`, `$ARGUMENTS[1]`.

### Frontmatter Main Fields

| Field | Description |
|--------|--------------|
| `name` | Slash command name (lowercase, hyphens, max 64 chars) |
| `description` | Used by Claude to assess relevance |
| `disable-model-invocation` | `true` for user-only invocation, safe for actions like deploy |
| `user-invocable` | `false` hides from slash menu |
| `allowed-tools` | Tools permitted during invocation |
| `context` | `fork` for isolated sub-agent |
| `model` | Model to use |
| `effort` | Thought effort level (`low`, `medium`, `high`, `max`) |

### Reference vs Task Skills

Skills can be broadly categorized:

- **Reference Skills**: Inject specifications or documentation on demand, keeping CLAUDE.md concise.

```yaml
---
name: api-spec
description: >
  Reference REST API specs for related implementation.
user-invocable: false
---
# API spec snippets
---
```

- **Task Skills**: Package specific operations—code review, deployment, issue resolution.

### Call Control Settings

Control which users or Claude can invoke skills:

| Frontmatter | User Launch | Auto Launch |
|--------------|--------------|--------------|
| (default) | Yes | Yes |
| `disable-model-invocation: true` | Yes | No |
| `user-invocable: false` | No | Yes |

Set `disable-model-invocation: true` for sensitive skills like deployments.

### Built-in Skills

Claude Code includes native skills:

| Skill | Use |
|-------|-----|
| `/batch <instruction>` | Run bulk changes |
| `/claude-api` | Load Claude API reference |
| `/debug [desc]` | Debug session logs |
| `/loop [interval] <prompt>` | Repeat prompts (polling) |
| `/simplify [focus]` | Improve recently changed code |

### CLAUDE.md vs Skills Comparison

| | CLAUDE.md | Skills |
|--|--------------|--------|
| Load Timing | Always at start | Call/auto-detected |
| Best For | Project rules & policies | Reusable procedures, expertise |
| Context Use | Always consumed | When needed |

---

## Subagents — Delegating Tasks to Experts

### Concept of Subagents

**Subagents** are independent AI assistants specialized in specific tasks. Each has its own context window, prompt, and tool access.

They excel at tasks like "reading a large number of files," "read-only access," or "reducing cost by offloading to lightweight models."

### Four Benefits

1. **Context Protection**: Subagents explore files within their own context, returning only summaries, not polluting main conversation.
2. **Tool Restrictions**: Limit tools for subagents—for instance, read-only—preventing accidental file modifications.
3. **Expert Specialization**: Define agents with domain-specific prompts, e.g., "security review," "performance optimization."
4. **Cost Efficiency**: Delegate heavy tasks to lightweight models, reserving larger models for critical decisions.

### Built-in Subagents

Claude Code includes three built-in agents:

| Agent | Model | Purpose |
|---------|--------|---------|
| **Explore** | Haiku (fast) | Read-only codebase exploration |
| **Plan** | Inherited | Research in planning mode |
| **General-purpose** | Inherited | Complex multi-step tasks |

### How to Define Custom Subagents

Define in a Markdown file with YAML frontmatter:

```markdown
---
name: code-reviewer
description: Domain expert for code review.
tools: Read, Grep, Glob, Bash
model: sonnet
---

You are a senior code reviewer. Check:
- Readability, naming, duplication
- Error handling
- Security (secrets, input validation)
- Test coverage
- Performance

Provide prioritized feedback with specific examples.
```

Place in `.claude/agents/`. For user-wide access, put in `~/.claude/agents/`.

### Major Frontmatter Fields

| Field | Purpose |
|--------|---------|
| `name` | Identifier (lowercase, hyphens) |
| `description` | Used for delegation decision |
| `tools` | Allowed tools |
| `disallowedTools` | Tools to exclude |
| `model` | `sonnet`, `opus`, `haiku` |
| `permissionMode` | Access mode (`default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan`) |
| `maxTurns` | Max turns |
| `isolation` | `worktree` for isolated git worktree |

### Calling Method

Invoke subagents in three ways:

```bash
# Natural language (Claude decides)
"Use code-reviewer to review recent changes"

# Mention (@) for explicit use
@"code-reviewer" authの変更をレビューして

# Agent mode start
claude --agent code-reviewer
```

---

## Agent Teams — Coordinating Multiple Agents

### Difference from Subagents

Released in February 2026, **Agent Teams** advance Subagents by enabling multiple agents to communicate and work in parallel.

| | Subagents | Agent Teams |
|--|--------------|--------------|
| Communication | Main → Sub (one-way) | Agent ↔ Agent (two-way) |
| Suitable for | Single task delegation | Large-scale parallel, long-term | 
| Session | Main sub-session | Independent collaborative session |

### Four Core Components

- **Lead**: Oversees the team, decomposes tasks, assigns to Teammates, manages progress and quality.
- **Teammates**: Specialized agents executing instructions, each with unique prompts.
- **Task List**: Tracks tasks and dependencies, identifies parallelizable tasks.
- **Mailbox**: Asynchronous messaging for results and questions.

### When to Use Teams

```
task_is_complex?
  ↓ No → Regular Claude Code
  ↓ Yes
fits_in_context?
  ↓ Yes → Use Subagents
  ↓ No
are_independent_subtasks_available?
  ↓ No → Sequential (single agent)
  ↓ Yes → Use Agent Teams
```

Ideal for large refactors, multi-module updates, complex data pipelines, and cross-repository consistency checks.

---

## Hooks — Fully Guaranteed Automation

### Concept of Hooks

**Hooks** are scripts that run at specific lifecycle events of Claude Code. They aim to automate reliably—overcoming the partial compliance of instructions.

While commands in CLAUDE.md are suggestions Claude attempts to follow (~80% adherence), Hooks execute **100%**.

Use Hooks for critical automation like auto-linting or blocking dangerous commands.

### Event Types

| Event | Trigger | Main Use |
|--------|---------|----------|
| `SessionStart` | Start of session | Setup environment |
| `UserPromptSubmit` | User submits prompt | Filter inputs |
| `PreToolUse` | Before tool runs | Block dangerous commands |
| `PostToolUse` | After successful tool | Run lint, log |
| `PostToolUseFailure` | On tool failure | Error handling |
| `Stop` | End of Claude response | Quality check, decide continue |
| `SubagentStart` | Subagent launch | Setup |
| `SubagentStop` | Subagent end | Cleanup |
| `SessionEnd` | End of session | Record stats |

### Setting Up

Configure in `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{"type": "command", "command": "npm run lint --fix"}]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{"type": "command", "command": "./.claude/hooks/check-dangerous-command.sh"}]
      }
    ]
  }
}
```

Example: after editing files, auto-run lint.

Sample check script:

```bash
#!/bin/bash
# .claude/hooks/block-dangerous.sh

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if echo "$COMMAND" | grep -q 'rm -rf'; then
  echo "Blocked dangerous command: $COMMAND" >&2
  exit 2
fi

exit 0
```

Hook Exit Codes:

| Code | Meaning |
|-------|---------|
| `0` | Allowed |
| `2` | Blocked (Claude notified) |
| Other | Error (not blocking) |

### Hook Types

Supports scripts and multiple execution modes:

| type | Description |
|-------|--------------|
| `command` | Shell command |
| `http` | POST to URL |
| `prompt` | Single prompt to Claude model |
| `agent` | Run a sub-agent for validation |

### Files Location

| Scope | Path |
|--------|-------|
| User | `~/.claude/settings.json` |
| Project | `.claude/settings.json` |
| Local | `.claude/settings.local.json` |

---

## MCP Server Integration — Connecting External Services

### What is MCP?

**Model Context Protocol (MCP)**, released by Anthropic in Nov 2024, is an open standard for integrating external data sources/tools with AI agents. Claude Code uses MCP to connect with various external services.

By March 2026, companies like Apple (Xcode) and OpenAI (ChatGPT) announced MCP support, signaling industry adoption.

### Examples of Connectable Services

- **Development Tools**: GitHub / GitLab (issues, PRs), Jira
- **Communication**: Slack
- **Documents**: Google Drive, Notion
- **Databases**: PostgreSQL, SQLite
- **Design**: Figma
- **Cloud**: AWS, GCP, Azure

### Setup Method

Add MCP servers interactively:

```bash
claude mcp add
```
Or edit `.mcp.json` directly:

```json
{
  "playwright": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@playwright/mcp@latest"]
  },
  "github": {
    "type": "stdio",
    "command": "uvx",
    "args": ["mcp-server-github"],
    "env": {"GITHUB_TOKEN": "${GITHUB_TOKEN}"}
  }
}
```

### Scope for Subagents

You can assign MCP servers to specific subagents:

```yaml
---
name: browser-tester
description: Playwright-based browser testing
mcpServers:
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
  - github
---
```
This way, main conversation can hide sensitive MCP tools, while subagents have access.

### Recommended MCP Servers

Here are some practical MCP server options for early setup:

#### Development & Code Management

| Server | Purpose | Recommendation |
|---------|---------|----------------|
| **GitHub** | Issue/PR management, code review | ★★★ |
| **GitLab** | Similar for GitLab users | ★★★ |
| **Playwright** | Browser automation, E2E testing | ★★★ |
| **Sentry** | Error monitoring, bug analysis | ★★☆ |

#### Documentation & Knowledge

| Server | Purpose | Recommendation |
|---------|---------|----------------|
| **Context7** | Real-time API docs | ★★★ |
| **Notion** | Document reference | ★★☆ |
| **Google Drive** | Specs & designs | ★★☆ |

#### Data & Infrastructure

| Server | Purpose | Recommendation |
|---------|---------|----------------|
| **PostgreSQL** | SQL commands, schema | ★★★ |
| **Supabase** | Manage database & RLS | ★★☆ |
| **AWS** | Cloud resource control | ★★☆ |

#### Communication & External APIs

| Server | Purpose | Recommendation |
|---------|---------|----------------|
| **Slack** | Messaging, notifications | ★★☆ |
| **Jira / Linear** | Issue management | ★★☆ |
| **Google Calendar** | Scheduling | ★☆☆ |

### Top 3 Recommendations for Beginners

Start with these:

1. **GitHub MCP** — Streamlines PR/issue handling in conversation
2. **Context7** — Access latest APIs with commands
3. **Playwright** — Automate UI screenshots after changes

Example setup:

```bash
# Add GitHub MCP
claude mcp add github -- uvx mcp-server-github

# Add Context7
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

---

## Context Management — The Key to Performance

### Why Context Management Matters

Claude Code performance hinges on **context window management**: the amount of information fed into the model.

The window supports up to 200,000 tokens (~150,000 words). As sessions lengthen, context accumulates, nearing capacity, which can cause Claude to "forget" previous instructions, reducing accuracy.

Effective context management is crucial for reliable results.

### Commands for Context Control

| Command | Description | When to Use |
|---------|--------------|------------|
| `/clear` | Reset all context | Start a new unrelated task |
| `/compact` | Compress info while retaining essentials | Continue same task, save space |
| `/compact Focus on the API changes` | Compress with focus | Keep specific info relevant |
| `/btw` | Side question (not in history) | Quick question without clutter |
| `Esc+Esc` or `/rewind` | Rewind menu | Undo last actions |

When nearly full (~95%), auto-compaction triggers. Override threshold with `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50`.

### Plan Mode — Exploration Without Modification

**Plan mode** is for "thinking first, coding later." It reads files but does not modify them (read-only).

Switch with `Shift+Tab` twice or set default in `settings.json`:

```json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

Workflow:

1. Exploration (read files, understand)
2. Planning (draft your implementation plan)
3. Implementation (write code, test, fix)
4. Commit (push PR)

This mode reduces token use and costs, focusing on design without actual coding.

### Common Pitfalls and Solutions

| Pattern | Symptoms | Solution |
|---------|----------|----------|
| Kitchen-sink sessions | Misplaced focus, mistakes | Use `/clear` between tasks |
| Loop of revisions | Repeated mistakes | If happens twice, `/clear` and restart |
| Bloated CLAUDE.md | Overlooked rules | Regularly review and trim |
| Implementation without testing | Looks right but buggy | Always run tests, build, verify screenshots |
| Infinite exploration | Context overload | Narrow scope or delegate to subagents |

### Best Practices for Context Efficiency

- Keep CLAUDE.md under 200 lines.
- Separate detailed specs into Skills for on-demand loading.
- Scope MCP tools wisely.
- Adopt 30-minute sprints with `/compact` between to maintain high performance.
- Use subagents for large explorations.

---

## Summary — Feature Comparison and Next Steps

### Feature Table

| Feature | Purpose | When | Deterministic |
|---------|---------|-------|--------------|
| **CLAUDE.md** | Persistent instructions & context | At session start | No (~80% compliance) |
| **Skills** | Reusable procedures/knowledge | Call or detect | — |
| **Hooks** | Reliable automation | Lifecycle events | Yes (100%) |
| **Subagents** | Specialized tasks | Delegation decision | — |
| **Agent Teams** | Large-scale parallel work | Task start | — |
| **MCP** | Connect to external services | Tool call | — |

### How to Get Started

1. Create and maintain a clear CLAUDE.md to set project rules.
2. Package repetitive steps into Skills.
3. Automate frequent actions with Hooks.
4. Use Subagents for large, specialized, or sensitive tasks.
5. Integrate MCP for external data/services.
6. For big projects, consider Agent Teams.

Claude Code can transform your entire development workflow. Start by running `/init` to generate CLAUDE.md, then refine and optimize over time.

As you deepen usage, it will evolve into a tailored AI coding assistant, guided by the right configuration and context management habits.

---

> This article was automatically generated by LLM. It may contain errors.
