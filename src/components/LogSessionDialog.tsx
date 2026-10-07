import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, saveSession } from '../db/db';
import { displayName, useActiveResident } from '../state/resident';
import { useSettings } from '../state/settings';
import type { Engagement, Mood } from '../types';
import { Button, Field, Modal, inputClass } from './ui';

export const ENGAGEMENT: { value: Engagement; emoji: string; label: string }[] = [
  { value: 1, emoji: '😴', label: 'Not engaged' },
  { value: 2, emoji: '😐', label: 'A little' },
  { value: 3, emoji: '🙂', label: 'Engaged' },
  { value: 4, emoji: '😊', label: 'Very engaged' },
  { value: 5, emoji: '🤩', label: 'Loved it' },
];

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: 'low', emoji: '☹️', label: 'Low' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'good', emoji: '😀', label: 'Good' },
];

/**
 * Quick record of who took part and how it went.
 * Common case is three taps: Finish → smiley → Save.
 */
export function LogSessionDialog({
  open,
  activityId,
  activityTitle,
  startedAt,
  onClose,
  onSaved,
}: {
  open: boolean;
  activityId: string;
  activityTitle: string;
  startedAt: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { resident } = useActiveResident();
  const { settings } = useSettings();
  const residents = useLiveQuery(() => db.residents.orderBy('name').toArray(), []);
  const [selected, setSelected] = useState<number[]>([]);
  const [engagement, setEngagement] = useState<Engagement | undefined>();
  const [moodBefore, setMoodBefore] = useState<Mood | undefined>();
  const [moodAfter, setMoodAfter] = useState<Mood | undefined>();
  const [note, setNote] = useState('');
  const [more, setMore] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setSelected(resident?.id !== undefined ? [resident.id] : []);
      setEngagement(undefined);
      setMoodBefore(undefined);
      setMoodAfter(undefined);
      setNote('');
      setMore(false);
    }
  }, [open, resident?.id]);

  const minutes = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
  const canSave = selected.length > 0 && engagement !== undefined && !saving;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    await saveSession({
      activityId,
      activityTitle,
      startedAt,
      endedAt: Date.now(),
      staffName: settings.staffName,
      participants: selected.map((residentId) => ({ residentId, engagement: engagement!, moodBefore, moodAfter })),
      note: note.trim(),
    });
    setSaving(false);
    onSaved();
  };

  const toggle = (id: number) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <Modal open={open} title="How did it go?" onClose={onClose}>
      <p className="mt-0 text-muted">
        {activityTitle} · about {minutes} min
      </p>

      <fieldset className="mb-5 border-0 p-0">
        <legend className="mb-2 text-lg font-bold">Who took part?</legend>
        <div className="flex flex-wrap gap-2">
          {residents?.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={selected.includes(r.id!)}
              onClick={() => toggle(r.id!)}
              className={`rounded-2xl border-2 px-4 py-2 text-lg font-bold ${
                selected.includes(r.id!) ? 'border-primary bg-primary text-on-primary' : 'border-line bg-surface'
              }`}
            >
              {selected.includes(r.id!) ? '✓ ' : ''}
              {displayName(r)}
            </button>
          ))}
        </div>
        {residents?.length === 0 && <p>Add residents first to record sessions.</p>}
      </fieldset>

      <fieldset className="mb-5 border-0 p-0">
        <legend className="mb-2 text-lg font-bold">How engaged were they?</legend>
        <div className="grid grid-cols-5 gap-2">
          {ENGAGEMENT.map((e) => (
            <button
              key={e.value}
              type="button"
              aria-pressed={engagement === e.value}
              aria-label={e.label}
              onClick={() => setEngagement(e.value)}
              className={`flex flex-col items-center rounded-2xl border-2 p-2 ${
                engagement === e.value ? 'border-primary bg-cell-active' : 'border-line bg-surface'
              }`}
            >
              <span aria-hidden className="text-4xl">{e.emoji}</span>
              <span className="text-sm font-bold leading-tight">{e.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {!more ? (
        <Button variant="ghost" className="mb-4 underline" onClick={() => setMore(true)}>
          Add mood or a note (optional)
        </Button>
      ) : (
        <div className="mb-5 space-y-4">
          <MoodRow label="Mood before" value={moodBefore} onChange={setMoodBefore} />
          <MoodRow label="Mood after" value={moodAfter} onChange={setMoodAfter} />
          <Field label="Note">
            <textarea
              className={`${inputClass} min-h-28`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything worth remembering, e.g. a story they told"
            />
          </Field>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button variant="primary" className="flex-1" disabled={!canSave} onClick={save}>
          Save
        </Button>
        <Button onClick={onClose}>Not now</Button>
      </div>
    </Modal>
  );
}

function MoodRow({ label, value, onChange }: { label: string; value?: Mood; onChange: (m: Mood) => void }) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 text-lg font-bold">{label}</legend>
      <div className="flex gap-2">
        {MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            aria-pressed={value === m.value}
            onClick={() => onChange(m.value)}
            className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-2 text-lg font-bold ${
              value === m.value ? 'border-primary bg-cell-active' : 'border-line bg-surface'
            }`}
          >
            <span aria-hidden className="text-2xl">{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
