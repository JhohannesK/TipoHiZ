import { expect, test } from '@playwright/test';
import { openHome, readWords, timer } from './helpers';

test('should ignore modal keystrokes and return focus to Feedback', async ({
   page,
}) => {
   await page.route('**/api/feedback', async (route) => {
      await route.fulfill({
         status: 200,
         contentType: 'application/json',
         body: JSON.stringify({ ok: true }),
      });
   });

   await openHome(page);
   const words = await readWords(page);
   await expect(timer(page)).toHaveText('30');
   await page.locator('div.h-28').click();
   await page.getByRole('button', { name: 'Feedback' }).click();

   const dialog = page.getByRole('dialog');
   await expect(dialog).toBeVisible();
   const message = dialog.getByRole('textbox', {
      name: "What's on your mind?",
   });
   await message.click();
   await page.keyboard.type('hello feedback');
   await page.keyboard.press('Tab');
   await page.keyboard.press('Enter');
   await page.keyboard.press('Shift+Enter');

   await expect
      .poll(async () => (await readWords(page)).join('\n'))
      .toBe(words.join('\n'));
   await expect(timer(page)).toHaveText('30');
   await expect(page).toHaveURL('/');

   await expect
      .poll(() =>
         page.evaluate(
            () => document.activeElement?.closest('[role="dialog"]') !== null
         )
      )
      .toBe(true);

   await page.keyboard.press('Tab');
   await page.keyboard.press('Tab');
   await page.keyboard.press('Tab');
   expect(
      await page.evaluate(
         () => document.activeElement?.closest('[role="dialog"]') !== null
      )
   ).toBe(true);

   await page.keyboard.press('Escape');
   await expect(dialog).toBeHidden();
   await expect(page.getByRole('button', { name: 'Feedback' })).toBeFocused();
   await expect(timer(page)).toHaveText('30');
});
