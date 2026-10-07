import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ActivityShell } from '../components/ActivityShell';
import { Celebration } from '../components/Celebration';
import { Button, Segmented, SpeakButton } from '../components/ui';
import { activityById } from '../data/catalog';
import { quizById, type QuizQuestion } from '../data/quizzes';
import { shuffle } from '../lib/random';
import { chime, speak } from '../lib/speech';
import { useSettings } from '../state/settings';
import type { Difficulty } from '../types';
import { NotFound } from '../pages/NotFound';

const CHOICES: Record<Difficulty, number> = { sensory: 2, easy: 2, medium: 3, challenging: 4 };
const QUESTIONS: Record<Difficulty, number> = { sensory: 5, easy: 8, medium: 10, challenging: 12 };

type Mode = 'play' | 'quizmaster';

export default function QuizActivity() {
  const { quiz: quizId = '' } = useParams();
  const quiz = quizById(quizId);
  const activity = activityById(`quiz-${quizId}`);
  const [mode, setMode] = useState<Mode>('play');
  if (!quiz || !activity) return <NotFound />;
  return (
    <ActivityShell activityId={activity.id} title={activity.title} emoji={quiz.emoji} tips={activity.staffTips}>
      {({ difficulty, restart, finish }) => (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="text-lg font-bold">Mode:</span>
            <Segmented
              label="Quiz mode"
              value={mode}
              options={[
                { id: 'play', label: 'Answer on screen' },
                { id: 'quizmaster', label: 'Quiz-master (group)' },
              ]}
              onChange={setMode}
            />
          </div>
          <QuizGame key={mode} questions={quiz.questions} difficulty={difficulty} mode={mode} onAgain={restart} onFinish={finish} />
        </>
      )}
    </ActivityShell>
  );
}

export function QuizGame({
  questions,
  difficulty,
  mode = 'play',
  onAgain,
  onFinish,
}: {
  questions: QuizQuestion[];
  difficulty: Difficulty;
  mode?: Mode;
  onAgain: () => void;
  onFinish: () => void;
}) {
  const { settings } = useSettings();
  const round = useMemo(() => {
    return shuffle(questions)
      .slice(0, QUESTIONS[difficulty])
      .map((q) => {
        const [answer, ...others] = q.options;
        const options = shuffle([answer, ...shuffle(others).slice(0, CHOICES[difficulty] - 1)]);
        return { ...q, answer, options };
      });
  }, [questions, difficulty]);

  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  if (index >= round.length) {
    return (
      <Celebration
        message="Quiz complete!"
        detail={mode === 'play' ? `You answered ${round.length} questions and got ${correctCount} spot on.` : `That's all ${round.length} questions.`}
        onAgain={onAgain}
        onFinish={onFinish}
      />
    );
  }

  const q = round[index];
  const answered = mode === 'play' ? chosen !== null : revealed;

  const choose = (opt: string) => {
    if (chosen) return;
    setChosen(opt);
    if (opt === q.answer) {
      setCorrectCount((c) => c + 1);
      if (settings.sounds) chime('soft');
    }
  };

  const next = () => {
    setChosen(null);
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  const feedback = () => {
    if (mode === 'quizmaster') return `The answer is: ${q.answer}`;
    if (chosen === q.answer) return `Yes! ${q.answer} is right.`;
    // Errorless: celebrate the attempt and simply share the answer.
    return `Good try! The answer is ${q.answer}.`;
  };

  return (
    <div className="mx-auto max-w-4xl">
      <p className="mt-0 text-lg font-bold text-muted">
        Question {index + 1} of {round.length}
      </p>
      <div className="mb-6 flex items-start gap-4 rounded-3xl border-2 border-line bg-surface p-6">
        {q.emoji && (
          <span aria-hidden className="text-6xl">
            {q.emoji}
          </span>
        )}
        <h2 className="m-0 flex-1 text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold leading-snug">{q.question}</h2>
        <SpeakButton text={`${q.question} Is it: ${q.options.join(', or ')}?`} />
      </div>

      <div className={`grid gap-4 ${q.options.length > 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
        {q.options.map((opt) => {
          const isAnswer = opt === q.answer;
          const showState = answered;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => (mode === 'play' ? choose(opt) : undefined)}
              disabled={mode === 'quizmaster'}
              aria-pressed={chosen === opt}
              className={`min-h-24 rounded-3xl border-4 px-6 py-4 text-left text-2xl font-bold shadow-sm ${
                showState && isAnswer
                  ? 'border-success bg-success-bg text-ink'
                  : chosen === opt
                    ? 'border-focus bg-cell-active'
                    : 'border-line bg-surface text-ink'
              } disabled:opacity-100`}
            >
              {showState && isAnswer ? '✓ ' : ''}
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <div aria-live="polite" className="animate-gentle-pop mt-6 rounded-3xl border-2 border-line bg-hint p-5">
          <p className="m-0 text-2xl font-bold">{feedback()}</p>
          {q.fact && <p className="mb-0 mt-2 text-xl">{q.fact}</p>}
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        {mode === 'quizmaster' && !revealed && (
          <Button
            variant="accent"
            onClick={() => {
              setRevealed(true);
              if (settings.speech) speak(`The answer is ${q.answer}`, settings.speechRate);
            }}
          >
            Reveal answer
          </Button>
        )}
        {answered && (
          <Button variant="primary" onClick={next}>
            Next question ▶
          </Button>
        )}
      </div>
    </div>
  );
}
