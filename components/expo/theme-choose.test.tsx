import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider } from '@/lib/providers/theme-provider';
import { THEMES } from './theme.constant';
import ThemeChoose from './theme-choose';

const SAVED_THEME = 'dark-gray';

function installDomShims(): void {
   Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: (query: string) => ({
         matches: false,
         media: query,
         onchange: null,
         addListener: () => undefined,
         removeListener: () => undefined,
         addEventListener: () => undefined,
         removeEventListener: () => undefined,
         dispatchEvent: () => false,
      }),
   });

   Element.prototype.hasPointerCapture ??= () => false;
   Element.prototype.setPointerCapture ??= () => undefined;
   Element.prototype.releasePointerCapture ??= () => undefined;
}

async function openThemePicker() {
   localStorage.setItem('theme', SAVED_THEME);
   const user = userEvent.setup();
   render(
      <ThemeProvider
         attribute="class"
         defaultTheme={SAVED_THEME}
         enableSystem
         disableTransitionOnChange
         themes={THEMES}
      >
         <ThemeChoose />
      </ThemeProvider>
   );

   await user.click(await screen.findByRole('button', { name: SAVED_THEME }));
   const ocean = await screen.findByRole('button', { name: 'ocean' });
   return { user, ocean };
}

describe('theme picker preview', () => {
   beforeEach(() => {
      localStorage.clear();
      document.documentElement.className = '';
      installDomShims();
   });

   it('should keep the saved theme applied when the picker opens', async () => {
      await openThemePicker();

      expect(document.documentElement).toHaveClass(SAVED_THEME);
      expect(localStorage.getItem('theme')).toBe(SAVED_THEME);
   });

   it('should preview a theme on hover without saving it', async () => {
      const { user, ocean } = await openThemePicker();

      await user.hover(ocean);

      expect(document.documentElement).toHaveClass('ocean');
      expect(document.documentElement).not.toHaveClass(SAVED_THEME);
      expect(localStorage.getItem('theme')).toBe(SAVED_THEME);
      expect(screen.getByRole('button', { name: SAVED_THEME })).toHaveClass(
         'border-2'
      );
   });

   it('should restore the saved theme when the pointer leaves', async () => {
      const { user, ocean } = await openThemePicker();

      await user.hover(ocean);
      await user.hover(screen.getByRole('heading', { name: 'Choose a Theme' }));

      expect(document.documentElement).toHaveClass(SAVED_THEME);
      expect(document.documentElement).not.toHaveClass('ocean');
      expect(localStorage.getItem('theme')).toBe(SAVED_THEME);
   });

   it('should preview a focused theme and restore it on blur', async () => {
      const { ocean } = await openThemePicker();

      ocean.focus();

      expect(document.documentElement).toHaveClass('ocean');
      expect(localStorage.getItem('theme')).toBe(SAVED_THEME);

      ocean.blur();

      expect(document.documentElement).toHaveClass(SAVED_THEME);
      expect(document.documentElement).not.toHaveClass('ocean');
      expect(localStorage.getItem('theme')).toBe(SAVED_THEME);
   });

   it('should save the theme when its option is clicked', async () => {
      const { user, ocean } = await openThemePicker();

      await user.click(ocean);

      expect(localStorage.getItem('theme')).toBe('ocean');
      expect(document.documentElement).toHaveClass('ocean');
      expect(document.documentElement).not.toHaveClass(SAVED_THEME);
   });

   it('should save the focused theme when Enter is pressed', async () => {
      const { user, ocean } = await openThemePicker();

      ocean.focus();
      await user.keyboard('{Enter}');

      expect(localStorage.getItem('theme')).toBe('ocean');
      expect(document.documentElement).toHaveClass('ocean');
   });
});
