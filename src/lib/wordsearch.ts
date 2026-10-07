import { seededRandom, shuffle } from './random';

export type Vector = [number, number];

export interface PlacedWord {
  word: string;
  cells: [number, number][];
}

export interface WordSearch {
  size: number;
  grid: string[][];
  words: PlacedWord[];
}

export const DIRECTIONS: Record<'across' | 'down' | 'diagonal' | 'backwards', Vector[]> = {
  across: [[0, 1]],
  down: [[1, 0]],
  diagonal: [[1, 1], [-1, 1]],
  backwards: [[0, -1], [-1, 0], [-1, -1], [1, -1]],
};

// Letters that are easy to tell apart in large print; avoids I/J/Q/X/Z clutter.
const FILLER = 'AABCDEEEFGHIKLMNOOPRSSTTUWY';

export function generateWordSearch(
  words: string[],
  size: number,
  vectors: Vector[],
  seed = Date.now(),
): WordSearch {
  const rand = seededRandom(seed);
  const clean = [...new Set(words.map((w) => w.toUpperCase().replace(/[^A-Z]/g, '')))]
    .filter((w) => w.length >= 2 && w.length <= size)
    .sort((a, b) => b.length - a.length);

  const grid: (string | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  const placed: PlacedWord[] = [];

  for (const word of clean) {
    const spots: { cells: [number, number][]; overlap: number }[] = [];
    for (const [dr, dc] of vectors) {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const endR = r + dr * (word.length - 1);
          const endC = c + dc * (word.length - 1);
          if (endR < 0 || endR >= size || endC < 0 || endC >= size) continue;
          const cells: [number, number][] = [];
          let overlap = 0;
          let ok = true;
          for (let i = 0; i < word.length; i++) {
            const rr = r + dr * i;
            const cc = c + dc * i;
            const cur = grid[rr][cc];
            if (cur !== null && cur !== word[i]) {
              ok = false;
              break;
            }
            if (cur === word[i]) overlap++;
            cells.push([rr, cc]);
          }
          if (ok) spots.push({ cells, overlap });
        }
      }
    }
    if (spots.length === 0) continue;
    // Prefer spots without overlaps: shared letters make words harder to see.
    const minOverlap = Math.min(...spots.map((s) => s.overlap));
    const choices = shuffle(spots.filter((s) => s.overlap === minOverlap), rand);
    const spot = choices[0];
    spot.cells.forEach(([r, c], i) => (grid[r][c] = word[i]));
    placed.push({ word, cells: spot.cells });
  }

  const filled = grid.map((row) => row.map((ch) => ch ?? FILLER[Math.floor(rand() * FILLER.length)]));
  return { size, grid: filled, words: placed };
}

/**
 * The straight line of cells from a to b, or null if a and b don't line up
 * across, down or diagonally.
 */
export function lineBetween(a: [number, number], b: [number, number]): [number, number][] | null {
  const dr = b[0] - a[0];
  const dc = b[1] - a[1];
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
  const len = Math.max(Math.abs(dr), Math.abs(dc));
  const sr = Math.sign(dr);
  const sc = Math.sign(dc);
  return Array.from({ length: len + 1 }, (_, i) => [a[0] + sr * i, a[1] + sc * i]);
}

export function sameCells(x: [number, number][], y: [number, number][]) {
  if (x.length !== y.length) return false;
  const k = (cells: [number, number][]) => cells.map((c) => c.join(',')).join('|');
  return k(x) === k(y) || k(x) === k([...y].reverse());
}
