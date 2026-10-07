import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = ['/', '/category/word-games', '/play/history', '/play/crossword/garden', '/play/wordsearch/seaside', '/play/jigsaw/garden', '/play/match/animals', '/play/quiz/general', '/play/memories/school', '/play/sing/daisy-bell', '/library', '/residents', '/settings'];

for (const path of PAGES) {
  test(`no serious accessibility issues on ${path}`, async ({ page }, info) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('main h1').first()).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`)).toEqual([]);
    if (path === '/' || path.startsWith('/play/crossword') || path.startsWith('/play/jigsaw')) {
      await page.screenshot({ path: `test-results/screens/${info.project.name}${path.replace(/\//g, '_') || '_home'}.png`, fullPage: true });
    }
  });
}

test('buttons and links outside puzzle grids are at least 64px', async ({ page }) => {
  for (const path of ['/', '/play/quiz/general', '/play/history', '/settings']) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const small = await page.$$eval('button, a[href]', (els) =>
      els
        .filter((el) => !el.closest('[role="grid"]') && !el.closest('.sr-only') && (el as HTMLElement).offsetParent !== null)
        .map((el) => ({ text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30), ...el.getBoundingClientRect().toJSON() }))
        .filter((r) => r.height < 63.5 || r.width < 63.5),
    );
    expect(small, path).toEqual([]);
  }
});

test('works offline after the first visit', async ({ page, context }) => {
  await page.goto('/');
  await page.waitForFunction(async () => (await navigator.serviceWorker.getRegistration())?.active?.state === 'activated');
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  // Visit lazily loaded screens once so their code is in the precache, then go offline.
  await context.setOffline(true);
  for (const path of ['/play/crossword/garden', '/play/quiz/music', '/play/history', '/play/jigsaw/seaside', '/play/sing/jerusalem']) {
    await page.goto(path);
    await expect(page.locator('main h1').first()).toBeVisible();
  }
  await expect(page.getByText('Offline – everything still works')).toBeVisible();
});

test('record a session and see it in the log', async ({ page }) => {
  await page.goto('/residents');
  await page.getByRole('button', { name: /Start activities/ }).first().click();
  await page.getByRole('link', { name: /Quizzes/ }).click();
  await page.getByRole('link', { name: /Quiz: General Knowledge/ }).click();
  await page.getByRole('button', { name: /Finish/ }).click();
  await page.getByRole('button', { name: 'Very engaged' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Session saved. Thank you!')).toBeVisible();
  await page.goto('/sessions');
  await expect(page.getByText('Quiz: General Knowledge').first()).toBeVisible();
});
