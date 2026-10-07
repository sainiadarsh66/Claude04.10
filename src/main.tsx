import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import './index.css';
import App from './App';
import { seedIfEmpty } from './db/db';

registerSW({ immediate: true });

// Ask the browser not to clear our data when storage runs low.
navigator.storage?.persist?.().catch(() => {});
seedIfEmpty().catch(() => {});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
