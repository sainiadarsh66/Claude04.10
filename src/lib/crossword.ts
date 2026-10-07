import { seededRandom, shuffle } from './random';

export interface ClueWord {
  word: string;
  clue: string;
}

export type Direction = 'across' | 'down';

export interface CrosswordEntry {
  number: number;
  word: string;
  clue: string;
  row: number;
  col: number;
  dir: Direction;
}

export interface Crossword {
  rows: number;
  cols: number;
  /** Solution letters; null for blocked squares. */
  grid: (string | null)[][];
  /** Clue number shown in the corner of a square, if any. */
  numbers: (number | null)[][];
  entries: CrosswordEntry[];
}

interface Placement {
  word: string;
  clue: string;
  row: number;
  col: number;
  dir: Direction;
}

const SIZE = 40;

/**
 * Builds a compact crossword from a word list. Words that can't be linked into
 * the grid are left out, so the result may hold fewer words than were given.
 */
export function generateCrossword(words: ClueWord[], maxWords: number, seed = Date.now()): Crossword {
  const rand = seededRandom(seed);
  const clean = dedupe(words)
    .map((w) => ({ ...w, word: w.word.toUpperCase().replace(/[^A-Z]/g, '') }))
    .filter((w) => w.word.length >= 2);

  let best: Placement[] = [];
  let bestScore = -Infinity;
  for (let attempt = 0; attempt < 30; attempt++) {
    const pool = shuffle(clean, rand).slice(0, Math.max(maxWords * 2, maxWords + 4));
    // Long words first give the grid a spine to hang others from.
    pool.sort((a, b) => b.word.length - a.word.length + (rand() - 0.5) * 2);
    const placed = build(pool, maxWords, rand);
    const score = placed.length * 100 - area(placed);
    if (score > bestScore) {
      best = placed;
      bestScore = score;
    }
    if (best.length >= maxWords && attempt > 8) break;
  }
  return finalise(best);
}

function dedupe(words: ClueWord[]) {
  const seen = new Set<string>();
  return words.filter((w) => {
    const k = w.word.toUpperCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function build(pool: ClueWord[], maxWords: number, rand: () => number): Placement[] {
  const grid: (string | null)[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  const dirs: Set<Direction>[][] = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => new Set()));
  const placed: Placement[] = [];

  const put = (p: Placement) => {
    for (let i = 0; i < p.word.length; i++) {
      const r = p.row + (p.dir === 'down' ? i : 0);
      const c = p.col + (p.dir === 'across' ? i : 0);
      grid[r][c] = p.word[i];
      dirs[r][c].add(p.dir);
    }
    placed.push(p);
  };

  const [first, ...rest] = pool;
  if (!first) return placed;
  put({ ...first, row: Math.floor(SIZE / 2), col: Math.floor((SIZE - first.word.length) / 2), dir: 'across' });

  for (const cand of rest) {
    if (placed.length >= maxWords) break;
    const options: { p: Placement; crossings: number }[] = [];
    for (const other of placed) {
      for (let i = 0; i < other.word.length; i++) {
        for (let j = 0; j < cand.word.length; j++) {
          if (other.word[i] !== cand.word[j]) continue;
          const dir: Direction = other.dir === 'across' ? 'down' : 'across';
          const r = other.row + (other.dir === 'down' ? i : 0) - (dir === 'down' ? j : 0);
          const c = other.col + (other.dir === 'across' ? i : 0) - (dir === 'across' ? j : 0);
          const crossings = fits(grid, dirs, cand.word, r, c, dir);
          if (crossings > 0) options.push({ p: { ...cand, row: r, col: c, dir }, crossings });
        }
      }
    }
    if (options.length === 0) continue;
    const top = Math.max(...options.map((o) => o.crossings));
    const bestOptions = options.filter((o) => o.crossings === top);
    put(bestOptions[Math.floor(rand() * bestOptions.length)].p);
  }
  return placed;
}

/** Returns the number of crossings if the word fits legally, or 0 if it doesn't. */
function fits(
  grid: (string | null)[][],
  dirs: Set<Direction>[][],
  word: string,
  row: number,
  col: number,
  dir: Direction,
): number {
  const dr = dir === 'down' ? 1 : 0;
  const dc = dir === 'across' ? 1 : 0;
  const endR = row + dr * (word.length - 1);
  const endC = col + dc * (word.length - 1);
  if (row < 1 || col < 1 || endR >= SIZE - 1 || endC >= SIZE - 1) return 0;
  // The squares just before and after the word must be empty.
  if (grid[row - dr][col - dc] !== null) return 0;
  if (grid[endR + dr][endC + dc] !== null) return 0;

  let crossings = 0;
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    const cell = grid[r][c];
    if (cell === null) {
      // A new letter must not touch other letters side-on.
      const n1 = grid[r + dc][c + dr];
      const n2 = grid[r - dc][c - dr];
      if (n1 !== null || n2 !== null) return 0;
    } else {
      if (cell !== word[i] || dirs[r][c].has(dir)) return 0;
      crossings++;
    }
  }
  return crossings;
}

function area(placed: Placement[]) {
  const b = bounds(placed);
  return (b.maxR - b.minR + 1) * (b.maxC - b.minC + 1);
}

function bounds(placed: Placement[]) {
  let minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity;
  for (const p of placed) {
    const endR = p.row + (p.dir === 'down' ? p.word.length - 1 : 0);
    const endC = p.col + (p.dir === 'across' ? p.word.length - 1 : 0);
    minR = Math.min(minR, p.row);
    minC = Math.min(minC, p.col);
    maxR = Math.max(maxR, endR);
    maxC = Math.max(maxC, endC);
  }
  return { minR, minC, maxR, maxC };
}

function finalise(placed: Placement[]): Crossword {
  if (placed.length === 0) return { rows: 0, cols: 0, grid: [], numbers: [], entries: [] };
  const b = bounds(placed);
  const rows = b.maxR - b.minR + 1;
  const cols = b.maxC - b.minC + 1;
  const grid: (string | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  const shifted = placed.map((p) => ({ ...p, row: p.row - b.minR, col: p.col - b.minC }));
  for (const p of shifted) {
    for (let i = 0; i < p.word.length; i++) {
      grid[p.row + (p.dir === 'down' ? i : 0)][p.col + (p.dir === 'across' ? i : 0)] = p.word[i];
    }
  }

  // Number squares in reading order, the usual crossword convention.
  const numbers: (number | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  const starts = new Map<string, number>();
  let n = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (shifted.some((p) => p.row === r && p.col === c)) {
        numbers[r][c] = ++n;
        starts.set(`${r},${c}`, n);
      }
    }
  }
  const entries = shifted
    .map((p) => ({ ...p, number: starts.get(`${p.row},${p.col}`)! }))
    .sort((a, b) => (a.dir === b.dir ? a.number - b.number : a.dir === 'across' ? -1 : 1));
  return { rows, cols, grid, numbers, entries };
}

export function entryCells(e: Pick<CrosswordEntry, 'row' | 'col' | 'dir' | 'word'>): [number, number][] {
  return Array.from({ length: e.word.length }, (_, i) => [
    e.row + (e.dir === 'down' ? i : 0),
    e.col + (e.dir === 'across' ? i : 0),
  ]);
}
