import type { Activity, CategoryId, StaffTips } from '../types';
import { WORD_THEMES } from './wordlists';
import { QUIZZES } from './quizzes';
import { MEMORY_BOXES, MATCH_SETS } from './reminiscence';
import { SONGS } from './songs';
import { SCENES } from './scenes';

export interface Category {
  id: CategoryId;
  title: string;
  emoji: string;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { id: 'history', title: 'Today in History', emoji: '📅', blurb: 'What happened on this day' },
  { id: 'word-games', title: 'Word Games', emoji: '🔤', blurb: 'Crosswords and word searches' },
  { id: 'puzzles', title: 'Puzzles', emoji: '🧩', blurb: 'Jigsaws and matching pairs' },
  { id: 'quizzes', title: 'Quizzes', emoji: '❓', blurb: 'Big-button trivia for one or many' },
  { id: 'reminiscence', title: 'Reminiscence', emoji: '📷', blurb: 'Memory boxes and life stories' },
  { id: 'music', title: 'Music & Singing', emoji: '🎵', blurb: 'Singalong with large lyrics' },
];

const crosswordTips: StaffTips = {
  introduce: 'Sit side by side so you can both see the screen. Read each clue aloud and let the resident answer before typing.',
  prompts: ['Does this word remind you of anything?', 'Shall we try the next one together?'],
  adaptations: [
    'Choose "Simple" or "Easy" to show more letters in the grid.',
    'Use "Show a letter" freely: the aim is enjoyment, not testing.',
    'Let the resident tap the letters if they can, or say them for you to type.',
  ],
};

const wordSearchTips: StaffTips = {
  introduce: 'Tell the resident which word you are looking for and trace the rows with your finger together.',
  prompts: ['Can you see the first letter anywhere?', 'Talk about each word once you find it.'],
  adaptations: ['"Simple" uses fewer words, written left to right only.', 'Tap the first letter, then the last letter, to mark a word.', 'Use "Hint" to light up the first letter.'],
};

export function buildCatalog(): Activity[] {
  const list: Activity[] = [];

  list.push({
    id: 'history-today',
    title: 'Today in History',
    category: 'history',
    path: '/play/history',
    emoji: '📅',
    summary: 'Events, birthdays and celebrations for today, with talking points.',
    minutes: 15,
    group: 'either',
    energy: 'either',
    bedFriendly: true,
    tags: ['history', 'conversation'],
    staffTips: {
      introduce: 'Start with the date and the season. Read one item aloud at a time and pause for comments.',
      prompts: ['Do you remember this?', 'Where were you living then?', 'What else was happening in your life around that time?'],
      adaptations: ['Pick one or two items rather than reading everything.', 'Use "Birth year" to look at the year the resident was born.', 'Tap the speaker button to have it read aloud.'],
    },
  });

  for (const t of WORD_THEMES) {
    list.push({
      id: `crossword-${t.id}`,
      title: `Crossword: ${t.title}`,
      category: 'word-games',
      path: `/play/crossword/${t.id}`,
      emoji: t.emoji,
      summary: `A friendly crossword about ${t.title.toLowerCase()}.`,
      minutes: 15,
      group: 'either',
      energy: 'stimulating',
      bedFriendly: true,
      tags: ['crossword', ...t.tags],
      staffTips: { ...crosswordTips, prompts: [...t.prompts, ...crosswordTips.prompts] },
    });
    list.push({
      id: `wordsearch-${t.id}`,
      title: `Word Search: ${t.title}`,
      category: 'word-games',
      path: `/play/wordsearch/${t.id}`,
      emoji: t.emoji,
      summary: `Find the hidden words about ${t.title.toLowerCase()}.`,
      minutes: 15,
      group: 'one-to-one',
      energy: 'calming',
      bedFriendly: true,
      tags: ['wordsearch', ...t.tags],
      staffTips: { ...wordSearchTips, prompts: [...t.prompts, ...wordSearchTips.prompts] },
    });
  }

  for (const s of SCENES) {
    list.push({
      id: `jigsaw-${s.id}`,
      title: `Jigsaw: ${s.title}`,
      category: 'puzzles',
      path: `/play/jigsaw/${s.id}`,
      emoji: '🧩',
      summary: 'Drag the pieces into place. They gently snap when they are close.',
      minutes: 15,
      group: 'one-to-one',
      energy: 'calming',
      bedFriendly: true,
      tags: ['jigsaw'],
      staffTips: {
        introduce: 'Look at the whole picture together first and talk about what you can see.',
        prompts: ['What can you see in this picture?', 'Does it remind you of anywhere?'],
        adaptations: ['"Simple" uses 4 large pieces.', 'Pieces snap into place when they are close, so precision is not needed.', 'Use the resident\'s own photos from their profile for a personal jigsaw.'],
      },
    });
  }
  list.push({
    id: 'jigsaw-photo',
    title: 'Jigsaw: Your Own Photo',
    category: 'puzzles',
    path: '/play/jigsaw/photo',
    emoji: '🖼️',
    summary: 'Make a jigsaw from a photo in the resident\'s life-story gallery.',
    minutes: 15,
    group: 'one-to-one',
    energy: 'calming',
    bedFriendly: true,
    tags: ['jigsaw', 'personal'],
    staffTips: {
      introduce: 'Choose a familiar photo, such as family, a pet or a favourite place.',
      prompts: ['Who is in this picture?', 'When was this taken?'],
      adaptations: ['Only photos with consent recorded on the profile are shown.'],
    },
  });

  for (const m of MATCH_SETS) {
    list.push({
      id: `match-${m.id}`,
      title: `Matching Pairs: ${m.title}`,
      category: 'puzzles',
      path: `/play/match/${m.id}`,
      emoji: m.emoji,
      summary: 'Turn over the cards to find the pairs.',
      minutes: 5,
      group: 'one-to-one',
      energy: 'either',
      bedFriendly: true,
      tags: ['memory', 'matching'],
      staffTips: {
        introduce: 'Explain that each picture has a twin hiding somewhere. Turn over two cards at a time.',
        prompts: ['Do you remember where you saw that one?', 'What does this picture make you think of?'],
        adaptations: ['"Simple" shows all the pictures face up: just tap two that match.', 'There is no time limit and no score.'],
      },
    });
  }

  for (const q of QUIZZES) {
    list.push({
      id: `quiz-${q.id}`,
      title: `Quiz: ${q.title}`,
      category: 'quizzes',
      path: `/play/quiz/${q.id}`,
      emoji: q.emoji,
      summary: `${q.questions.length} questions with large answer buttons.`,
      minutes: 15,
      group: 'either',
      energy: 'stimulating',
      bedFriendly: true,
      tags: ['quiz', ...q.tags],
      staffTips: {
        introduce: 'Read each question aloud. In a group, use Quiz-master mode and let everyone call out answers.',
        prompts: ['Why do you think that?', 'Does anyone have a story about this?'],
        adaptations: ['"Simple" and "Easy" give fewer choices.', 'Every answer gets a friendly response. The right answer is shown, never a "wrong".', 'Share the fact after each question to start a chat.'],
      },
    });
  }

  for (const b of MEMORY_BOXES) {
    list.push({
      id: `memories-${b.id}`,
      title: `Memory Box: ${b.title}`,
      category: 'reminiscence',
      path: `/play/memories/${b.id}`,
      emoji: b.emoji,
      summary: b.intro,
      minutes: 30,
      group: 'either',
      energy: 'calming',
      bedFriendly: true,
      tags: ['reminiscence', ...b.tags],
      staffTips: {
        introduce: 'Go at the resident\'s pace. One card can be a whole conversation.',
        prompts: b.cards.slice(0, 2).map((c) => c.prompt),
        adaptations: ['Follow their lead: if a topic is upsetting, move on gently.', 'Write any lovely stories in the session note afterwards.'],
      },
    });
  }
  list.push({
    id: 'memories-life-story',
    title: 'My Life Story',
    category: 'reminiscence',
    path: '/play/life-story',
    emoji: '📖',
    summary: 'Look through the resident\'s own photos and life history.',
    minutes: 30,
    group: 'one-to-one',
    energy: 'calming',
    bedFriendly: true,
    tags: ['reminiscence', 'personal'],
    staffTips: {
      introduce: 'Choose the resident first, then browse their photos and life history together.',
      prompts: ['Tell me about this picture.', 'What was a typical day like then?'],
      adaptations: ['Add new photos from the resident\'s profile (consent needed).'],
    },
  });

  for (const s of SONGS) {
    list.push({
      id: `song-${s.id}`,
      title: s.title,
      category: 'music',
      path: `/play/sing/${s.id}`,
      emoji: s.emoji,
      summary: `${s.era}. ${s.about}`,
      minutes: 5,
      group: 'either',
      energy: s.tags.includes('hymn') ? 'calming' : 'stimulating',
      bedFriendly: true,
      tags: ['music', 'singing', ...s.tags],
      staffTips: {
        introduce: 'Start humming the tune. Many residents will join in before the words appear.',
        prompts: ['Where did you used to sing this?', 'Do you know any other verses?'],
        adaptations: ['Use the big arrows to move line by line, or turn on auto-scroll.', 'Clap or tap along to the beat.', 'Play a recording on your music service if you have one.'],
      },
    });
  }

  return list;
}

export const ACTIVITIES = buildCatalog();

export function activityById(id: string) {
  return ACTIVITIES.find((a) => a.id === id);
}

export function activityByPath(path: string) {
  return ACTIVITIES.find((a) => a.path === path);
}

export function activitiesIn(category: CategoryId) {
  return ACTIVITIES.filter((a) => a.category === category);
}
