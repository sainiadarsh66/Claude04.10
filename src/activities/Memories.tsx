import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ActivityShell } from '../components/ActivityShell';
import { Button, LinkButton, SpeakButton } from '../components/ui';
import { activityById } from '../data/catalog';
import { memoryBoxById } from '../data/reminiscence';
import { db } from '../db/db';
import { displayName, useActiveResident } from '../state/resident';
import { useObjectUrl } from '../lib/useObjectUrl';
import { NotFound } from '../pages/NotFound';
import type { Resident, ResidentPhoto } from '../types';

export default function MemoryBoxActivity() {
  const { box: boxId = '' } = useParams();
  const box = memoryBoxById(boxId);
  const activity = activityById(`memories-${boxId}`);
  const [index, setIndex] = useState(0);
  if (!box || !activity) return <NotFound />;
  const card = box.cards[index];
  return (
    <ActivityShell activityId={activity.id} title={box.title} emoji={box.emoji} tips={activity.staffTips} withDifficulty={false}>
      {() => (
        <div className="mx-auto max-w-4xl">
          <p className="mt-0 text-xl">{box.intro}</p>
          <Carousel
            index={index}
            count={box.cards.length}
            onChange={setIndex}
            render={() => (
              <div className="flex flex-col items-center gap-4 text-center">
                <span aria-hidden className="text-[clamp(6rem,20vw,11rem)] leading-none">
                  {card.emoji}
                </span>
                <h2 className="m-0 text-4xl font-bold">{card.title}</h2>
                <div className="flex items-center gap-3">
                  <p className="m-0 text-2xl">{card.prompt}</p>
                  <SpeakButton text={`${card.title}. ${card.prompt}`} />
                </div>
              </div>
            )}
          />
        </div>
      )}
    </ActivityShell>
  );
}

export function Carousel({
  index,
  count,
  onChange,
  render,
}: {
  index: number;
  count: number;
  onChange: (i: number) => void;
  render: () => React.ReactNode;
}) {
  return (
    <div>
      <div className="min-h-[24rem] rounded-3xl border-2 border-line bg-surface p-6">{render()}</div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <Button className="min-w-32" disabled={index === 0} onClick={() => onChange(index - 1)} aria-label="Previous">
          ◀ Back
        </Button>
        <span className="text-xl font-bold">
          {index + 1} of {count}
        </span>
        <Button className="min-w-32" variant="primary" disabled={index === count - 1} onClick={() => onChange(index + 1)} aria-label="Next">
          Next ▶
        </Button>
      </div>
    </div>
  );
}

export function LifeStoryActivity() {
  const activity = activityById('memories-life-story')!;
  const { resident } = useActiveResident();
  return (
    <ActivityShell activityId={activity.id} title={activity.title} emoji="📖" tips={activity.staffTips} withDifficulty={false}>
      {() =>
        resident ? (
          <LifeStory resident={resident} />
        ) : (
          <p className="text-xl">Choose a resident first using the button at the top of the screen.</p>
        )
      }
    </ActivityShell>
  );
}

function LifeStory({ resident }: { resident: Resident }) {
  const photos = useLiveQuery(
    () => (resident.photoConsent && resident.id !== undefined ? db.photos.where('residentId').equals(resident.id).sortBy('createdAt') : []),
    [resident.id, resident.photoConsent],
  );
  const [index, setIndex] = useState(0);
  const name = displayName(resident);
  const facts = [
    resident.birthYear && ['🎂', `Born in ${resident.birthYear}`],
    resident.occupation && ['🛠️', `Worked as: ${resident.occupation}`],
    resident.hobbies && ['🎨', `Enjoys: ${resident.hobbies}`],
    resident.favouriteMusic && ['🎵', `Favourite music: ${resident.favouriteMusic}`],
    resident.likes && ['💛', `Likes: ${resident.likes}`],
    resident.faith && ['🕊️', `Faith: ${resident.faith}`],
  ].filter(Boolean) as [string, string][];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section>
        <h2 className="mt-0 text-3xl font-bold">All about {name}</h2>
        <ul className="m-0 list-none space-y-3 p-0">
          {facts.map(([emoji, text]) => (
            <li key={text} className="flex items-center gap-3 rounded-2xl border-2 border-line bg-surface p-4 text-xl">
              <span aria-hidden className="text-3xl">{emoji}</span>
              <span className="flex-1">{text}</span>
            </li>
          ))}
        </ul>
        {facts.length === 0 && <p className="text-xl">Add life history to {name}'s profile to see it here.</p>}
      </section>
      <section>
        <h2 className="mt-0 text-3xl font-bold">Photos</h2>
        {!resident.photoConsent ? (
          <p className="text-xl">Photo consent isn't recorded for {name}.</p>
        ) : photos && photos.length > 0 ? (
          <Carousel index={Math.min(index, photos.length - 1)} count={photos.length} onChange={setIndex} render={() => <Photo photo={photos[Math.min(index, photos.length - 1)]} />} />
        ) : (
          <div>
            <p className="text-xl">No photos yet.</p>
            <LinkButton to={`/residents/${resident.id}`}>Add photos</LinkButton>
          </div>
        )}
      </section>
    </div>
  );
}

function Photo({ photo }: { photo: ResidentPhoto }) {
  const url = useObjectUrl(photo.blob);
  return (
    <figure className="m-0 text-center">
      {url && <img src={url} alt={photo.caption || 'Photo'} className="mx-auto max-h-[60vh] w-full rounded-2xl object-contain" />}
      {photo.caption && <figcaption className="mt-3 text-2xl">{photo.caption}</figcaption>}
    </figure>
  );
}
