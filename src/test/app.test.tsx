import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { db, emptyResident } from '../db/db';
import { renderApp, renderWithProviders } from './render';
import { QuizGame } from '../activities/Quiz';
import { CrosswordGame } from '../activities/Crossword';
import { WORD_THEMES } from '../data/wordlists';

beforeEach(async () => {
  localStorage.clear();
  sessionStorage.clear();
  await db.delete();
  await db.open();
});

describe('home and navigation', () => {
  it('starts a crossword in two taps from the home screen', async () => {
    const user = userEvent.setup();
    renderApp('/');
    await user.click(screen.getByRole('link', { name: /Word Games/ }));
    await user.click(await screen.findByRole('link', { name: /Crossword: In the Garden/ }));
    expect(await screen.findByRole('grid', { name: 'Crossword grid' })).toBeInTheDocument();
  });

  it('shows today in history', async () => {
    renderApp('/play/history');
    expect(await screen.findByText(/Today is/)).toBeInTheDocument();
  });
});

describe('quiz', () => {
  it('never tells a resident they are wrong', async () => {
    const user = userEvent.setup();
    const questions = [{ question: 'What colour is grass?', options: ['Green', 'Blue', 'Red', 'Pink'] as [string, string, string, string] }];
    renderWithProviders(<QuizGame questions={questions} difficulty="challenging" onAgain={() => {}} onFinish={() => {}} />);
    await user.click(screen.getByRole('button', { name: 'Blue' }));
    expect(screen.getByText('Good try! The answer is Green.')).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/wrong|incorrect/i);
  });

  it('offers two choices on the easy level', () => {
    const questions = [{ question: 'Q?', options: ['A', 'B', 'C', 'D'] as [string, string, string, string] }];
    renderWithProviders(<QuizGame questions={questions} difficulty="easy" onAgain={() => {}} onFinish={() => {}} />);
    expect(screen.getAllByRole('button', { pressed: false })).toHaveLength(2);
  });
});

describe('crossword', () => {
  it('celebrates when every word is filled in', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CrosswordGame words={WORD_THEMES[0].words} difficulty="easy" seed={5} onAgain={() => {}} onFinish={() => {}} />);
    const clueCount = screen.getAllByRole('button', { name: /\(\d+\)$/ }).length;
    expect(clueCount).toBeGreaterThan(2);
    for (let i = 0; i < clueCount; i++) {
      await user.click(screen.getAllByRole('button', { name: /\(\d+\)$/ })[i]);
      await user.click(screen.getByRole('button', { name: 'Show the word' }));
    }
    expect(await screen.findByText(/You finished the crossword/)).toBeInTheDocument();
  });
});

describe('session logging', () => {
  it('records a session in three taps for the chosen resident', async () => {
    const user = userEvent.setup();
    const id = await db.residents.add({ ...emptyResident(), name: 'Peggy Ellis', preferredName: 'Peggy' });
    sessionStorage.setItem('activity-hub:active-resident', String(id));
    renderApp('/play/memories/seaside');
    await screen.findByRole('heading', { name: /Seaside Holidays/ });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Choose resident' })).toHaveTextContent('Peggy'));

    await user.click(screen.getByRole('button', { name: /Finish/ })); // tap 1
    await user.click(await screen.findByRole('button', { name: 'Loved it' })); // tap 2
    await user.click(screen.getByRole('button', { name: 'Save' })); // tap 3

    await waitFor(async () => expect(await db.sessions.count()).toBe(1));
    const [session] = await db.sessions.toArray();
    expect(session.activityId).toBe('memories-seaside');
    expect(session.participants).toEqual([expect.objectContaining({ residentId: id, engagement: 5 })]);
  });
});

describe('resident mode', () => {
  it('locks staff screens until the PIN is entered', async () => {
    const user = userEvent.setup();
    localStorage.setItem('activity-hub:settings', JSON.stringify({ residentMode: true, pin: '2468' }));
    renderApp('/settings');
    expect(await screen.findByText('This area is for staff')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Unlock staff mode' }));
    for (const d of '2468') await user.click(screen.getByRole('button', { name: d }));
    expect(await screen.findByRole('heading', { name: /Settings/ })).toBeInTheDocument();
  });
});
