import { expect, type Page } from '@playwright/test';

export function timer(page: Page) {
   return page.locator('div.text-accent').first();
}

export async function stubAuth(page: Page): Promise<void> {
   await page.route('**/api/auth/**', async (route) => {
      await route.fulfill({
         status: 200,
         contentType: 'application/json',
         body: 'null',
      });
   });
}

export async function readWords(page: Page): Promise<string[]> {
   const words = await page
      .locator('div.h-28 > div')
      .evaluateAll((nodes) =>
         nodes.map((node) => (node.textContent ?? '').trim())
      );

   return words.filter((word) => word.length > 0);
}

export async function openHome(page: Page): Promise<void> {
   await stubAuth(page);
   await page.goto('/');
   await expect
      .poll(async () => (await readWords(page)).length)
      .toBeGreaterThan(8);
}

export async function selectTime(page: Page, seconds: number): Promise<void> {
   await page
      .locator('div.time')
      .locator(`button[value="${seconds}"]`)
      .locator('visible=true')
      .click();
}

export async function selectCategory(
   page: Page,
   category: 'time' | 'words'
): Promise<void> {
   await page
      .locator('div.category')
      .locator(`button[value="${category}"]`)
      .locator('visible=true')
      .click();
}

export async function selectWordCount(
   page: Page,
   count: number
): Promise<void> {
   await page
      .locator('div.words')
      .locator(`button[value="${count}"]`)
      .locator('visible=true')
      .click();
}

export async function expectWordsAfterRestart(
   page: Page,
   before: readonly string[],
   expectedCount?: number
): Promise<string[]> {
   const previousJoined = before.join('\n');
   let last = '';
   let stable: string[] = [];
   await expect
      .poll(async () => {
         const words = await readWords(page);
         const joined = words.join('\n');
         const longEnough =
            expectedCount === undefined
               ? words.length > 8
               : words.length === expectedCount;
         const settled =
            longEnough && joined !== previousJoined && joined === last;
         last = joined;
         if (settled) stable = words;
         return settled;
      })
      .toBe(true);
   return stable;
}

export async function waitForWordCount(
   page: Page,
   count: number
): Promise<string[]> {
   let previous = '';
   let stable: string[] = [];
   await expect
      .poll(async () => {
         const words = await readWords(page);
         const joined = words.join('\n');
         const same = words.length === count && joined === previous;
         previous = joined;
         if (same) stable = words;
         return same;
      })
      .toBe(true);
   return stable;
}

export function wordsProgress(page: Page) {
   return page.getByTestId('words-progress');
}

export function elapsedTime(page: Page) {
   return page.getByTestId('elapsed-time');
}

export async function focusTyping(page: Page): Promise<void> {
   await page.locator('div.h-28').click();
}

export async function statText(page: Page, label: RegExp): Promise<string> {
   const heading = page.getByRole('heading', { name: label });
   const card = heading.locator('..');
   return (await card.locator('p').innerText()).trim();
}

export function clockSeconds(value: string): number {
   const [hours = 0, minutes = 0, seconds = 0] = value.split(':').map(Number);
   return hours * 3600 + minutes * 60 + seconds;
}
