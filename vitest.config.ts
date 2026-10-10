import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
   plugins: [react()],
   resolve: {
      alias: {
         '@': root,
      },
   },
   test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./test/setup.ts'],
      include: ['**/*.{test,spec}.{ts,tsx}'],
      exclude: [
         '**/node_modules/**',
         '**/.next/**',
         'e2e/**',
         'playwright-report/**',
         'test-results/**',
      ],
      clearMocks: true,
      restoreMocks: true,
   },
});
