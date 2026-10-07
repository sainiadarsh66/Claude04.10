import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Theme = 'calm' | 'dark' | 'contrast';

export interface Settings {
  textScale: number;
  theme: Theme;
  speech: boolean;
  speechRate: number;
  sounds: boolean;
  reduceMotion: boolean;
  leftHanded: boolean;
  staffName: string;
  residentMode: boolean;
  pin: string;
}

export const DEFAULT_SETTINGS: Settings = {
  textScale: 1,
  theme: 'calm',
  speech: true,
  speechRate: 0.85,
  sounds: true,
  reduceMotion: false,
  leftHanded: false,
  staffName: '',
  residentMode: false,
  pin: '1234',
};

const STORAGE_KEY = 'activity-hub:settings';

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // Storage can be blocked (private mode); fall back to defaults.
  }
  return DEFAULT_SETTINGS;
}

interface SettingsContextValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
    const root = document.documentElement;
    root.dataset.theme = settings.theme;
    root.style.setProperty('--text-scale', String(settings.textScale));
    root.classList.toggle('reduce-motion', settings.reduceMotion);
  }, [settings]);

  const value = useMemo(
    () => ({ settings, update: (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })) }),
    [settings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
