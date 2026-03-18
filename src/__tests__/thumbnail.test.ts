import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// prompt-factory をモック
vi.mock('../thumbnail/prompt-factory.js', () => ({
  resolvePromptGeneratorConfig: vi.fn(),
  generatePromptByProvider: vi.fn(),
}));

// fs モジュールをモック（ファイル I/O を回避）
vi.mock('node:fs', () => ({
  existsSync: vi.fn().mockReturnValue(false),
  copyFileSync: vi.fn(),
  mkdirSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  readdirSync: vi.fn().mockReturnValue([]),
}));

import { resolvePromptGeneratorConfig, generatePromptByProvider } from '../thumbnail/prompt-factory.js';
import { generateThumbnail } from '../scripts/thumbnail.js';
import type { ThumbnailPromptResult } from '../types/thumbnail.js';

const MOCK_PROMPT_RESULT: ThumbnailPromptResult = {
  prompt:
    'A ginger cat sitting at a desk with quantum computing papers, actual photograph, real fur texture, STRICTLY PROHIBITED: Do NOT include any text, letters, words, numbers, watermarks, logos, captions',
  scene: 'A ginger cat sitting at a desk with quantum computing papers',
};

function makeImagenFetchMock(status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    text: async () => `HTTP ${status}`,
    json: async () => ({
      predictions: [{ bytesBase64Encoded: 'aW1hZ2VkYXRh', mimeType: 'image/png' }],
    }),
  });
}

describe('generateThumbnail（統合テスト）', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = makeImagenFetchMock();
    vi.mocked(resolvePromptGeneratorConfig).mockReturnValue({ provider: 'claude', apiKey: 'test-key' });
    vi.mocked(generatePromptByProvider).mockResolvedValue(MOCK_PROMPT_RESULT);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('TC-06: プロンプトファクトリー経由でプロンプトを取得し、Imagen API にそのプロンプトを渡す', async () => {
    // Arrange
    const slug = 'quantum-computing-2026-03-18';
    const title = 'Quantum Computing Breakthrough';
    const summary = 'A new quantum algorithm achieves exponential speedup';
    const body = 'Researchers at MIT have developed a novel quantum algorithm...';
    const apiKey = 'imagen-api-key';

    // Act
    const result = await generateThumbnail(slug, title, summary, body, apiKey);

    // Assert: generatePromptByProvider が呼ばれた
    expect(generatePromptByProvider).toHaveBeenCalledOnce();

    // Assert: Imagen API の fetch に prompt が渡された
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const fetchCall = vi.mocked(globalThis.fetch).mock.calls[0];
    const fetchBody = JSON.parse(fetchCall![1]!.body as string);
    expect(fetchBody.instances[0].prompt).toBe(MOCK_PROMPT_RESULT.prompt);

    // Assert: 結果が返る
    expect(result).toBeDefined();
  });

  it('TC-07: body 引数が generatePromptByProvider の request.body に渡される', async () => {
    // Arrange
    const slug = 'ai-news-2026-03-18';
    const title = 'AI News Today';
    const summary = 'Latest AI developments';
    const body = 'This is the full article body with detailed content about AI breakthroughs.';
    const apiKey = 'imagen-api-key';

    // Act
    await generateThumbnail(slug, title, summary, body, apiKey);

    // Assert: generatePromptByProvider が body を受け取っている
    expect(generatePromptByProvider).toHaveBeenCalledWith(
      expect.objectContaining({ body }),
      expect.objectContaining({ provider: 'claude', apiKey: 'test-key' }),
    );
  });

  it('TC-08: generatePromptByProvider がエラー（reject）しても画像生成を試み、ThumbnailResult を返す', async () => {
    // Arrange
    vi.mocked(generatePromptByProvider).mockRejectedValue(new Error('LLM API unavailable'));

    const slug = 'fallback-test-2026-03-18';
    const title = 'Fallback Test Article';
    const summary = 'Testing fallback behavior';
    const body = 'Article body content';
    const apiKey = 'imagen-api-key';

    // Act: 例外を投げずに結果を返す
    const result = await generateThumbnail(slug, title, summary, body, apiKey);

    // Assert: クラッシュせず ThumbnailResult を返す
    expect(result).toBeDefined();
    expect(result.slug).toBe(slug);
    expect(['success', 'fallback']).toContain(result.status);

    // Assert: Imagen API には何らかのプロンプトで呼び出されている（フォールバックプロンプト含む）
    expect(globalThis.fetch).toHaveBeenCalled();
    const fetchCall = vi.mocked(globalThis.fetch).mock.calls[0];
    const fetchBody = JSON.parse(fetchCall![1]!.body as string);
    // フォールバックプロンプトには title と summary が含まれる
    expect(fetchBody.instances[0].prompt).toContain(title);
    expect(fetchBody.instances[0].prompt).toContain(summary);
  });

  it('TC-09: body が空文字列でも generateThumbnail が正常に動作する', async () => {
    // Arrange
    const slug = 'empty-body-2026-03-18';
    const title = 'Empty Body Article';
    const summary = 'An article without body content';
    const body = '';
    const apiKey = 'imagen-api-key';

    // Act & Assert: 例外を投げずに ThumbnailResult を返す
    const result = await generateThumbnail(slug, title, summary, body, apiKey);

    expect(result).toBeDefined();
    expect(result.slug).toBe(slug);
    expect(typeof result.status).toBe('string');
    expect(typeof result.path).toBe('string');
  });

  it('TC-10: 旧 buildThumbnailPrompt 関数がエクスポートされていない（廃止確認）', async () => {
    // Arrange & Act: thumbnail.ts のエクスポートを動的確認
    const thumbnailModule = await import('../scripts/thumbnail.js');

    // Assert: buildThumbnailPrompt がエクスポートされていない
    expect((thumbnailModule as Record<string, unknown>)['buildThumbnailPrompt']).toBeUndefined();
  });
});
