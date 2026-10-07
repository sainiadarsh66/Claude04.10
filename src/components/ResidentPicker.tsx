import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { displayName, useActiveResident } from '../state/resident';
import { Button, Modal } from './ui';

export function ResidentPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const residents = useLiveQuery(() => db.residents.orderBy('name').toArray(), []);
  const { resident, setResidentId } = useActiveResident();

  return (
    <Modal open={open} title="Who are you with?" onClose={onClose}>
      <p className="mt-0 text-muted">Choosing a resident tailors difficulty and topics to them.</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {residents?.map((r) => (
          <Button
            key={r.id}
            variant={resident?.id === r.id ? 'primary' : 'secondary'}
            className="justify-start text-left"
            onClick={() => {
              setResidentId(r.id);
              onClose();
            }}
          >
            <span aria-hidden className="text-3xl">🙂</span>
            <span>
              {displayName(r)}
              <span className="block text-base font-normal opacity-80">Room {r.room || '–'}</span>
            </span>
          </Button>
        ))}
        <Button
          variant={resident ? 'secondary' : 'primary'}
          onClick={() => {
            setResidentId(undefined);
            onClose();
          }}
        >
          👥 A group, or no one in particular
        </Button>
      </div>
      {residents?.length === 0 && <p>No residents yet. Add them in Residents.</p>}
    </Modal>
  );
}
