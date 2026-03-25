# rick-brick-content

Content repository for [Rick-Brick](https://oct-rick-brick.com) — an AI-focused tech blog. Manages article Markdown files, images, and the automated article generation pipeline.

This repository is mounted as a git submodule in **rick-brick** (the Astro app, private repository).

[Japanese version / 日本語版](./README.ja.md)

## Repository Structure

```
rick-brick-content/
├── articles/              # Article Markdown (manual + auto-generated)
├── images/                # Article thumbnail images
│   └── defaults/          # Fallback images
├── drafts/                # Drafts
├── ideas/                 # Article ideas
├── src/
│   ├── scripts/           # Auto-generation & SNS posting scripts
│   ├── utils/             # Shared utilities (SNS, formatting, frontmatter)
│   ├── providers/         # LLM providers (Claude / Gemini / OpenAI)
│   └── types/             # TypeScript type definitions
├── prompts/
│   ├── base/              # Base prompts for article generation
│   └── providers/         # Provider-specific supplementary prompts
└── .github/
    ├── actions/
    │   └── post-generate/    # Composite action: thumbnail, translate, validate, SNS post
    └── workflows/
        ├── generate-daily.yml       # Daily auto-generation (JST 05:00)
        ├── generate-weekly.yml      # Weekly articles (Mon/Wed/Fri JST 18:00)
        ├── generate-recap.yml       # Recap articles (Tue/Thu + last day JST 18:00)
        └── post-sns-scheduled.yml   # Scheduled SNS posts (7x daily)
```

## Automated Article Generation

Three workflows run on different schedules via GitHub Actions cron:

| Workflow | Schedule (JST) | Categories |
|----------|---------------|------------|
| `generate-daily.yml` | Every day 05:00 | `ai-tech-daily`, `extended-daily` |
| `generate-weekly.yml` | Mon 18:00 | `paper-review` |
| `generate-weekly.yml` | Wed 18:00 | `extended-paper-review` |
| `generate-weekly.yml` | Fri 18:00 | `community-trends` |
| `generate-recap.yml` | Tue 18:00 | `ai-weekly-recap` |
| `generate-recap.yml` | Thu 18:00 | `extended-weekly-recap` |
| `generate-recap.yml` | Last day of month 18:00 | `monthly-paper-recap` |

Each workflow follows the same pipeline:

1. Research latest AI papers and news using LLM API (Claude / Gemini / OpenAI)
2. Generate Markdown articles from research results (including `sns_topics` for SNS posting)
3. Generate thumbnail images via Gemini Imagen API
4. Translate articles to multiple languages
5. Run quality checks (frontmatter validation, etc.)
6. Push successful articles to main
7. Trigger deployment on rick-brick via `repository_dispatch`
8. Post to SNS (X, Bluesky, Mastodon) with OpenAI-generated human-like comments

### Provider Switching

Select the LLM provider with the `RESEARCH_PROVIDER` environment variable.

| Value | Provider | Default Model |
|-------|----------|---------------|
| `claude` | Claude API (web_search) | claude-haiku-4-5 |
| `gemini` | Gemini API (Grounding with Google Search) | gemini-2.5-flash |
| `openai` | OpenAI API (web_search) | gpt-4.1-mini |

### Manual Execution

Can be triggered manually from GitHub Actions "Run workflow". Supports provider/model override and dry run options.

## SNS Posting

### Post-Generate Notification (after article generation)

After each article generation workflow, OpenAI API (`gpt-4.1-nano`) generates a human-like one-sentence comment about the article, then posts to:

- **X (Twitter)**: Japanese articles with title + comment + URL
- **Bluesky**: English articles with embed external card (OGP thumbnail)
- **Mastodon**: English articles with title + comment + URL

### Scheduled Topic Posts (7x daily)

`post-sns-scheduled.yml` runs at JST 8, 10, 12, 14, 18, 20, 22. Picks one topic from the 2 most recent articles' `sns_topics` field, generates a comment with insights via OpenAI API, and posts to all three platforms.

### sns_topics Field

Auto-generated articles include an `sns_topics` frontmatter field with 3-5 key topics extracted by the LLM:

```yaml
sns_topics:
  - topic: "Topic name"
    summary: "~100 char summary of the topic"
  - topic: "Another topic"
    summary: "..."
```

Articles without `sns_topics` (older articles) fall back to using `summary`.

## GitHub Actions Secrets

| Secret | Purpose |
|--------|---------|
| `ANTHROPIC_API_KEY` | Claude API |
| `GEMINI_API_KEY` | Gemini API (research) |
| `GEMINI_IMAGE_API_KEY` | Gemini Imagen API (thumbnails) |
| `OPENAI_API_KEY` | OpenAI API (SNS comment generation) |
| `DEPLOY_TRIGGER_PAT` | Deploy trigger to rick-brick (Fine-grained PAT) |
| `X_API_KEY` | X (Twitter) API Consumer Key |
| `X_API_SECRET` | X (Twitter) API Consumer Secret |
| `X_ACCESS_TOKEN` | X (Twitter) Access Token |
| `X_ACCESS_TOKEN_SECRET` | X (Twitter) Access Token Secret |
| `BSKY_HANDLE` | Bluesky handle |
| `BSKY_APP_PASSWORD` | Bluesky app password |
| `MASTODON_INSTANCE_URL` | Mastodon instance URL |
| `MASTODON_ACCESS_TOKEN` | Mastodon access token |

## Local Development

```bash
npm install
npm run research    # Run research
npm run generate    # Generate article Markdown
npm run thumbnail   # Generate thumbnails
npm run validate    # Run quality checks
```

Set environment variables in a `.env` file (gitignored).

```env
RESEARCH_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AI...
GEMINI_IMAGE_API_KEY=AI...
```

## Manual Article Posting

```bash
# Create an article
vim articles/YYYY-MM-DD-slug.md

# Merge to main via PR -> auto-deploy
git checkout -b feat/new-article
git add articles/ images/
git commit -m "feat: add article about ..."
git push origin feat/new-article
```

## Related Repositories

- **rick-brick** (private) — Astro SSG app. Handles build and deployment.
