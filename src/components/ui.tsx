import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../state/settings';
import { speak } from '../lib/speech';

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-on-primary border-primary',
  secondary: 'bg-surface text-ink border-line',
  accent: 'bg-accent text-on-accent border-accent',
  ghost: 'bg-transparent text-ink border-transparent',
};

export function Button({
  variant = 'secondary',
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border-2 px-5 py-3 text-lg font-bold shadow-sm transition-transform active:scale-[0.97] disabled:opacity-50 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  to,
  variant = 'secondary',
  className = '',
  children,
}: {
  to: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`touch inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl border-2 px-5 py-3 text-lg font-bold no-underline shadow-sm ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

/** Big picture tile used on launcher screens. */
export function Tile({
  to,
  emoji,
  title,
  subtitle,
  onClick,
}: {
  to?: string;
  emoji: string;
  title: string;
  subtitle?: string;
  onClick?: () => void;
}) {
  const body = (
    <>
      <span aria-hidden className="text-5xl leading-none sm:text-6xl">
        {emoji}
      </span>
      <span className="text-xl font-bold leading-tight">{title}</span>
      {subtitle && <span className="text-base leading-snug text-muted">{subtitle}</span>}
    </>
  );
  const cls =
    'touch flex min-h-40 flex-col items-center justify-center gap-2 rounded-3xl border-2 border-line bg-surface p-4 text-center text-ink no-underline shadow-sm transition-transform active:scale-[0.98]';
  if (to)
    return (
      <Link to={to} className={cls}>
        {body}
      </Link>
    );
  return (
    <button type="button" onClick={onClick} className={`${cls} w-full`}>
      {body}
    </button>
  );
}

export function SpeakButton({ text, label = 'Read aloud' }: { text: string; label?: string }) {
  const { settings } = useSettings();
  if (!settings.speech) return null;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => speak(text, settings.speechRate)}
      className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-line bg-surface text-2xl"
    >
      🔊
    </button>
  );
}

export function PageTitle({ children, speakText }: { children: ReactNode; speakText?: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h1 className="m-0 text-3xl font-bold leading-tight sm:text-4xl">{children}</h1>
      {speakText && <SpeakButton text={speakText} />}
    </div>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-[min(46rem,100%)] overflow-auto rounded-3xl border-2 border-line bg-surface p-6 text-ink shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="m-0 text-2xl font-bold">{title}</h2>
          <Button variant="ghost" aria-label="Close" onClick={onClose}>
            ✕
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-2xl border-2 px-4 py-2 text-lg font-bold ${
            value === o.id ? 'border-primary bg-primary text-on-primary' : 'border-line bg-surface text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border-2 border-line bg-surface px-5 py-3 text-left"
    >
      <span>
        <span className="block text-lg font-bold">{label}</span>
        {description && <span className="block text-base text-muted">{description}</span>}
      </span>
      <span
        aria-hidden
        className={`relative inline-block h-10 w-18 shrink-0 rounded-full border-2 ${checked ? 'border-primary bg-primary' : 'border-line bg-surface-2'}`}
      >
        <span
          className={`absolute top-1 h-7 w-7 rounded-full bg-surface shadow transition-all ${checked ? 'left-9' : 'left-1'}`}
        />
      </span>
    </button>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-lg font-bold">{label}</span>
      {hint && <span className="mb-1 block text-base text-muted">{hint}</span>}
      {children}
    </label>
  );
}

export const inputClass =
  'w-full min-h-16 rounded-2xl border-2 border-line bg-surface px-4 py-3 text-lg text-ink placeholder:text-muted';
