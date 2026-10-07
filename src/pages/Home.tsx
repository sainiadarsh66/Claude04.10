import { useNavigate } from 'react-router-dom';
import { Tile } from '../components/ui';
import { ACTIVITIES, CATEGORIES, activitiesIn } from '../data/catalog';
import { itemsForDate } from '../data/history';
import { formatLongDate } from '../activities/TodayInHistory';
import { displayName, useActiveResident } from '../state/resident';
import { useSettings } from '../state/settings';
import { pickSurprise, suitableFor } from '../lib/suitability';

function greeting(d: Date) {
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const now = new Date();
  const { settings } = useSettings();
  const { resident } = useActiveResident();
  const navigate = useNavigate();
  const today = itemsForDate(now, resident?.avoidTopics ?? []);
  const teaser = today.find((i) => i.kind === 'event') ?? today[0];

  // A different quiz each day, so "Quiz of the day" feels fresh.
  const quizzes = activitiesIn('quizzes').filter((a) => suitableFor(a, resident));
  const dayIndex = Math.floor(now.getTime() / 86_400_000);
  const quizOfDay = quizzes[dayIndex % Math.max(1, quizzes.length)];

  const who = resident ? `with ${displayName(resident)}` : settings.staffName ? settings.staffName : '';

  return (
    <div>
      <header className="mb-6">
        <p className="m-0 text-2xl text-muted">{formatLongDate(now)}</p>
        <h1 className="m-0 text-4xl font-bold leading-tight">
          {greeting(now)}
          {who && !resident ? `, ${who}` : ''}
        </h1>
        {resident && <p className="m-0 text-2xl">Activities suited to {displayName(resident)}</p>}
      </header>

      <section aria-label="Start now" className="mb-8 grid gap-4 md:grid-cols-3">
        <Tile
          to="/play/history"
          emoji="📅"
          title="Today in History"
          subtitle={teaser ? `${teaser.year ? `${teaser.year}: ` : ''}${teaser.text}` : 'What happened on this day'}
        />
        <Tile
          emoji="🎲"
          title="Surprise me"
          subtitle="Pick a random activity"
          onClick={() => {
            const a = pickSurprise(ACTIVITIES, resident);
            if (a) navigate(a.path);
          }}
        />
        {quizOfDay && <Tile to={quizOfDay.path} emoji={quizOfDay.emoji} title="Quiz of the day" subtitle={quizOfDay.title.replace('Quiz: ', '')} />}
      </section>

      <h2 className="text-2xl font-bold">Choose an activity</h2>
      <section aria-label="Categories" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Tile
            key={c.id}
            to={c.id === 'history' ? '/play/history' : `/category/${c.id}`}
            emoji={c.emoji}
            title={c.title}
            subtitle={c.blurb}
          />
        ))}
        <Tile to="/library" emoji="🔎" title="All activities" subtitle="Search and filter" />
      </section>
    </div>
  );
}
