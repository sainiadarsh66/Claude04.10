import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { CognitiveLevel, Difficulty, Resident } from '../types';

interface ActiveResidentValue {
  resident: Resident | undefined;
  setResidentId: (id: number | undefined) => void;
}

const ActiveResidentContext = createContext<ActiveResidentValue | null>(null);
const KEY = 'activity-hub:active-resident';

/** The resident staff are currently doing activities with (optional). */
export function ActiveResidentProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<number | undefined>(() => {
    try {
      const v = sessionStorage.getItem(KEY);
      return v ? Number(v) : undefined;
    } catch {
      return undefined;
    }
  });

  useEffect(() => {
    try {
      if (id === undefined) sessionStorage.removeItem(KEY);
      else sessionStorage.setItem(KEY, String(id));
    } catch {
      // ignore
    }
  }, [id]);

  const resident = useLiveQuery(() => (id === undefined ? undefined : db.residents.get(id)), [id]);

  return (
    <ActiveResidentContext.Provider value={{ resident, setResidentId: setId }}>
      {children}
    </ActiveResidentContext.Provider>
  );
}

export function useActiveResident() {
  const ctx = useContext(ActiveResidentContext);
  if (!ctx) throw new Error('useActiveResident must be used inside ActiveResidentProvider');
  return ctx;
}

export function difficultyForCognitive(level: CognitiveLevel | undefined): Difficulty {
  switch (level) {
    case 'advanced':
      return 'sensory';
    case 'moderate':
      return 'easy';
    case 'none':
      return 'challenging';
    default:
      return 'medium';
  }
}

export function displayName(r: Pick<Resident, 'name' | 'preferredName'>) {
  return r.preferredName || r.name.split(' ')[0];
}
