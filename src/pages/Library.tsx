import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTitle, Segmented, Toggle, inputClass } from '../components/ui';
import { ACTIVITIES, CATEGORIES } from '../data/catalog';
import { useActiveResident } from '../state/resident';
import { suitableFor } from '../lib/suitability';
import { groupLabel } from './CategoryPage';

type GroupFilter = 'any' | 'one-to-one' | 'group';
type TimeFilter = 'any' | '5' | '15' | '30';
type EnergyFilter = 'any' | 'calming' | 'stimulating';

export default function Library() {
  const { resident } = useActiveResident();
  const [q, setQ] = useState('');
  const [group, setGroup] = useState<GroupFilter>('any');
  const [time, setTime] = useState<TimeFilter>('any');
  const [energy, setEnergy] = useState<EnergyFilter>('any');
  const [bed, setBed] = useState(false);

  const results = useMemo(() => {
    const needle = q.toLowerCase().trim();
    return ACTIVITIES.filter((a) => suitableFor(a, resident))
      .filter((a) => !needle || `${a.title} ${a.summary} ${a.tags.join(' ')}`.toLowerCase().includes(needle))
      .filter((a) => group === 'any' || a.group === group || a.group === 'either')
      .filter((a) => time === 'any' || a.minutes <= Number(time))
      .filter((a) => energy === 'any' || a.energy === energy || a.energy === 'either')
      .filter((a) => !bed || a.bedFriendly);
  }, [q, group, time, energy, bed, resident]);

  return (
    <div>
      <PageTitle>🔎 All activities</PageTitle>
      <div className="mb-6 space-y-4 rounded-3xl border-2 border-line bg-surface p-5">
        <label className="block">
          <span className="sr-only">Search activities</span>
          <input
            type="search"
            className={inputClass}
            placeholder="Search, e.g. garden, quiz, Christmas"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <FilterRow label="Who">
          <Segmented<GroupFilter>
            label="Group size"
            value={group}
            onChange={setGroup}
            options={[
              { id: 'any', label: 'Anyone' },
              { id: 'one-to-one', label: 'One-to-one' },
              { id: 'group', label: 'Group' },
            ]}
          />
        </FilterRow>
        <FilterRow label="Time">
          <Segmented<TimeFilter>
            label="Time available"
            value={time}
            onChange={setTime}
            options={[
              { id: 'any', label: 'Any' },
              { id: '5', label: '5 min' },
              { id: '15', label: '15 min' },
              { id: '30', label: '30 min' },
            ]}
          />
        </FilterRow>
        <FilterRow label="Mood">
          <Segmented<EnergyFilter>
            label="Mood"
            value={energy}
            onChange={setEnergy}
            options={[
              { id: 'any', label: 'Any' },
              { id: 'calming', label: 'Calming' },
              { id: 'stimulating', label: 'Lively' },
            ]}
          />
        </FilterRow>
        <Toggle label="Suitable in bed" checked={bed} onChange={setBed} />
      </div>

      <p className="text-xl font-bold" aria-live="polite">
        {results.length} {results.length === 1 ? 'activity' : 'activities'}
      </p>
      <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2">
        {results.map((a) => (
          <li key={a.id}>
            <Link
              to={a.path}
              className="touch flex min-h-24 items-center gap-4 rounded-3xl border-2 border-line bg-surface p-4 text-ink no-underline"
            >
              <span aria-hidden className="text-5xl">
                {a.emoji}
              </span>
              <span className="flex-1">
                <span className="block text-xl font-bold">{a.title}</span>
                <span className="block text-base text-muted">
                  {CATEGORIES.find((c) => c.id === a.category)?.title} · {a.minutes} min · {groupLabel(a.group)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-20 text-lg font-bold">{label}</span>
      {children}
    </div>
  );
}
