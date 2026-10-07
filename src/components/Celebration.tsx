import { useEffect, useMemo } from 'react';
import { useSettings } from '../state/settings';
import { chime } from '../lib/speech';
import { Button } from './ui';

const MESSAGES = ['Well done!', 'Wonderful!', 'Lovely work!', 'Brilliant!', 'You did it!'];

/** Gentle full-screen "well done". Balloons drift up; nothing flashes. */
export function Celebration({
  message,
  detail,
  onAgain,
  onFinish,
}: {
  message?: string;
  detail?: string;
  onAgain?: () => void;
  onFinish?: () => void;
}) {
  const { settings } = useSettings();
  const text = useMemo(() => message ?? MESSAGES[Math.floor(Math.random() * MESSAGES.length)], [message]);
  const balloons = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ left: 5 + i * 9.5, delay: (i % 5) * 0.35, emoji: ['🎈', '🌟', '🌸'][i % 3] })),
    [],
  );

  useEffect(() => {
    if (settings.sounds) chime('success');
  }, [settings.sounds]);

  return (
    <div role="status" aria-live="polite" className="relative overflow-hidden rounded-3xl border-2 border-line bg-success-bg p-8 text-center">
      {!settings.reduceMotion &&
        balloons.map((b, i) => (
          <span
            key={i}
            aria-hidden
            className="animate-float-up pointer-events-none absolute bottom-0 text-4xl"
            style={{ left: `${b.left}%`, animationDelay: `${b.delay}s` }}
          >
            {b.emoji}
          </span>
        ))}
      <p className="animate-gentle-pop m-0 text-5xl font-bold text-success">{text}</p>
      {detail && <p className="mt-3 text-xl">{detail}</p>}
      <div className="relative mt-6 flex flex-wrap justify-center gap-3">
        {onAgain && (
          <Button variant="primary" onClick={onAgain}>
            Play again
          </Button>
        )}
        {onFinish && <Button onClick={onFinish}>Finish and record</Button>}
      </div>
    </div>
  );
}
