import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import Settings from '@/components/settings';
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

function renderWithTheme(ui: ReactElement, saved = SAVED_THEME) {
   localStorage.setItem('theme', saved);
   return render(
      <ThemeProvider
         attribute="class"
         defaultTheme={saved}
         enableSystem
         disableTransitionOnChange
         themes={THEMES}
      >
         {ui}
      </ThemeProvider>
   );
}

describe('theme catalog', () => {
   beforeEach(() => {
      localStorage.clear();
      document.documentElement.className = '';
      installDomShims();
   });

   it('should list every theme in the picker', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ThemeChoose />);

      await user.click(
         await screen.findByRole('button', { name: SAVED_THEME })
      );

      for (const name of THEMES) {
         expect(screen.getAllByRole('button', { name }).length).toBeGreaterThan(
            0
         );
      }
   });

   it('should list every theme in settings', async () => {
      const user = userEvent.setup();
      renderWithTheme(<Settings />);

      await user.click(await screen.findByRole('button'));

      for (const name of THEMES) {
         expect(screen.getByRole('button', { name })).toBeInTheDocument();
      }
   });

   it('should preview a new theme on hover without saving it', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ThemeChoose />);

      await user.click(
         await screen.findByRole('button', { name: SAVED_THEME })
      );
      await user.hover(screen.getByRole('button', { name: 'serika-dark' }));

      expect(document.documentElement).toHaveClass('serika-dark');
      expect(document.documentElement).not.toHaveClass(SAVED_THEME);
      expect(localStorage.getItem('theme')).toBe(SAVED_THEME);
   });

   it('should keep a new theme applied after the picker remounts', async () => {
      const user = userEvent.setup();
      const view = renderWithTheme(<ThemeChoose />);

      await user.click(
         await screen.findByRole('button', { name: SAVED_THEME })
      );
      await user.click(screen.getByRole('button', { name: 'dracula' }));

      expect(localStorage.getItem('theme')).toBe('dracula');
      expect(document.documentElement).toHaveClass('dracula');

      view.unmount();
      document.documentElement.className = '';
      renderWithTheme(<ThemeChoose />, 'dracula');

      await waitFor(() => {
         expect(document.documentElement).toHaveClass('dracula');
      });
      expect(localStorage.getItem('theme')).toBe('dracula');
      expect(
         await screen.findByRole('button', { name: 'dracula' })
      ).toBeInTheDocument();
   });
});
