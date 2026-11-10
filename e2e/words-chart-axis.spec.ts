import { expect, test, type Locator, type Page } from '@playwright/test';
import { statText, stubAuth } from './helpers';

const LAST_MS = 120_400;

function hundredWordResult() {
   const words = Array.from({ length: 100 }, () => 'to');
   const log: [string, string, 'correct', number, number][] = [];
   const strokes = words.length * 2 + (words.length - 1);
   let stroke = 0;

   for (let wordIndex = 0; wordIndex < words.length; wordIndex += 1) {
      const word = words[wordIndex] ?? 'to';
      for (const letter of word) {
         log.push([
            letter,
            letter,
            'correct',
            Math.round((stroke / (strokes - 1)) * LAST_MS),
            wordIndex,
         ]);
         stroke += 1;
      }
      if (wordIndex < words.length - 1) {
         log.push([
            ' ',
            ' ',
            'correct',
            Math.round((stroke / (strokes - 1)) * LAST_MS),
            wordIndex,
         ]);
         stroke += 1;
      }
   }

   return {
      id: 'words-100-axis',
      createdAt: '2026-11-09T00:00:00.000Z',
      mode: 'default',
      category: 'words',
      language: 'english',
      durationSeconds: LAST_MS / 1000,
      wordCount: 100,
      words,
      log,
      stats: { typedEntries: log.length },
   };
}

async function labelBoxes(axis: Locator) {
   await axis.scrollIntoViewIfNeeded();
   const labels = axis.locator('span');
   const count = await labels.count();
   const boxes = [];
   for (let index = 0; index < count; index += 1) {
      const box = await labels.nth(index).boundingBox();
      expect(box, `x-axis label ${index}`).not.toBeNull();
      if (box) boxes.push(box);
   }
   return boxes;
}

async function expectAxisReadable(page: Page, lastLabel: string) {
   const axis = page.getByTestId('wpm-chart-x-axis');
   await expect(axis.locator('span').last()).toHaveText(lastLabel);
   const boxes = await labelBoxes(axis);
   expect(boxes.length).toBeGreaterThan(1);

   const viewport = page.viewportSize();
   const width = viewport?.width ?? 0;
   const height = viewport?.height ?? 0;
   const last = boxes[boxes.length - 1];
   expect(last).toBeDefined();
   if (!last) return;
   expect(last.x).toBeGreaterThanOrEqual(0);
   expect(last.y).toBeGreaterThanOrEqual(0);
   expect(last.x + last.width).toBeLessThanOrEqual(width);
   expect(last.y + last.height).toBeLessThanOrEqual(height);

   for (let index = 1; index < boxes.length; index += 1) {
      const previous = boxes[index - 1];
      const current = boxes[index];
      expect(previous).toBeDefined();
      expect(current).toBeDefined();
      if (!previous || !current) continue;
      expect(previous.x + previous.width).toBeLessThanOrEqual(current.x);
   }
}

test('should keep 100-word x-axis labels apart on desktop and at 375px', async ({
   page,
}) => {
   await stubAuth(page);
   await page.addInitScript((saved) => {
      sessionStorage.setItem('tipohiz.lastResult', JSON.stringify(saved));
      localStorage.setItem('tipohiz.results', JSON.stringify([saved]));
   }, hundredWordResult());

   await page.setViewportSize({ width: 1280, height: 720 });
   await page.goto('/results');
   await expect(
      page.getByRole('heading', { name: 'Speed by second' })
   ).toBeVisible();
   expect(await statText(page, /^mode:$/i)).toBe('words 100');
   expect(await statText(page, /^time:/i)).toBe('120.40s');
   await expectAxisReadable(page, '120.4');

   await page.setViewportSize({ width: 375, height: 812 });
   await expectAxisReadable(page, '120.4');
});
