/**
 * rick-brick の deploy.yml を repository_dispatch で発火する。
 * generate-articles.yml の最終ステップとして実行される。
 *
 * 環境変数:
 *   DEPLOY_TRIGGER_PAT - GitHub Fine-grained PAT
 */

interface DeployTriggerPayload {
  trigger: 'auto' | 'manual';
  commit_sha: string;
  articles: string[];
}

async function main() {
  const pat = process.env.DEPLOY_TRIGGER_PAT;
  if (!pat) {
    console.error('DEPLOY_TRIGGER_PAT is not set');
    process.exit(1);
  }

  // rick-brick リポジトリに対して repository_dispatch を発火
  const targetRepo = 'no-problem-dev/rick-brick';

  const payload: DeployTriggerPayload = {
    trigger: 'auto',
    commit_sha: process.env.GITHUB_SHA || 'unknown',
    articles: [],
  };

  const url = `https://api.github.com/repos/${targetRepo}/dispatches`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${pat}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      event_type: 'content-updated',
      client_payload: payload,
    }),
  });

  if (response.status === 204) {
    console.log('Deploy triggered successfully');
  } else {
    const text = await response.text();
    console.error(`Failed to trigger deploy: ${response.status} ${text}`);
    // エラーでもワークフロー失敗にはしない（記事は既に push 済み）
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('Trigger deploy error:', error);
  process.exit(0);
});
