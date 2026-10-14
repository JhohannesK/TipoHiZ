import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { THEMES } from './theme.constant';

const MIN_MAIN_TEXT_CONTRAST = 4.5;

const cssPath = path.resolve(
   path.dirname(fileURLToPath(import.meta.url)),
   '../../styles/globals.css'
);
const themeCss = readFileSync(cssPath, 'utf8');

type Rgb = [number, number, number];

function themeSelector(theme: string): string {
   return theme === 'light' ? ':root' : `.${theme}`;
}

function themeBlock(source: string, selector: string): string {
   const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
   const match = source.match(
      new RegExp(`(?:^|\\n)\\s*${escaped}\\s*\\{([^}]*)\\}`)
   );
   const block = match?.[1];
   if (!block) {
      throw new Error(`Missing theme block for ${selector}`);
   }
   return block;
}

function readHsl(block: string, variable: string): Rgb {
   const match = block.match(
      new RegExp(
         `--${variable}\\s*:\\s*([\\d.]+)[,\\s]+([\\d.]+)%[,\\s]+([\\d.]+)%`
      )
   );
   if (!match) {
      throw new Error(`Missing --${variable}`);
   }
   return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function hslToRgb(hue: number, saturation: number, lightness: number): Rgb {
   const s = saturation / 100;
   const l = lightness / 100;
   const chroma = (1 - Math.abs(2 * l - 1)) * s;
   const hueSector = (((hue % 360) + 360) % 360) / 60;
   const x = chroma * (1 - Math.abs((hueSector % 2) - 1));
   const m = l - chroma / 2;
   let red = 0;
   let green = 0;
   let blue = 0;

   if (hueSector < 1) {
      red = chroma;
      green = x;
   } else if (hueSector < 2) {
      red = x;
      green = chroma;
   } else if (hueSector < 3) {
      green = chroma;
      blue = x;
   } else if (hueSector < 4) {
      green = x;
      blue = chroma;
   } else if (hueSector < 5) {
      red = x;
      blue = chroma;
   } else {
      red = chroma;
      blue = x;
   }

   return [(red + m) * 255, (green + m) * 255, (blue + m) * 255];
}

function channelLuminance(channel: number): number {
   const srgb = channel / 255;
   return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(rgb: Rgb): number {
   const [red, green, blue] = rgb;
   return (
      0.2126 * channelLuminance(red) +
      0.7152 * channelLuminance(green) +
      0.0722 * channelLuminance(blue)
   );
}

function contrastRatio(foreground: Rgb, background: Rgb): number {
   const lighter = Math.max(
      relativeLuminance(foreground),
      relativeLuminance(background)
   );
   const darker = Math.min(
      relativeLuminance(foreground),
      relativeLuminance(background)
   );
   return (lighter + 0.05) / (darker + 0.05);
}

function mainTextContrast(theme: string): number {
   const block = themeBlock(themeCss, themeSelector(theme));
   const background = hslToRgb(...readHsl(block, 'background'));
   const text = hslToRgb(...readHsl(block, 'input'));
   return contrastRatio(text, background);
}

describe('theme main text contrast', () => {
   it.each(THEMES)(
      'should keep main text contrast at or above 4.5:1 when the theme is %s',
      (theme) => {
         expect(mainTextContrast(theme)).toBeGreaterThanOrEqual(
            MIN_MAIN_TEXT_CONTRAST
         );
      }
   );
});
