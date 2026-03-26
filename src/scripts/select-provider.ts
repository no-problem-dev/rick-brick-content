/**
 * ワークフローから呼び出されるプロバイダー選択スクリプト。
 * ARTICLE_TYPE 環境変数に基づいて RESEARCH_PROVIDER を自動選択し、
 * $GITHUB_ENV に書き出す。
 *
 * Usage:
 *   ARTICLE_TYPE=daily npx tsx src/scripts/select-provider.ts
 *   ARTICLE_TYPE=weekly npx tsx src/scripts/select-provider.ts
 *
 * 環境変数:
 *   ARTICLE_TYPE        — "daily" or "weekly" (required)
 *   RESEARCH_PROVIDER   — 既に設定済みの場合はスキップ
 *   TARGET_DATE          — 日付上書き（空の場合は当日 JST）
 */

import { appendFileSync } from 'node:fs';
import { getTodayDate } from '../utils/date.js';
import { selectDailyProvider, selectWeeklyProvider } from '../utils/provider-routing.js';

const articleType = process.env.ARTICLE_TYPE;
const existingProvider = process.env.RESEARCH_PROVIDER;

if (existingProvider) {
  console.log(`::notice::Provider already set: ${existingProvider}`);
  process.exit(0);
}

const today = getTodayDate();
let provider: string;

if (articleType === 'daily') {
  provider = selectDailyProvider(today);
} else if (articleType === 'weekly') {
  provider = selectWeeklyProvider(today);
} else {
  console.error(`Unknown ARTICLE_TYPE: ${articleType}`);
  process.exit(1);
}

console.log(`::notice::Auto-selected provider: ${provider} (type=${articleType}, date=${today})`);

const githubEnvFile = process.env.GITHUB_ENV;
if (githubEnvFile) {
  appendFileSync(githubEnvFile, `RESEARCH_PROVIDER=${provider}\n`);
}
