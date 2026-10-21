import { expect, test } from '@playwright/test';
import { accurateWPM, calculateAccuracy, grossWPM } from '../lib/utils';
import { garble, scoreTypedRun } from '../test/scoring';
import {
   clockSeconds,
   focusTyping,
   openHome,
   readWords,
   selectTime,
   statText,
   timer,
} from './helpers';

test('should restart a 15 second test at 15 seconds', async ({ page }) => {
   await openHome(page);
   await selectTime(page, 15);
   await expect(timer(page)).toHaveText('15');

   await page.keyboard.press('Tab');
   await page.keyboard.press('Enter');

   await expect(timer(page)).toHaveText('15', { timeout: 1_500 });
});

// P0: the page starts the countdown with a lower bound of 1, so the test
// ends and navigates while the timer still shows 1. It should stop at 0.
test.fail(
   'should stop the countdown at 0 and then open results',
   async ({ page }) => {
      await openHome(page);
      await selectTime(page, 15);
      await expect(timer(page)).toHaveText('15');

      const words = await readWords(page);
      await focusTyping(page);
      await page.keyboard.type(`${words[0]} `, { delay: 0 });
      await expect(timer(page)).not.toHaveText('15');

      const seen = new Set<string>();
      await expect
         .poll(
            async () => {
               if (!page.url().includes('/results')) {
                  seen.add((await timer(page).innerText()).trim());
               }
               return page.url();
            },
            { timeout: 20_000, intervals: [100] }
         )
         .toMatch(/\/results$/);

      expect(seen.has('0')).toBe(true);
   }
);

// Mistyping every 4th word has to lower average speed below raw speed.
// Stats come from the keystroke log, including finished mistakes.
test('should score every fourth mistyped word from the mistakes that were made', async ({
   page,
}) => {
   await openHome(page);
   await selectTime(page, 15);
   await expect(timer(page)).toHaveText('15');

   const words = await readWords(page);
   const completed: string[] = [];
   let current = '';

   await focusTyping(page);

   for (let index = 0; index < words.length; index += 1) {
      const target = words[index] ?? '';
      const mistype = (index + 1) % 4 === 0;
      const typed = mistype ? garble(target) : target;

      await page.keyboard.type(typed, { delay: 0 });
      current = typed;

      const projected = scoreTypedRun({
         words,
         completed,
         current,
      }).typedEntries;

      if (projected >= 291 && !mistype) break;

      await page.keyboard.press('Space');
      completed.push(typed);
      current = '';
   }

   const expected = scoreTypedRun({ words, completed, current });
   expect(expected.errors).toBeGreaterThan(0);
   expect(expected.typedEntries).toBeGreaterThan(250);

   await expect(page).toHaveURL(/\/results$/, { timeout: 25_000 });

   const duration = clockSeconds(await statText(page, /^time:/i));
   const reportedWpm = Number.parseFloat(await statText(page, /^wpm:$/i));
   const reportedAccuracy = Number.parseFloat(
      await statText(page, /^accuracy:$/i)
   );
   const expectedWpm = accurateWPM(
      expected.errors,
      expected.typedEntries,
      duration
   );
   const cleanWpm = grossWPM(expected.typedEntries, duration);

   expect(duration).toBe(15);
   expect(reportedWpm).toBeCloseTo(expectedWpm, 0);
   expect(reportedWpm).toBeLessThan(cleanWpm - 20);
   expect(reportedAccuracy).toBeCloseTo(
      calculateAccuracy(expected.errors, expected.typedEntries),
      0
   );
});
