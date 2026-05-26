import { describe, it, expect } from 'vitest';
import { selectDailyProvider, selectWeeklyProvider } from '../utils/provider-routing.js';

describe('selectDailyProvider', () => {
  it('常に openai を返す', () => {
    expect(selectDailyProvider('2026-03-01')).toBe('openai');
    expect(selectDailyProvider('2026-03-02')).toBe('openai');
    expect(selectDailyProvider('2026-03-31')).toBe('openai');
  });
});

describe('selectWeeklyProvider', () => {
  it('常に openai を返す', () => {
    expect(selectWeeklyProvider('2026-03-23')).toBe('openai');
    expect(selectWeeklyProvider('2026-03-30')).toBe('openai');
    expect(selectWeeklyProvider('2026-01-01')).toBe('openai');
  });
});
