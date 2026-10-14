import { expect, test, type Page } from '@playwright/test';
import {
   clockSeconds,
   elapsedTime,
   focusTyping,
   openHome,
   selectCategory,
   selectWordCount,
   statText,
   waitForWordCount,
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
   await expect(
      page.getByRole('heading', { name: /Average Speed/ })
   ).toBeVisible();
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
   await expect(page.getByTestId('speed-sample')).toHaveCount(samples.length);

   const reported = Number.parseFloat(await statText(page, /Average Speed/));
   expect(reported).toBeCloseTo(saved.last?.stats?.wpm ?? -1, 1);
   expect(clockSeconds(await statText(page, /^words:/i))).toBe(
      Math.floor(saved.last?.durationSeconds ?? -1)
   );

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
               data: { wordCount: 10 },
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
   const words = await waitForWordCount(page, 25);
   await expect(wordsProgress(page)).toHaveText('0/25');
   await focusTyping(page);
   await page.keyboard.type(`${words[0] ?? ''} `, { delay: 0 });
   await expect(wordsProgress(page)).toHaveText('1/25');

   await page.getByRole('button', { name: 'button to restart test' }).click();
   await waitForWordCount(page, 25);
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
   await expect(wordsProgress(page)).toHaveText('0/25');
   await waitForWordCount(page, 25);

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
