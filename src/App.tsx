import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ToastProvider } from './components/Toast';
import { SettingsProvider, useSettings } from './state/settings';
import { ActiveResidentProvider } from './state/resident';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import Library from './pages/Library';
import { NotFound } from './pages/NotFound';

const Crossword = lazy(() => import('./activities/Crossword'));
const WordSearch = lazy(() => import('./activities/WordSearch'));
const Jigsaw = lazy(() => import('./activities/Jigsaw'));
const MemoryMatch = lazy(() => import('./activities/MemoryMatch'));
const Quiz = lazy(() => import('./activities/Quiz'));
const TodayInHistory = lazy(() => import('./activities/TodayInHistory'));
const MemoryBox = lazy(() => import('./activities/Memories'));
const LifeStory = lazy(() => import('./activities/Memories').then((m) => ({ default: m.LifeStoryActivity })));
const Singalong = lazy(() => import('./activities/Singalong'));
const Residents = lazy(() => import('./pages/Residents'));
const ResidentProfile = lazy(() => import('./pages/ResidentProfile'));
const Sessions = lazy(() => import('./pages/Sessions'));
const Settings = lazy(() => import('./pages/Settings'));

/** Staff-only screens are hidden while the tablet is in Resident Mode. */
function StaffOnly({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  if (settings.residentMode)
    return (
      <div className="py-10 text-center">
        <p className="text-6xl" aria-hidden>
          🔒
        </p>
        <h1 className="text-3xl font-bold">This area is for staff</h1>
        <p className="text-xl">Tap the 🔒 button at the top and enter the staff PIN.</p>
      </div>
    );
  return children;
}

function Loading() {
  return <p className="py-10 text-center text-2xl">Getting it ready…</p>;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:id" element={<CategoryPage />} />
          <Route path="library" element={<Library />} />
          <Route path="play/history" element={<TodayInHistory />} />
          <Route path="play/crossword/:theme" element={<Crossword />} />
          <Route path="play/wordsearch/:theme" element={<WordSearch />} />
          <Route path="play/jigsaw/:scene" element={<Jigsaw />} />
          <Route path="play/match/:set" element={<MemoryMatch />} />
          <Route path="play/quiz/:quiz" element={<Quiz />} />
          <Route path="play/memories/:box" element={<MemoryBox />} />
          <Route path="play/life-story" element={<LifeStory />} />
          <Route path="play/sing/:song" element={<Singalong />} />
          <Route path="residents" element={<StaffOnly><Residents /></StaffOnly>} />
          <Route path="residents/:id" element={<StaffOnly><ResidentProfile /></StaffOnly>} />
          <Route path="sessions" element={<StaffOnly><Sessions /></StaffOnly>} />
          <Route path="settings" element={<StaffOnly><Settings /></StaffOnly>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <ActiveResidentProvider>
        <ToastProvider>{children}</ToastProvider>
      </ActiveResidentProvider>
    </SettingsProvider>
  );
}

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Providers>
  );
}
