import { useState } from 'react';
import { Button, Modal } from './ui';

/** Large keypad used to leave Resident Mode. */
export function PinPad({
  open,
  expected,
  onSuccess,
  onClose,
}: {
  open: boolean;
  expected: string;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [entry, setEntry] = useState('');
  const [message, setMessage] = useState('');

  const press = (d: string) => {
    const next = (entry + d).slice(0, 8);
    setEntry(next);
    setMessage('');
    if (next.length >= expected.length) {
      if (next === expected) {
        setEntry('');
        onSuccess();
      } else {
        setEntry('');
        setMessage('That PIN did not match. Please try again.');
      }
    }
  };

  return (
    <Modal open={open} title="Staff PIN" onClose={onClose}>
      <p className="mt-0">Enter the staff PIN to leave Resident Mode.</p>
      <p aria-live="polite" className="text-center text-4xl tracking-[0.5em]">
        {'•'.repeat(entry.length) || ' '}
      </p>
      {message && <p className="text-center font-bold">{message}</p>}
      <div className="mx-auto grid max-w-sm grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <Button key={d} className="text-3xl" onClick={() => press(d)}>
            {d}
          </Button>
        ))}
        <Button onClick={() => setEntry('')}>Clear</Button>
        <Button className="text-3xl" onClick={() => press('0')}>
          0
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}
