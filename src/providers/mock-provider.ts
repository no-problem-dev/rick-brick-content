import type { ResearchRequest, ResearchResult } from '../types/research.js';
import { BaseResearchProvider } from './base-provider.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class MockProvider extends BaseResearchProvider {
  readonly name = 'mock' as const;

  async research(request: ResearchRequest): Promise<ResearchResult> {
    const fixturePath = join(__dirname, '../../fixtures/articles', `${request.category}.md`);

    try {
      const markdown = readFileSync(fixturePath, 'utf-8');
      return this.buildResult(request.category, markdown);
    } catch {
      return this.buildError(request.category, `Mock fixture not found: ${fixturePath}`);
    }
  }
}
