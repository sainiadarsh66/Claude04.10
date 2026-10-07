import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, emptyResident, sessionsForResident } from '../db/db';
import { Button, Field, PageTitle, Toggle, inputClass } from '../components/ui';
import { useToast } from '../components/Toast';
import { ENGAGEMENT } from '../components/LogSessionDialog';
import { resizeImage } from '../lib/image';
import { useObjectUrl } from '../lib/useObjectUrl';
import { displayName, useActiveResident } from '../state/resident';
import type { CognitiveLevel, Mobility, Resident, ResidentPhoto } from '../types';

const COGNITIVE: { id: CognitiveLevel; label: string }[] = [
  { id: 'none', label: 'No memory concerns' },
  { id: 'mild', label: 'Mild' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'advanced', label: 'Advanced' },
];

const MOBILITY: { id: Mobility; label: string }[] = [
  { id: 'independent', label: 'Walks independently' },
  { id: 'aided', label: 'Walks with an aid' },
  { id: 'wheelchair', label: 'Wheelchair' },
  { id: 'bed', label: 'Cared for in bed' },
];

const AVOID_SUGGESTIONS = ['war', 'relationships', 'childhood', 'work', 'faith', 'food', 'christmas'];

export default function ResidentProfile() {
  const { id } = useParams();
  const isNew = id === 'new';
  const residentId = isNew ? undefined : Number(id);
  const stored = useLiveQuery(() => (residentId === undefined ? undefined : db.residents.get(residentId)), [residentId]);
  const [form, setForm] = useState<Resident>(emptyResident);
  const navigate = useNavigate();
  const toast = useToast();
  const { resident: active, setResidentId } = useActiveResident();

  useEffect(() => {
    if (stored) setForm(stored);
  }, [stored]);

  const set = <K extends keyof Resident>(key: K, value: Resident[K]) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const record = { ...form, name: form.name.trim(), updatedAt: Date.now() };
    if (isNew) {
      const newId = await db.residents.add({ ...record, createdAt: Date.now() });
      toast('Resident added');
      navigate(`/residents/${newId}`, { replace: true });
    } else {
      await db.residents.put(record);
      toast('Profile saved');
    }
  };

  const remove = async () => {
    if (residentId === undefined) return;
    if (!window.confirm(`Delete ${form.name} and all their photos and activity records from this device? This cannot be undone.`)) return;
    await db.transaction('rw', db.residents, db.photos, db.sessions, async () => {
      await db.photos.where('residentId').equals(residentId).delete();
      // Remove them from group records but keep the record for everyone else.
      const sessions = await db.sessions.where('participantIds').equals(residentId).toArray();
      for (const s of sessions) {
        const participants = s.participants.filter((p) => p.residentId !== residentId);
        if (participants.length === 0) await db.sessions.delete(s.id!);
        else
          await db.sessions.update(s.id!, {
            participants,
            participantIds: participants.map((p) => p.residentId),
          } as Partial<typeof s>);
      }
      await db.residents.delete(residentId);
    });
    if (active?.id === residentId) setResidentId(undefined);
    toast('Resident deleted');
    navigate('/residents');
  };

  if (!isNew && stored === undefined) return <p className="text-xl">Loading…</p>;

  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle>{isNew ? 'Add a resident' : displayName(form)}</PageTitle>
      <form onSubmit={save} className="space-y-6">
        <Section title="About them">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name *">
              <input required className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} />
            </Field>
            <Field label="Preferred name">
              <input className={inputClass} value={form.preferredName} onChange={(e) => set('preferredName', e.target.value)} />
            </Field>
            <Field label="Room">
              <input className={inputClass} value={form.room} onChange={(e) => set('room', e.target.value)} />
            </Field>
            <Field label="Year of birth" hint="Used for 'birth year' history">
              <input
                className={inputClass}
                inputMode="numeric"
                value={form.birthYear ?? ''}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                  set('birthYear', v ? Number(v) : undefined);
                }}
              />
            </Field>
          </div>
        </Section>

        <Section title="Life story and interests">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Past job or occupation" value={form.occupation} onChange={(v) => set('occupation', v)} />
            <TextField label="Hobbies" value={form.hobbies} onChange={(v) => set('hobbies', v)} />
            <TextField label="Favourite music or era" value={form.favouriteMusic} onChange={(v) => set('favouriteMusic', v)} />
            <TextField label="Faith or culture" value={form.faith} onChange={(v) => set('faith', v)} />
            <TextField label="Likes" value={form.likes} onChange={(v) => set('likes', v)} />
            <TextField label="Dislikes" value={form.dislikes} onChange={(v) => set('dislikes', v)} />
          </div>
        </Section>

        <Section title="Topics to avoid">
          <p className="mt-0 text-muted">Activities and history items on these topics are hidden while you are with this resident.</p>
          <div className="flex flex-wrap gap-2">
            {[...new Set([...AVOID_SUGGESTIONS, ...form.avoidTopics])].map((t) => {
              const on = form.avoidTopics.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={on}
                  onClick={() => set('avoidTopics', on ? form.avoidTopics.filter((x) => x !== t) : [...form.avoidTopics, t])}
                  className={`rounded-2xl border-2 px-4 py-2 text-lg font-bold capitalize ${on ? 'border-primary bg-primary text-on-primary' : 'border-line bg-surface'}`}
                >
                  {on ? '✓ ' : ''}
                  {t}
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="Care needs">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Memory and thinking" hint="Sets the starting level for games">
              <select className={inputClass} value={form.cognitive} onChange={(e) => set('cognitive', e.target.value as CognitiveLevel)}>
                {COGNITIVE.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Mobility">
              <select className={inputClass} value={form.mobility} onChange={(e) => set('mobility', e.target.value as Mobility)}>
                {MOBILITY.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <TextField label="Communication needs" value={form.communication} onChange={(v) => set('communication', v)} />
            <TextField label="Sight and hearing" value={form.sensory} onChange={(v) => set('sensory', v)} />
          </div>
        </Section>

        <Section title="Consent">
          <Toggle
            label="Photo consent recorded"
            description="Photos can be stored on this device and used in activities"
            checked={form.photoConsent}
            onChange={(v) => set('photoConsent', v)}
          />
        </Section>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" variant="primary">
            {isNew ? 'Add resident' : 'Save profile'}
          </Button>
          {!isNew && (
            <Button
              variant="accent"
              onClick={() => {
                setResidentId(residentId);
                navigate('/');
              }}
            >
              ▶ Start activities
            </Button>
          )}
        </div>
      </form>

      {!isNew && residentId !== undefined && stored && (
        <>
          {stored.photoConsent && <Photos residentId={residentId} />}
          <History residentId={residentId} />
          <div className="mt-10 border-t-2 border-line pt-6">
            <Button onClick={remove}>🗑️ Delete resident and their data</Button>
          </div>
        </>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-3xl border-2 border-line bg-surface p-5">
      <legend className="px-2 text-2xl font-bold">{title}</legend>
      {children}
    </fieldset>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <input className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

function Photos({ residentId }: { residentId: number }) {
  const photos = useLiveQuery(() => db.photos.where('residentId').equals(residentId).sortBy('createdAt'), [residentId]);
  const [caption, setCaption] = useState('');
  const [busy, setBusy] = useState(false);

  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    for (const f of Array.from(files)) {
      const blob = await resizeImage(f);
      await db.photos.add({ residentId, caption: caption.trim(), blob, createdAt: Date.now() });
    }
    setCaption('');
    setBusy(false);
  };

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold">Life-story photos</h2>
      <p className="mt-0 text-muted">Used in "My Life Story" and personal jigsaws. Stored only on this tablet.</p>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="min-w-64 flex-1">
          <Field label="Caption for the next photo">
            <input className={inputClass} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Wedding day, 1960" />
          </Field>
        </div>
        <label className="touch inline-flex min-h-16 cursor-pointer items-center rounded-2xl border-2 border-primary bg-primary px-5 text-lg font-bold text-on-primary">
          {busy ? 'Adding…' : '📷 Add photos'}
          <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => add(e.target.files)} />
        </label>
      </div>
      <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-3">
        {photos?.map((p) => (
          <PhotoItem key={p.id} photo={p} />
        ))}
      </ul>
    </section>
  );
}

function PhotoItem({ photo }: { photo: ResidentPhoto }) {
  const url = useObjectUrl(photo.blob);
  return (
    <li className="overflow-hidden rounded-2xl border-2 border-line bg-surface">
      {url && <img src={url} alt={photo.caption || 'Photo'} className="aspect-[4/3] w-full object-cover" />}
      <div className="flex items-center gap-2 p-2">
        <span className="flex-1 text-lg">{photo.caption || 'No caption'}</span>
        <Button variant="ghost" aria-label="Remove photo" onClick={() => db.photos.delete(photo.id!)}>
          🗑️
        </Button>
      </div>
    </li>
  );
}

function History({ residentId }: { residentId: number }) {
  const sessions = useLiveQuery(() => sessionsForResident(residentId), [residentId]);
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold">Recent activities</h2>
      {sessions?.length === 0 && <p className="text-xl">No activities recorded yet.</p>}
      <ul className="m-0 list-none space-y-2 p-0">
        {sessions?.slice(0, 20).map((s) => {
          const p = s.participants.find((x) => x.residentId === residentId);
          const e = ENGAGEMENT.find((x) => x.value === p?.engagement);
          return (
            <li key={s.id} className="flex items-center gap-3 rounded-2xl border-2 border-line bg-surface p-3 text-lg">
              <span aria-label={e?.label} className="text-3xl">
                {e?.emoji}
              </span>
              <span className="flex-1">
                <strong>{s.activityTitle}</strong>
                <span className="block text-muted">
                  {new Date(s.startedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                  {s.note ? ` · ${s.note}` : ''}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
