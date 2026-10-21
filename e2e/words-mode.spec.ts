import { expect, test, type Page } from '@playwright/test';
import {
   clockSeconds,
   elapsedTime,
   expectWordsAfterRestart,
   focusTyping,
   openHome,
   readWords,
   selectCategory,
   selectTime,
   selectWordCount,
   statText,
   waitForWordCount,
   timer,
   wordsProgress,
} from './helpers';

async function captureUsage(page: Page): Promise<void> {
   await page.addInitScript(() => {
      const events: { kind: string; payload?: unknown }[] = [];
      (
         window as unknown as Window & { __usageEvents: typeof events }
      ).__usageEvents = events;
      window.va = (kind, payload) => {
         events.push({ kind, payload });
      };
   });
   await page.route('**/va.vercel-scripts.com/**', (route) => route.abort());
   await page.route('**/_vercel/insights/**', (route) => route.abort());
}

test('should finish a words test on the last word and record elapsed stats', async ({
   page,
}) => {
   await captureUsage(page);
   await openHome(page);
   await selectCategory(page, 'words');

   for (const count of [10, 25, 50, 100]) {
      await expect(
         page
            .locator('div.words')
            .locator(`button[value="${count}"]`)
            .locator('visible=true')
      ).toBeVisible();
   }
   await expect(page.locator('div.time')).toHaveCount(0);

   await selectWordCount(page, 10);
   const words = await waitForWordCount(page, 10);
   await expect(wordsProgress(page)).toHaveText('0/10');
   await expect(elapsedTime(page)).toHaveText('0:00');
   await expect(
      page.locator('div.words button.selected').locator('visible=true')
   ).toHaveAttribute('value', '10');
   expect(words).toHaveLength(10);
   await focusTyping(page);
   await page.keyboard.type(words[0]?.slice(0, 1) ?? 'a', { delay: 0 });
   await expect
      .poll(async () => elapsedTime(page).innerText(), { timeout: 4_000 })
      .toBe('0:01');

   await page.keyboard.type(`${words[0]?.slice(1) ?? ''} `, { delay: 0 });
   await page.keyboard.type(`${words[1] ?? ''} `, { delay: 0 });
   await expect(wordsProgress(page)).toHaveText('2/10');
   await expect(page).toHaveURL(/\/$/);
   await expect(page.locator('div.text-accent').first()).not.toHaveText(
      /^(30|15|60|120)$/
   );

   for (let index = 2; index < words.length; index += 1) {
      const word = words[index] ?? '';
      await page.keyboard.type(word, { delay: 0 });
      if (index < words.length - 1) {
         await page.keyboard.press('Space');
      }
   }

   await expect(page).toHaveURL(/\/results$/, { timeout: 10_000 });
   await expect(
      page.getByRole('heading', { name: 'Speed by second' })
   ).toBeVisible();
   await expect(page.getByRole('heading', { name: /^wpm:$/i })).toBeVisible();
   await expect(page.getByText(/\d+\.\d+wpm/).first()).toBeVisible();

   const saved = await page.evaluate(() => {
      const history = JSON.parse(
         localStorage.getItem('tipohiz.results') ?? '[]'
      ) as {
         category?: string;
         wordCount?: number;
         words?: string[];
         durationSeconds?: number;
         stats?: { wpm?: number; samples?: unknown[] };
      }[];
      const last = JSON.parse(
         sessionStorage.getItem('tipohiz.lastResult') ?? 'null'
      ) as (typeof history)[number] | null;
      return { history, last };
   });

   expect(saved.history[0]).toMatchObject({
      category: 'words',
      wordCount: 10,
   });
   expect(saved.last?.words).toHaveLength(10);
   expect(saved.last?.durationSeconds ?? 0).toBeGreaterThan(0);
   expect(saved.last?.durationSeconds ?? 30).toBeLessThan(30);
   const samples = saved.last?.stats?.samples ?? [];
   expect(samples.length).toBeGreaterThan(0);
   expect(samples.length).toBe(Math.ceil(saved.last?.durationSeconds ?? 0));
   const reported = Number.parseFloat(await statText(page, /^wpm:$/i));
   expect(reported).toBeCloseTo(saved.last?.stats?.wpm ?? -1, 1);
   expect(clockSeconds(await statText(page, /^words:/i))).toBe(
      Math.floor(saved.last?.durationSeconds ?? -1)
   );
   await expect(page.locator('table tbody tr')).toHaveCount(samples.length);

   const events = await page.evaluate(
      () =>
         (
            window as unknown as Window & {
               __usageEvents?: {
                  kind: string;
                  payload?: { name?: string; data?: { wordCount?: number } };
               }[];
            }
         ).__usageEvents ?? []
   );
   expect(events).toEqual(
      expect.arrayContaining([
         expect.objectContaining({
            kind: 'event',
            payload: expect.objectContaining({
               name: 'test_finished',
               data: expect.objectContaining({ wordCount: 10 }),
            }),
         }),
      ])
   );

   await page.goto('/dashboard');
   await expect(page.getByText(/10 words/)).toBeVisible();
});

test('should keep the chosen word count across restart and reload', async ({
   page,
}) => {
   await openHome(page);
   await selectCategory(page, 'words');
   await selectWordCount(page, 25);
   let words = await waitForWordCount(page, 25);
   await expect(wordsProgress(page)).toHaveText('0/25');
   await focusTyping(page);
   await page.keyboard.type(`${words[0] ?? ''} `, { delay: 0 });
   await expect(wordsProgress(page)).toHaveText('1/25');

   await page.getByRole('button', { name: 'button to restart test' }).click();
   words = await expectWordsAfterRestart(page, words, 25);
   await expect(wordsProgress(page)).toHaveText('0/25');
   await expect(elapsedTime(page)).toHaveText('0:00');
   await expect(
      page.locator('div.words button.selected').locator('visible=true')
   ).toHaveAttribute('value', '25');

   const saved = await page.evaluate(() => localStorage.getItem('userConfig'));
   expect(JSON.parse(saved ?? '{}').state).toMatchObject({
      category: 'words',
      wordCount: 25,
   });

   await page.keyboard.press('Tab');
   await page.keyboard.press('Enter');
   words = await expectWordsAfterRestart(page, words, 25);
   await expect(wordsProgress(page)).toHaveText('0/25');

   await page.reload();
   await waitForWordCount(page, 25);
   await expect(wordsProgress(page)).toHaveText('0/25');
   await expect(
      page.locator('div.words button.selected').locator('visible=true')
   ).toHaveAttribute('value', '25');
   await expect(
      page.locator('div.category button.selected').locator('visible=true')
   ).toHaveAttribute('value', 'words');
});

test('should keep a passage after shortcuts, restart, and mode changes', async ({
   page,
}) => {
   await openHome(page);
   let words = await readWords(page);

   await selectTime(page, 15);
   words = await expectWordsAfterRestart(page, words);
   await expect(timer(page)).toHaveText('15');

   await page.keyboard.press('Tab');
   await page.keyboard.press('Enter');
   words = await expectWordsAfterRestart(page, words);

   await page.keyboard.press('Shift+Enter');
   words = await expectWordsAfterRestart(page, words);

   await page.getByRole('button', { name: 'button to restart test' }).click();
   words = await expectWordsAfterRestart(page, words);

   await selectTime(page, 60);
   words = await expectWordsAfterRestart(page, words);
   await expect(timer(page)).toHaveText('60');

   await selectCategory(page, 'words');
   words = await expectWordsAfterRestart(page, words, 10);
   await expect(wordsProgress(page)).toHaveText('0/10');

   await selectWordCount(page, 25);
   words = await expectWordsAfterRestart(page, words, 25);
   await expect(wordsProgress(page)).toHaveText('0/25');

   await page.keyboard.press('Tab');
   await page.keyboard.press('Enter');
   words = await expectWordsAfterRestart(page, words, 25);

   await page.keyboard.press('Shift+Enter');
   words = await expectWordsAfterRestart(page, words, 25);

   await page.getByRole('button', { name: 'button to restart test' }).click();
   words = await expectWordsAfterRestart(page, words, 25);
   await expect(wordsProgress(page)).toHaveText('0/25');

   await selectWordCount(page, 50);
   words = await expectWordsAfterRestart(page, words, 50);

   await selectCategory(page, 'time');
   words = await expectWordsAfterRestart(page, words);
   expect(words.length).toBeGreaterThan(8);
   await expect(timer(page)).toHaveText('60');
});

test('should keep words visible when the language changes in words mode', async ({
   page,
}) => {
   await openHome(page);
   await selectCategory(page, 'words');
   await selectWordCount(page, 10);
   await waitForWordCount(page, 10);
   await expect(wordsProgress(page)).toHaveText('0/10');

   await page.getByRole('combobox').click();
   await page.getByRole('option', { name: 'Español' }).click();

   const words = await waitForWordCount(page, 10);
   expect(words.every((word) => word.length > 0)).toBe(true);
   await expect(wordsProgress(page)).toHaveText('0/10');
   await expect
      .poll(async () => {
         const saved = await page.evaluate(() =>
            localStorage.getItem('userConfig')
         );
         return JSON.parse(saved ?? '{}').state?.language;
      })
      .toBe('spanish');
});

test('should show a fresh words passage after retake from results', async ({
   page,
}) => {
   await openHome(page);
   await selectCategory(page, 'words');
   await selectWordCount(page, 10);
   await waitForWordCount(page, 10);
   await expect
      .poll(async () => {
         const saved = await page.evaluate(() =>
            localStorage.getItem('userConfig')
         );
         return JSON.parse(saved ?? '{}').state;
      })
      .toMatchObject({ category: 'words', wordCount: 10 });

   await page.goto('/results');
   await page.getByRole('link', { name: 'Retake' }).click();

   await expect(page).toHaveURL(/\/$/);
   const words = await waitForWordCount(page, 10);
   expect(words.every((word) => word.length > 0)).toBe(true);
   await expect(wordsProgress(page)).toHaveText('0/10');
});

test('should reset a words test that is already underway', async ({ page }) => {
   await openHome(page);
   await selectCategory(page, 'words');
   await selectWordCount(page, 10);
   const words = await waitForWordCount(page, 10);
   await focusTyping(page);
   await page.keyboard.type(`${words[0] ?? ''} ${words[1] ?? ''} `, {
      delay: 0,
   });
   await expect(wordsProgress(page)).toHaveText('2/10');
   await expect
      .poll(async () => elapsedTime(page).innerText(), { timeout: 4_000 })
      .toBe('0:01');

   await page.getByRole('button', { name: 'button to restart test' }).click();

   const next = await expectWordsAfterRestart(page, words, 10);
   expect(next.every((word) => word.length > 0)).toBe(true);
   await expect(wordsProgress(page)).toHaveText('0/10');
   await expect(elapsedTime(page)).toHaveText('0:00');
});

test('should keep the words counter off the language icon on a phone', async ({
   page,
}) => {
   async function gap(): Promise<{ columnGap: string; space: number }> {
      const row = page
         .locator('div.justify-between')
         .filter({ has: page.getByTestId('elapsed-time') });
      const elapsed = await page.getByTestId('elapsed-time').boundingBox();
      const globe = await page.locator('svg.lucide-globe').boundingBox();
      const columnGap = await row.evaluate(
         (element) => getComputedStyle(element).columnGap
      );
      if (!elapsed || !globe) {
         throw new Error('counter or language icon is missing');
      }
      return { columnGap, space: globe.x - (elapsed.x + elapsed.width) };
   }

   await openHome(page);
   await selectCategory(page, 'words');
   await selectWordCount(page, 25);
   const words = await waitForWordCount(page, 25);
   await focusTyping(page);
   await page.keyboard.type(`${words[0] ?? ''} ${words[1] ?? ''} `, {
      delay: 0,
   });
   await expect(wordsProgress(page)).toHaveText('2/25');

   await page.setViewportSize({ width: 375, height: 812 });
   const phone = await gap();
   expect(phone.columnGap).toBe('12px');
   expect(phone.space).toBeGreaterThanOrEqual(8);

   await page.setViewportSize({ width: 1280, height: 800 });
   const desktop = await gap();
   expect(desktop.columnGap).toBe('0px');
   expect(desktop.space).toBeGreaterThan(48);
});

test('should reset the countdown when a timed test is restarted mid-run', async ({
   page,
}) => {
   await openHome(page);
   await selectTime(page, 15);
   const words = await readWords(page);
   await expect(timer(page)).toHaveText('15');
   await focusTyping(page);
   await page.keyboard.type(words[0]?.slice(0, 1) ?? 'a', { delay: 0 });
   await expect
      .poll(async () => timer(page).innerText(), { timeout: 4_000 })
      .not.toBe('15');

   await page.getByRole('button', { name: 'button to restart test' }).click();

   const next = await expectWordsAfterRestart(page, words);
   expect(next.length).toBeGreaterThan(8);
   await expect(timer(page)).toHaveText('15');
});
