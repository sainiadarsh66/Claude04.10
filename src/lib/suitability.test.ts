import { pickSurprise, suitableFor } from './suitability';
import { ACTIVITIES } from '../data/catalog';
import { emptyResident } from '../db/db';
import { isGentle } from './onThisDayOnline';

describe('suitableFor', () => {
  it('hides activities on topics a resident avoids', () => {
    const resident = { ...emptyResident(), name: 'Test', avoidTopics: ['war'] };
    const wartime = ACTIVITIES.find((a) => a.id === 'memories-wartime')!;
    expect(suitableFor(wartime, undefined)).toBe(true);
    expect(suitableFor(wartime, resident)).toBe(false);
    for (let i = 0; i < 50; i++) expect(pickSurprise(ACTIVITIES, resident)?.tags).not.toContain('war');
  });
});

describe('isGentle', () => {
  it('filters upsetting online history', () => {
    expect(isGentle('The first episode of a TV show is broadcast.')).toBe(true);
    expect(isGentle('An earthquake kills 300 people.')).toBe(false);
    expect(isGentle('Battle of Hastings')).toBe(false);
  });
});
