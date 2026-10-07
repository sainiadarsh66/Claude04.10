import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Difficulty, StaffTips } from '../types';
import { DIFFICULTIES } from '../types';
import { difficultyForCognitive, useActiveResident } from '../state/resident';
import { Button, Segmented, SpeakButton } from './ui';
import { LogSessionDialog } from './LogSessionDialog';
import { useToast } from './Toast';

/**
 * Common frame for every activity: title, difficulty, staff tips and the
 * Finish button that records the session.
 */
export function ActivityShell({
  activityId,
  title,
  emoji,
  tips,
  withDifficulty = true,
  children,
}: {
  activityId: string;
  title: string;
  emoji?: string;
  tips?: StaffTips;
  withDifficulty?: boolean;
  children: (ctx: { difficulty: Difficulty; round: number; finish: () => void; restart: () => void }) => ReactNode;
}) {
  const { resident } = useActiveResident();
  const navigate = useNavigate();
  const toast = useToast();
  const [difficulty, setDifficulty] = useState<Difficulty>(() => difficultyForCognitive(resident?.cognitive));
  const [round, setRound] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const [showTips, setShowTips] = useState(false);
  const [logging, setLogging] = useState(false);

  // The resident profile loads asynchronously; adopt their level once it arrives,
  // unless staff have already picked one.
  const chosenByStaff = useRef(false);
  useEffect(() => {
    if (resident && !chosenByStaff.current) setDifficulty(difficultyForCognitive(resident.cognitive));
  }, [resident?.id, resident?.cognitive]); // eslint-disable-line react-hooks/exhaustive-deps

  const finish = useCallback(() => setLogging(true), []);
  const restart = useCallback(() => setRound((r) => r + 1), []);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="m-0 flex-1 text-3xl font-bold leading-tight">
          {emoji && <span aria-hidden className="mr-2">{emoji}</span>}
          {title}
        </h1>
        <SpeakButton text={title} />
        {tips && (
          <Button aria-expanded={showTips} onClick={() => setShowTips((s) => !s)}>
            💡 Staff tips
          </Button>
        )}
        <Button variant="accent" onClick={finish}>
          ✔ Finish
        </Button>
      </div>

      {showTips && tips && (
        <aside aria-label="Staff tips" className="mb-5 rounded-3xl border-2 border-line bg-hint p-5">
          <h2 className="mt-0 text-xl font-bold">How to introduce it</h2>
          <p>{tips.introduce}</p>
          <h2 className="text-xl font-bold">Things to ask</h2>
          <ul className="space-y-1">
            {tips.prompts.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <h2 className="text-xl font-bold">Making it easier</h2>
          <ul className="mb-0 space-y-1">
            {tips.adaptations.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </aside>
      )}

      {withDifficulty && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="text-lg font-bold">Level:</span>
          <Segmented
            label="Difficulty"
            value={difficulty}
            options={DIFFICULTIES.map((d) => ({ id: d.id, label: d.label }))}
            onChange={(d) => {
              chosenByStaff.current = true;
              setDifficulty(d);
              setRound((r) => r + 1);
            }}
          />
        </div>
      )}

      <div key={`${difficulty}-${round}`}>{children({ difficulty, round, finish, restart })}</div>

      <LogSessionDialog
        open={logging}
        activityId={activityId}
        activityTitle={title}
        startedAt={startedAt}
        onClose={() => setLogging(false)}
        onSaved={() => {
          setLogging(false);
          toast('Session saved. Thank you!');
          navigate('/');
        }}
      />
    </div>
  );
}
