import { expect, test, type Page } from '@playwright/test';
import { focusTyping, openHome, selectTime, timer } from './helpers';

async function savedConfig(page: Page) {
   const raw = await page.evaluate(() => localStorage.getItem('userConfig'));
   return JSON.parse(raw ?? '{}') as {
      state?: { time?: number; category?: string; type?: string };
   };
}

async function chooseWords(page: Page) {
   await page
      .locator('div.category')
      .locator('button[value="words"]')
      .locator('visible=true')
      .click();
}

test('should restart a 15 second test at 15 seconds with tab then enter', async ({
   page,
}) => {
   await openHome(page);
   await selectTime(page, 15);
   await expect(timer(page)).toHaveText('15');

   await page.keyboard.press('Tab');
   await page.keyboard.press('Enter');

   await expect(timer(page)).toHaveText('15', { timeout: 1_500 });
   expect((await savedConfig(page)).state?.time).toBe(15);
});

test('should keep words mode and 15 seconds when shift+enter restarts', async ({
   page,
}) => {
   await openHome(page);
   await selectTime(page, 15);
   await chooseWords(page);
   await expect(timer(page)).toHaveText('15');
   await expect
      .poll(async () => (await savedConfig(page)).state)
      .toMatchObject({ time: 15, category: 'words' });

   await focusTyping(page);
   await page.keyboard.press('Shift+Enter');

   await expect(timer(page)).toHaveText('15', { timeout: 1_500 });
   expect((await savedConfig(page)).state).toMatchObject({
      time: 15,
      category: 'words',
   });
});

test('should retake from results with shift+enter and keep the saved duration', async ({
   page,
}) => {
   await openHome(page);
   await selectTime(page, 30);
   await chooseWords(page);
   await expect
      .poll(async () => (await savedConfig(page)).state)
      .toMatchObject({ time: 30, category: 'words' });

   await page.goto('/results');
   await expect(page.getByRole('link', { name: 'Retake' })).toBeVisible();

   await page.keyboard.press('Shift+Enter');

   await expect(page).not.toHaveURL(/\/results/);
   await expect(timer(page)).toHaveText('30');
   expect((await savedConfig(page)).state).toMatchObject({
      time: 30,
      category: 'words',
   });
});
