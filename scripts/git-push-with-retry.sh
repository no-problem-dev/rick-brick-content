#!/usr/bin/env bash
# git-push-with-retry.sh
# Configures git user, stages articles/, images/, and data/, commits, and pushes to origin main
# with retry logic. Intended to be shared across generate-daily, generate-weekly, and
# generate-recap workflows to eliminate duplicated commit/push boilerplate.
#
# Usage:
#   ./scripts/git-push-with-retry.sh "<commit-message>" [max-retries] [retry-interval-seconds]
#
# Arguments:
#   $1  Commit message (required)
#   $2  Maximum number of push attempts (default: 3)
#   $3  Seconds to wait between retries (default: 10)
#
# Environment variables:
#   GIT_PUSH_TOKEN  Optional. When set, configures the remote URL to use this token
#                   for authentication (https://x-access-token:TOKEN@github.com/...).

set -euo pipefail

COMMIT_MSG="${1:?Commit message is required as the first argument}"
MAX_RETRIES="${2:-3}"
RETRY_INTERVAL="${3:-10}"

# --- git user configuration ---
git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

# --- token-based push authentication ---
if [[ -n "${GIT_PUSH_TOKEN:-}" ]]; then
  git remote set-url origin "https://x-access-token:${GIT_PUSH_TOKEN}@github.com/no-problem-dev/rick-brick-content.git"
fi

# --- stage articles, images, and data (SNS post logs etc.) ---
git add articles/ images/ data/

if git diff --staged --quiet; then
  echo "No changes to commit"
  exit 0
fi

# --- commit ---
git commit -m "${COMMIT_MSG}"

# --- sync with remote before first push attempt ---
git pull --rebase origin main

# --- push with retry ---
for i in $(seq 1 "${MAX_RETRIES}"); do
  if git push origin main; then
    echo "Push succeeded on attempt ${i}"
    exit 0
  fi
  echo "Push failed (attempt ${i}/${MAX_RETRIES}), retrying in ${RETRY_INTERVAL}s..."
  sleep "${RETRY_INTERVAL}"
  git pull --rebase origin main
done

echo "Push failed after ${MAX_RETRIES} attempts"
exit 1
