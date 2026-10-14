import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { THEMES, THEME_COLORS } from './theme.constant';

const AA_NORMAL_TEXT = 4.5;
const MIN_ROLE_CONTRAST = 3;
const MIN_ROLE_DELTA_E = 25;

const ADDED_THEMES = [
   'serika-dark',
   'nord',
   'dracula',
   'carbon',
   'botanical',
   'olivia',
] as const;

// Shipped palettes whose main text (--input on --background) is under AA.
// New themes must not be added here.
const LEGACY_MAIN_TEXT_BELOW_AA = [
   'chrismas',
   'cyberpunk',
   'light-green',
   'light-orange',
   'retro',
] as const;

const TYPING_ROLES = ['input', 'correct_char', 'wrong_char', 'cursor'] as const;

type Rgb = [number, number, number];
type Tokens = Record<string, string>;

const css = readFileSync(
   path.resolve(process.cwd(), 'styles/globals.css'),
   'utf8'
);
const blocks = parseThemeBlocks(css);

function parseThemeBlocks(source: string): Map<string, Tokens> {
   const parsed = new Map<string, Tokens>();
   let selector: string | null = null;
   let tokens: Tokens = {};

   const commit = () => {
      if (!selector || !tokens.background || !tokens.input) return;
      const name = selector === ':root' ? 'light' : selector.replace(/^\./, '');
      parsed.set(name, tokens);
   };

   for (const line of source.split('\n')) {
      const open = line.match(/^\s*([.#:]?[\w-]+)\s*\{/);
      if (open && selector === null) {
         const candidate = open[1] ?? '';
         if (candidate === ':root' || candidate.startsWith('.')) {
            selector = candidate;
            tokens = {};
         }
         continue;
      }

      if (selector === null) continue;

      const variable = line.match(/--([\w-]+)\s*:\s*([^;]+)/);
      if (variable) tokens[variable[1] ?? ''] = (variable[2] ?? '').trim();

      if (line.includes('}')) {
         commit();
         selector = null;
      }
   }

   return parsed;
}

function parseHsl(raw: string): { h: number; s: number; l: number; a: number } {
   const parts = raw
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean);
   return {
      h: Number.parseFloat(parts[0] ?? ''),
      s: Number.parseFloat(parts[1] ?? ''),
      l: Number.parseFloat(parts[2] ?? ''),
      a: parts[3] === undefined ? 1 : Number.parseFloat(parts[3]),
   };
}

function hslToRgb({ h, s, l }: { h: number; s: number; l: number }): Rgb {
   const sat = s / 100;
   const lig = l / 100;
   const chroma = (1 - Math.abs(2 * lig - 1)) * sat;
   const hue = (((h % 360) + 360) % 360) / 60;
   const x = chroma * (1 - Math.abs((hue % 2) - 1));
   let red = 0;
   let green = 0;
   let blue = 0;

   if (hue < 1) [red, green, blue] = [chroma, x, 0];
   else if (hue < 2) [red, green, blue] = [x, chroma, 0];
   else if (hue < 3) [red, green, blue] = [0, chroma, x];
   else if (hue < 4) [red, green, blue] = [0, x, chroma];
   else if (hue < 5) [red, green, blue] = [x, 0, chroma];
   else [red, green, blue] = [chroma, 0, x];

   const match = lig - chroma / 2;
   return [(red + match) * 255, (green + match) * 255, (blue + match) * 255];
}

function composite(foreground: Rgb, background: Rgb, alpha: number): Rgb {
   return [
      (foreground[0] ?? 0) * alpha + (background[0] ?? 0) * (1 - alpha),
      (foreground[1] ?? 0) * alpha + (background[1] ?? 0) * (1 - alpha),
      (foreground[2] ?? 0) * alpha + (background[2] ?? 0) * (1 - alpha),
   ];
}

function linear(channel: number): number {
   const value = channel / 255;
   return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(rgb: Rgb): number {
   const [red, green, blue] = rgb.map(linear) as Rgb;
   return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground: Rgb, background: Rgb): number {
   const lighter = Math.max(luminance(foreground), luminance(background));
   const darker = Math.min(luminance(foreground), luminance(background));
   return (lighter + 0.05) / (darker + 0.05);
}

function displayed(tokens: Tokens, role: string, background: Rgb): Rgb {
   const parsed = parseHsl(tokens[role] ?? '');
   return composite(hslToRgb(parsed), background, parsed.a);
}

function themeTokens(name: string): Tokens {
   const tokens = blocks.get(name);
   if (!tokens) throw new Error(`missing css block for ${name}`);
   return tokens;
}

function mainTextContrast(name: string): number {
   const tokens = themeTokens(name);
   const background = hslToRgb(parseHsl(tokens.background ?? ''));
   return contrast(displayed(tokens, 'input', background), background);
}

function rgbToXyz([red, green, blue]: Rgb): [number, number, number] {
   const convert = (channel: number) => {
      const value = channel / 255;
      return value <= 0.04045
         ? value / 12.92
         : ((value + 0.055) / 1.055) ** 2.4;
   };
   const r = convert(red);
   const g = convert(green);
   const b = convert(blue);
   return [
      r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
      r * 0.2126729 + g * 0.7151522 + b * 0.072175,
      r * 0.0193339 + g * 0.119192 + b * 0.9503041,
   ];
}

function xyzToLab([x, y, z]: [number, number, number]): [
   number,
   number,
   number
] {
   const pivot = (channel: number) =>
      channel > 0.008856 ? Math.cbrt(channel) : 7.787 * channel + 16 / 116;
   const fx = pivot(x / 0.95047);
   const fy = pivot(y);
   const fz = pivot(z / 1.08883);
   return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function deltaE(left: Rgb, right: Rgb): number {
   const [l1, a1, b1] = xyzToLab(rgbToXyz(left));
   const [l2, a2, b2] = xyzToLab(rgbToXyz(right));
   return Math.hypot(l1 - l2, a1 - a2, b1 - b2);
}

const legacyBelowAa = new Set<string>(LEGACY_MAIN_TEXT_BELOW_AA);
const themesAtAa = THEMES.filter((name) => !legacyBelowAa.has(name));

describe('theme contrast', () => {
   it('should define a swatch and typing tokens for every theme', () => {
      expect(new Set(THEMES).size).toBe(THEMES.length);

      for (const name of THEMES) {
         const tokens = themeTokens(name);
         expect(THEME_COLORS[name], name).toHaveLength(2);
         for (const role of TYPING_ROLES) {
            expect(tokens[role], `${name} ${role}`).toBeTruthy();
         }
      }
   });

   it.each(themesAtAa)(
      'should contrast main text at least 4.5:1 when the theme is %s',
      (name) => {
         expect(mainTextContrast(name)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
      }
   );

   it.each(LEGACY_MAIN_TEXT_BELOW_AA)(
      'should still measure main text contrast when the legacy theme is %s',
      (name) => {
         const ratio = mainTextContrast(name);
         expect(Number.isFinite(ratio)).toBe(true);
         expect(ratio).toBeGreaterThan(1);
         expect(ratio).toBeLessThan(AA_NORMAL_TEXT);
      }
   );

   it.each(ADDED_THEMES)(
      'should separate untyped, correct, error, and caret colours when the theme is %s',
      (name) => {
         const tokens = themeTokens(name);
         const background = hslToRgb(parseHsl(tokens.background ?? ''));
         const colours = Object.fromEntries(
            TYPING_ROLES.map((role) => [
               role,
               displayed(tokens, role, background),
            ])
         ) as Record<(typeof TYPING_ROLES)[number], Rgb>;

         for (const role of TYPING_ROLES) {
            expect(
               contrast(colours[role], background),
               `${name} ${role} against background`
            ).toBeGreaterThanOrEqual(MIN_ROLE_CONTRAST);
         }

         for (let left = 0; left < TYPING_ROLES.length; left += 1) {
            for (
               let right = left + 1;
               right < TYPING_ROLES.length;
               right += 1
            ) {
               const leftRole = TYPING_ROLES[left] ?? 'input';
               const rightRole = TYPING_ROLES[right] ?? 'cursor';
               expect(
                  deltaE(colours[leftRole], colours[rightRole]),
                  `${name} ${leftRole} vs ${rightRole}`
               ).toBeGreaterThanOrEqual(MIN_ROLE_DELTA_E);
            }
         }
      }
   );
});
