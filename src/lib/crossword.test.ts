import { entryCells, generateCrossword } from './crossword';
import { WORD_THEMES } from '../data/wordlists';

describe('generateCrossword', () => {
  it('is reproducible with the same seed', () => {
    const a = generateCrossword(WORD_THEMES[0].words, 7, 42);
    const b = generateCrossword(WORD_THEMES[0].words, 7, 42);
    expect(a).toEqual(b);
  });

  for (const theme of WORD_THEMES) {
    it(`builds a valid grid for "${theme.title}"`, () => {
      for (const seed of [1, 2, 3]) {
        const cw = generateCrossword(theme.words, 10, seed);
        expect(cw.entries.length).toBeGreaterThanOrEqual(7);

        // Every entry's letters agree with the grid.
        for (const e of cw.entries) {
          entryCells(e).forEach(([r, c], i) => expect(cw.grid[r][c]).toBe(e.word[i]));
          expect(cw.numbers[e.row][e.col]).toBe(e.number);
        }

        // Every run of two or more letters in the grid is a real entry,
        // so there are no accidental nonsense words.
        const runs = new Set<string>();
        for (let r = 0; r < cw.rows; r++) {
          for (let c = 0; c < cw.cols; c++) {
            if (cw.grid[r][c] === null) continue;
            if ((c === 0 || cw.grid[r][c - 1] === null) && cw.grid[r][c + 1]) runs.add(`${r},${c},across`);
            if ((r === 0 || cw.grid[r - 1][c] === null) && cw.grid[r + 1]?.[c]) runs.add(`${r},${c},down`);
          }
        }
        const starts = new Set(cw.entries.map((e) => `${e.row},${e.col},${e.dir}`));
        expect(runs).toEqual(starts);

        // All words are connected (one crossing graph).
        const seen = new Set([0]);
        const queue = [0];
        const cellsOf = cw.entries.map((e) => new Set(entryCells(e).map((x) => x.join(','))));
        while (queue.length) {
          const i = queue.shift()!;
          cw.entries.forEach((_, j) => {
            if (!seen.has(j) && [...cellsOf[i]].some((k) => cellsOf[j].has(k))) {
              seen.add(j);
              queue.push(j);
            }
          });
        }
        expect(seen.size).toBe(cw.entries.length);
      }
    });
  }

  it('respects the maximum word count', () => {
    expect(generateCrossword(WORD_THEMES[1].words, 3, 9).entries).toHaveLength(3);
  });
});
