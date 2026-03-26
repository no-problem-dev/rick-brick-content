import { describe, it, expect } from 'vitest';
import { selectDailyProvider, selectWeeklyProvider, getISOWeekNumber } from '../utils/provider-routing.js';

describe('selectDailyProvider', () => {
  it('偶数日 → openai', () => {
    expect(selectDailyProvider('2026-03-02')).toBe('openai');
    expect(selectDailyProvider('2026-03-10')).toBe('openai');
    expect(selectDailyProvider('2026-03-20')).toBe('openai');
    expect(selectDailyProvider('2026-03-30')).toBe('openai');
  });

  it('奇数日 → gemini', () => {
    expect(selectDailyProvider('2026-03-01')).toBe('gemini');
    expect(selectDailyProvider('2026-03-11')).toBe('gemini');
    expect(selectDailyProvider('2026-03-21')).toBe('gemini');
    expect(selectDailyProvider('2026-03-31')).toBe('gemini');
  });

  it('全31日をカバー', () => {
    for (let d = 1; d <= 31; d++) {
      const date = `2026-03-${String(d).padStart(2, '0')}`;
      const expected = d % 2 === 0 ? 'openai' : 'gemini';
      expect(selectDailyProvider(date)).toBe(expected);
    }
  });
});

describe('getISOWeekNumber', () => {
  it('2026-01-01 (木) → W01', () => {
    expect(getISOWeekNumber('2026-01-01')).toBe(1);
  });

  it('2026-03-23 (月) → W13', () => {
    expect(getISOWeekNumber('2026-03-23')).toBe(13);
  });

  it('2026-12-31 (木) → W53', () => {
    expect(getISOWeekNumber('2026-12-31')).toBe(53);
  });
});

describe('selectWeeklyProvider', () => {
  it('偶数週 → openai', () => {
    // W13 is odd → gemini, W14 is even → openai
    // 2026-03-30 is Monday of W14
    expect(selectWeeklyProvider('2026-03-30')).toBe('openai');
  });

  it('奇数週 → gemini', () => {
    // W13 → 2026-03-23 (Mon)
    expect(selectWeeklyProvider('2026-03-23')).toBe('gemini');
  });

  it('2026年の全ISO週で交互に切り替わる', () => {
    // W1: 2025-12-29(Mon) to 2026-01-04(Sun), W2: 2026-01-05(Mon) to 2026-01-11(Sun)
    expect(selectWeeklyProvider('2026-01-01')).toBe('gemini'); // W1 (odd)
    expect(selectWeeklyProvider('2026-01-04')).toBe('gemini'); // still W1
    expect(selectWeeklyProvider('2026-01-05')).toBe('openai'); // W2 (even)
    expect(selectWeeklyProvider('2026-01-08')).toBe('openai'); // still W2
  });
});
