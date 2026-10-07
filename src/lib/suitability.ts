import type { Activity, Resident } from '../types';

/** Hide activities touching a resident's "topics to avoid", and suit bed-bound residents. */
export function suitableFor(activity: Activity, resident: Resident | undefined) {
  if (!resident) return true;
  const avoid = resident.avoidTopics.map((t) => t.toLowerCase().trim()).filter(Boolean);
  if (activity.tags.some((t) => avoid.includes(t.toLowerCase()))) return false;
  if (resident.mobility === 'bed' && !activity.bedFriendly) return false;
  return true;
}

export function pickSurprise(activities: Activity[], resident: Resident | undefined, rand = Math.random) {
  const pool = activities.filter((a) => suitableFor(a, resident));
  return pool[Math.floor(rand() * pool.length)];
}
