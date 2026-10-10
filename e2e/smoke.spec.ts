import { expect, test } from '@playwright/test';
import { focusTyping, openHome, readWords, selectTime, timer } from './helpers';

test('should show wpm and accuracy after a timed test finishes', async ({
   page,
}) => {
   await openHome(page);
   await selectTime(page, 15);
   await expect(timer(page)).toHaveText('15');

   const words = await readWords(page);
   expect(words.length).toBeGreaterThan(8);

   await focusTyping(page);
   for (const word of words.slice(0, 8)) {
      await page.keyboard.type(`${word} `, { delay: 0 });
   }

   await expect(page).toHaveURL(/\/results$/, { timeout: 25_000 });
   await expect(
      page.getByRole('heading', { name: 'Game Results page' })
   ).toBeAttached();
   await expect(
      page.getByRole('heading', { name: /Average Speed/ })
   ).toBeVisible();
   await expect(page.getByRole('heading', { name: /Accuracy/ })).toBeVisible();
   await expect(page.getByText(/\d+\.\d+wpm/).first()).toBeVisible();
   await expect(page.getByText(/\d+\.\d+%/).first()).toBeVisible();
});
