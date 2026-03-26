import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { RECAP_CATEGORIES } from '../config/constants.js';

const PROMPT_DIR = 'prompts/base';
const PLACEHOLDER = '{{ARTICLES}}';

describe('recap プロンプトテンプレート', () => {
  for (const category of RECAP_CATEGORIES) {
    const promptPath = `${PROMPT_DIR}/${category}.md`;

    describe(category, () => {
      it('プロンプトファイルが存在する', () => {
        expect(existsSync(promptPath)).toBe(true);
      });

      it(`{{ARTICLES}} プレースホルダーを含む`, () => {
        const content = readFileSync(promptPath, 'utf-8');
        expect(content).toContain(PLACEHOLDER);
      });

      it('{{ARTICLES}} はプロンプト内に1回だけ出現する', () => {
        const content = readFileSync(promptPath, 'utf-8');
        const count = (content.match(/\{\{ARTICLES\}\}/g) || []).length;
        expect(count).toBe(1);
      });
    });
  }
});

describe('recap プロンプト構築の結合テスト', () => {
  it('{{ARTICLES}} が記事データで正しく置換される', () => {
    const template = readFileSync(`${PROMPT_DIR}/ai-weekly-recap.md`, 'utf-8');
    const articlesXml = '<articles>\n<article date="2026-03-20" category="ai-tech-daily">test content</article>\n</articles>';
    const result = template.replace(PLACEHOLDER, articlesXml);

    expect(result).not.toContain(PLACEHOLDER);
    expect(result).toContain('<articles>');
    expect(result).toContain('test content');
  });

  it('replace 後にプレースホルダーが残らない', () => {
    for (const category of RECAP_CATEGORIES) {
      const template = readFileSync(`${PROMPT_DIR}/${category}.md`, 'utf-8');
      const result = template.replace(PLACEHOLDER, '<articles></articles>');
      expect(result).not.toContain(PLACEHOLDER);
    }
  });
});
