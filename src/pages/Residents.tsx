import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { db } from '../db/db';
import { Button, LinkButton, PageTitle } from '../components/ui';
import { displayName, useActiveResident } from '../state/resident';

export default function Residents() {
  const residents = useLiveQuery(() => db.residents.orderBy('name').toArray(), []);
  const { resident: active, setResidentId } = useActiveResident();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageTitle>👪 Residents</PageTitle>
        <LinkButton to="/residents/new" variant="primary">
          ＋ Add resident
        </LinkButton>
      </div>
      <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2">
        {residents?.map((r) => (
          <li key={r.id} className="rounded-3xl border-2 border-line bg-surface p-5">
            <p className="m-0 text-2xl font-bold">
              {displayName(r)} {r.preferredName && r.preferredName !== r.name && <span className="font-normal text-muted">({r.name})</span>}
            </p>
            <p className="mt-1 text-lg text-muted">
              Room {r.room || '–'}
              {r.birthYear ? ` · born ${r.birthYear}` : ''}
              {r.hobbies ? ` · ${r.hobbies}` : ''}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button
                variant={active?.id === r.id ? 'primary' : 'accent'}
                onClick={() => {
                  setResidentId(r.id);
                  navigate('/');
                }}
              >
                {active?.id === r.id ? '✓ Doing activities' : '▶ Start activities'}
              </Button>
              <LinkButton to={`/residents/${r.id}`}>Profile</LinkButton>
            </div>
          </li>
        ))}
      </ul>
      {residents?.length === 0 && <p className="text-xl">No residents yet. Tap "Add resident" to begin.</p>}
    </div>
  );
}
