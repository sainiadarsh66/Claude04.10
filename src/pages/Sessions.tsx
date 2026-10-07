import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { Button, PageTitle } from '../components/ui';
import { ENGAGEMENT } from '../components/LogSessionDialog';
import { displayName } from '../state/resident';

export default function Sessions() {
  const sessions = useLiveQuery(() => db.sessions.orderBy('startedAt').reverse().limit(200).toArray(), []);
  const residents = useLiveQuery(() => db.residents.toArray(), []);
  const names = new Map(residents?.map((r) => [r.id!, displayName(r)]));

  const exportCsv = () => {
    if (!sessions) return;
    const rows = [['Date', 'Activity', 'Resident', 'Engagement (1-5)', 'Mood before', 'Mood after', 'Minutes', 'Staff', 'Note']];
    for (const s of sessions) {
      for (const p of s.participants) {
        rows.push([
          new Date(s.startedAt).toISOString(),
          s.activityTitle,
          names.get(p.residentId) ?? `#${p.residentId}`,
          String(p.engagement),
          p.moodBefore ?? '',
          p.moodAfter ?? '',
          String(Math.max(1, Math.round((s.endedAt - s.startedAt) / 60000))),
          s.staffName,
          s.note,
        ]);
      }
    }
    const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageTitle>📝 Activity log</PageTitle>
        <Button onClick={exportCsv} disabled={!sessions?.length}>
          ⬇️ Export CSV
        </Button>
      </div>
      {sessions?.length === 0 && <p className="text-xl">No activities recorded yet. Tap "Finish" at the end of an activity to record it.</p>}
      <ul className="m-0 list-none space-y-3 p-0">
        {sessions?.map((s) => (
          <li key={s.id} className="rounded-3xl border-2 border-line bg-surface p-4">
            <p className="m-0 text-xl font-bold">{s.activityTitle}</p>
            <p className="m-0 text-lg text-muted">
              {new Date(s.startedAt).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })} ·{' '}
              {Math.max(1, Math.round((s.endedAt - s.startedAt) / 60000))} min
              {s.staffName ? ` · ${s.staffName}` : ''}
            </p>
            <p className="m-0 mt-1 text-lg">
              {s.participants
                .map((p) => `${ENGAGEMENT.find((e) => e.value === p.engagement)?.emoji ?? ''} ${names.get(p.residentId) ?? 'Removed resident'}`)
                .join('   ')}
            </p>
            {s.note && <p className="m-0 mt-1 text-lg italic">“{s.note}”</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
