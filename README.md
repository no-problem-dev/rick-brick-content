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
│   ├── scripts/           # Auto-generation pipeline scripts
│   ├── providers/         # LLM providers (Claude / Gemini / OpenAI)
│   └── types/             # TypeScript type definitions
├── prompts/
│   ├── base/              # Base prompts for article generation
│   └── providers/         # Provider-specific supplementary prompts
└── .github/workflows/
    └── generate-articles.yml  # Daily auto-generation workflow
```

## Automated Article Generation

Runs daily via GitHub Actions cron (UTC 20:00 / JST 05:00).

1. Research latest AI papers and news using LLM API (Claude / Gemini / OpenAI)
2. Generate Markdown articles from research results (paper-review + ai-news-digest)
3. Generate thumbnail images via Gemini Imagen API
4. Run quality checks (frontmatter validation, etc.)
5. Push successful articles to main
6. Trigger deployment on rick-brick via `repository_dispatch`

### Provider Switching

Select the LLM provider with the `RESEARCH_PROVIDER` environment variable.

| Value | Provider | Default Model |
|-------|----------|---------------|
| `claude` | Claude API (web_search) | claude-haiku-4-5 |
| `gemini` | Gemini API (Grounding with Google Search) | gemini-2.5-flash |
| `openai` | OpenAI API (web_search) | gpt-4.1-mini |

### Manual Execution

Can be triggered manually from GitHub Actions "Run workflow". Supports provider/model override and dry run options.

## GitHub Actions Secrets

| Secret | Purpose |
|--------|---------|
| `ANTHROPIC_API_KEY` | Claude API |
| `GEMINI_API_KEY` | Gemini API (research) |
| `GEMINI_IMAGE_API_KEY` | Gemini Imagen API (thumbnails) |
| `OPENAI_API_KEY` | OpenAI API |
| `DEPLOY_TRIGGER_PAT` | Deploy trigger to rick-brick (Fine-grained PAT) |

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
