import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '../state/settings';
import { displayName, useActiveResident } from '../state/resident';
import { useOnline } from '../lib/useOnline';
import { ResidentPicker } from './ResidentPicker';
import { PinPad } from './PinPad';

const navBase = 'touch inline-flex min-h-16 min-w-16 items-center justify-center gap-2 rounded-2xl border-2 px-4 text-lg font-bold no-underline';
const navBtn = `${navBase} border-line bg-surface text-ink`;
const navActive = `${navBase} border-primary bg-primary text-on-primary`;

export function Layout() {
  const { settings, update } = useSettings();
  const { resident } = useActiveResident();
  const navigate = useNavigate();
  const location = useLocation();
  const online = useOnline();
  const [picking, setPicking] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const atHome = location.pathname === '/';

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <a href="#main" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <header className="no-print sticky top-0 z-40 border-b-2 border-line bg-bg/95 backdrop-blur">
        <nav
          aria-label="Main"
          className={`mx-auto flex max-w-6xl items-center gap-2 px-3 py-2 ${settings.leftHanded ? 'flex-row-reverse' : ''}`}
        >
          <Link to="/" className={atHome ? navActive : navBtn} aria-label="Home">
            <span aria-hidden>🏠</span>
            <span className="hidden sm:inline">Home</span>
          </Link>
          {!atHome && (
            <button type="button" className={navBtn} onClick={() => navigate(-1)} aria-label="Back">
              <span aria-hidden>◀</span>
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          <div className="flex-1" />
          {!online && (
            <span className="rounded-full bg-hint px-3 py-1 text-base font-bold" role="status">
              Offline – everything still works
            </span>
          )}
          <button type="button" className={navBtn} onClick={() => setPicking(true)} aria-label="Choose resident">
            <span aria-hidden>{resident ? '🙂' : '👥'}</span>
            <span className="max-w-40 truncate">{resident ? displayName(resident) : 'Group'}</span>
          </button>
          {settings.residentMode ? (
            <button type="button" className={navBtn} onClick={() => setPinOpen(true)} aria-label="Unlock staff mode">
              <span aria-hidden>🔒</span>
            </button>
          ) : (
            <>
              <Link to="/residents" className={navBtn} aria-label="Residents">
                <span aria-hidden>👪</span>
                <span className="hidden lg:inline">Residents</span>
              </Link>
              <Link to="/sessions" className={navBtn} aria-label="Activity log">
                <span aria-hidden>📝</span>
                <span className="hidden lg:inline">Log</span>
              </Link>
              <Link to="/settings" className={navBtn} aria-label="Settings">
                <span aria-hidden>⚙️</span>
              </Link>
            </>
          )}
        </nav>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 py-5 pb-16">
        <Outlet />
      </main>
      <ResidentPicker open={picking} onClose={() => setPicking(false)} />
      <PinPad
        open={pinOpen}
        expected={settings.pin}
        onClose={() => setPinOpen(false)}
        onSuccess={() => {
          setPinOpen(false);
          update({ residentMode: false });
        }}
      />
    </div>
  );
}
