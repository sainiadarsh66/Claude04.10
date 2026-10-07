import { useParams } from 'react-router-dom';
import { PageTitle, Tile } from '../components/ui';
import { CATEGORIES, activitiesIn } from '../data/catalog';
import { useActiveResident } from '../state/resident';
import { suitableFor } from '../lib/suitability';
import type { CategoryId } from '../types';
import { NotFound } from './NotFound';

export default function CategoryPage() {
  const { id } = useParams();
  const category = CATEGORIES.find((c) => c.id === id);
  const { resident } = useActiveResident();
  if (!category) return <NotFound />;
  const items = activitiesIn(category.id as CategoryId).filter((a) => suitableFor(a, resident));

  return (
    <div>
      <PageTitle speakText={`${category.title}. ${category.blurb}`}>
        <span aria-hidden className="mr-2">
          {category.emoji}
        </span>
        {category.title}
      </PageTitle>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((a) => (
          <Tile key={a.id} to={a.path} emoji={a.emoji} title={a.title} subtitle={`${a.minutes} min · ${groupLabel(a.group)}`} />
        ))}
      </div>
    </div>
  );
}

export function groupLabel(g: string) {
  return g === 'one-to-one' ? 'One-to-one' : g === 'group' ? 'Group' : 'One-to-one or group';
}
