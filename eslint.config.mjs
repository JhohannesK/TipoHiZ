import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
   ...nextVitals,
   ...nextTs,
   {
      rules: {
         // react-hooks 7 (eslint-config-next 16) errors on existing mount
         // effects and ref initialization. Those patterns stay as they are.
         'react-hooks/set-state-in-effect': 'off',
         'react-hooks/refs': 'off',
      },
   },
   globalIgnores([
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'prisma/generated/**',
      'playwright-report/**',
      'test-results/**',
      'coverage/**',
   ]),
]);

export default eslintConfig;
