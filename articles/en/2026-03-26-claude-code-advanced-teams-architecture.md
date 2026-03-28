---
title: "Claude Code Practical Architecture — Design Patterns to Accelerate Development with Teams/Subagents"
slug: "claude-code-advanced-teams-architecture"
summary: "Explains advanced multi-agent design patterns on Claude Code, including Star Topology, DAG-driven tasks, context 80/20 rule, CLAUDE.md optimization, and deterministic control via Hooks, with offici..."
date: "2026-03-26T00:10"
tags: ["Claude Code","AI","Multi-Agent","Anthropic","Teams"]
category: "tech-article"
automated: false
thumbnail: "/images/claude-code-advanced-teams-architecture.png"
draft: false
---
# Claude Code Practical Architecture — Design Patterns to Accelerate Development with Teams/Subagents

Using Claude Code daily inevitably leads to encountering the "Single Session Barrier." During complex refactoring, the context degrades, causing the model to produce contradictory suggestions to previous decisions. When handling large parallel tasks, conversations become heavy, and inference accuracy drops. Breaking through this bottleneck is achieved by leveraging Subagents and Agent Teams to implement multi-agent architectures.

This article is aimed at engineers who are proficient with basic Claude Code operations, offering a comprehensive explanation of why certain designs are effective and practical advice on how to implement them.

---

## 1. Why is Multi-Agent Design Necessary? — Limitations of Single Sessions

### Scientific Basis for Context Degradation

Addy Osmani stated on his blog:

> "LLMs perform worse as context expands"

This isn’t just a token limit issue. As irrelevant information accumulates in the context window, the model’s "attention" disperses, resulting in degraded inference quality. The reason Claude makes proposals that contradict previous decisions during long sessions is due to this mechanism.

Similar findings are observed in Anthropic’s multi-agent research. Compared to a single Opus 4 session, a structure where **Opus 4 leads and Sonnet 4 acts as a subagent** shows a **performance increase of 90.2%**. Notably, switching to a multi-agent configuration yielded a larger improvement than simply upgrading to a higher model.

The study also identified that token usage, tool invocation count, and model selection explain 95% of the variance in performance. Thus, an all-in-one session design tends to worsen all three elements.

### What Changes with Multi-Agent?

```
【Single Session】
  All context (exploration, implementation, testing, debugging) accumulates in one window
  → Inference quality deteriorates toward the end

【Multi-Agent Design】
  Each agent focuses only on "their own domain"
  → Each window maintains an optimal state
```

The **Agent Teams** feature released in February 2026 embodies this design at the implementation level. Multiple Claude Code instances operate independently, sharing task lists and mailboxes for coordination.

---

## 2. Star Topology — Leader/Advisor/Teammate 3-Layer Architecture

### Design Philosophy

The most critical decision in Agent Teams architecture is "information flow shape." Instead of a flat Mesh Topology—where all agents communicate directly—the **Star Topology**, where all communication passes through a Leader, is adopted to prevent information contradiction and dispersion.

```
Team Leader (Opus)
    ↕  Specification queries and distilled info reception
Advisor (Sonnet) — Reads & distills spec/ and codebase
    ↓
Teammates (Sonnet × N) — Focus on implementation
```

The Leader acts not as an information repository, but as a **data intersection point**. How the Leader manages what to retain and what to discard determines the entire team’s performance.

### What the Leader does / does not do

| What the Leader Does | What the Leader Does Not Do |
|---|---|
| Task decomposition & dependency management | Direct code implementation |
| Quality verification (tests & type checks) | Referencing specifications directly |
| Provide feedback to Teammates | Oversee entire codebase |
| Progress management & bottleneck detection | Allow direct coordination among Teammates |

This configuration yields the "paradoxical strength" of the Star Topology. By not reading specifications directly, the Leader can dedicate its context window solely to progress oversight and quality assurance.

### Advisor — The Information Distillation Expert

The role of Advisor is essentially "information distillation." It reads large amounts of specs and codebases, extracting only the structured information necessary for the Leader.

```
Leader: "Please tell me the specifications needed for T04 implementation. Include type definitions & DoD."
        ↓
Advisor: Reads spec/ and distills structured info back to Leader
        ↓
Leader: Transfers Advisor’s reply to messages for Teammates
```

**Advisor Constraint:** It is read-only. It cannot write or edit files. If Advisor gains write permissions, information flow consistency collapses.

### Principles for Teammates

The most important rule for designing Teammates is "do not read specifications directly." Though counterintuitive, the rationale is clear.

Reading specs directly causes interpretative variance among Teammates. Instead, record the distilled info from Advisor directly in the message to Teammates, ensuring uniform interpretation.

Implementation principles for Teammates:

1. Implement based solely on leader instructions (no extra features)
2. Do not act on ambiguous points—confirm with Leader
3. Include changed files, test results, type check results, and unresolved issues in completion reports
4. Do not read files under `spec/` (Leader transmits necessary info)

### Information Flow Constraints

```
【Permitted Communication】
  Leader ↔ Advisor: Specification queries & distillation
  Leader → Teammates: Implementation instructions & feedback
  Teammates → Leader: Completion reports & questions

【Prohibited Communication】
  Teammates → Teammates: Direct messages (only via Leader)
  Teammates → Advisor: Direct messages (only via Leader)
  Leader → spec/: Direct file reading (delegate to Advisor)
```

### Why is this Design Effective?

Anthropic’s multi-agent research shows that "model choice" significantly impacts performance. Concentrating Opus as the Leader and running multiple Sonnet Teammates in parallel approaches an optimal cost-quality solution.

Moreover, Star Topology inherently "prevents information contradiction." As the number of agents grows exponentially, managing communication paths via a single hub (the Leader) makes the system manageable.

---

## 3. DAG-Driven Task Design — The Science of Parallelization

### Managing Tasks as a DAG

Design the task list as a **Directed Acyclic Graph (DAG)** to explicitly manage dependencies between tasks.

```json
{
  "tasks": [
    { "id": "T01", "name": "Authentication Schema Design", "blocked_by": [] },
    { "id": "T02", "name": "API Endpoint Implementation", "blocked_by": ["T01"] },
    { "id": "T03", "name": "Frontend Implementation", "blocked_by": ["T01"] },
    { "id": "T04", "name": "Integration Testing", "blocked_by": ["T02", "T03"] }
  ]
}
```

In this example, T02 and T03 can run in parallel, while T04 waits for both. Designing the DAG makes "what can be parallelized" immediately clear.

### Wave Execution Pattern

Break down dependency-separated task groups into "Waves." Running tasks in wave units maximizes parallelism while respecting dependencies.

```
Wave 1: Research & Design (all tasks parallel)
  ├─ Teammate A: Frontend state research
  ├─ Teammate B: Backend API research
  └─ Teammate C: Testing strategy planning
  ↓
Wave 1 complete

Wave 2: Implementation (file separation assumed)
  ├─ Teammate A: Frontend implementation (src/components/)
  └─ Teammate B: Backend API implementation (src/api/)
  ↓
Wave 2 complete

Wave 3: Integration Testing (sequential)
  └─ Teammate C: Run integration tests & verify quality
```

Wave design ensures "tasks within the same wave do not depend on each other". Pre-check for file duplication is essential.

### Task Sizing Principles

| Size | Issues |
|---|---|
| Too small (less than 1 file) | Management overhead exceeds execution savings |
| Too large (over 1 week) | No intermediate check-ins, increased rework risk |
| Appropriate | Self-contained unit with clear deliverables |

Practically, 5–6 tasks per Teammate is recommended. Proper batching prevents context switching and keeps Teammates focused on their domain.

### File Locking & Conflict Avoidance

Anthropic’s C compiler project (16 agents, 100,000 lines of Rust) uses a custom file lock mechanism to prevent conflicts. Agents write lock files in `current_tasks/`, and Git’s conflict resolution handles cross-agent task claiming.

```bash
# Example of claiming a task
echo "$AGENT_ID" > current_tasks/task-$TASK_ID.lock
git add current_tasks/task-$TASK_ID.lock
git commit -m "claim: task-$TASK_ID"
```

This "distributed claiming" approach avoids centralized orchestrators.

### Automated Quality Gates

Using `TaskCompleted` and `TeammateIdle` hooks, automate quality checks at task completion or just before Teammate stops.

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
npm test || { echo "Tests failed" >&2; exit 2; }
npm run lint || { echo "Lint failed" >&2; exit 2; }
npm run build || { echo "Build failed" >&2; exit 2; }
exit 0
```

Returning `exit 2` blocks progress and sends feedback to Claude, establishing an automatic quality gate.

---

## 4. Mastering Context Management — The 80/20 Rule and Beyond

### 80/20 Rule

The fundamental principle of context management is simple:

> Don’t use the last 20% of the context window for complex multi-file tasks.

For example, with a 200K token window, reaching 83.5% (167K tokens) triggers automatic compaction. Inference quality drops significantly just before this point. Always monitor token usage and consider manual compaction when exceeding 70–80%.

### Compression Strategies — When & How to Compress

**Recommended timing for compression**:
- After major features are completed
- Before switching from exploration to implementation
- When Claude repeats previous questions or contradicts itself
- At logical task boundaries (Wave transitions)

**Timings to avoid**:
- During debugging (while tracking specific errors)
- During complex refactoring involving inter-file dependencies

### Isolating Exploration Tasks with Subagents

One of the most effective tactics to protect context is "delegating exploration tasks to Subagents."

```
Main Context
  └─ "Investigate current auth module"
        ↓
Delegated to Subagent
  Subagent Context (independent)
    ├─ Read all files in src/auth/
    ├─ Analyze test files
    └─ Track dependencies
        ↓ Returns only summary to parent
Main Context
  └─ "Auth module uses JWT + Redis sessions; main functions are..."
```

Reading hundreds of files becomes manageable within the Subagent context. The main context contains only the summary.

### 30-Minute Sprint Strategy

Divide work into '30-minute sprints.' Advance the task within 30 minutes, then perform compaction or `/clear`. Shorter cycles with fresh contexts often yield higher final quality than prolonged sessions.

### Leader’s Context Design

| Task State | What Leader Keeps | What Leader Discards |
|---|---|---|
| COMPLETED | task_id, status, deliverable path | Implementation details, test results, message history |
| IN_PROGRESS | Instructions and progress for Teammates | Full task definition (re-queriable from Advisor) |
| PENDING | task_id, blocked_by, wave | Full task definition (from Advisor as needed) |

Design the Leader’s context as a "summary of state," and retrieve detailed info from Advisor as needed. Advisor’s context remains self-contained, never consumed by Leader.

---

## 5. CLAUDE.md Optimization Tactics — How to Use 300 Lines Wisely

### "Less is More" Principle

Research by HumanLayer indicates the maximum effective instruction set for cutting-edge LLMs is around 150–200 instructions. Claude Code’s prompt includes about 50 instructions already. The limit for CLAUDE.md is effectively 100–150 instructions.

**Recommendation**: Root file under 300 lines, ideally under 60.

Lengthy CLAUDE.md increases the chance that critical rules are ignored or buried, reducing their effectiveness.

### Don’t Write What Claude Already Knows

Avoid instructions like "write clean code" or "don’t forget error handling" if Claude already performs correctly. Write only necessary, project-specific rules.

**Criteria for inclusion**:
- If the rule could be followed without explicit instruction, omit it
- If the rule is common knowledge for Claude, omit it
- If the rule rarely changes, omit it

### Delegate Styling & Formatting to Linters & Hooks

> "Never let an LLM do a linter’s job."

Let format, lint, and type checks be handled by deterministic tools (Biome, ESLint, tsc), automated via Hooks, saving tokens and ensuring consistency.

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

Remove style instructions from CLAUDE.md, replacing them with Hook configurations for reliable enforcement.

### Progressive Disclosure Pattern

Prevent CLAUDE.md from becoming bloated by writing core info in the root, linking to detailed docs only when needed.

```markdown
# CLAUDE.md (Root — under 60 lines)

## Tech Stack
- Astro 5.18.0 + Tailwind CSS 4.2.0 + Cloudflare Pages
- TypeScript 5.9.x (strict mode)

## Commands
- Build: `npm run build`
- Type Check: `npx tsc --noEmit`
- Lint: `npm run lint`

## On-demand Docs (linked when necessary)
- API Design: @.claude/rules/api-conventions.md
- Git Workflow: @.claude/rules/branching.md
- Deployment: @.claude/rules/deployment.md
```

Files imported with `@path/to/file` are loaded on demand when Claude deems necessary.

### Hierarchical CLAUDE.md Design

```
~/.claude/CLAUDE.md          # Common across all projects (personal settings)
  ./CLAUDE.md                 # Project root (team shared)
    ./.claude/rules/api.md    # Loaded during API development
    ./.claude/rules/test.md   # Loaded during testing
    src/components/CLAUDE.md  # Loaded during component development
```

Child directories’ CLAUDE.md are loaded on demand, keeping the root lean and purpose-specific.

---

## 6. Skills Design Pattern — On-demand Knowledge Injection

### How to Separate Skills from CLAUDE.md

Skills are stored in `.claude/skills/{skill-name}/SKILL.md`, representing specialized knowledge sets. Their usage is distinct from CLAUDE.md.

```
CLAUDE.md → Used throughout all sessions for core info.
  e.g., build commands, tech stacks, branch conventions

Skills → Used selectively for specific tasks or contexts.
  e.g., API design rules, deployment procedures, domain expertise
```

Skills are loaded on demand, avoiding the bloat of full-project CLAUDE.md.

### Converting Specifications into Skills — SDD Layered Architecture

Large projects cannot store entire specifications in CLAUDE.md. The example project "rick-brick" divides specs into 6 layers (L0–L5), each defined as a Skill.

```
.claude/skills/
  spec-l0-core/            # Always loaded (tech stack criteria)
  spec-l1-1-vision/        # L1: Vision & problem definition
  spec-l1-6-content-types/ # L1: Content type classification
  spec-l4-1-content-schema/ # L4: Frontmatter schema
  spec-l4-3-article/       # L4: Article templates & embeds
  generate-thumbnail/      # Thumbnail generation workflow
  common-doc-writer/       # File output workflow
```

Calling `Skill("spec-l4-1-content-schema")` injects schema details. Advisor loads only necessary specs on demand, keeping Leader’s context clean.

### Injecting Skills into Subagents

Subagents do not inherit Skills from parent conversations. Skills must be explicitly listed in their frontmatter.

```yaml
---
name: api-developer
description: Implements API endpoints according to team standards
tools: Read, Edit, Write, Bash
skills:
  - api-conventions
  - error-handling-patterns
  - security-checklist
---

You are a senior backend engineer.
Implement strictly following the listed team standards.
```

### `context: fork` for Independent Execution

Setting `context: fork` in a skill’s frontmatter makes the skill run as an independent subagent.

```yaml
---
name: security-audit
description: Performs security audit after code changes
context: fork
allowed-tools: Read, Grep, Glob
disable-model-invocation: false
---
```

`context: fork` skills do not consume parent context, ideal for large-scale audits or reviews.

---

## 7. Deterministic Control via Hooks — Automated Quality Assurance

### CLAUDE.md (Advisory) vs Hooks (Deterministic)

Understanding the two-layer quality assurance structure in Claude Code is crucial.

| | CLAUDE.md | Hooks |
|---|---|---|
| Usage Probability | About 80% (advisory) | 100% (deterministic) |
| Suitable for | Design decisions & context | Format, lint, security checks |
| Execution Timing | Loaded at session start | Automated at lifecycle events |

Write "must execute every time" instructions in Hooks. Even if CLAUDE.md mentions "run type checks," it’s only about 80% reliable. Hooks guarantee execution.

### Agent Teams Quality Gates

Two important hooks during Agent Teams operation:

**`TeammateIdle`**: Run just before a Teammate stops (idle). Returning `exit 2` sends feedback messages for continuation.

**`TaskCompleted`**: Run immediately before marking a task as complete. Returning `exit 2` prevents completion.

```bash
#!/bin/bash
# .claude/hooks/verify-output.sh (for TeammateIdle)

# Run tests
if ! npm test 2>&1; then
  echo "Tests failed. Please fix before stopping." >&2
  exit 2
fi

# Run type checks
if ! npx tsc --noEmit 2>&1; then
  echo "TypeScript errors remain." >&2
  exit 2
fi

echo "Quality check passed" >&2
exit 0
```

Using `exit 2` both blocks progress and communicates issues back to Claude, establishing an automatic quality gate.

### Security Control — Blocking Dangerous Commands in PreToolUse

```bash
#!/bin/bash
# .claude/hooks/block-dangerous.sh

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Check for dangerous command patterns
DANGEROUS_PATTERNS=("rm -rf /" "DROP TABLE" "git push --force.*main" "chmod 777")

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "Blocked dangerous command: $pattern" >&2
    exit 2  # Block + feedback to Claude
  fi

done

exit 0
```

### Exit Code 2 — Block + Feedback

Three exit codes:

- `exit 0`: Success / allow
- `exit 2`: Block (feedback message sent to Claude)
- Others: Error (non-blocking, verbose mode)

`exit 2` not only blocks the command but also passes context info back to Claude. This enables Claude to autonomously attempt alternative approaches based on the feedback.

---

## 8. Practical Case Studies — Industry Leaders & Anthropic

### Anthropic C Compiler: 16 Agents, 100,000 Lines of Rust

Anthropic’s project building a C compiler with 16 parallel agents and a total of 2,000 sessions over 10 million tokens is the largest multi-agent development effort to date.

- **Scale**: 16 agents, 2,000 sessions, 200 million tokens
- **Outcome**: Successfully built 100,000 lines of Rust code and compiled Linux 6.9 kernel (x86/ARM/RISC-V)
- **Technical Innovations**:
  - Isolated each agent in separate Docker containers
  - Used Git file locking to prevent conflicts
  - Specialized agents for code deduplication, performance optimization, documentation maintenance

Key lesson: **"Claude is nearly perfect only if its test validators are effective.""** Agents maximize measurable success metrics independently; high-quality testing guides overall direction.

### Anthropic Multi-Agent Research: 15x Token Usage for 90% Performance

Experimental data from Anthropic demonstrates the effectiveness of multi-agent architecture:

- Compared to single-agent, multi-agent systems consume **15 times** more tokens.
- Opus 4 alone vs. Opus 4 lead + Sonnet 4 subagents yields **90.2% performance improvement**.
- Model upgrades are less impactful than switching to a multi-agent architecture.

Though cost increases significantly, the quality benefits justify the investment—this is Anthropic’s current insight.

### Parallel Code Review Prompts

```
Review PR #142 with an Agent Team. Generate three independent reviews:

- Reviewer-Security: Focus on authentication, authorization, input validation, secret leaks
- Reviewer-Performance: Focus on DB query efficiency, N+1 issues, caching strategies
- Reviewer-Testing: Focus on test coverage, edge cases, mock quality

Each review is independent. Summarize findings and report to Leader.
Leader combines all in prioritized feedback.
```

### Hypothesis Debugging Prompts

```
A user reports a white screen after login.
Create 5 agents to investigate different hypotheses in parallel:

- Agent-Auth: Check JWT expiration/signature issues
- Agent-State: Check Redux/Context update timing
- Agent-Route: Check for infinite redirect loops
- Agent-Error: Check if error boundaries are hiding errors
- Agent-Network: Check API response timing

Agents gather evidence and look for contradictory evidence to other hypotheses. Converge on the most probable cause.
```

### Doctolib: 40% Faster Feature Deployment

Doctolib deployed Claude Code across engineering teams, replacing legacy testing infrastructure within hours, resulting in a **40% speed increase** in feature releases.
As of 2026, 86% of organizations employ agent-driven code in production. The answer to "How to trust code written by AI" involves establishing automated quality assurance through tests, reviews, and Hooks.

---

## 9. Anti-Patterns & Lessons from Failures

### Kitchen Sink Sessions — Context Contamination

**Symptom**: Running unrelated tasks in a single session degrades response quality.

**Root Cause**: Context is contaminated with irrelevant information. Debug info from bug fixes remains, and subsequent features cause focus drift.

**Countermeasure**: Use `/clear` actively between tasks. Reset with a fresh context for each new task, resisting the urge to continue previous conversations.

### Recursive Fixes — Accumulating Failed Context

**Symptom**: Claude repeats same mistakes; corrections do not improve.

**Root Cause**: Failed attempts stay in context. Claude refers excessively to "this was a failed method."

**Countermeasure**: After two consecutive failures, `/clear` and restart with a clean prompt, re-expressing only what is to be achieved.

### Overuse of Agent Teams — Cost-Effectiveness

Applying Agent Teams to every task increases token consumption by 15x. For simple sequential tasks, it is unnecessary.

The key is "match the problem to the tool," avoiding problem creation solely for a tool.

### Hand-off Context Loss

Complex multi-agent setups risk losing context during Teammate hand-offs, increasing token consumption on coordination rather than actual work.
Including "what was achieved" and "why" in instructions helps prevent this.

### Parallel Convergence — Same Bugs in Multiple Agents

In Anthropic’s C compiler project, all 16 agents converged on a bug, overwriting each other’s fixes—a deadlock situation.

To prevent, decompose tasks into "separable units" with clear problem domains, e.g., identifying file differences and assigning per-file fixes.

### Underestimating Test & Verification — No Quality Assurance

**Lesson**: Agents aim to maximize measurable success. If tests are weak, they may generate passing but incorrect solutions.
Test quality directs project quality. Investment in testing and validation architecture is essential.

### Myth: "Multi-Agent Always Faster"

Multi-agent systems seem to promise "parallel speedup," but real-world issues include:
- Communication overhead
- Context management costs
- Contention & waiting

The real benefit is "performance gains with fresh context and quality improvement," making complex tasks feasible within multi-agent systems.

---

## 10. Deployment Roadmap — From Phase 1 to Phase 4

A step-by-step approach ensures steady progress toward full multi-agent orchestration.

### Phase 1: Foundation (CLAUDE.md Optimization + Hooks)

Fix "ineffective use" of current setup.

**Actions**:
1. Generate CLAUDE.md via `/init`, condense to under 300 lines
2. Remove rules Claude already follows correctly
3. Set up `PostToolUse` Hooks for automatic lint & format
4. Use `PreToolUse` Hooks to block dangerous commands

**Expected Outcome**: Improved inference accuracy; automated quality assurance reduces review workload.

**Completion**: CLAUDE.md under 300 lines; Hooks automating code quality checks.

### Phase 2: Subagents & Isolation (Exploration Separation + Code Review)

Experience practical benefits of context protection.

**Actions**:
1. Define a read-only `code-reviewer` subagent
2. Delegate "heavy investigation" tasks to Subagent
3. Use `context: fork` for isolated exploration skills

```yaml
---
name: code-reviewer
description: Review code for security, readability, performance
tools: Read, Grep, Glob
model: sonnet
---
Perform code review focusing on:
- Security (input validation, secret leaks, permissions)
- Readability (naming, duplication, comments)
- Performance (N+1, recalculations)
- Test coverage
Provide feedback as Critical / Warning / Suggestion.
```

**Complete when**: large-scale investigation and review can be done without consuming main context.

### Phase 3: Agent Teams — Transition from Read-Only Tasks

Start with "safe" read-only tasks like PR reviews or bug investigations.

**Actions**:
1. Use 3–5 Teammates; aim for 5–6 tasks per Teammate
2. Automate quality gates with `TeammateIdle` + `TaskCompleted` hooks

**Completion**: Agent Teams performs parallel reviews with auto quality control.

### Phase 4: Full Orchestration — Multi-Layer Architecture

Implement the 3-tier Leader/Advisor/Teammate structure for production workflows.

**Actions**:
1. Define orchestration plans (`.claude/orchestrators/*.md`)
2. Create Advisor agents specialized for spec understanding
3. Design DAG-based task dependency graphs
4. Establish progress management & quality control workflows

```markdown
# feature-x Orchestrator

## Team Structure
- Leader: Opus
- Advisor: Sonnet
- Teammates: Sonnet × 3

## Wave Plan
Wave 1: T01 (DB schema); sequential, Advisor verified
Wave 2: T02 (API) + T03 (Frontend); parallel
Wave 3: T04 (Testing); after Wave 2
```

**Complete when**: complex feature development runs autonomously, quality gates work seamlessly, no human intervention needed.

---

## Conclusion — The Essence of Design

Advanced Claude Code utilization boils down to "context design"—who knows what, what to keep or discard, task parallelization choices. These design decisions define the system’s quality and costs.

Star Topology improves quality through centralization, DAG enhances parallelism via dependency clarity, and the 80/20 rule maintains inference quality by keeping context fresh. Each addresses a different aspect of "context design."

Anthropic’s achievement of developing a C compiler with 16 agents, writing 100,000 lines of Rust, and building Linux kernels stems from "correct context design." Automated tests, isolated Docker environments, and conflict avoidance mechanisms ensure safe parallel execution.

Start with Phase 1: CLAUDE.md optimization, and gradually progress to Phase 4 tailored to your use case. Multi-agent design offers far greater potential than what current daily Claude Code usage might suggest.

---

> This article was automatically generated by LLM. It may contain errors.
