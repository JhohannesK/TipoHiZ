import { expect, test, type Page } from '@playwright/test';
import { clockSeconds, openHome, readWords, statText, timer } from './helpers';

const savedFifteenSeconds = JSON.stringify({
   state: {
      time: 15,
      theme: '',
      type: 'default',
      category: 'time',
      sound: false,
      language: 'english',
   },
   version: 0,
});

function selectedTime(page: Page) {
   return page.locator('div.time button.selected').locator('visible=true');
}

test('should start a fresh visit on a 30 second test', async ({ page }) => {
   await page.addInitScript(() => {
      localStorage.removeItem('userConfig');
   });

   await openHome(page);

   await expect(timer(page)).toHaveText('30');
   await expect(selectedTime(page)).toHaveAttribute('value', '30');

   await page.goto('/results');
   expect(clockSeconds(await statText(page, /^time:/i))).toBe(30);
});

test('should keep a saved 15 second duration after reload', async ({
   page,
}) => {
   await openHome(page);

   await page.evaluate((payload) => {
      localStorage.setItem('userConfig', payload);
   }, savedFifteenSeconds);

   await page.reload();
   await expect
      .poll(async () => (await readWords(page)).length)
      .toBeGreaterThan(8);

   await expect(timer(page)).toHaveText('15');
   await expect(selectedTime(page)).toHaveAttribute('value', '15');

   const saved = await page.evaluate(() => localStorage.getItem('userConfig'));
   expect(JSON.parse(saved ?? '{}').state.time).toBe(15);
});
