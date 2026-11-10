import { expect, test } from '@playwright/test';
import { THEMES } from '../components/expo/theme.constant';
import { openHome, readWords } from './helpers';

const ADDED_THEMES = [
   'serika-dark',
   'nord',
   'dracula',
   'carbon',
   'botanical',
   'olivia',
] as const;

test('should preview a theme on hover and keep the choice after reload', async ({
   page,
}) => {
   await page.addInitScript(() => {
      if (!localStorage.getItem('theme')) {
         localStorage.setItem('theme', 'dark-gray');
      }
   });

   await openHome(page);
   await page.getByRole('button', { name: 'dark-gray' }).click();

   for (const name of ADDED_THEMES) {
      expect(THEMES).toContain(name);
      await expect(page.getByRole('button', { name })).toBeVisible();
   }

   const nord = page.getByRole('button', { name: 'nord' });
   await nord.hover();
   await expect(page.locator('html')).toHaveClass(/nord/);
   expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(
      'dark-gray'
   );

   await page.getByRole('heading', { name: 'Choose a Theme' }).hover();
   await expect(page.locator('html')).toHaveClass(/dark-gray/);
   await expect(page.locator('html')).not.toHaveClass(/nord/);

   await nord.click();
   await expect(page.locator('html')).toHaveClass(/nord/);
   await expect
      .poll(async () => page.evaluate(() => localStorage.getItem('theme')))
      .toBe('nord');

   await page.reload();
   await expect
      .poll(async () => (await readWords(page)).length)
      .toBeGreaterThan(8);
   await expect(page.locator('html')).toHaveClass(/nord/);
   await expect(page.getByRole('button', { name: 'nord' })).toBeVisible();
});
