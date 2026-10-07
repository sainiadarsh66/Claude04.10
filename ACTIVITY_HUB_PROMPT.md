# Build Prompt: "Activity Hub", a Tablet-First Activity Platform for Care Homes

## 1. Role
You are a senior full-stack engineer and UX designer who has worked in health and social care. Build a production-quality, accessible, tablet-first progressive web app (PWA) called **Activity Hub**.

## 2. Purpose & Problem
Care home staff are often short on time and lack ready-made, engaging material for activities with residents, many of whom live with dementia, sight or hearing loss, or limited mobility. Activity Hub is a **complete toolkit in one tablet**: a member of staff picks up the device, chooses an activity in two taps or fewer, and runs it with a resident or a group. Coordinators plan the activity calendar, build custom content and record participation and wellbeing outcomes.

## 3. Users & Personas
| Persona | Needs |
|---|---|
| **Care Assistant** (main user, low tech confidence, little time) | Big buttons, a "Start activity now" button, clear instructions on screen, no setup |
| **Activity Coordinator** | Plan a weekly or monthly calendar, create and customise content, assign activities, see reports |
| **Home Manager** | Engagement reports for CQC/inspection evidence, staff usage, resident wellbeing trends |
| **Resident** (indirect user, uses the screen with staff) | High contrast, large text, simple interactions, no time pressure, nothing that makes them feel they have failed |
| **Family member** (optional, phase 3) | Upload photos/memories for reminiscence, see activity highlights |

## 4. Core Principles (non-negotiable)
1. **Tablet-first, touch-first**: designed for 10–13" tablets in landscape and portrait; also works on desktop and phone.
2. **Dementia-friendly design**: minimum 20px body text (resizable up to 200%), WCAG 2.2 AA (aim for AAA contrast), touch targets of at least 64px, no flashing content, no countdown timers by default, plain language, icons with labels, calm colour palette, a single clear focus per screen.
3. **Errorless and failure-free**: games never say "wrong". Give gentle hints and celebrate taking part.
4. **Offline-capable**: core content and games work without Wi-Fi (care home Wi-Fi is often poor). Data syncs when the connection returns.
5. **Two-tap start**: from the home screen, any activity can start within 2 taps.
6. **Privacy by design**: GDPR / UK Data Protection Act compliant. Keep resident data to the minimum needed, use role-based access, and keep an audit log.
7. **Adjustable difficulty**: every activity has Easy / Medium / Challenging levels, plus a "Sensory/Simple" mode for advanced dementia.

## 5. Feature Modules

### 5.1 Home / Launcher (Staff "Grab & Go" mode)
- Large tiles: **Today's Plan**, **Quick Activities**, **Games**, **Reminiscence**, **Music**, **Today in History**, **Quizzes**, **Relax & Sensory**, **Exercise**, **Creative**.
- "Surprise me": a random activity suited to the selected resident's profile.
- Filter by: one-to-one vs group, duration (5/15/30/60 min), seated or bed-bound, cognitive level, mood (calming vs stimulating).
- Optional "Resident Mode" lock that hides admin features, with a PIN to exit.

### 5.2 Activity Planner & Calendar (Coordinator)
- Drag-and-drop weekly or monthly calendar; recurring events; activities per room or lounge; staff assignment.
- Built-in **awareness days calendar** (national days, religious and cultural festivals, seasons, sports events, birthdays of residents) with suggested matching activities.
- Activity templates with: title, objectives, materials needed, step-by-step staff guide, risk notes, duration, group size, and suitability tags.
- Printable / PDF weekly planner and posters for noticeboards (large print).
- Notifications for upcoming sessions on staff tablets.

### 5.3 Content & Resource Library
Searchable, taggable library. Each item has a staff guide and conversation prompts.
- **Word games**: crosswords (auto-generated from themed word lists, adjustable grid size), word searches, anagrams, "finish the proverb/song lyric", hangman-style word reveal without a "losing" state.
- **Puzzles**: jigsaws made from any image (6–100 pieces, snap-assist), sliding puzzles, spot the difference, matching pairs/memory cards, sorting and categorising (e.g. sort fruit vs vegetables), sudoku (4×4 to 9×9), pattern completion.
- **Today in History / "On This Day"**: auto-populated for the current date: historical events, famous birthdays, "what it cost in 1955", number-one songs, film releases, and memory prompts tied to the decades residents grew up in (1930s–1970s). Includes "This week in [year]" and a "Your birth year" feature that builds from the resident's birth year.
- **3D & interactive games** (WebGL / Three.js): virtual garden (plant and grow flowers), 3D bowls/skittles, fishing by the pond, balloon pop (slow and gentle), virtual aquarium, 3D jigsaw sphere, driving through a countryside scene, virtual walks (seaside, countryside, famous cities) with narration.
- **Quizzes & trivia**: multiple choice with big answer buttons, picture rounds, music rounds ("name that tune"), general knowledge, local history, sports, film stars, royals. Has a group "quiz-master" mode where staff read questions aloud and the screen is shown to a group (casting support).
- **Reminiscence**: themed memory boxes (school days, wartime, holidays, wedding days, 1960s fashion, old adverts, cars, household items), photo galleries with prompts ("Did you ever have one of these?"), personal life-story books per resident (photos, family, career, places).
- **Music & singing**: era playlists, singalong lyrics in large text, karaoke mode, hymns, musical instrument sound pads, "music for calm" (licence-aware: royalty-free/public domain or streaming integration).
- **Relax & Sensory**: calming visuals (lava lamp, fireworks, aquarium, nature scenes), touch-reactive colour/ripple screens, breathing guides, ambient sounds, guided relaxation.
- **Movement & exercise**: seated exercise videos (chair yoga, armchair aerobics), with intensity levels and safety notes.
- **Creative**: digital colouring (tap-to-fill, large regions), drawing pad, simple poetry and story builder, art appreciation (famous paintings with discussion prompts).
- **Conversation starters & discussion cards**: themed question decks, "would you rather", debate topics, news in simple language.
- **Daily newsletter generator**: a one-page printable "Daily Chronicle" (date, weather, on this day, joke, quiz, word puzzle, birthday shout-outs) in large print.
- **Printable resources**: every puzzle/quiz can be exported as a large-print PDF worksheet.

### 5.4 Content Creator Studio (Coordinator)
- Create custom crosswords/word searches from a word list (e.g. resident names, local places).
- Build custom quizzes (text, image, audio questions).
- Upload photos (with consent flags) to make jigsaws, memory games and reminiscence galleries.
- Create step-by-step activity guides (rich text + images + video).
- **AI assistant** (optional, behind a feature flag): "Generate a 20-minute 1950s-themed reminiscence session for a group of 6 with moderate dementia" → produces a plan, quiz, discussion prompts and a printable sheet. Staff review before publishing.
- Share content between homes in the same organisation; version and approval workflow.

### 5.5 Resident Profiles (Person-Centred)
- Name, photo, room, preferred name, birth year, life history highlights, hobbies, past occupation, favourite music/era, faith/culture, likes/dislikes, communication needs, sensory needs, cognitive level, mobility, and **triggers or topics to avoid** (e.g. bereavement, war).
- Recommendations engine: suggest activities based on profile and past engagement.
- Consent recording for photos and data sharing.

### 5.6 Session Logging & Outcomes
- After each activity: quick log in 3 taps or fewer: who took part, duration, engagement level (smiley scale 1–5), mood before and after, free-text note or voice note.
- Group attendance register.
- Can be logged offline.

### 5.7 Reports & Dashboard (Manager)
- Participation per resident (flag residents with low engagement, e.g. no activity for 3 or more days, as a social isolation alert).
- Most-used and most-loved activities, staff usage, engagement trends.
- Export to PDF/CSV for CQC / Care Inspectorate / regulator evidence.

### 5.8 Admin & Settings
- Multi-home / organisation tenancy, users and roles (Admin, Manager, Coordinator, Staff, Family).
- Device management: shared tablet login with quick PIN switching between staff.
- Accessibility settings: text size, contrast themes (light, dark, high-contrast yellow-on-black), audio narration (text-to-speech) on all text, slower animations, left-hand mode.
- Language/localisation support (English first; structure ready for others).

## 6. Technical Requirements
- **Frontend**: React + TypeScript + Vite, Tailwind CSS, PWA (service worker, offline cache, installable), React Router, Zustand or TanStack Query for state/data.
- **3D/Games**: Three.js / React Three Fiber for 3D; HTML Canvas or Phaser for 2D games. Target 60fps on mid-range Android/iPad tablets.
- **Backend**: Node.js (NestJS or Express) or Supabase/Firebase. PostgreSQL database, REST or tRPC API, object storage for media.
- **Auth**: email/password + PIN quick-switch on shared devices; role-based access control.
- **Offline sync**: IndexedDB (e.g. Dexie) with background sync queue and conflict resolution (last write wins + audit).
- **Content data**: "On This Day" from a curated local dataset plus optional external API (e.g. Wikipedia "On this day" feed) with caching and a content-safety filter.
- **Text-to-speech**: Web Speech API, with a fallback.
- **Media**: images optimised (WebP/AVIF), lazy loaded; video streaming with captions.
- **Security**: HTTPS, encrypted at rest, audit log, session timeout, GDPR data export/delete.
- **Testing**: unit tests (Vitest), component tests (React Testing Library), E2E (Playwright, on tablet viewport sizes), automated accessibility checks (axe).
- **Deployment**: Dockerised, CI/CD pipeline, environment configs.

## 7. Data Model (starting point)
`Organisation`, `CareHome`, `User(role)`, `Resident`, `ResidentProfile`, `Consent`, `Activity` (template), `ActivityCategory`, `ContentItem` (type: crossword | quiz | jigsaw | gallery | video | game | guide …), `Tag`, `CalendarEvent`, `Session`, `SessionParticipant` (engagement score, mood before/after, notes), `MediaAsset`, `AuditLog`.

## 8. UX & Visual Design
- Calm, warm palette (soft blues, greens, cream) with a high-contrast option. No pure white glare in dark rooms.
- Big rounded tiles with a picture and a one-word label. Persistent large **Home** and **Back** buttons.
- Every activity screen has a collapsible **"Staff tips"** panel: how to introduce it, conversation prompts, adaptations.
- Celebratory but gentle feedback (soft sound, confetti optional, "Well done!").
- Avoid childish styling. Residents are adults, so the tone must be respectful and dignified.

## 9. Phased Delivery
- **Phase 1 (MVP)**: Launcher, resident profiles (basic), content library with crossword, word search, jigsaw, memory match, quiz, Today in History, reminiscence galleries, music singalong, session logging, accessibility settings, offline PWA.
- **Phase 2**: Planner/calendar with awareness days, Creator Studio, printable PDFs, daily newsletter, reports dashboard, 3D games (garden, bowls, aquarium, virtual walks).
- **Phase 3**: AI content assistant, family portal, multi-home sharing, recommendations engine, casting to TV, multilingual.

## 10. Acceptance Criteria (MVP)
- A staff member with no training can start a crossword with a resident within 30 seconds of unlocking the tablet.
- All MVP activities work in airplane mode after the first load.
- Lighthouse: PWA installable, Accessibility ≥ 95, Performance ≥ 85 on a mid-range tablet.
- axe reports zero critical accessibility violations; all touch targets are at least 64px.
- A session can be logged in 3 taps or fewer, and appears in the resident's history and reports.
- Today in History shows correct, family-friendly content for any date of the year.

## 11. What to Deliver
1. Proposed architecture and folder structure.
2. Database schema and seed data (sample residents, 50+ activities, word lists, quiz banks, 366 days of history content).
3. Working MVP code with README setup instructions.
4. Tests and accessibility report.
5. A short staff "quick start" guide (one page, large print).

Start by confirming the architecture and MVP scope, then build iteratively, module by module, showing working screens at each step.

