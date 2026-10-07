import Dexie, { type EntityTable } from 'dexie';
import type { ActivitySession, Resident, ResidentPhoto } from '../types';

/**
 * Everything is stored on the device in IndexedDB so the hub keeps working when
 * the Wi-Fi drops. Records carry `syncedAt` so a server sync can be added later.
 */
export class HubDB extends Dexie {
  residents!: EntityTable<Resident, 'id'>;
  photos!: EntityTable<ResidentPhoto, 'id'>;
  sessions!: EntityTable<ActivitySession, 'id'>;
  cache!: EntityTable<{ key: string; value: unknown; savedAt: number }, 'key'>;

  constructor(name = 'activity-hub') {
    super(name);
    this.version(1).stores({
      residents: '++id, name, room',
      photos: '++id, residentId, createdAt',
      sessions: '++id, activityId, startedAt, *participantIds',
      cache: 'key',
    });
  }
}

export const db = new HubDB();

export function emptyResident(): Resident {
  const now = Date.now();
  return {
    name: '',
    preferredName: '',
    room: '',
    birthYear: undefined,
    hobbies: '',
    occupation: '',
    favouriteMusic: '',
    faith: '',
    likes: '',
    dislikes: '',
    avoidTopics: [],
    communication: '',
    sensory: '',
    cognitive: 'mild',
    mobility: 'independent',
    photoConsent: false,
    createdAt: now,
    updatedAt: now,
  };
}

export async function saveSession(session: ActivitySession): Promise<number> {
  // participantIds is a multi-entry index so a resident's history is a fast lookup.
  const record = { ...session, participantIds: session.participants.map((p) => p.residentId) };
  return (await db.sessions.add(record as ActivitySession)) as number;
}

export function sessionsForResident(residentId: number) {
  return db.sessions.where('participantIds').equals(residentId).reverse().sortBy('startedAt');
}

/** Sample residents so a new install has something to explore. */
export async function seedIfEmpty(): Promise<void> {
  if ((await db.residents.count()) > 0) return;
  const base = emptyResident();
  await db.residents.bulkAdd([
    {
      ...base,
      name: 'Margaret Ellis',
      preferredName: 'Peggy',
      room: '12',
      birthYear: 1938,
      hobbies: 'Gardening, knitting, ballroom dancing',
      occupation: 'Seamstress',
      favouriteMusic: '1950s dance bands, Vera Lynn',
      likes: 'Roses, tea with two sugars, the seaside',
      avoidTopics: ['war'],
      cognitive: 'moderate',
      mobility: 'aided',
      photoConsent: true,
    },
    {
      ...base,
      name: 'Arthur Patel',
      preferredName: 'Arthur',
      room: '4',
      birthYear: 1945,
      hobbies: 'Cricket, crosswords, steam trains',
      occupation: 'Railway signalman',
      favouriteMusic: 'The Beatles, Cliff Richard',
      likes: 'A good debate, sport on the radio',
      cognitive: 'mild',
      mobility: 'independent',
      photoConsent: true,
    },
    {
      ...base,
      name: 'Doris Campbell',
      preferredName: 'Doris',
      room: '7',
      birthYear: 1932,
      hobbies: 'Singing in the church choir, baking',
      occupation: 'School cook',
      favouriteMusic: 'Hymns, Scottish songs',
      faith: 'Church of Scotland',
      sensory: 'Hard of hearing on the left side',
      cognitive: 'advanced',
      mobility: 'wheelchair',
      photoConsent: false,
    },
  ]);
}
