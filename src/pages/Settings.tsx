import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Field, PageTitle, Segmented, Toggle, inputClass } from '../components/ui';
import { useSettings, type Theme } from '../state/settings';
import { speak } from '../lib/speech';
import { db } from '../db/db';
import { useToast } from '../components/Toast';

const SCALES = [
  { id: '1', label: 'Standard' },
  { id: '1.25', label: 'Large' },
  { id: '1.5', label: 'Larger' },
  { id: '2', label: 'Largest' },
];

export default function Settings() {
  const { settings, update } = useSettings();
  const navigate = useNavigate();
  const toast = useToast();
  const [pin, setPin] = useState(settings.pin);

  const exportAll = async () => {
    const residents = await db.residents.toArray();
    const sessions = await db.sessions.toArray();
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), residents, sessions }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `activity-hub-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageTitle>⚙️ Settings</PageTitle>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Seeing and hearing</h2>
        <Field label="Text size">
          <Segmented
            label="Text size"
            value={String(settings.textScale)}
            options={SCALES}
            onChange={(v) => update({ textScale: Number(v) })}
          />
        </Field>
        <Field label="Colours">
          <Segmented<Theme>
            label="Colour theme"
            value={settings.theme}
            onChange={(theme) => update({ theme })}
            options={[
              { id: 'calm', label: 'Calm (light)' },
              { id: 'dark', label: 'Dark' },
              { id: 'contrast', label: 'High contrast' },
            ]}
          />
        </Field>
        <Toggle label="Read-aloud buttons" description="Show 🔊 buttons that read text aloud" checked={settings.speech} onChange={(speech) => update({ speech })} />
        {settings.speech && (
          <Field label="Reading speed">
            <div className="flex flex-wrap items-center gap-3">
              <Segmented
                label="Reading speed"
                value={String(settings.speechRate)}
                onChange={(v) => update({ speechRate: Number(v) })}
                options={[
                  { id: '0.7', label: 'Slow' },
                  { id: '0.85', label: 'Gentle' },
                  { id: '1', label: 'Normal' },
                ]}
              />
              <Button onClick={() => speak('Hello! This is how I will sound.', settings.speechRate)}>🔊 Test</Button>
            </div>
          </Field>
        )}
        <Toggle label="Gentle sounds" description="Soft chimes when something is completed" checked={settings.sounds} onChange={(sounds) => update({ sounds })} />
        <Toggle label="Reduce movement" description="Turns off animations" checked={settings.reduceMotion} onChange={(reduceMotion) => update({ reduceMotion })} />
        <Toggle label="Left-handed layout" description="Moves the main buttons to the other side" checked={settings.leftHanded} onChange={(leftHanded) => update({ leftHanded })} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Staff</h2>
        <Field label="Your name" hint="Saved with activity records made on this tablet">
          <input className={inputClass} value={settings.staffName} onChange={(e) => update({ staffName: e.target.value })} />
        </Field>
        <Field label="Staff PIN" hint="Needed to leave Resident Mode (4 to 8 digits)">
          <div className="flex gap-3">
            <input
              className={inputClass}
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
            />
            <Button
              disabled={pin.length < 4 || pin === settings.pin}
              onClick={() => {
                update({ pin });
                toast('PIN updated');
              }}
            >
              Save PIN
            </Button>
          </div>
        </Field>
        <div className="rounded-3xl border-2 border-line bg-surface p-5">
          <p className="mt-0 text-lg font-bold">Resident Mode</p>
          <p className="text-muted">
            Hides residents, records and settings so a resident can use the tablet safely. Unlock with the staff PIN (🔒 button).
          </p>
          <Button
            variant="primary"
            onClick={() => {
              update({ residentMode: true });
              navigate('/');
            }}
          >
            🔒 Turn on Resident Mode
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Data on this tablet</h2>
        <p className="m-0 text-muted">
          Residents, photos and activity records are kept on this device only. Export a copy for your records, or for a data request.
        </p>
        <Button onClick={exportAll}>⬇️ Export residents and records (JSON)</Button>
      </section>
    </div>
  );
}
