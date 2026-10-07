export interface QuizQuestion {
  question: string;
  /** The first option is always the correct answer; options are shuffled on screen. */
  options: [string, string, string, string];
  /** A friendly fact to share after answering, which helps start a conversation. */
  fact?: string;
  emoji?: string;
}

export interface QuizBank {
  id: string;
  title: string;
  emoji: string;
  tags: string[];
  questions: QuizQuestion[];
}

export const QUIZZES: QuizBank[] = [
  {
    id: 'general',
    title: 'General Knowledge',
    emoji: '💡',
    tags: [],
    questions: [
      { question: 'How many days are there in a leap year?', options: ['366', '365', '364', '360'], fact: 'February gets an extra day, the 29th.' },
      { question: 'What colour do you get by mixing blue and yellow?', options: ['Green', 'Purple', 'Orange', 'Brown'], emoji: '🎨' },
      { question: 'How many legs does a spider have?', options: ['Eight', 'Six', 'Ten', 'Four'], emoji: '🕷️' },
      { question: 'Which planet is known as the Red Planet?', options: ['Mars', 'Venus', 'Jupiter', 'Saturn'], emoji: '🪐' },
      { question: 'How many minutes are in an hour?', options: ['60', '100', '30', '45'], emoji: '⏰' },
      { question: 'What is frozen water called?', options: ['Ice', 'Steam', 'Dew', 'Mist'], emoji: '🧊' },
      { question: 'Which bird is famous for laying the largest eggs?', options: ['Ostrich', 'Swan', 'Eagle', 'Goose'], fact: 'An ostrich egg weighs about as much as two dozen hen eggs.' },
      { question: 'How many players are in a football team on the pitch?', options: ['Eleven', 'Nine', 'Fifteen', 'Seven'], emoji: '⚽' },
      { question: 'What do bees make?', options: ['Honey', 'Milk', 'Silk', 'Wax crayons'], emoji: '🐝' },
      { question: 'Which is the largest ocean on Earth?', options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], emoji: '🌊' },
      { question: 'How many sides does a triangle have?', options: ['Three', 'Four', 'Five', 'Six'], emoji: '🔺' },
      { question: 'Which month has the fewest days?', options: ['February', 'April', 'June', 'November'], emoji: '📅' },
    ],
  },
  {
    id: 'britain',
    title: 'Britain and the Royals',
    emoji: '👑',
    tags: ['royals', 'places'],
    questions: [
      { question: 'In what year was Queen Elizabeth II crowned?', options: ['1953', '1947', '1960', '1936'], fact: 'Many families bought or borrowed a television to watch the Coronation on 2 June 1953.' },
      { question: 'What is the name of the famous bell in the clock tower at Westminster?', options: ['Big Ben', 'Great Tom', 'Old Bailey', 'Little John'], emoji: '🕰️' },
      { question: 'Which flower is the national emblem of Scotland?', options: ['Thistle', 'Rose', 'Daffodil', 'Shamrock'] },
      { question: 'Which flower is a national emblem of Wales?', options: ['Daffodil', 'Thistle', 'Tulip', 'Poppy'], fact: 'The leek is a national emblem of Wales too.' },
      { question: 'Where does the King live in London?', options: ['Buckingham Palace', 'Windsor Castle', 'Balmoral', 'The Tower of London'], emoji: '🏰' },
      { question: 'What is the longest river in the United Kingdom?', options: ['Severn', 'Thames', 'Trent', 'Tay'], fact: 'The Severn runs for about 220 miles, from Wales to the Bristol Channel.' },
      { question: 'Which famous ship was Admiral Nelson\'s flagship at Trafalgar?', options: ['HMS Victory', 'HMS Belfast', 'The Mary Rose', 'The Cutty Sark'] },
      { question: 'In which city would you find the Angel of the North nearby?', options: ['Gateshead', 'Manchester', 'Glasgow', 'Bristol'] },
      { question: 'Who wrote "Romeo and Juliet"?', options: ['William Shakespeare', 'Charles Dickens', 'Jane Austen', 'Thomas Hardy'], emoji: '🎭' },
      { question: 'What is the capital city of Scotland?', options: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'] },
      { question: 'Which saint\'s day is celebrated on 23 April in England?', options: ['St George', 'St Andrew', 'St David', 'St Patrick'], emoji: '🐉' },
    ],
  },
  {
    id: 'screen',
    title: 'Stars of Stage and Screen',
    emoji: '🎬',
    tags: ['film', 'tv'],
    questions: [
      { question: 'In "The Wizard of Oz", what colour are Dorothy\'s slippers?', options: ['Ruby red', 'Silver', 'Gold', 'Emerald green'], fact: 'In the original book they were silver.' },
      { question: 'Which comedy duo had the catchphrase "Bring me sunshine"?', options: ['Morecambe and Wise', 'Laurel and Hardy', 'The Two Ronnies', 'Cannon and Ball'] },
      { question: 'Which actor first played James Bond in the films?', options: ['Sean Connery', 'Roger Moore', 'David Niven', 'Michael Caine'], fact: '"Dr. No" came out in 1962.' },
      { question: 'What is the name of the long-running soap set on a Manchester street?', options: ['Coronation Street', 'EastEnders', 'Emmerdale', 'Crossroads'], fact: 'The first episode was shown on 9 December 1960.' },
      { question: 'Which singing nanny was played by Julie Andrews?', options: ['Mary Poppins', 'Nanny McPhee', 'Annie', 'Eliza Doolittle'], emoji: '☂️' },
      { question: 'In which film does Gene Kelly dance in a rainstorm?', options: ["Singin' in the Rain", 'An American in Paris', 'Top Hat', 'Oklahoma!'], emoji: '🌧️' },
      { question: 'Which famous mouse was created by Walt Disney?', options: ['Mickey Mouse', 'Jerry', 'Mighty Mouse', 'Speedy Gonzales'], emoji: '🐭' },
      { question: 'Who travels through time in a police box called the TARDIS?', options: ['Doctor Who', 'Sherlock Holmes', 'The Saint', 'Captain Scarlet'] },
      { question: 'Which comedian was famous for wearing a fez?', options: ['Tommy Cooper', 'Ken Dodd', 'Benny Hill', 'Frankie Howerd'], fact: 'His catchphrase was "Just like that!"' },
      { question: 'Which film tells the story of the von Trapp family singers?', options: ['The Sound of Music', 'My Fair Lady', 'Oliver!', 'South Pacific'], emoji: '🏔️' },
    ],
  },
  {
    id: 'music',
    title: 'Music Through the Years',
    emoji: '🎶',
    tags: ['music'],
    questions: [
      { question: 'Which band were known as the "Fab Four"?', options: ['The Beatles', 'The Rolling Stones', 'The Shadows', 'The Who'], fact: 'They came from Liverpool.' },
      { question: 'Who was known as "The King of Rock and Roll"?', options: ['Elvis Presley', 'Buddy Holly', 'Cliff Richard', 'Chuck Berry'], emoji: '🎸' },
      { question: 'Which singer was called the "Forces\' Sweetheart"?', options: ['Vera Lynn', 'Gracie Fields', 'Shirley Bassey', 'Petula Clark'] },
      { question: 'Which Welsh singer is famous for the song "Delilah"?', options: ['Tom Jones', 'Shirley Bassey', 'Harry Secombe', 'Ivor Novello'] },
      { question: 'Cliff Richard sang "Summer ___". What is the missing word?', options: ['Holiday', 'Breeze', 'Nights', 'Time'], emoji: '🚌' },
      { question: 'Which instrument has 88 keys?', options: ['Piano', 'Accordion', 'Organ', 'Harp'], emoji: '🎹' },
      { question: 'Who sang "Goldfinger" for the James Bond film?', options: ['Shirley Bassey', 'Lulu', 'Dusty Springfield', 'Cilla Black'] },
      { question: 'Frank Sinatra sang "I Did It ___". What is the missing phrase?', options: ['My Way', 'Again', 'For You', 'Tonight'] },
      { question: 'Which composer wrote the "Moonlight Sonata"?', options: ['Beethoven', 'Mozart', 'Elgar', 'Handel'] },
      { question: 'What do we call a group of four singers or musicians?', options: ['Quartet', 'Trio', 'Duet', 'Choir'] },
    ],
  },
  {
    id: 'food',
    title: 'Food and Drink',
    emoji: '🍽️',
    tags: ['food'],
    questions: [
      { question: 'What is the main ingredient of guacamole?', options: ['Avocado', 'Pea', 'Cucumber', 'Lime'], emoji: '🥑' },
      { question: 'What is a Yorkshire pudding made from?', options: ['Batter', 'Pastry', 'Sponge', 'Mashed potato'], fact: 'Batter is flour, eggs and milk.' },
      { question: 'Which fruit is traditionally used to make marmalade?', options: ['Oranges', 'Apples', 'Strawberries', 'Plums'], emoji: '🍊' },
      { question: 'What is a "cuppa"?', options: ['A cup of tea', 'A cupcake', 'A small cup of soup', 'A glass of milk'], emoji: '☕' },
      { question: 'Which county is famous for its pasties?', options: ['Cornwall', 'Kent', 'Norfolk', 'Durham'] },
      { question: 'What is the main vegetable in coleslaw?', options: ['Cabbage', 'Lettuce', 'Celery', 'Spinach'], emoji: '🥬' },
      { question: 'Bangers and mash is sausages and what?', options: ['Mashed potato', 'Peas', 'Beans', 'Onions'] },
      { question: 'Which nut is used to make marzipan?', options: ['Almond', 'Walnut', 'Peanut', 'Hazelnut'] },
      { question: 'What is the traditional filling of a Bakewell tart?', options: ['Jam and frangipane', 'Custard', 'Treacle', 'Lemon curd'] },
      { question: 'Which Scottish dish is traditionally eaten on Burns Night?', options: ['Haggis', 'Kedgeree', 'Hotpot', 'Toad in the hole'] },
    ],
  },
  {
    id: 'nature',
    title: 'Nature and Animals',
    emoji: '🦔',
    tags: ['nature', 'animals'],
    questions: [
      { question: 'What is a baby sheep called?', options: ['Lamb', 'Kid', 'Calf', 'Foal'], emoji: '🐑' },
      { question: 'Which animal is famous for changing colour?', options: ['Chameleon', 'Tortoise', 'Hamster', 'Frog'], emoji: '🦎' },
      { question: 'What is a group of fish swimming together called?', options: ['A shoal', 'A flock', 'A herd', 'A pack'], emoji: '🐟' },
      { question: 'What do caterpillars turn into?', options: ['Butterflies', 'Bees', 'Beetles', 'Dragonflies'], emoji: '🦋' },
      { question: 'Which tree do acorns come from?', options: ['Oak', 'Ash', 'Beech', 'Elm'], emoji: '🌳' },
      { question: 'What is the fastest land animal?', options: ['Cheetah', 'Horse', 'Lion', 'Greyhound'] },
      { question: 'Which bird is known for its "cuckoo" call?', options: ['Cuckoo', 'Pigeon', 'Blackbird', 'Thrush'], fact: 'Hearing the first cuckoo was a sign that spring had arrived.' },
      { question: 'Which animal sleeps through the winter in Britain?', options: ['Hedgehog', 'Fox', 'Badger', 'Rabbit'], fact: 'Hedgehogs hibernate from about November to March.' },
      { question: 'What is the largest animal on Earth?', options: ['Blue whale', 'Elephant', 'Giraffe', 'Great white shark'], emoji: '🐋' },
      { question: 'What is a baby cat called?', options: ['Kitten', 'Cub', 'Pup', 'Joey'], emoji: '🐱' },
    ],
  },
  {
    id: 'sayings',
    title: 'Finish the Saying',
    emoji: '💬',
    tags: [],
    questions: [
      { question: 'An apple a day keeps the ___ away.', options: ['doctor', 'teacher', 'rain', 'milkman'], emoji: '🍎' },
      { question: 'Every cloud has a silver ___.', options: ['lining', 'spoon', 'button', 'coin'] },
      { question: 'The early bird catches the ___.', options: ['worm', 'bus', 'cold', 'fish'], emoji: '🐦' },
      { question: "Don't count your chickens before they ___.", options: ['hatch', 'fly', 'sing', 'sleep'], emoji: '🐣' },
      { question: 'Too many cooks spoil the ___.', options: ['broth', 'bread', 'party', 'cake'] },
      { question: 'A stitch in time saves ___.', options: ['nine', 'money', 'ten', 'trouble'], emoji: '🧵' },
      { question: 'Where there\'s a will, there\'s a ___.', options: ['way', 'gift', 'friend', 'party'] },
      { question: 'Many hands make light ___.', options: ['work', 'music', 'shadows', 'lunch'] },
      { question: 'Look before you ___.', options: ['leap', 'sleep', 'speak', 'eat'] },
      { question: 'Rome wasn\'t built in a ___.', options: ['day', 'year', 'hurry', 'week'] },
      { question: "There's no place like ___.", options: ['home', 'Rome', 'the seaside', 'London'], emoji: '🏡' },
      { question: 'Red sky at night, shepherd\'s ___.', options: ['delight', 'supper', 'fright', 'pie'], fact: '"Red sky in the morning, shepherd\'s warning."' },
    ],
  },
  {
    id: 'sport',
    title: 'Sporting Moments',
    emoji: '🏆',
    tags: ['sport'],
    questions: [
      { question: 'In what year did England win the football World Cup?', options: ['1966', '1970', '1958', '1982'], fact: 'England beat West Germany 4–2 at Wembley.' },
      { question: 'Where is the famous tennis championship held each summer in London?', options: ['Wimbledon', 'Wembley', 'Twickenham', "Lord's"], emoji: '🎾' },
      { question: 'Who was the first person to run a mile in under four minutes?', options: ['Roger Bannister', 'Sebastian Coe', 'Chris Chataway', 'Steve Ovett'], fact: 'He did it in Oxford on 6 May 1954.' },
      { question: 'How many balls are in an over in cricket?', options: ['Six', 'Eight', 'Five', 'Ten'], emoji: '🏏' },
      { question: 'Which horse race is run at Aintree?', options: ['The Grand National', 'The Derby', "The St Leger", 'The Gold Cup'], emoji: '🏇' },
      { question: 'Which boxer said "I am the greatest"?', options: ['Muhammad Ali', 'Henry Cooper', 'Joe Frazier', 'Frank Bruno'], emoji: '🥊' },
      { question: 'What colour jersey does the Tour de France leader wear?', options: ['Yellow', 'Green', 'Pink', 'White'], emoji: '🚴' },
      { question: 'In golf, what is one under par on a hole called?', options: ['Birdie', 'Eagle', 'Bogey', 'Albatross'], emoji: '⛳' },
      { question: 'Which two universities race in the Boat Race?', options: ['Oxford and Cambridge', 'Durham and York', 'London and Bristol', 'Edinburgh and Glasgow'], emoji: '🚣' },
      { question: 'How often are the Olympic Games held?', options: ['Every four years', 'Every year', 'Every two years', 'Every ten years'], emoji: '🥇' },
    ],
  },
];

export function quizById(id: string) {
  return QUIZZES.find((q) => q.id === id);
}
