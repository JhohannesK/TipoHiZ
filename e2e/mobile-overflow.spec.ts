import { expect, test } from '@playwright/test';
import { openHome } from './helpers';

test('should keep the document within a 375px viewport', async ({ page }) => {
   await page.setViewportSize({ width: 375, height: 812 });
   await openHome(page);

   const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
   );
   const viewportWidth = page.viewportSize()?.width ?? 0;

   expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
});
