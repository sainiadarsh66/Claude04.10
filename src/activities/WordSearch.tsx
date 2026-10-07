import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ActivityShell } from '../components/ActivityShell';
import { Celebration } from '../components/Celebration';
import { Button } from '../components/ui';
import { activityById } from '../data/catalog';
import { themeById } from '../data/wordlists';
import { DIRECTIONS, generateWordSearch, lineBetween, sameCells, type Vector } from '../lib/wordsearch';
import { shuffle, seededRandom } from '../lib/random';
import { chime } from '../lib/speech';
import { useSettings } from '../state/settings';
import type { Difficulty } from '../types';
import { NotFound } from '../pages/NotFound';

const LEVELS: Record<Difficulty, { size: number; words: number; maxLen: number; vectors: Vector[] }> = {
  sensory: { size: 6, words: 3, maxLen: 5, vectors: DIRECTIONS.across },
  easy: { size: 8, words: 5, maxLen: 7, vectors: DIRECTIONS.across },
  medium: { size: 10, words: 7, maxLen: 9, vectors: [...DIRECTIONS.across, ...DIRECTIONS.down] },
  challenging: { size: 12, words: 10, maxLen: 10, vectors: [...DIRECTIONS.across, ...DIRECTIONS.down, ...DIRECTIONS.diagonal] },
};

const FOUND_COLOURS = ['#b7e4c7', '#ffd6a5', '#bde0fe', '#ffc8dd', '#e2ece9', '#fdffb6', '#cdb4db', '#caffbf', '#a0c4ff', '#ffadad'];

export default function WordSearchActivity() {
  const { theme: themeId = '' } = useParams();
  const theme = themeById(themeId);
  const activity = activityById(`wordsearch-${themeId}`);
  if (!theme || !activity) return <NotFound />;
  return (
    <ActivityShell activityId={activity.id} title={activity.title} emoji={theme.emoji} tips={activity.staffTips}>
      {({ difficulty, restart, finish }) => (
        <WordSearchGame words={theme.words.map((w) => w.word)} difficulty={difficulty} onAgain={restart} onFinish={finish} />
      )}
    </ActivityShell>
  );
}

export function WordSearchGame({
  words,
  difficulty,
  onAgain,
  onFinish,
}: {
  words: string[];
  difficulty: Difficulty;
  onAgain: () => void;
  onFinish: () => void;
}) {
  const { settings } = useSettings();
  const level = LEVELS[difficulty];
  const [seed] = useState(() => Math.floor(Math.random() * 1e9));
  const puzzle = useMemo(() => {
    const pool = shuffle(
      words.filter((w) => w.length <= Math.min(level.maxLen, level.size)),
      seededRandom(seed),
    ).slice(0, level.words);
    return generateWordSearch(pool, level.size, level.vectors, seed);
  }, [words, level, seed]);

  const [found, setFound] = useState<string[]>([]);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [message, setMessage] = useState('Tap the first letter of a word, then the last letter.');

  const complete = found.length === puzzle.words.length && puzzle.words.length > 0;

  const cellColour = new Map<string, string>();
  puzzle.words.forEach((w, i) => {
    if (found.includes(w.word)) w.cells.forEach(([r, c]) => cellColour.set(`${r},${c}`, FOUND_COLOURS[i % FOUND_COLOURS.length]));
  });
  const hintCell = hint ? puzzle.words.find((w) => w.word === hint)?.cells[0].join(',') : undefined;

  const tap = (r: number, c: number) => {
    if (!start) {
      setStart([r, c]);
      setMessage('Now tap the last letter of the word.');
      return;
    }
    if (start[0] === r && start[1] === c) {
      setStart(null);
      setMessage('Tap the first letter of a word, then the last letter.');
      return;
    }
    const line = lineBetween(start, [r, c]);
    const match = line && puzzle.words.find((w) => !found.includes(w.word) && sameCells(w.cells, line));
    setStart(null);
    if (match) {
      setFound((f) => [...f, match.word]);
      setHint(null);
      setMessage(`You found ${match.word}!`);
      if (settings.sounds) chime('soft');
    } else {
      setMessage('Nearly! Have another look, or tap Hint.');
    }
  };

  const giveHint = () => {
    const next = puzzle.words.find((w) => !found.includes(w.word));
    if (next) {
      setHint(next.word);
      setMessage(`Look for ${next.word}. Its first letter is glowing.`);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
      <div>
        {complete ? (
          <Celebration detail="You found every word." onAgain={onAgain} onFinish={onFinish} />
        ) : (
          <p aria-live="polite" className="mt-0 rounded-3xl border-2 border-line bg-hint p-4 text-2xl font-bold">
            {message}
          </p>
        )}
        <div
          role="grid"
          aria-label="Word search grid"
          className="mx-auto grid select-none gap-1"
          style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))`, maxWidth: `min(100%, ${puzzle.size * 4.4}rem)` }}
        >
          {puzzle.grid.map((row, r) => (
            <div role="row" key={r} className="contents">
            {row.map((ch, c) => {
              const k = `${r},${c}`;
              const colour = cellColour.get(k);
              const isStart = start && start[0] === r && start[1] === c;
              return (
                <button
                  key={k}
                  type="button"
                  role="gridcell"
                  aria-label={`${ch}, row ${r + 1}, column ${c + 1}`}
                  onClick={() => tap(r, c)}
                  style={{ minWidth: 0, minHeight: 0, background: colour, color: colour ? '#1f2a2c' : undefined }}
                  className={`aspect-square rounded-lg border-2 p-0 text-[clamp(1.1rem,3.6vw,2.2rem)] font-bold ${
                    isStart ? 'border-focus bg-cell-active' : k === hintCell ? 'border-focus bg-accent text-on-accent' : 'border-line bg-cell text-ink'
                  }`}
                >
                  {ch}
                </button>
              );
            })}
            </div>
          ))}
        </div>
        {!complete && (
          <div className="mt-4 flex justify-center">
            <Button onClick={giveHint}>💡 Hint</Button>
          </div>
        )}
      </div>
      <section>
        <h2 className="mt-0 text-2xl font-bold">
          Words to find ({found.length} of {puzzle.words.length})
        </h2>
        <ul className="m-0 list-none space-y-2 p-0">
          {puzzle.words.map((w, i) => (
            <li
              key={w.word}
              className="rounded-2xl border-2 border-line px-4 py-2 text-2xl font-bold tracking-wide"
              style={found.includes(w.word) ? { background: FOUND_COLOURS[i % FOUND_COLOURS.length], color: '#1f2a2c' } : undefined}
            >
              {found.includes(w.word) ? '✓ ' : ''}
              {w.word}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
