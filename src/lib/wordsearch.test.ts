import { DIRECTIONS, generateWordSearch, lineBetween, sameCells } from './wordsearch';

describe('generateWordSearch', () => {
  it('places every word along its cells', () => {
    const words = ['ROSE', 'DAISY', 'TULIP', 'SPADE', 'HEDGE'];
    const ws = generateWordSearch(words, 8, DIRECTIONS.across, 7);
    expect(ws.words.map((w) => w.word).sort()).toEqual([...words].sort());
    for (const w of ws.words) {
      expect(w.cells.map(([r, c]) => ws.grid[r][c]).join('')).toBe(w.word);
      // Across only: every word sits on one row, left to right.
      expect(new Set(w.cells.map(([r]) => r)).size).toBe(1);
    }
    expect(ws.grid.flat().every((ch) => /^[A-Z]$/.test(ch))).toBe(true);
  });

  it('drops words that cannot fit', () => {
    const ws = generateWordSearch(['GREENHOUSE', 'BEE'], 6, DIRECTIONS.across, 1);
    expect(ws.words.map((w) => w.word)).toEqual(['BEE']);
  });
});

describe('lineBetween', () => {
  it('returns straight and diagonal lines', () => {
    expect(lineBetween([0, 0], [0, 3])).toHaveLength(4);
    expect(lineBetween([3, 3], [0, 0])).toEqual([[3, 3], [2, 2], [1, 1], [0, 0]]);
    expect(lineBetween([0, 0], [1, 3])).toBeNull();
  });

  it('matches a word selected in either direction', () => {
    const cells: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    expect(sameCells(cells, [[0, 2], [0, 1], [0, 0]])).toBe(true);
    expect(sameCells(cells, [[0, 0], [0, 1]])).toBe(false);
  });
});
