# Activity Hub

A tablet-first web app for care homes. Staff pick up the tablet, choose an activity in two taps, and do it with a resident or a group. Phase 1 of the plan in [ACTIVITY_HUB_PROMPT.md](ACTIVITY_HUB_PROMPT.md).

## What's in Phase 1

| Area | What it does |
|---|---|
| **Home** | Big tiles, Today in History teaser, "Surprise me", Quiz of the day |
| **Today in History** | Events, birthdays and celebrations for every day of the year (moveable feasts such as Easter are calculated), talking points, read-aloud, print, a "birth year" view per resident, and optional filtered extras from Wikipedia when online |
| **Word games** | Crosswords generated from 12 themed word lists, with a large on-screen keyboard and "Show a letter". Word searches use tap-first-then-last selection |
| **Puzzles** | Jigsaws (built-in pictures or the resident's own photos) with generous snapping. Matching pairs |
| **Quizzes** | 8 quiz banks; "Answer on screen" or "Quiz-master" mode for groups. Errorless: never says "wrong" |
| **Reminiscence** | 9 memory boxes with conversation prompts, plus "My Life Story" from the resident's profile and photos |
| **Music** | 14 public-domain songs with line-by-line large lyrics and auto-scroll |
| **Residents** | Person-centred profiles: life history, topics to avoid, care needs, photo consent, photos, activity history |
| **Session log** | Finish → smiley → Save (3 taps). Optional mood before/after and a note. CSV export |
| **Accessibility** | 20px base text (up to 200%), calm / dark / high-contrast themes, read-aloud, gentle sounds, reduce motion, left-handed layout, 64px touch targets |
| **Resident Mode** | Hides staff screens; unlock with the staff PIN (default `1234`, change it in Settings) |
| **Offline** | Installable PWA; everything works without Wi-Fi after the first visit |

Every activity has Simple / Easy / Medium / Challenging levels (where it makes sense), a "Staff tips" panel and a Finish button. Choosing a resident sets the starting level from their profile and hides activities and history on their "topics to avoid".

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build in dist/
npm run preview      # serve the build (needed to test offline mode)
```

Three sample residents are added on first run so there is something to explore.

## Tests

```bash
npm test             # unit and component tests (Vitest + Testing Library)
npm run test:e2e     # Playwright on tablet viewports: axe accessibility, 64px targets, offline, session logging
```

If Playwright can't find a browser, point it at one: `PW_CHROMIUM_PATH=/path/to/chrome npm run test:e2e`.

## Project layout

```
src/
  activities/   one file per activity (Crossword, WordSearch, Jigsaw, MemoryMatch, Quiz, TodayInHistory, Memories, Singalong)
  components/   shared UI: Layout, ActivityShell (title, level, tips, Finish), LogSessionDialog, buttons and tiles
  data/         content: catalog, word lists, quizzes, history, memory boxes, songs, jigsaw pictures
  db/           IndexedDB (Dexie): residents, photos, sessions
  lib/          crossword and word-search generators, speech, suitability rules
  pages/        Home, Category, Library, Residents, ResidentProfile, Sessions, Settings
  state/        settings and active-resident contexts
e2e/            Playwright tests
docs/           staff quick-start guide
```

## Adding content

- **Word list** (new crossword and word search): add a theme to `src/data/wordlists.ts`. Words are 3–10 letters, A–Z.
- **Quiz**: add a bank to `src/data/quizzes.ts`. The first option is the correct answer.
- **History**: add a row to `src/data/history.ts`. Tag anything about war with `'war'`.
- **Songs**: only add lyrics that are public domain or that you are licensed to display.

New items appear in the catalogue automatically.

## Data and privacy

In Phase 1 all data stays on the tablet, in the browser's IndexedDB. Nothing is sent anywhere except the optional "More from Wikipedia" request, which sends only the date. Settings → Export downloads residents and records as JSON. Deleting a resident removes their photos and their entries in activity records. Every session record has a `syncedAt` field ready for server sync in a later phase.
