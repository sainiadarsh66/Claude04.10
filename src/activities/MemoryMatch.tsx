import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ActivityShell } from '../components/ActivityShell';
import { Celebration } from '../components/Celebration';
import { activityById } from '../data/catalog';
import { MATCH_SETS } from '../data/reminiscence';
import { shuffle } from '../lib/random';
import { chime } from '../lib/speech';
import { useSettings } from '../state/settings';
import type { Difficulty } from '../types';
import { NotFound } from '../pages/NotFound';

const LEVELS: Record<Difficulty, { pairs: number; faceUp: boolean; cols: number }> = {
  sensory: { pairs: 3, faceUp: true, cols: 3 },
  easy: { pairs: 3, faceUp: false, cols: 3 },
  medium: { pairs: 6, faceUp: false, cols: 4 },
  challenging: { pairs: 8, faceUp: false, cols: 4 },
};

export default function MemoryMatchActivity() {
  const { set: setId = '' } = useParams();
  const set = MATCH_SETS.find((s) => s.id === setId);
  const activity = activityById(`match-${setId}`);
  if (!set || !activity) return <NotFound />;
  return (
    <ActivityShell activityId={activity.id} title={activity.title} emoji={set.emoji} tips={activity.staffTips}>
      {({ difficulty, restart, finish }) => (
        <MatchGame items={set.items} difficulty={difficulty} onAgain={restart} onFinish={finish} />
      )}
    </ActivityShell>
  );
}

export function MatchGame({
  items,
  difficulty,
  onAgain,
  onFinish,
}: {
  items: string[];
  difficulty: Difficulty;
  onAgain: () => void;
  onFinish: () => void;
}) {
  const { settings } = useSettings();
  const level = LEVELS[difficulty];
  const cards = useMemo(() => {
    const chosen = shuffle(items).slice(0, level.pairs);
    return shuffle([...chosen, ...chosen].map((emoji, i) => ({ id: i, emoji })));
  }, [items, level.pairs]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState(level.faceUp ? 'Tap two pictures that are the same.' : 'Tap two cards to turn them over.');

  const complete = matched.size === level.pairs;

  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open.map((i) => cards[i]);
    if (a.emoji === b.emoji) {
      setMatched((m) => new Set(m).add(a.emoji));
      setOpen([]);
      setMessage('A pair! Well spotted.');
      if (settings.sounds) chime('soft');
      return;
    }
    setMessage('Not a pair this time. Have another look.');
    const t = window.setTimeout(() => setOpen([]), level.faceUp ? 600 : 1400);
    return () => window.clearTimeout(t);
  }, [open, cards, level.faceUp, settings.sounds]);

  const flip = (i: number) => {
    if (open.length === 2 || open.includes(i) || matched.has(cards[i].emoji)) return;
    setOpen((o) => [...o, i]);
  };

  if (complete) return <Celebration detail="You found all the pairs." onAgain={onAgain} onFinish={onFinish} />;

  return (
    <div>
      <p aria-live="polite" className="mt-0 rounded-3xl border-2 border-line bg-hint p-4 text-2xl font-bold">
        {message}
      </p>
      <div className="mx-auto grid max-w-3xl gap-3" style={{ gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))` }}>
        {cards.map((card, i) => {
          const isMatched = matched.has(card.emoji);
          const visible = level.faceUp || isMatched || open.includes(i);
          return (
            <button
              key={card.id}
              type="button"
              aria-label={visible ? `Card showing ${card.emoji}${isMatched ? ', matched' : ''}` : 'Face-down card'}
              disabled={isMatched}
              onClick={() => flip(i)}
              className={`aspect-square rounded-3xl border-4 text-[clamp(2.5rem,9vw,5rem)] shadow-md transition-transform ${
                isMatched
                  ? 'border-success bg-success-bg opacity-70'
                  : open.includes(i)
                    ? 'border-focus bg-cell-active'
                    : visible
                      ? 'border-line bg-surface'
                      : 'border-primary bg-primary text-on-primary'
              }`}
            >
              {visible ? card.emoji : <span aria-hidden className="text-[0.6em]">❀</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
