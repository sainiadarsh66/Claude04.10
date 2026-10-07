export type Difficulty = 'sensory' | 'easy' | 'medium' | 'challenging';

export const DIFFICULTIES: { id: Difficulty; label: string; description: string }[] = [
  { id: 'sensory', label: 'Simple', description: 'Very few steps, lots of help' },
  { id: 'easy', label: 'Easy', description: 'Gentle start' },
  { id: 'medium', label: 'Medium', description: 'A little more to think about' },
  { id: 'challenging', label: 'Challenging', description: 'For keen puzzlers' },
];

export type CategoryId =
  | 'word-games'
  | 'puzzles'
  | 'history'
  | 'quizzes'
  | 'reminiscence'
  | 'music';

export type GroupSize = 'one-to-one' | 'group' | 'either';
export type Energy = 'calming' | 'stimulating' | 'either';

export interface Activity {
  id: string;
  title: string;
  category: CategoryId;
  /** Route that starts the activity. */
  path: string;
  emoji: string;
  summary: string;
  minutes: 5 | 15 | 30 | 60;
  group: GroupSize;
  energy: Energy;
  /** Suitable for residents who are cared for in bed. */
  bedFriendly: boolean;
  tags: string[];
  staffTips: StaffTips;
}

export interface StaffTips {
  introduce: string;
  prompts: string[];
  adaptations: string[];
}

export type CognitiveLevel = 'none' | 'mild' | 'moderate' | 'advanced';
export type Mobility = 'independent' | 'aided' | 'wheelchair' | 'bed';

export interface Resident {
  id?: number;
  name: string;
  preferredName: string;
  room: string;
  birthYear?: number;
  hobbies: string;
  occupation: string;
  favouriteMusic: string;
  faith: string;
  likes: string;
  dislikes: string;
  /** Topics to steer away from, e.g. "war", "bereavement". */
  avoidTopics: string[];
  communication: string;
  sensory: string;
  cognitive: CognitiveLevel;
  mobility: Mobility;
  photoConsent: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ResidentPhoto {
  id?: number;
  residentId: number;
  caption: string;
  blob: Blob;
  createdAt: number;
}

export type Engagement = 1 | 2 | 3 | 4 | 5;
export type Mood = 'low' | 'okay' | 'good';

export interface SessionParticipant {
  residentId: number;
  engagement: Engagement;
  moodBefore?: Mood;
  moodAfter?: Mood;
}

export interface ActivitySession {
  id?: number;
  activityId: string;
  activityTitle: string;
  startedAt: number;
  endedAt: number;
  staffName: string;
  participants: SessionParticipant[];
  note: string;
  /** Set once the record has been sent to a server. Phase 1 is device-only. */
  syncedAt?: number;
}
