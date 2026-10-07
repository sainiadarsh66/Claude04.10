import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ActivityShell } from '../components/ActivityShell';
import { Button, Segmented, Toggle } from '../components/ui';
import { activityById } from '../data/catalog';
import { songById } from '../data/songs';
import { NotFound } from '../pages/NotFound';

const SPEEDS = { slow: 6000, medium: 4500, quick: 3200 } as const;
type Speed = keyof typeof SPEEDS;

export default function SingalongActivity() {
  const { song: songId = '' } = useParams();
  const song = songById(songId);
  const activity = activityById(`song-${songId}`);
  if (!song || !activity) return <NotFound />;
  return (
    <ActivityShell activityId={activity.id} title={song.title} emoji={song.emoji} tips={activity.staffTips} withDifficulty={false}>
      {() => <Lyrics sections={song.sections} about={`${song.era}. ${song.about}`} />}
    </ActivityShell>
  );
}

export function Lyrics({ sections, about }: { sections: { label: string; lines: string[] }[]; about: string }) {
  const lines = useMemo(() => sections.flatMap((s) => s.lines.map((text, i) => ({ text, label: i === 0 ? s.label : undefined }))), [sections]);
  const [view, setView] = useState<'line' | 'all'>('line');
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(false);
  const [speed, setSpeed] = useState<Speed>('slow');

  useEffect(() => {
    if (!auto || view !== 'line') return;
    if (index >= lines.length - 1) {
      setAuto(false);
      return;
    }
    const t = window.setTimeout(() => setIndex((i) => i + 1), SPEEDS[speed]);
    return () => window.clearTimeout(t);
  }, [auto, index, lines.length, speed, view]);

  return (
    <div className="mx-auto max-w-5xl">
      <p className="mt-0 text-xl text-muted">{about}</p>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Segmented
          label="Lyrics view"
          value={view}
          options={[
            { id: 'line', label: 'Line by line' },
            { id: 'all', label: 'Whole song' },
          ]}
          onChange={setView}
        />
      </div>

      {view === 'all' ? (
        <div className="space-y-6 rounded-3xl border-2 border-line bg-surface p-6">
          {sections.map((s) => (
            <section key={s.label}>
              <h2 className="mt-0 text-xl font-bold uppercase tracking-wide text-muted">{s.label}</h2>
              {s.lines.map((l) => (
                <p key={l} className="my-1 text-[clamp(1.5rem,3vw,2.2rem)] leading-snug">
                  {l}
                </p>
              ))}
            </section>
          ))}
        </div>
      ) : (
        <>
          <div className="flex min-h-[22rem] flex-col justify-center gap-4 rounded-3xl border-2 border-line bg-surface p-6 text-center" aria-live="polite">
            {lines[index].label && <p className="m-0 text-xl font-bold uppercase tracking-wide text-muted">{lines[index].label}</p>}
            {index > 0 && <p className="m-0 text-2xl text-muted">{lines[index - 1].text}</p>}
            <p className="m-0 text-[clamp(2rem,5vw,3.6rem)] font-bold leading-tight">{lines[index].text}</p>
            {index < lines.length - 1 && <p className="m-0 text-2xl text-muted">{lines[index + 1].text}</p>}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <Button className="min-w-32" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
              ◀ Back
            </Button>
            <span className="text-xl font-bold">
              Line {index + 1} of {lines.length}
            </span>
            {index < lines.length - 1 ? (
              <Button className="min-w-32" variant="primary" onClick={() => setIndex((i) => i + 1)}>
                Next ▶
              </Button>
            ) : (
              <Button className="min-w-32" variant="primary" onClick={() => setIndex(0)}>
                Sing again
              </Button>
            )}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <Toggle label="Auto-scroll" description="Moves to the next line on its own" checked={auto} onChange={setAuto} />
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-lg font-bold">Speed:</span>
              <Segmented
                label="Speed"
                value={speed}
                options={[
                  { id: 'slow', label: 'Slow' },
                  { id: 'medium', label: 'Medium' },
                  { id: 'quick', label: 'Quick' },
                ]}
                onChange={setSpeed}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
