import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateThumbnailPrompt } from '../thumbnail/prompt-generator.js';
import type { ThumbnailPromptRequest } from '../types/thumbnail.js';

const mockRequest: ThumbnailPromptRequest = {
  title: 'Quantum Computing Breakthrough',
  summary: 'A new quantum algorithm achieves exponential speedup',
  body: 'Researchers at MIT have developed a novel quantum algorithm...',
  category: 'paper-review',
};

const MOCK_API_KEY = 'test-api-key';
const MOCK_SCENE = 'A ginger cat sitting at a desk with quantum computing papers';

function makeFetchMock(scene: string, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => ({
      content: [{ type: 'text', text: scene }],
    }),
  });
}

describe('generateThumbnailPrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('TC-01: API を呼び出し、記事内容に基づくシーン描写を含むプロンプトを返す', async () => {
    // Arrange
    globalThis.fetch = makeFetchMock(MOCK_SCENE);

    // Act
    const result = await generateThumbnailPrompt(mockRequest, MOCK_API_KEY);

    // Assert
    expect(result.prompt).toContain(MOCK_SCENE);
    expect(result.scene).toContain(MOCK_SCENE);
  });

  it('TC-02: 生成されたプロンプトに実写品質制約・テキスト禁止制約が含まれる', async () => {
    // Arrange
    globalThis.fetch = makeFetchMock(MOCK_SCENE);

    // Act
    const result = await generateThumbnailPrompt(mockRequest, MOCK_API_KEY);

    // Assert
    expect(result.prompt).toContain('actual photograph');
    expect(result.prompt).toContain('real fur texture');
    expect(result.prompt).toContain('STRICTLY PROHIBITED');
    expect(result.prompt).toContain('Do NOT include any text');
    expect(result.prompt).toContain('no CGI, no digital art, no illustration');
  });

  it('TC-03: API エラー時にフォールバックプロンプトを返す（例外を投げない）', async () => {
    // Arrange
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal Server Error' }),
    });

    // Act
    const result = await generateThumbnailPrompt(mockRequest, MOCK_API_KEY);

    // Assert: 例外を投げずに ThumbnailPromptResult を返す
    expect(result).toBeDefined();
    expect(typeof result.prompt).toBe('string');
    expect(typeof result.scene).toBe('string');

    // フォールバックの prompt に title と summary が含まれる
    expect(result.prompt).toContain(mockRequest.title);
    expect(result.prompt).toContain(mockRequest.summary);

    // フォールバックにも必須制約が含まれる
    expect(result.prompt).toContain('actual photograph');
    expect(result.prompt).toContain('Do NOT include any text');
  });

  it('TC-04: body が空文字列でも title と summary からプロンプト生成できる', async () => {
    // Arrange
    globalThis.fetch = makeFetchMock(MOCK_SCENE);
    const requestWithEmptyBody: ThumbnailPromptRequest = {
      ...mockRequest,
      body: '',
    };

    // Act & Assert: 例外を投げずに ThumbnailPromptResult を返す
    const result = await generateThumbnailPrompt(requestWithEmptyBody, MOCK_API_KEY);
    expect(result).toBeDefined();
    expect(typeof result.prompt).toBe('string');
    expect(typeof result.scene).toBe('string');
  });

  it('TC-05: プロンプトにテキスト禁止の包括的な指示が含まれる', async () => {
    // Arrange
    globalThis.fetch = makeFetchMock(MOCK_SCENE);

    // Act
    const result = await generateThumbnailPrompt(mockRequest, MOCK_API_KEY);

    // Assert: テキスト禁止キーワード群が含まれる
    expect(result.prompt).toContain('text');
    expect(result.prompt).toContain('letters');
    expect(result.prompt).toContain('words');
    expect(result.prompt).toContain('numbers');
    expect(result.prompt).toContain('watermarks');
    expect(result.prompt).toContain('logos');
    expect(result.prompt).toContain('captions');
  });
});
