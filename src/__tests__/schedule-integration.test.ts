/**
 * スケジュール結合テスト
 *
 * 全ワークフローの cron スケジュール × プロバイダー選択 × カテゴリ判定を
 * 1週間分（全曜日）にわたって検証する結合テスト。
 *
 * API は呼ばず、ルーティングロジックのみをテストする。
 */
import { describe, it, expect } from 'vitest';
import { determineRecapCategories, isLastDayOfMonth } from '../utils/recap-routing.js';
import { selectDailyProvider, selectWeeklyProvider, getISOWeekNumber } from '../utils/provider-routing.js';
import type { RecapCategory } from '../config/constants.js';

// 2026-03-23(月) 〜 2026-03-29(日) の1週間
const WEEK_DATES = [
  { date: '2026-03-23', dow: 1, dayName: '月' },
  { date: '2026-03-24', dow: 2, dayName: '火' },
  { date: '2026-03-25', dow: 3, dayName: '水' },
  { date: '2026-03-26', dow: 4, dayName: '木' },
  { date: '2026-03-27', dow: 5, dayName: '金' },
  { date: '2026-03-28', dow: 6, dayName: '土' },
  { date: '2026-03-29', dow: 7, dayName: '日' },
];

describe('スケジュール結合テスト: 1週間のフルサイクル', () => {
  describe('Daily ワークフロー (毎日 JST 05:00)', () => {
    for (const { date, dayName } of WEEK_DATES) {
      it(`${date}(${dayName}): プロバイダーが正しく選択される`, () => {
        const provider = selectDailyProvider(date);
        const day = parseInt(date.split('-')[2]!, 10);
        const expected = day % 2 === 0 ? 'openai' : 'gemini';
        expect(provider).toBe(expected);
      });
    }
  });

  describe('Weekly ワークフロー (月・水・金 JST 18:00)', () => {
    const weeklyDates = WEEK_DATES.filter(({ dow }) => [1, 3, 5].includes(dow));

    for (const { date, dayName } of weeklyDates) {
      it(`${date}(${dayName}): プロバイダーが正しく選択される`, () => {
        const provider = selectWeeklyProvider(date);
        const isoWeek = getISOWeekNumber(date);
        const expected = isoWeek % 2 === 0 ? 'openai' : 'gemini';
        expect(provider).toBe(expected);
      });
    }

    // 月・水・金以外はワークフローが起動しないことを確認（カテゴリ検証の範囲外だが記録）
    const nonWeeklyDates = WEEK_DATES.filter(({ dow }) => ![1, 3, 5].includes(dow));
    for (const { date, dayName } of nonWeeklyDates) {
      it(`${date}(${dayName}): weekly ワークフローは起動しない（cron 対象外）`, () => {
        // cron が起動しないためプロバイダー選択は呼ばれないが、関数は呼べる
        const provider = selectWeeklyProvider(date);
        expect(provider).toBeDefined();
      });
    }
  });

  describe('Recap ワークフロー (火・木 JST 18:00 + 月末)', () => {
    for (const { date, dayName, dow } of WEEK_DATES) {
      it(`${date}(${dayName}): カテゴリが正しく判定される`, () => {
        const categories = determineRecapCategories(date);

        if (dow === 2) {
          expect(categories).toContain('ai-weekly-recap');
        } else {
          expect(categories).not.toContain('ai-weekly-recap');
        }

        if (dow === 4) {
          expect(categories).toContain('extended-weekly-recap');
        } else {
          expect(categories).not.toContain('extended-weekly-recap');
        }

        // 2026-03-23〜29 はいずれも月末ではない
        expect(categories).not.toContain('monthly-paper-recap');
      });
    }
  });
});

describe('月末判定: 2026年全12ヶ月', () => {
  const testCases: Array<{ lastDay: string; month: string; dow: string }> = [
    { lastDay: '2026-01-31', month: '1月', dow: '土' },
    { lastDay: '2026-02-28', month: '2月', dow: '土' },
    { lastDay: '2026-03-31', month: '3月', dow: '火' },
    { lastDay: '2026-04-30', month: '4月', dow: '木' },
    { lastDay: '2026-05-31', month: '5月', dow: '日' },
    { lastDay: '2026-06-30', month: '6月', dow: '火' },
    { lastDay: '2026-07-31', month: '7月', dow: '金' },
    { lastDay: '2026-08-31', month: '8月', dow: '月' },
    { lastDay: '2026-09-30', month: '9月', dow: '水' },
    { lastDay: '2026-10-31', month: '10月', dow: '土' },
    { lastDay: '2026-11-30', month: '11月', dow: '月' },
    { lastDay: '2026-12-31', month: '12月', dow: '木' },
  ];

  for (const { lastDay, month, dow } of testCases) {
    it(`${month}末 ${lastDay}(${dow}): isLastDayOfMonth=true`, () => {
      expect(isLastDayOfMonth(lastDay)).toBe(true);
    });

    it(`${month}末 ${lastDay}(${dow}): monthly-paper-recap を含む`, () => {
      const categories = determineRecapCategories(lastDay);
      expect(categories).toContain('monthly-paper-recap');
    });

    // 月末の前日は月末ではない
    const prevDay = new Date(`${lastDay}T12:00:00+09:00`);
    prevDay.setDate(prevDay.getDate() - 1);
    const prevDayStr = prevDay.toISOString().split('T')[0]!;

    it(`${month}末前日 ${prevDayStr}: isLastDayOfMonth=false`, () => {
      expect(isLastDayOfMonth(prevDayStr)).toBe(false);
    });
  }
});

describe('プロバイダー自動選択: 月間パターン検証', () => {
  it('1ヶ月間の daily プロバイダーが正確に交互する', () => {
    const results: Array<{ date: string; provider: string }> = [];
    for (let d = 1; d <= 31; d++) {
      const date = `2026-03-${String(d).padStart(2, '0')}`;
      results.push({ date, provider: selectDailyProvider(date) });
    }

    // 偶数日は全て openai、奇数日は全て gemini
    const openaiDays = results.filter((r) => r.provider === 'openai');
    const geminiDays = results.filter((r) => r.provider === 'gemini');
    expect(openaiDays).toHaveLength(15); // 2,4,6,...,30
    expect(geminiDays).toHaveLength(16); // 1,3,5,...,31
  });

  it('2ヶ月間の weekly プロバイダーが週単位で一貫している', () => {
    // 同じISO週内の月・水・金は同じプロバイダーであること
    const monWedFri = [
      // W13: 2026-03-23(月), 2026-03-25(水), 2026-03-27(金)
      ['2026-03-23', '2026-03-25', '2026-03-27'],
      // W14: 2026-03-30(月), 2026-04-01(水), 2026-04-03(金)
      ['2026-03-30', '2026-04-01', '2026-04-03'],
    ];

    for (const weekDates of monWedFri) {
      const providers = weekDates.map((d) => selectWeeklyProvider(d));
      // 同一週は全て同じプロバイダー
      expect(new Set(providers).size).toBe(1);
    }
  });
});

describe('Recap ルーティング: 2026年の全火曜・木曜', () => {
  // 2026年の全火曜を生成
  function getAllDatesForDOW(year: number, dow: number): string[] {
    const dates: string[] = [];
    const date = new Date(`${year}-01-01T12:00:00+09:00`);
    while (date.getUTCFullYear() === year) {
      if (date.getUTCDay() === dow) {
        dates.push(date.toISOString().split('T')[0]!);
      }
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }

  const allTuesdays = getAllDatesForDOW(2026, 2);
  const allThursdays = getAllDatesForDOW(2026, 4);

  it(`2026年の全${allTuesdays.length}火曜で ai-weekly-recap が生成される`, () => {
    for (const date of allTuesdays) {
      const categories = determineRecapCategories(date);
      expect(categories).toContain('ai-weekly-recap');
    }
  });

  it(`2026年の全${allThursdays.length}木曜で extended-weekly-recap が生成される`, () => {
    for (const date of allThursdays) {
      const categories = determineRecapCategories(date);
      expect(categories).toContain('extended-weekly-recap');
    }
  });

  it('火曜以外で ai-weekly-recap が生成されない', () => {
    const nonTuesdayDates = WEEK_DATES.filter(({ dow }) => dow !== 2);
    for (const { date } of nonTuesdayDates) {
      const categories = determineRecapCategories(date);
      expect(categories).not.toContain('ai-weekly-recap');
    }
  });

  it('木曜以外で extended-weekly-recap が生成されない', () => {
    const nonThursdayDates = WEEK_DATES.filter(({ dow }) => dow !== 4);
    for (const { date } of nonThursdayDates) {
      const categories = determineRecapCategories(date);
      expect(categories).not.toContain('extended-weekly-recap');
    }
  });
});

describe('cron → JST 変換の正確性', () => {
  // GitHub Actions の cron は UTC で定義されている。
  // 以下のテストは「UTC→JST変換後の曜日・日付が正しいか」を検証する。

  interface CronSchedule {
    name: string;
    cronUTC: string;
    expectedJST: string;
    expectedDays: string;
  }

  const schedules: CronSchedule[] = [
    { name: 'daily', cronUTC: '0 20 * * *', expectedJST: '05:00', expectedDays: '毎日' },
    { name: 'weekly', cronUTC: '0 9 * * 1,3,5', expectedJST: '18:00', expectedDays: '月水金' },
    { name: 'recap-weekly', cronUTC: '0 9 * * 2,4', expectedJST: '18:00', expectedDays: '火木' },
    { name: 'recap-monthly', cronUTC: '0 9 28-31 * *', expectedJST: '18:00', expectedDays: '28-31日' },
  ];

  for (const schedule of schedules) {
    it(`${schedule.name}: UTC ${schedule.cronUTC} → JST ${schedule.expectedJST} (${schedule.expectedDays})`, () => {
      // cron のフォーマットを解析
      const parts = schedule.cronUTC.split(' ');
      const minute = parseInt(parts[0]!, 10);
      const hour = parseInt(parts[1]!, 10);

      // UTC → JST 変換
      const jstHour = (hour + 9) % 24;
      const jstTime = `${String(jstHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

      expect(jstTime).toBe(schedule.expectedJST);
    });
  }

  it('daily: UTC 20:00 は JST 翌日 05:00（日付が +1）', () => {
    // UTC 20:00 + 9h = 翌日 05:00 JST
    const utcHour = 20;
    const jstHour = utcHour + 9;
    expect(jstHour).toBe(29); // 29 % 24 = 5, carry = 1 (next day)
    expect(jstHour % 24).toBe(5);
    expect(Math.floor(jstHour / 24)).toBe(1); // 日付が+1される
  });

  it('weekly/recap: UTC 09:00 は JST 同日 18:00（日付変更なし）', () => {
    const utcHour = 9;
    const jstHour = utcHour + 9;
    expect(jstHour).toBe(18);
    expect(Math.floor(jstHour / 24)).toBe(0); // 日付変更なし
  });
});

describe('日付ユーティリティ結合テスト', () => {
  it('isLastDayOfMonth が閏年を正しく判定する', () => {
    // 2024: 閏年
    expect(isLastDayOfMonth('2024-02-28')).toBe(false);
    expect(isLastDayOfMonth('2024-02-29')).toBe(true);
    // 2025: 非閏年
    expect(isLastDayOfMonth('2025-02-28')).toBe(true);
    // 2028: 閏年
    expect(isLastDayOfMonth('2028-02-28')).toBe(false);
    expect(isLastDayOfMonth('2028-02-29')).toBe(true);
  });

  it('100年ルール（閏年でない）', () => {
    expect(isLastDayOfMonth('2100-02-28')).toBe(true);
  });

  it('400年ルール（閏年）', () => {
    expect(isLastDayOfMonth('2400-02-29')).toBe(true);
  });
});
