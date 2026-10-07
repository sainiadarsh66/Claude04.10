import { HISTORY, easterSunday, itemsForDate, itemsThisWeek, itemsForYear, dateKey, moveableCelebrations } from './history';

describe('history data', () => {
  it('uses valid dates', () => {
    for (const h of HISTORY) {
      const [m, d] = h.date.split('-').map(Number);
      const probe = new Date(2024, m - 1, d);
      expect(dateKey(probe)).toBe(h.date);
      expect(h.text.length).toBeGreaterThan(5);
    }
  });

  it('has no duplicate entries', () => {
    const keys = HISTORY.map((h) => `${h.date}|${h.text}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('has something to talk about for every day of a leap year', () => {
    const d = new Date(2024, 0, 1);
    while (d.getFullYear() === 2024) {
      const count = itemsForDate(d).length + itemsThisWeek(d).length;
      expect(count, dateKey(d)).toBeGreaterThanOrEqual(3);
      d.setDate(d.getDate() + 1);
    }
  });

  it('hides war-related items for residents who avoid the topic', () => {
    const veDay = new Date(2025, 4, 8);
    expect(itemsForDate(veDay).some((i) => i.tags.includes('war'))).toBe(true);
    expect(itemsForDate(veDay, ['war']).some((i) => i.tags.includes('war'))).toBe(false);
  });

  it('finds events for a birth year', () => {
    expect(itemsForYear(1953).map((i) => i.text).join(' ')).toMatch(/Coronation/);
  });
});

describe('moveable celebrations', () => {
  it('calculates Easter Sunday', () => {
    expect(dateKey(easterSunday(2024))).toBe('03-31');
    expect(dateKey(easterSunday(2025))).toBe('04-20');
    expect(dateKey(easterSunday(2026))).toBe('04-05');
  });

  it('puts Pancake Day 47 days before Easter', () => {
    const shrove = moveableCelebrations(2026).find((c) => c.text.startsWith('Shrove'));
    expect(shrove?.date).toBe('02-17');
  });
});
