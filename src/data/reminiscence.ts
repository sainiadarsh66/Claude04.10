export interface MemoryCard {
  emoji: string;
  title: string;
  prompt: string;
}

export interface MemoryBox {
  id: string;
  title: string;
  emoji: string;
  tags: string[];
  intro: string;
  cards: MemoryCard[];
}

/**
 * Themed memory boxes. Pictures are emoji so everything works offline;
 * coordinators can add real photos to a resident's own life-story gallery.
 */
export const MEMORY_BOXES: MemoryBox[] = [
  {
    id: 'school',
    title: 'School Days',
    emoji: '🏫',
    tags: ['childhood'],
    intro: 'Let\'s remember the classroom, the playground and the walk to school.',
    cards: [
      { emoji: '🖋️', title: 'Ink wells and dip pens', prompt: 'Did you write with a dip pen? Were there ink blots?' },
      { emoji: '🧮', title: 'Times tables', prompt: 'Did you chant your times tables? Which one was hardest?' },
      { emoji: '🔔', title: 'The school bell', prompt: 'What did you do at playtime?' },
      { emoji: '🥛', title: 'School milk', prompt: 'Do you remember the little bottles of milk? Were they warm or cold?' },
      { emoji: '🎒', title: 'Satchels', prompt: 'What did you carry to school?' },
      { emoji: '🧑‍🏫', title: 'Teachers', prompt: 'Was there a teacher you remember well? Were they strict?' },
    ],
  },
  {
    id: 'seaside',
    title: 'Seaside Holidays',
    emoji: '🏖️',
    tags: ['holidays', 'seaside'],
    intro: 'Pack your bucket and spade, we\'re off to the seaside!',
    cards: [
      { emoji: '🚂', title: 'The train to the coast', prompt: 'How did you get to the seaside? Who came with you?' },
      { emoji: '🫏', title: 'Donkey rides', prompt: 'Did you ever ride a donkey on the sands?' },
      { emoji: '🍦', title: 'Ice cream', prompt: 'What was your favourite ice cream? Did it have a flake?' },
      { emoji: '🎡', title: 'The pier and the fair', prompt: 'Did you go on the rides or play on the slot machines?' },
      { emoji: '🐟', title: 'Fish and chips', prompt: 'Salt and vinegar? Wrapped in newspaper?' },
      { emoji: '🏕️', title: 'Holiday camps', prompt: 'Did you ever go to Butlins or a caravan park?' },
    ],
  },
  {
    id: 'kitchen',
    title: "Mum's Kitchen",
    emoji: '🍲',
    tags: ['food', 'home'],
    intro: 'Smells and tastes from home cooking.',
    cards: [
      { emoji: '🥧', title: 'Sunday dinner', prompt: 'What was on the table for Sunday dinner?' },
      { emoji: '🍞', title: 'Bread and dripping', prompt: 'Did you ever have bread and dripping? Or a jam sandwich?' },
      { emoji: '🫖', title: 'A pot of tea', prompt: 'How do you take your tea? Did you use a tea cosy?' },
      { emoji: '🍮', title: 'Puddings', prompt: 'Spotted dick, jam roly-poly or rice pudding?' },
      { emoji: '🧺', title: 'The pantry', prompt: 'What did you keep in the pantry? Was there a meat safe?' },
      { emoji: '🎂', title: 'Baking day', prompt: 'Did you lick the bowl when someone was baking?' },
    ],
  },
  {
    id: 'washday',
    title: 'Wash Day and Housework',
    emoji: '🧺',
    tags: ['home'],
    intro: 'Monday was wash day in many homes.',
    cards: [
      { emoji: '🫧', title: 'The twin tub', prompt: 'Did you have a twin tub or a mangle?' },
      { emoji: '👕', title: 'The washing line', prompt: 'Did you peg the washing out in the garden or the back yard?' },
      { emoji: '🔥', title: 'The coal fire', prompt: 'Who lit the fire in the mornings? Did you have a coal man?' },
      { emoji: '🧹', title: 'Spring cleaning', prompt: 'Did you beat the rugs outside?' },
      { emoji: '🧼', title: 'Bath night', prompt: 'Was there a tin bath in front of the fire?' },
      { emoji: '🪡', title: 'Darning and mending', prompt: 'Did you darn socks or make your own clothes?' },
    ],
  },
  {
    id: 'courting',
    title: 'Dances and Courting',
    emoji: '💃',
    tags: ['music', 'relationships'],
    intro: 'Dance halls, the pictures and first dates.',
    cards: [
      { emoji: '🕺', title: 'The dance hall', prompt: 'Where did you go dancing? What dances did you do?' },
      { emoji: '🎬', title: 'The pictures', prompt: 'Did you sit in the back row at the cinema?' },
      { emoji: '💐', title: 'Flowers and gifts', prompt: 'Did anyone ever bring you flowers?' },
      { emoji: '👗', title: 'Dressing up', prompt: 'What did you wear for a night out?' },
      { emoji: '💍', title: 'Wedding day', prompt: 'If you married, where was the wedding? What was the weather like?' },
      { emoji: '📻', title: 'Songs on the radio', prompt: 'Is there a song that reminds you of someone special?' },
    ],
  },
  {
    id: 'shops',
    title: 'Shops and the High Street',
    emoji: '🏪',
    tags: ['money', 'places'],
    intro: 'A trip down the high street, before supermarkets.',
    cards: [
      { emoji: '🍬', title: 'The sweet shop', prompt: 'What sweets did you buy with your pocket money?' },
      { emoji: '🥩', title: 'The butcher', prompt: 'Was there sawdust on the butcher\'s floor?' },
      { emoji: '🥛', title: 'The milkman', prompt: 'Did the milkman deliver to your door? Did birds peck the foil tops?' },
      { emoji: '🪙', title: 'Pounds, shillings and pence', prompt: 'Do you remember half-crowns and threepenny bits?' },
      { emoji: '🧾', title: 'Co-op divi', prompt: 'Did your family have a Co-op number? Can you still remember it?' },
      { emoji: '🚲', title: 'Delivery boys', prompt: 'Did shops deliver by bicycle?' },
    ],
  },
  {
    id: 'work',
    title: 'Working Life',
    emoji: '🛠️',
    tags: ['work'],
    intro: 'Jobs, workplaces and the people we worked with.',
    cards: [
      { emoji: '📋', title: 'First job', prompt: 'What was your very first job? How much were you paid?' },
      { emoji: '🏭', title: 'Factories and mills', prompt: 'Did you or your family work in a factory or a mill?' },
      { emoji: '🚜', title: 'On the land', prompt: 'Did you ever help on a farm, or go fruit picking?' },
      { emoji: '🏥', title: 'Caring jobs', prompt: 'Did you work as a nurse, teacher or in a shop?' },
      { emoji: '⌨️', title: 'The office', prompt: 'Did you use a typewriter or a switchboard?' },
      { emoji: '🎉', title: 'Works outings', prompt: 'Did your work have a Christmas party or a day trip?' },
    ],
  },
  {
    id: 'toys',
    title: 'Toys and Games',
    emoji: '🪀',
    tags: ['childhood'],
    intro: 'What did we play with when we were young?',
    cards: [
      { emoji: '🪁', title: 'Kites and hoops', prompt: 'Did you fly kites or roll a hoop?' },
      { emoji: '🧸', title: 'Teddy bears and dolls', prompt: 'Did you have a favourite toy? What was it called?' },
      { emoji: '🎲', title: 'Board games', prompt: 'Ludo, snakes and ladders, or draughts?' },
      { emoji: '🚂', title: 'Train sets', prompt: 'Did anyone you know have a train set?' },
      { emoji: '🪢', title: 'Skipping and hopscotch', prompt: 'Can you remember a skipping rhyme?' },
      { emoji: '🎠', title: 'The fair', prompt: 'Did the fair come to town? What rides did you go on?' },
    ],
  },
  {
    id: 'wartime',
    title: 'Wartime Memories',
    emoji: '🎖️',
    tags: ['war'],
    intro: 'Some people like to share memories of wartime. Go gently and follow their lead.',
    cards: [
      { emoji: '📖', title: 'Ration books', prompt: 'What did you miss most when food was rationed?' },
      { emoji: '🥕', title: 'Dig for Victory', prompt: 'Did your family grow vegetables in the garden?' },
      { emoji: '🧳', title: 'Evacuation', prompt: 'Were you or someone you knew evacuated to the countryside?' },
      { emoji: '🎤', title: 'Songs of the time', prompt: 'Do you remember "We\'ll Meet Again"?' },
      { emoji: '🎉', title: 'Street parties', prompt: 'Did you go to a street party at the end of the war?' },
      { emoji: '✉️', title: 'Letters home', prompt: 'Did you write or receive letters from someone far away?' },
    ],
  },
];

export function memoryBoxById(id: string) {
  return MEMORY_BOXES.find((b) => b.id === id);
}

/** Picture sets for the memory-match game. */
export const MATCH_SETS: { id: string; title: string; emoji: string; items: string[] }[] = [
  { id: 'garden', title: 'Garden', emoji: '🌻', items: ['🌻', '🌷', '🌹', '🐝', '🦋', '🐞', '🍓', '🌳', '🐦', '🍄'] },
  { id: 'food', title: 'Teatime', emoji: '🍰', items: ['🍰', '🫖', '🍞', '🧀', '🍎', '🍌', '🥕', '🍪', '🥚', '🍒'] },
  { id: 'animals', title: 'Animals', emoji: '🐶', items: ['🐶', '🐱', '🐴', '🐮', '🐷', '🐑', '🦆', '🐰', '🐔', '🦔'] },
  { id: 'travel', title: 'Travel', emoji: '🚂', items: ['🚂', '🚌', '🚗', '⛵', '✈️', '🚲', '🚕', '🛵', '🚀', '⛴️'] },
  { id: 'music', title: 'Music', emoji: '🎻', items: ['🎻', '🎺', '🥁', '🎹', '🎸', '🎷', '🪗', '🎤', '📻', '🪕'] },
];
