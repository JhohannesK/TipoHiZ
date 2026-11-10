import { expect, test, type Page } from '@playwright/test';
import { openHome, readWords } from './helpers';

function collectErrors(page: Page): string[] {
   const errors: string[] = [];

   page.on('pageerror', (error) => {
      errors.push(`pageerror: ${error.message}`);
   });
   page.on('console', (message) => {
      if (message.type() !== 'error') return;
      errors.push(`console: ${message.text()}`);
   });

   return errors;
}

test('should load home, results, and settings without console errors', async ({
   page,
}) => {
   const errors = collectErrors(page);

   await openHome(page);
   expect(errors, errors.join('\n')).toEqual([]);

   await page.goto('/results');
   await expect(
      page.getByRole('heading', { name: 'Current Results' })
   ).toBeVisible();
   expect(errors, errors.join('\n')).toEqual([]);

   await page.goto('/');
   await expect
      .poll(async () => (await readWords(page)).length)
      .toBeGreaterThan(8);

   await page.getByRole('button', { name: 'Settings' }).click();
   await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
   expect(errors, errors.join('\n')).toEqual([]);
});
