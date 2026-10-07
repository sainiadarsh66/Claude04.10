import { ACTIVITIES, CATEGORIES } from './catalog';
import { QUIZZES } from './quizzes';
import { WORD_THEMES } from './wordlists';
import { SONGS } from './songs';
import { MEMORY_BOXES, MATCH_SETS } from './reminiscence';

describe('content library', () => {
  it('offers at least 50 activities with unique ids and paths', () => {
    expect(ACTIVITIES.length).toBeGreaterThanOrEqual(50);
    expect(new Set(ACTIVITIES.map((a) => a.id)).size).toBe(ACTIVITIES.length);
    expect(new Set(ACTIVITIES.map((a) => a.path)).size).toBe(ACTIVITIES.length);
  });

  it('gives every activity a category and staff tips', () => {
    const ids = new Set(CATEGORIES.map((c) => c.id));
    for (const a of ACTIVITIES) {
      expect(ids.has(a.category)).toBe(true);
      expect(a.staffTips.introduce.length).toBeGreaterThan(10);
      expect(a.staffTips.prompts.length).toBeGreaterThan(0);
    }
  });

  it('has well-formed quizzes', () => {
    for (const quiz of QUIZZES) {
      expect(quiz.questions.length).toBeGreaterThanOrEqual(10);
      for (const q of quiz.questions) {
        expect(new Set(q.options).size, q.question).toBe(4);
      }
    }
  });

  it('has clean word lists with clues', () => {
    for (const t of WORD_THEMES) {
      expect(t.words.length).toBeGreaterThanOrEqual(12);
      for (const w of t.words) {
        expect(w.word).toMatch(/^[A-Z]{3,10}$/);
        expect(w.clue.length).toBeGreaterThan(3);
      }
    }
  });

  it('has songs, memory boxes and picture sets', () => {
    expect(SONGS.every((s) => s.sections.every((sec) => sec.lines.length > 0))).toBe(true);
    expect(MEMORY_BOXES.every((b) => b.cards.length >= 4)).toBe(true);
    expect(MATCH_SETS.every((m) => new Set(m.items).size >= 8)).toBe(true);
  });
});
