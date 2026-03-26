import { describe, it, expect } from 'vitest';
import { determineRecapCategories } from '../utils/recap-routing.js';

describe('determineRecapCategories', () => {
  describe('曜日ベースのルーティング', () => {
    it('月曜 (DOW=1) → 空配列（スキップ）', () => {
      // 2026-03-23 は月曜
      expect(determineRecapCategories('2026-03-23')).toEqual([]);
    });

    it('火曜 (DOW=2) → ai-weekly-recap', () => {
      // 2026-03-24 は火曜
      expect(determineRecapCategories('2026-03-24')).toEqual(['ai-weekly-recap']);
    });

    it('水曜 (DOW=3) → 空配列（スキップ）', () => {
      // 2026-03-25 は水曜
      expect(determineRecapCategories('2026-03-25')).toEqual([]);
    });

    it('木曜 (DOW=4) → extended-weekly-recap', () => {
      // 2026-03-26 は木曜
      expect(determineRecapCategories('2026-03-26')).toEqual(['extended-weekly-recap']);
    });

    it('金曜 (DOW=5) → 空配列（スキップ）', () => {
      // 2026-03-27 は金曜
      expect(determineRecapCategories('2026-03-27')).toEqual([]);
    });

    it('土曜 (DOW=6) → 空配列（スキップ）', () => {
      // 2026-03-28 は土曜
      expect(determineRecapCategories('2026-03-28')).toEqual([]);
    });

    it('日曜 (DOW=7) → 空配列（スキップ）', () => {
      // 2026-03-29 は日曜
      expect(determineRecapCategories('2026-03-29')).toEqual([]);
    });
  });

  describe('月末判定', () => {
    it('3月31日（火曜）→ ai-weekly-recap + monthly-paper-recap', () => {
      // 2026-03-31 は火曜かつ月末
      expect(determineRecapCategories('2026-03-31')).toEqual([
        'ai-weekly-recap',
        'monthly-paper-recap',
      ]);
    });

    it('4月30日（木曜）→ extended-weekly-recap + monthly-paper-recap', () => {
      // 2026-04-30 は木曜かつ月末
      expect(determineRecapCategories('2026-04-30')).toEqual([
        'extended-weekly-recap',
        'monthly-paper-recap',
      ]);
    });

    it('5月31日（日曜）→ monthly-paper-recap のみ', () => {
      // 2026-05-31 は日曜かつ月末
      expect(determineRecapCategories('2026-05-31')).toEqual(['monthly-paper-recap']);
    });

    it('6月30日（火曜）→ ai-weekly-recap + monthly-paper-recap', () => {
      // 2026-06-30 は火曜かつ月末
      expect(determineRecapCategories('2026-06-30')).toEqual([
        'ai-weekly-recap',
        'monthly-paper-recap',
      ]);
    });

    it('7月31日（金曜）→ monthly-paper-recap のみ', () => {
      // 2026-07-31 は金曜かつ月末
      expect(determineRecapCategories('2026-07-31')).toEqual(['monthly-paper-recap']);
    });

    it('8月31日（月曜）→ monthly-paper-recap のみ', () => {
      // 2026-08-31 は月曜かつ月末
      expect(determineRecapCategories('2026-08-31')).toEqual(['monthly-paper-recap']);
    });

    it('9月30日（水曜）→ monthly-paper-recap のみ', () => {
      // 2026-09-30 は水曜かつ月末
      expect(determineRecapCategories('2026-09-30')).toEqual(['monthly-paper-recap']);
    });

    it('10月31日（土曜）→ monthly-paper-recap のみ', () => {
      // 2026-10-31 は土曜かつ月末
      expect(determineRecapCategories('2026-10-31')).toEqual(['monthly-paper-recap']);
    });

    it('11月30日（月曜）→ monthly-paper-recap のみ', () => {
      // 2026-11-30 は月曜かつ月末
      expect(determineRecapCategories('2026-11-30')).toEqual(['monthly-paper-recap']);
    });

    it('12月31日（木曜）→ extended-weekly-recap + monthly-paper-recap', () => {
      // 2026-12-31 は木曜かつ月末
      expect(determineRecapCategories('2026-12-31')).toEqual([
        'extended-weekly-recap',
        'monthly-paper-recap',
      ]);
    });

    it('2月28日（土曜・非閏年月末）→ monthly-paper-recap', () => {
      // 2026-02-28 は土曜、2026年は非閏年なので月末
      expect(determineRecapCategories('2026-02-28')).toEqual(['monthly-paper-recap']);
    });

    it('2月28日（閏年・月末ではない）→ 空配列', () => {
      // 2028-02-28 は月曜、閏年なので28日は月末ではない（29日がある）
      expect(determineRecapCategories('2028-02-28')).toEqual([]);
    });

    it('2月29日（閏年・月末）→ monthly-paper-recap', () => {
      // 2028-02-29 は火曜かつ閏年の月末
      expect(determineRecapCategories('2028-02-29')).toEqual([
        'ai-weekly-recap',
        'monthly-paper-recap',
      ]);
    });
  });

  describe('月末ではない28-31日', () => {
    it('3月28日（土曜・月末ではない）→ 空配列', () => {
      expect(determineRecapCategories('2026-03-28')).toEqual([]);
    });

    it('3月29日（日曜・月末ではない）→ 空配列', () => {
      expect(determineRecapCategories('2026-03-29')).toEqual([]);
    });

    it('3月30日（月曜・月末ではない）→ 空配列', () => {
      expect(determineRecapCategories('2026-03-30')).toEqual([]);
    });
  });

  describe('2026年全月の月末テスト', () => {
    const monthlyLastDays: Record<string, string> = {
      '2026-01-31': '土曜',
      '2026-02-28': '土曜',
      '2026-03-31': '火曜',
      '2026-04-30': '木曜',
      '2026-05-31': '日曜',
      '2026-06-30': '火曜',
      '2026-07-31': '金曜',
      '2026-08-31': '月曜',
      '2026-09-30': '水曜',
      '2026-10-31': '土曜',
      '2026-11-30': '月曜',
      '2026-12-31': '木曜',
    };

    for (const [date, dayName] of Object.entries(monthlyLastDays)) {
      it(`${date}（${dayName}）は monthly-paper-recap を含む`, () => {
        const categories = determineRecapCategories(date);
        expect(categories).toContain('monthly-paper-recap');
      });
    }
  });
});
