import { db } from '../db/db';

export interface OnlineItem {
  year: number;
  text: string;
}

/**
 * Words that suggest an upsetting story. Online items mentioning any of these
 * are dropped: the hub only shows gentle, family-friendly history.
 */
const UNSAFE =
  /\b(kill|killed|killing|dead|death|deaths|die|died|dies|murder|war|wars|bomb|bombing|attack|attacks|massacre|terror|terrorist|crash|crashes|disaster|earthquake|tsunami|shoot|shooting|shot|assassinat\w*|execut\w*|genocide|riot|riots|flood|fire|hurricane|famine|plague|explosion|explodes|sinks|sank|invade\w*|invasion|battle|siege|hostage|nazi|holocaust|slave\w*|torture|abuse|suicide|epidemic|pandemic|coup|injur\w*|victim\w*|arrest\w*|prison|military|troops|army|soldiers|weapon\w*|nuclear|missile|violence|violent|wounded|fatal\w*|collapse\w*|rebels?|insurgen\w*|guerrilla|deport\w*|persecut\w*|surrender\w*|conflict)\b/i;

export function isGentle(text: string) {
  return !UNSAFE.test(text);
}

/** Fetches Wikipedia's selected events for a date, keeping a copy for offline use. */
export async function fetchOnThisDay(month: number, day: number): Promise<OnlineItem[]> {
  const key = `otd:${month}-${day}`;
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`,
      { headers: { Accept: 'application/json' } },
    );
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { selected?: { text: string; year: number }[] };
    const items = (data.selected ?? [])
      .filter((s) => typeof s.text === 'string' && isGentle(s.text))
      .map((s) => ({ year: s.year, text: s.text }))
      .sort((a, b) => a.year - b.year);
    await db.cache.put({ key, value: items, savedAt: Date.now() });
    return items;
  } catch (err) {
    const cached = await db.cache.get(key);
    if (cached) return cached.value as OnlineItem[];
    throw err;
  }
}
