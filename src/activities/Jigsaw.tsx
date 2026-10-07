import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ActivityShell } from '../components/ActivityShell';
import { Celebration } from '../components/Celebration';
import { Button } from '../components/ui';
import { activityById } from '../data/catalog';
import { SCENES, sceneUrl } from '../data/scenes';
import { db } from '../db/db';
import { useActiveResident, displayName } from '../state/resident';
import { useSettings } from '../state/settings';
import { chime } from '../lib/speech';
import { shuffle } from '../lib/random';
import type { Difficulty } from '../types';
import { NotFound } from '../pages/NotFound';
import { useObjectUrl } from '../lib/useObjectUrl';

const GRID: Record<Difficulty, [number, number]> = {
  sensory: [2, 2],
  easy: [3, 2],
  medium: [4, 3],
  challenging: [6, 4],
};

export default function JigsawActivity() {
  const { scene: sceneId = '' } = useParams();
  const scene = SCENES.find((s) => s.id === sceneId);
  const activity = activityById(`jigsaw-${sceneId}`);
  if (sceneId === 'photo') return <PhotoJigsaw />;
  if (!scene || !activity) return <NotFound />;
  return (
    <ActivityShell activityId={activity.id} title={activity.title} emoji="🧩" tips={activity.staffTips}>
      {({ difficulty, restart, finish }) => (
        <JigsawGame image={sceneUrl(scene)} difficulty={difficulty} onAgain={restart} onFinish={finish} />
      )}
    </ActivityShell>
  );
}

function PhotoJigsaw() {
  const activity = activityById('jigsaw-photo')!;
  const { resident } = useActiveResident();
  const photos = useLiveQuery(
    () => (resident?.id !== undefined && resident.photoConsent ? db.photos.where('residentId').equals(resident.id).toArray() : []),
    [resident?.id, resident?.photoConsent],
  );
  const [photoId, setPhotoId] = useState<number | undefined>();
  const chosen = photos?.find((p) => p.id === photoId);
  const url = useObjectUrl(chosen?.blob);

  return (
    <ActivityShell activityId={activity.id} title={activity.title} emoji="🖼️" tips={activity.staffTips}>
      {({ difficulty, restart, finish }) => {
        if (!resident) return <p className="text-xl">Choose a resident first using the button at the top of the screen.</p>;
        if (!resident.photoConsent)
          return <p className="text-xl">{displayName(resident)} does not have photo consent recorded. Update their profile to use photos.</p>;
        if (!photos?.length) return <p className="text-xl">No photos yet. Add some from {displayName(resident)}'s profile.</p>;
        if (!chosen || !url)
          return (
            <div>
              <p className="text-xl">Choose a photo:</p>
              <PhotoChoices photos={photos} onPick={setPhotoId} />
            </div>
          );
        return <JigsawGame image={url} difficulty={difficulty} onAgain={restart} onFinish={finish} />;
      }}
    </ActivityShell>
  );
}

function PhotoChoices({ photos, onPick }: { photos: { id?: number; blob: Blob; caption: string }[]; onPick: (id: number) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {photos.map((p) => (
        <PhotoThumb key={p.id} blob={p.blob} caption={p.caption} onClick={() => onPick(p.id!)} />
      ))}
    </div>
  );
}

function PhotoThumb({ blob, caption, onClick }: { blob: Blob; caption: string; onClick: () => void }) {
  const url = useObjectUrl(blob);
  return (
    <button type="button" onClick={onClick} className="overflow-hidden rounded-2xl border-2 border-line bg-surface p-0">
      {url && <img src={url} alt={caption || 'Photo'} className="aspect-[4/3] w-full object-cover" />}
      {caption && <span className="block p-2 text-lg">{caption}</span>}
    </button>
  );
}

interface Drag {
  piece: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  moved: boolean;
}

export function JigsawGame({
  image,
  difficulty,
  onAgain,
  onFinish,
}: {
  image: string;
  difficulty: Difficulty;
  onAgain: () => void;
  onFinish: () => void;
}) {
  const { settings } = useSettings();
  const [cols, rows] = GRID[difficulty];
  const total = cols * rows;
  const order = useMemo(() => shuffle(Array.from({ length: total }, (_, i) => i)), [total]);
  const [placed, setPlaced] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<number | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [hintSlot, setHintSlot] = useState<number | null>(null);
  const [message, setMessage] = useState('Drag a piece onto the picture, or tap a piece and then tap where it goes.');
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(600);

  useLayoutEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const measure = () => setBoardWidth(el.getBoundingClientRect().width || 600);
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : undefined;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, []);

  const pieceW = boardWidth / cols;
  const pieceH = (boardWidth * 0.75) / rows;
  const complete = placed.size === total;

  const bgStyle = (index: number) => {
    const c = index % cols;
    const r = Math.floor(index / cols);
    return {
      backgroundImage: `url("${image}")`,
      backgroundSize: `${cols * 100}% ${rows * 100}%`,
      backgroundPosition: `${cols === 1 ? 0 : (c / (cols - 1)) * 100}% ${rows === 1 ? 0 : (r / (rows - 1)) * 100}%`,
    };
  };

  const place = (piece: number) => {
    setPlaced((p) => new Set(p).add(piece));
    setSelected(null);
    setHintSlot(null);
    setMessage(placed.size + 1 === total ? '' : 'Lovely, that fits!');
    if (settings.sounds) chime('soft');
  };

  const slotAt = (x: number, y: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const c = Math.floor((x - rect.left) / (rect.width / cols));
    const r = Math.floor((y - rect.top) / (rect.height / rows));
    if (c < 0 || c >= cols || r < 0 || r >= rows) return null;
    return { c, r, fx: (x - rect.left) / (rect.width / cols), fy: (y - rect.top) / (rect.height / rows) };
  };

  // Snap generously: anywhere within about half a piece of the right spot counts.
  const near = (piece: number, x: number, y: number) => {
    const s = slotAt(x, y);
    if (!s) return false;
    const tc = (piece % cols) + 0.5;
    const tr = Math.floor(piece / cols) + 0.5;
    return Math.abs(s.fx - tc) < 1 && Math.abs(s.fy - tr) < 1;
  };

  const dragRef = useRef<Drag | null>(null);
  const updateDrag = (d: Drag | null) => {
    dragRef.current = d;
    setDrag(d);
  };

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      updateDrag({ ...d, x: e.clientX, y: e.clientY, moved: d.moved || Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 10 });
    };
    const up = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      updateDrag(null);
      if (!d.moved) {
        setSelected(d.piece);
        setMessage('Now tap the spot on the picture where it goes.');
      } else if (near(d.piece, e.clientX, e.clientY)) {
        place(d.piece);
      } else if (slotAt(e.clientX, e.clientY)) {
        setSelected(d.piece);
        setMessage('Not quite there. Try a different spot, or tap Hint.');
      }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }); // re-bound each render so the handlers see the latest state

  const tapSlot = (slot: number) => {
    if (selected === null || placed.has(slot)) return;
    if (slot === selected) place(selected);
    else setMessage('Not that spot. Have another try, or tap Hint.');
  };

  const showHint = () => {
    const piece = selected ?? order.find((p) => !placed.has(p));
    if (piece === undefined) return;
    setSelected(piece);
    setHintSlot(piece);
    setMessage('The glowing square shows where the chosen piece goes.');
  };

  return (
    <div>
      {complete ? (
        <div className="mb-4">
          <Celebration detail="The picture is complete." onAgain={onAgain} onFinish={onFinish} />
        </div>
      ) : (
        <p aria-live="polite" className="mt-0 rounded-3xl border-2 border-line bg-hint p-4 text-xl font-bold">
          {message}
        </p>
      )}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div
          ref={boardRef}
          aria-label="Jigsaw board"
          className="relative grid w-full overflow-hidden rounded-2xl border-4 border-line touch-none-scroll"
          style={{ aspectRatio: '4 / 3', gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
        >
          {/* Faint guide picture underneath makes it an errorless puzzle at easier levels. */}
          {difficulty !== 'challenging' && (
            <img src={image} alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25" />
          )}
          {Array.from({ length: total }, (_, slot) => (
            <button
              key={slot}
              type="button"
              aria-label={placed.has(slot) ? `Piece ${slot + 1} placed` : `Empty space ${slot + 1}`}
              onClick={() => tapSlot(slot)}
              style={{ minWidth: 0, minHeight: 0, ...(placed.has(slot) ? bgStyle(slot) : {}) }}
              className={`relative border p-0 ${placed.has(slot) ? 'border-transparent' : 'border-dashed border-line bg-transparent'} ${
                hintSlot === slot ? 'animate-pulse bg-accent/60 outline outline-4 outline-focus' : ''
              }`}
            />
          ))}
        </div>

        <div aria-label="Pieces" className="flex flex-wrap content-start gap-3">
          {order
            .filter((p) => !placed.has(p))
            .map((p) => (
              <button
                key={p}
                type="button"
                aria-label={`Puzzle piece${selected === p ? ', selected' : ''}`}
                aria-pressed={selected === p}
                onPointerDown={(e) => {
                  e.preventDefault();
                  updateDrag({ piece: p, x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY, moved: false });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelected(p);
                  }
                }}
                className={`shrink-0 rounded-lg border-4 p-0 shadow-md touch-none-scroll ${selected === p ? 'border-focus' : 'border-surface'} ${
                  drag?.piece === p && drag.moved ? 'opacity-30' : ''
                }`}
                style={{ width: Math.min(pieceW, 220), height: Math.min(pieceW, 220) * (pieceH / pieceW), minWidth: 0, minHeight: 0, ...bgStyle(p) }}
              />
            ))}
          {!complete && (
            <div className="w-full">
              <Button onClick={showHint}>💡 Hint</Button>
            </div>
          )}
        </div>
      </div>

      {drag?.moved && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-50 rounded-lg border-4 border-focus shadow-2xl"
          style={{ width: pieceW, height: pieceH, left: drag.x - pieceW / 2, top: drag.y - pieceH / 2, ...bgStyle(drag.piece) }}
        />
      )}
    </div>
  );
}
