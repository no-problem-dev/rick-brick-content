/**
 * recap ワークフローから呼び出されるルーティングスクリプト。
 * 当日の日付に基づいて生成すべき recap カテゴリを判定し、
 * GitHub Actions の環境変数ファイル ($GITHUB_ENV) に書き出す。
 *
 * Usage:
 *   npx tsx src/scripts/recap-routing.ts
 *
 * 出力する環境変数:
 *   GEN_AI_WEEKLY=true     — ai-weekly-recap を生成する場合
 *   GEN_EXT_WEEKLY=true    — extended-weekly-recap を生成する場合
 *   GEN_MONTHLY=true       — monthly-paper-recap を生成する場合
 *   SKIP_RUN=true          — いずれも該当しない場合
 */

import { appendFileSync } from 'node:fs';
import { getTodayDate } from '../utils/date.js';
import { determineRecapCategories } from '../utils/recap-routing.js';

const ENV_KEY_MAP: Record<string, string> = {
  'ai-weekly-recap': 'GEN_AI_WEEKLY',
  'extended-weekly-recap': 'GEN_EXT_WEEKLY',
  'monthly-paper-recap': 'GEN_MONTHLY',
};

const today = getTodayDate();
const categories = determineRecapCategories(today);

console.log(`[recap-routing] date=${today}, categories=[${categories.join(', ')}]`);

const githubEnvFile = process.env.GITHUB_ENV;

if (categories.length === 0) {
  console.log('::notice::Not a recap day. Skipping.');
  if (githubEnvFile) {
    appendFileSync(githubEnvFile, 'SKIP_RUN=true\n');
  }
} else {
  for (const cat of categories) {
    const envKey = ENV_KEY_MAP[cat];
    if (envKey) {
      console.log(`::notice::Will generate: ${cat}`);
      if (githubEnvFile) {
        appendFileSync(githubEnvFile, `${envKey}=true\n`);
      }
    }
  }
}
