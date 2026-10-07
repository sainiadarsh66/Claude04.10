import { useMemo, useState } from 'react';
import { ActivityShell } from '../components/ActivityShell';
import { Button, Segmented, SpeakButton } from '../components/ui';
import { activityById } from '../data/catalog';
import {
  MONTHS,
  MONTH_FACTS,
  decadeOf,
  itemsForDate,
  itemsForYear,
  itemsThisWeek,
  type HistoryItem,
} from '../data/history';
import { fetchOnThisDay, type OnlineItem } from '../lib/onThisDayOnline';
import { useOnline } from '../lib/useOnline';
import { displayName, useActiveResident } from '../state/resident';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function season(d: Date) {
  const m = d.getMonth();
  if (m === 11 || m <= 1) return { name: 'Winter', emoji: '❄️' };
  if (m <= 4) return { name: 'Spring', emoji: '🌷' };
  if (m <= 7) return { name: 'Summer', emoji: '☀️' };
  return { name: 'Autumn', emoji: '🍂' };
}

export function formatLongDate(d: Date) {
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const PROMPTS: Record<HistoryItem['kind'], string[]> = {
  event: ['Do you remember this?', 'Where were you living at the time?', 'What did people say about it?'],
  birthday: ['Did you like their work?', 'Can you remember seeing or hearing them?'],
  celebration: ['How did you celebrate this?', 'Did your family have any traditions for this day?'],
};

export default function TodayInHistory() {
  const activity = activityById('history-today')!;
  return (
    <ActivityShell activityId={activity.id} title={activity.title} emoji="📅" tips={activity.staffTips} withDifficulty={false}>
      {() => <HistoryBrowser />}
    </ActivityShell>
  );
}

export function HistoryBrowser({ initialDate }: { initialDate?: Date }) {
  const { resident } = useActiveResident();
  const avoid = resident?.avoidTopics ?? [];
  const [date, setDate] = useState(() => initialDate ?? new Date());
  const [tab, setTab] = useState<'day' | 'birth'>('day');

  const shift = (days: number) =>
    setDate((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() + days);
      return n;
    });

  return (
    <div>
      {resident?.birthYear && (
        <div className="mb-5">
          <Segmented
            label="View"
            value={tab}
            options={[
              { id: 'day', label: 'On this day' },
              { id: 'birth', label: `${displayName(resident)}'s birth year` },
            ]}
            onChange={setTab}
          />
        </div>
      )}
      {tab === 'birth' && resident?.birthYear ? (
        <BirthYear year={resident.birthYear} name={displayName(resident)} avoid={avoid} />
      ) : (
        <DayView date={date} avoid={avoid} onShift={shift} onToday={() => setDate(new Date())} />
      )}
    </div>
  );
}

function DayView({ date, avoid, onShift, onToday }: { date: Date; avoid: string[]; onShift: (n: number) => void; onToday: () => void }) {
  const items = useMemo(() => itemsForDate(date, avoid), [date, avoid]);
  const week = useMemo(() => itemsThisWeek(date, avoid), [date, avoid]);
  const facts = MONTH_FACTS[date.getMonth()];
  const s = season(date);
  const isToday = new Date().toDateString() === date.toDateString();
  const longDate = formatLongDate(date);

  const celebrations = items.filter((i) => i.kind === 'celebration');
  const events = items.filter((i) => i.kind === 'event');
  const birthdays = items.filter((i) => i.kind === 'birthday');

  return (
    <div>
      <section className="mb-6 rounded-3xl border-2 border-line bg-surface p-6 text-center">
        <p className="m-0 text-xl text-muted">{isToday ? 'Today is' : 'Looking at'}</p>
        <div className="flex items-center justify-center gap-3">
          <p className="m-0 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight">{longDate}</p>
          <SpeakButton text={`${isToday ? 'Today is' : ''} ${longDate}. It is ${s.name}.`} />
        </div>
        <p className="mb-0 mt-2 text-2xl">
          <span aria-hidden>{s.emoji}</span> {s.name} · Flower of the month: {facts.flower} · Birthstone: {facts.stone}
        </p>
        {facts.saying && <p className="mb-0 mt-2 text-xl italic text-muted">“{facts.saying}”</p>}
        <div className="no-print mt-4 flex flex-wrap justify-center gap-3">
          <Button onClick={() => onShift(-1)}>◀ Day before</Button>
          {!isToday && (
            <Button variant="primary" onClick={onToday}>
              Today
            </Button>
          )}
          <Button onClick={() => onShift(1)}>Day after ▶</Button>
          <Button onClick={() => window.print()}>🖨️ Print</Button>
        </div>
      </section>

      {celebrations.length > 0 && <ItemList title="Today we celebrate" items={celebrations} today={date} />}
      {events.length > 0 && <ItemList title="On this day" items={events} today={date} />}
      {birthdays.length > 0 && <ItemList title="Born on this day" items={birthdays} today={date} />}
      {events.length + birthdays.length < 3 && week.length > 0 && (
        <ItemList title="Also this week in history" items={week.slice(0, 6)} today={date} showDate />
      )}
      <OnlineExtras date={date} />
    </div>
  );
}

function ItemList({ title, items, today, showDate }: { title: string; items: HistoryItem[]; today: Date; showDate?: boolean }) {
  return (
    <section className="mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2">
        {items.map((item) => (
          <HistoryCard key={`${item.date}-${item.text}`} item={item} today={today} showDate={showDate} />
        ))}
      </ul>
    </section>
  );
}

function HistoryCard({ item, today, showDate }: { item: HistoryItem; today: Date; showDate?: boolean }) {
  const [open, setOpen] = useState(false);
  const ago = item.year ? today.getFullYear() - item.year : null;
  const [mm, dd] = item.date.split('-').map(Number);
  const label =
    item.kind === 'birthday' && item.year
      ? `Born ${item.year}`
      : item.year
        ? `${item.year}`
        : '';
  const spoken = `${item.year ? `In ${item.year}, ` : ''}${item.kind === 'birthday' ? 'the birthday of ' : ''}${item.text}.`;
  return (
    <li className="rounded-3xl border-2 border-line bg-surface p-5">
      <div className="flex items-start gap-3">
        <span aria-hidden className="text-4xl">
          {item.kind === 'celebration' ? '🎉' : item.kind === 'birthday' ? '🎂' : '📰'}
        </span>
        <div className="flex-1">
          {(label || showDate) && (
            <p className="m-0 text-lg font-bold text-primary">
              {showDate ? `${dd} ${MONTHS[mm - 1]}` : ''}
              {showDate && label ? ' · ' : ''}
              {label}
              {ago !== null && ago > 0 ? ` · ${ago} years ago` : ''}
            </p>
          )}
          <p className="m-0 text-xl leading-snug">{item.text}</p>
          {open && (
            <ul className="mb-0 mt-3 rounded-2xl bg-hint p-3 pl-8 text-lg">
              {PROMPTS[item.kind].map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </div>
        <SpeakButton text={spoken} />
      </div>
      <button type="button" className="mt-2 text-lg font-bold text-primary underline" onClick={() => setOpen((o) => !o)}>
        {open ? 'Hide talking points' : 'Talking points'}
      </button>
    </li>
  );
}

function OnlineExtras({ date }: { date: Date }) {
  const online = useOnline();
  const [state, setState] = useState<{ key: string; items?: OnlineItem[]; error?: boolean; loading?: boolean } | null>(null);
  const key = `${date.getMonth() + 1}-${date.getDate()}`;
  const current = state?.key === key ? state : null;

  const load = async () => {
    setState({ key, loading: true });
    try {
      const items = await fetchOnThisDay(date.getMonth() + 1, date.getDate());
      setState({ key, items });
    } catch {
      setState({ key, error: true });
    }
  };

  return (
    <section className="no-print mb-6">
      {!current && (
        <Button onClick={load} disabled={!online}>
          🌐 More from Wikipedia{!online ? ' (needs internet)' : ''}
        </Button>
      )}
      {current?.loading && <p className="text-xl">Loading…</p>}
      {current?.error && <p className="text-xl">Sorry, extra items are not available right now.</p>}
      {current?.items && (
        <>
          <h2 className="text-2xl font-bold">More from Wikipedia</h2>
          <p className="mt-0 text-muted">Filtered to leave out upsetting events. Staff should read them first.</p>
          <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2">
            {current.items.slice(0, 10).map((i) => (
              <li key={`${i.year}-${i.text}`} className="rounded-3xl border-2 border-line bg-surface p-5">
                <p className="m-0 text-lg font-bold text-primary">{i.year}</p>
                <p className="m-0 text-xl">{i.text}</p>
              </li>
            ))}
          </ul>
          {current.items.length === 0 && <p className="text-xl">Nothing extra for this date.</p>}
        </>
      )}
    </section>
  );
}

function BirthYear({ year, name, avoid }: { year: number; name: string; avoid: string[] }) {
  const born = itemsForYear(year, avoid);
  const milestones = [10, 18, 21, 30]
    .map((age) => ({ age, year: year + age, items: itemsForYear(year + age, avoid) }))
    .filter((m) => m.items.length > 0);
  const growingUp = [decadeOf(year + 8), decadeOf(year + 18)].filter((d, i, arr) => d && arr.indexOf(d) === i);

  return (
    <div>
      <section className="mb-6 rounded-3xl border-2 border-line bg-surface p-6 text-center">
        <p className="m-0 text-xl text-muted">{name} was born in</p>
        <p className="m-0 text-6xl font-bold">{year}</p>
        <p className="mb-0 mt-2 text-xl">That's {new Date().getFullYear() - year} years ago.</p>
      </section>
      {born.length > 0 && (
        <section className="mb-6">
          <h2 className="text-2xl font-bold">Also in {year}</h2>
          <SimpleList items={born.map((b) => b.text)} />
        </section>
      )}
      {milestones.map((m) => (
        <section key={m.age} className="mb-6">
          <h2 className="text-2xl font-bold">
            When {name} was {m.age} ({m.year})
          </h2>
          <SimpleList items={m.items.map((b) => b.text)} />
        </section>
      ))}
      {growingUp.map(
        (d) =>
          d && (
            <section key={d.title} className="mb-6">
              <h2 className="text-2xl font-bold">Growing up in {d.title}</h2>
              <SimpleList items={d.memories} />
            </section>
          ),
      )}
    </div>
  );
}

function SimpleList({ items }: { items: string[] }) {
  return (
    <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-3 rounded-3xl border-2 border-line bg-surface p-4 text-xl">
          <span className="flex-1">{t}</span>
          <SpeakButton text={t} />
        </li>
      ))}
    </ul>
  );
}
