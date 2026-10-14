import { useRef } from 'react';
import { useTheme } from 'next-themes';
import { THEMES } from '@/components/expo/theme.constant';

function applyDocumentTheme(themeName: string | undefined): void {
   const root = document.documentElement;
   for (const name of THEMES) {
      root.classList.remove(name);
   }
   if (themeName) root.classList.add(themeName);
}

function savedThemeClass(
   theme: string | undefined,
   resolvedTheme: string | undefined
): string | undefined {
   if (!theme || theme === 'system') return resolvedTheme;
   return theme;
}

export function useThemePreview() {
   const { theme, resolvedTheme, setTheme } = useTheme();
   const themeRef = useRef(theme);
   const resolvedRef = useRef(resolvedTheme);
   const pendingCommitRef = useRef<string | null>(null);
   const hoveredRef = useRef<string | null>(null);
   const focusedRef = useRef<string | null>(null);

   themeRef.current = theme;
   resolvedRef.current = resolvedTheme;
   if (pendingCommitRef.current === theme) {
      pendingCommitRef.current = null;
   }

   const paint = () => {
      const next =
         hoveredRef.current ??
         focusedRef.current ??
         pendingCommitRef.current ??
         savedThemeClass(themeRef.current, resolvedRef.current);
      applyDocumentTheme(next);
   };

   const bindTheme = (name: string, afterCommit?: () => void) => ({
      onMouseEnter: () => {
         hoveredRef.current = name;
         paint();
      },
      onMouseLeave: () => {
         hoveredRef.current = null;
         paint();
      },
      onFocus: () => {
         focusedRef.current = name;
         paint();
      },
      onBlur: () => {
         focusedRef.current = null;
         paint();
      },
      onClick: () => {
         pendingCommitRef.current = name;
         hoveredRef.current = null;
         focusedRef.current = null;
         applyDocumentTheme(name);
         setTheme(name);
         afterCommit?.();
      },
   });

   const dismissPreview = () => {
      hoveredRef.current = null;
      focusedRef.current = null;
      paint();
   };

   return { theme, resolvedTheme, bindTheme, dismissPreview };
}
