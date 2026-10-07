import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ActivityShell } from '../components/ActivityShell';
import { Celebration } from '../components/Celebration';
import { Button, SpeakButton } from '../components/ui';
import { activityById } from '../data/catalog';
import { themeById } from '../data/wordlists';
import { entryCells, generateCrossword, type Crossword as CW } from '../lib/crossword';
import { seededRandom } from '../lib/random';
import { useSettings } from '../state/settings';
import { chime } from '../lib/speech';
import type { Difficulty } from '../types';
import { NotFound } from '../pages/NotFound';

const LEVELS: Record<Difficulty, { words: number; reveal: number; firstLetters: boolean }> = {
  sensory: { words: 3, reveal: 0.6, firstLetters: true },
  easy: { words: 5, reveal: 0.3, firstLetters: true },
  medium: { words: 7, reveal: 0, firstLetters: true },
  challenging: { words: 10, reveal: 0, firstLetters: false },
};

const KEYS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

export default function CrosswordActivity() {
  const { theme: themeId = '' } = useParams();
  const theme = themeById(themeId);
  const activity = activityById(`crossword-${themeId}`);
  if (!theme || !activity) return <NotFound />;
  return (
    <ActivityShell activityId={activity.id} title={activity.title} emoji={theme.emoji} tips={activity.staffTips}>
      {({ difficulty, restart, finish }) => (
        <CrosswordGame words={theme.words} difficulty={difficulty} onAgain={restart} onFinish={finish} />
      )}
    </ActivityShell>
  );
}

export function CrosswordGame({
  words,
  difficulty,
  seed: seedProp,
  onAgain,
  onFinish,
}: {
  words: { word: string; clue: string }[];
  difficulty: Difficulty;
  seed?: number;
  onAgain: () => void;
  onFinish: () => void;
}) {
  const { settings } = useSettings();
  const level = LEVELS[difficulty];
  const [seed] = useState(() => seedProp ?? Math.floor(Math.random() * 1e9));
  const puzzle = useMemo(() => generateCrossword(words, level.words, seed), [words, level.words, seed]);
  const given = useMemo(() => givenCells(puzzle, level.reveal, level.firstLetters, seed), [puzzle, level, seed]);

  const [letters, setLetters] = useState<Record<string, string>>(() => ({ ...given }));
  const [active, setActive] = useState(0);
  const [cursor, setCursor] = useState(0);

  const entry = puzzle.entries[active];
  const cells = useMemo(() => (entry ? entryCells(entry) : []), [entry]);
  const isSolved = (e: (typeof puzzle.entries)[number]) => entryCells(e).every(([r, c], i) => letters[`${r},${c}`] === e.word[i]);
  const solvedCount = puzzle.entries.filter(isSolved).length;
  const complete = puzzle.entries.length > 0 && solvedCount === puzzle.entries.length;

  // Soft chime when a word is completed.
  const [lastSolved, setLastSolved] = useState(0);
  useEffect(() => {
    if (solvedCount > lastSolved && settings.sounds && !complete) chime('soft');
    setLastSolved(solvedCount);
  }, [solvedCount]); // eslint-disable-line react-hooks/exhaustive-deps

  const select = (index: number, pos = 0) => {
    setActive(index);
    const e = puzzle.entries[index];
    // Jump to the first empty square so typing carries on naturally.
    const ec = entryCells(e);
    const firstEmpty = ec.findIndex(([r, c]) => !letters[`${r},${c}`]);
    setCursor(pos || (firstEmpty === -1 ? 0 : firstEmpty));
  };

  const tapCell = (r: number, c: number) => {
    const matches = puzzle.entries
      .map((e, i) => ({ i, pos: entryCells(e).findIndex(([rr, cc]) => rr === r && cc === c) }))
      .filter((m) => m.pos !== -1);
    if (matches.length === 0) return;
    const current = matches.find((m) => m.i === active);
    // Tapping the same square again switches between across and down.
    const next = current && cells[cursor]?.[0] === r && cells[cursor]?.[1] === c ? matches.find((m) => m.i !== active) ?? current : current ?? matches[0];
    setActive(next.i);
    setCursor(next.pos);
  };

  const advance = useCallback(
    (from: number) => {
      for (let i = from + 1; i < cells.length; i++) {
        const [r, c] = cells[i];
        if (!given[`${r},${c}`]) return i;
      }
      return Math.min(from + 1, cells.length - 1);
    },
    [cells, given],
  );

  const type = useCallback(
    (ch: string) => {
      if (!cells[cursor]) return;
      const [r, c] = cells[cursor];
      const k = `${r},${c}`;
      if (given[k]) {
        setCursor(advance(cursor));
        return;
      }
      setLetters((l) => ({ ...l, [k]: ch }));
      setCursor(advance(cursor));
    },
    [cells, cursor, given, advance],
  );

  const erase = useCallback(() => {
    if (!cells[cursor]) return;
    const [r, c] = cells[cursor];
    const k = `${r},${c}`;
    if (letters[k] && !given[k]) {
      setLetters((l) => {
        const n = { ...l };
        delete n[k];
        return n;
      });
    } else {
      setCursor(Math.max(0, cursor - 1));
    }
  }, [cells, cursor, letters, given]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (/^[a-z]$/i.test(e.key)) type(e.key.toUpperCase());
      else if (e.key === 'Backspace') erase();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [type, erase]);

  const showLetter = () => {
    const pos = cells.findIndex(([r, c], i) => letters[`${r},${c}`] !== entry.word[i]);
    if (pos === -1) return;
    const [r, c] = cells[pos];
    setLetters((l) => ({ ...l, [`${r},${c}`]: entry.word[pos] }));
    setCursor(advance(pos));
  };

  const showWord = () => {
    setLetters((l) => {
      const n = { ...l };
      cells.forEach(([r, c], i) => (n[`${r},${c}`] = entry.word[i]));
      return n;
    });
  };

  if (puzzle.entries.length === 0) return <p>Sorry, this crossword could not be made. Please try another.</p>;

  const activeKeys = new Set(cells.map(([r, c]) => `${r},${c}`));
  const cursorKey = cells[cursor] ? cells[cursor].join(',') : '';

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
      <div>
        {complete ? (
          <Celebration detail="You finished the crossword." onAgain={onAgain} onFinish={onFinish} />
        ) : (
          <div className="mb-4 rounded-3xl border-2 border-line bg-hint p-4" aria-live="polite">
            <div className="flex items-center gap-3">
              <p className="m-0 flex-1 text-2xl font-bold">
                {entry.number} {entry.dir}: {entry.clue}{' '}
                <span className="font-normal text-muted">({entry.word.length} letters)</span>
              </p>
              <SpeakButton text={`${entry.number} ${entry.dir}. ${entry.clue}. ${entry.word.length} letters.`} />
            </div>
          </div>
        )}

        <div
          role="grid"
          aria-label="Crossword grid"
          className="mx-auto grid select-none gap-1"
          style={{
            gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))`,
            maxWidth: `min(100%, ${puzzle.cols * 4.2}rem)`,
          }}
        >
          {puzzle.grid.map((row, r) => (
            <div role="row" key={r} className="contents">
            {row.map((sol, c) => {
              const k = `${r},${c}`;
              if (sol === null) return <div key={k} role="presentation" className="aspect-square" />;
              const num = puzzle.numbers[r][c];
              const isCursor = k === cursorKey;
              const inWord = activeKeys.has(k);
              const correct = puzzle.entries.some((e) => isSolved(e) && entryCells(e).some(([rr, cc]) => rr === r && cc === c));
              return (
                <button
                  key={k}
                  type="button"
                  role="gridcell"
                  aria-label={`Row ${r + 1}, column ${c + 1}${letters[k] ? `, ${letters[k]}` : ', empty'}`}
                  onClick={() => tapCell(r, c)}
                  style={{ minWidth: 0, minHeight: 0 }}
                  className={`relative aspect-square rounded-md border-2 p-0 text-[clamp(1rem,3.4vw,2rem)] font-bold leading-none ${
                    isCursor ? 'border-focus bg-cell-active' : inWord ? 'border-primary bg-cell-word' : 'border-line bg-cell'
                  } ${correct ? 'text-success' : 'text-ink'}`}
                >
                  {num && <span className="absolute left-0.5 top-0 text-[0.55em] font-bold leading-none text-muted">{num}</span>}
                  {letters[k] ?? ''}
                </button>
              );
            })}
            </div>
          ))}
        </div>

        {!complete && (
          <>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button onClick={showLetter}>💡 Show a letter</Button>
              <Button onClick={showWord}>Show the word</Button>
            </div>
            <div className="mt-4 space-y-2" aria-label="Letter keyboard">
              {KEYS.map((row, i) => (
                <div key={row} className="flex justify-center gap-1.5">
                  {row.split('').map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => type(ch)}
                      style={{ minWidth: 0 }}
                      className="h-16 flex-1 basis-0 rounded-xl border-2 border-line bg-surface text-2xl font-bold sm:max-w-16"
                    >
                      {ch}
                    </button>
                  ))}
                  {i === 2 && (
                    <button
                      type="button"
                      onClick={erase}
                      aria-label="Delete letter"
                      className="h-16 rounded-xl border-2 border-line bg-surface-2 px-3 text-xl font-bold"
                    >
                      ⌫
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="space-y-5">
        {(['across', 'down'] as const).map((dir) => (
          <section key={dir}>
            <h2 className="mt-0 text-2xl font-bold capitalize">{dir}</h2>
            <ol className="m-0 list-none space-y-2 p-0">
              {puzzle.entries.map((e, i) =>
                e.dir !== dir ? null : (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => select(i)}
                      className={`w-full rounded-2xl border-2 px-4 py-2 text-left text-lg ${
                        i === active ? 'border-primary bg-cell-word font-bold' : 'border-line bg-surface'
                      } ${isSolved(e) ? 'text-success' : ''}`}
                    >
                      {isSolved(e) ? '✓ ' : ''}
                      <strong>{e.number}.</strong> {e.clue} ({e.word.length})
                    </button>
                  </li>
                ),
              )}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

function givenCells(puzzle: CW, reveal: number, firstLetters: boolean, seed: number) {
  const rand = seededRandom(seed + 1);
  const out: Record<string, string> = {};
  for (const e of puzzle.entries) {
    entryCells(e).forEach(([r, c], i) => {
      if ((firstLetters && i === 0) || rand() < reveal) out[`${r},${c}`] = e.word[i];
    });
  }
  // Every word keeps at least one square to fill in.
  for (const e of puzzle.entries) {
    const cells = entryCells(e);
    if (cells.every(([r, c]) => out[`${r},${c}`])) {
      const [r, c] = cells[cells.length - 1];
      delete out[`${r},${c}`];
    }
  }
  return out;
}
