export interface Song {
  id: string;
  title: string;
  era: string;
  emoji: string;
  tags: string[];
  about: string;
  sections: { label: string; lines: string[] }[];
}

/**
 * Lyrics here are traditional or long out of copyright (public domain in the UK).
 * Add newer songs only with a licence to display the words.
 */
export const SONGS: Song[] = [
  {
    id: 'daisy-bell',
    title: 'Daisy Bell (A Bicycle Made for Two)',
    era: '1892',
    emoji: '🚲',
    tags: ['music-hall'],
    about: 'A music hall favourite by Harry Dacre.',
    sections: [
      {
        label: 'Chorus',
        lines: [
          'Daisy, Daisy, give me your answer, do,',
          "I'm half crazy, all for the love of you.",
          "It won't be a stylish marriage,",
          "I can't afford a carriage,",
          "But you'll look sweet upon the seat",
          'Of a bicycle made for two.',
        ],
      },
    ],
  },
  {
    id: 'seaside',
    title: 'I Do Like to Be Beside the Seaside',
    era: '1907',
    emoji: '🏖️',
    tags: ['music-hall', 'seaside'],
    about: 'Written by John Glover-Kind and made famous by Mark Sheridan.',
    sections: [
      {
        label: 'Chorus',
        lines: [
          'Oh! I do like to be beside the seaside,',
          'I do like to be beside the sea!',
          'I do like to stroll along the prom, prom, prom,',
          'Where the brass bands play: tiddely-om-pom-pom!',
          'So just let me be beside the seaside,',
          "I'll be beside myself with glee,",
          "And there's lots of girls beside,",
          'I should like to be beside,',
          'Beside the seaside, beside the sea!',
        ],
      },
    ],
  },
  {
    id: 'tipperary',
    title: "It's a Long Way to Tipperary",
    era: '1912',
    emoji: '🎩',
    tags: ['music-hall', 'war'],
    about: 'A music hall song that became popular with soldiers in the First World War.',
    sections: [
      {
        label: 'Chorus',
        lines: [
          "It's a long way to Tipperary,",
          "It's a long way to go.",
          "It's a long way to Tipperary,",
          'To the sweetest girl I know!',
          'Goodbye, Piccadilly,',
          'Farewell, Leicester Square!',
          "It's a long, long way to Tipperary,",
          "But my heart's right there.",
        ],
      },
    ],
  },
  {
    id: 'pack-up',
    title: 'Pack Up Your Troubles',
    era: '1915',
    emoji: '🎒',
    tags: ['music-hall', 'war'],
    about: 'A cheerful marching song by George and Felix Powell.',
    sections: [
      {
        label: 'Chorus',
        lines: [
          'Pack up your troubles in your old kit-bag,',
          'And smile, smile, smile.',
          "While you've a lucifer to light your fag,",
          "Smile, boys, that's the style.",
          "What's the use of worrying?",
          'It never was worthwhile, so',
          'Pack up your troubles in your old kit-bag,',
          'And smile, smile, smile.',
        ],
      },
    ],
  },
  {
    id: 'molly-malone',
    title: 'Molly Malone',
    era: 'Traditional',
    emoji: '🐚',
    tags: ['irish', 'folk'],
    about: 'The unofficial anthem of Dublin.',
    sections: [
      {
        label: 'Verse',
        lines: [
          "In Dublin's fair city,",
          'Where the girls are so pretty,',
          'I first set my eyes on sweet Molly Malone,',
          'As she wheeled her wheelbarrow',
          'Through streets broad and narrow,',
          'Crying, "Cockles and mussels, alive, alive, oh!"',
        ],
      },
      {
        label: 'Chorus',
        lines: ['Alive, alive, oh,', 'Alive, alive, oh,', 'Crying, "Cockles and mussels, alive, alive, oh!"'],
      },
    ],
  },
  {
    id: 'my-bonnie',
    title: 'My Bonnie Lies Over the Ocean',
    era: 'Traditional',
    emoji: '🌊',
    tags: ['scottish', 'folk'],
    about: 'A traditional Scottish folk song.',
    sections: [
      {
        label: 'Verse',
        lines: [
          'My Bonnie lies over the ocean,',
          'My Bonnie lies over the sea,',
          'My Bonnie lies over the ocean,',
          'Oh, bring back my Bonnie to me.',
        ],
      },
      {
        label: 'Chorus',
        lines: ['Bring back, bring back,', 'Oh, bring back my Bonnie to me, to me.', 'Bring back, bring back,', 'Oh, bring back my Bonnie to me.'],
      },
    ],
  },
  {
    id: 'coming-round',
    title: "She'll Be Coming Round the Mountain",
    era: 'Traditional',
    emoji: '⛰️',
    tags: ['folk'],
    about: 'A lively call-and-response song. Add actions and sound effects!',
    sections: [
      {
        label: 'Verse 1',
        lines: [
          "She'll be coming round the mountain when she comes,",
          "She'll be coming round the mountain when she comes,",
          "She'll be coming round the mountain, she'll be coming round the mountain,",
          "She'll be coming round the mountain when she comes.",
        ],
      },
      {
        label: 'Verse 2',
        lines: [
          "She'll be driving six white horses when she comes,",
          "She'll be driving six white horses when she comes,",
          "She'll be driving six white horses, she'll be driving six white horses,",
          "She'll be driving six white horses when she comes.",
        ],
      },
      {
        label: 'Verse 3',
        lines: [
          "Oh, we'll all go out to meet her when she comes,",
          "Oh, we'll all go out to meet her when she comes,",
          "Oh, we'll all go out to meet her, we'll all go out to meet her,",
          "We'll all go out to meet her when she comes.",
        ],
      },
    ],
  },
  {
    id: 'danny-boy',
    title: 'Danny Boy',
    era: '1913',
    emoji: '🍀',
    tags: ['irish'],
    about: 'Words by Frederic Weatherly, sung to the "Londonderry Air".',
    sections: [
      {
        label: 'Verse',
        lines: [
          'Oh Danny boy, the pipes, the pipes are calling',
          'From glen to glen, and down the mountain side.',
          "The summer's gone, and all the roses falling,",
          "It's you, it's you must go and I must bide.",
          "But come ye back when summer's in the meadow,",
          "Or when the valley's hushed and white with snow,",
          "It's I'll be here in sunshine or in shadow,",
          'Oh Danny boy, oh Danny boy, I love you so!',
        ],
      },
    ],
  },
  {
    id: 'auld-lang-syne',
    title: 'Auld Lang Syne',
    era: '1788',
    emoji: '🎆',
    tags: ['scottish', 'celebrations'],
    about: 'Words by Robert Burns, sung at New Year all over the world.',
    sections: [
      {
        label: 'Verse',
        lines: [
          'Should auld acquaintance be forgot,',
          'And never brought to mind?',
          'Should auld acquaintance be forgot,',
          'And auld lang syne?',
        ],
      },
      {
        label: 'Chorus',
        lines: ['For auld lang syne, my dear,', 'For auld lang syne,', "We'll tak' a cup o' kindness yet,", 'For auld lang syne.'],
      },
    ],
  },
  {
    id: 'jerusalem',
    title: 'Jerusalem',
    era: '1916',
    emoji: '🏞️',
    tags: ['hymn', 'faith'],
    about: 'Words by William Blake, music by Hubert Parry.',
    sections: [
      {
        label: 'Verse 1',
        lines: [
          'And did those feet in ancient time',
          "Walk upon England's mountains green?",
          'And was the holy Lamb of God',
          "On England's pleasant pastures seen?",
          'And did the Countenance Divine',
          'Shine forth upon our clouded hills?',
          'And was Jerusalem builded here',
          'Among these dark Satanic mills?',
        ],
      },
      {
        label: 'Verse 2',
        lines: [
          'Bring me my bow of burning gold!',
          'Bring me my arrows of desire!',
          'Bring me my spear! O clouds, unfold!',
          'Bring me my chariot of fire!',
          'I will not cease from mental fight,',
          'Nor shall my sword sleep in my hand,',
          'Till we have built Jerusalem',
          "In England's green and pleasant land.",
        ],
      },
    ],
  },
  {
    id: 'amazing-grace',
    title: 'Amazing Grace',
    era: '1779',
    emoji: '🕊️',
    tags: ['hymn', 'faith'],
    about: 'Words by John Newton.',
    sections: [
      {
        label: 'Verse 1',
        lines: ['Amazing grace! How sweet the sound', 'That saved a wretch like me!', 'I once was lost, but now am found;', 'Was blind, but now I see.'],
      },
      {
        label: 'Verse 2',
        lines: ["'Twas grace that taught my heart to fear,", 'And grace my fears relieved;', 'How precious did that grace appear', 'The hour I first believed.'],
      },
    ],
  },
  {
    id: 'all-things-bright',
    title: 'All Things Bright and Beautiful',
    era: '1848',
    emoji: '🌼',
    tags: ['hymn', 'faith'],
    about: 'Words by Cecil Frances Alexander, a favourite school assembly hymn.',
    sections: [
      {
        label: 'Chorus',
        lines: ['All things bright and beautiful,', 'All creatures great and small,', 'All things wise and wonderful,', 'The Lord God made them all.'],
      },
      {
        label: 'Verse',
        lines: ['Each little flower that opens,', 'Each little bird that sings,', 'He made their glowing colours,', 'He made their tiny wings.'],
      },
    ],
  },
  {
    id: 'silent-night',
    title: 'Silent Night',
    era: '1818',
    emoji: '⭐',
    tags: ['christmas', 'faith'],
    about: 'A Christmas carol first sung in Austria.',
    sections: [
      {
        label: 'Verse',
        lines: [
          'Silent night, holy night,',
          'All is calm, all is bright',
          'Round yon virgin mother and child.',
          'Holy infant so tender and mild,',
          'Sleep in heavenly peace,',
          'Sleep in heavenly peace.',
        ],
      },
    ],
  },
  {
    id: 'jingle-bells',
    title: 'Jingle Bells',
    era: '1857',
    emoji: '🔔',
    tags: ['christmas'],
    about: 'Shake some bells along to this one!',
    sections: [
      {
        label: 'Chorus',
        lines: ['Jingle bells, jingle bells,', 'Jingle all the way!', 'Oh, what fun it is to ride', 'In a one-horse open sleigh, hey!', 'Jingle bells, jingle bells,', 'Jingle all the way!', 'Oh, what fun it is to ride', 'In a one-horse open sleigh!'],
      },
    ],
  },
];

export function songById(id: string) {
  return SONGS.find((s) => s.id === id);
}
