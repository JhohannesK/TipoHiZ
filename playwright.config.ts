import { defineConfig, devices } from '@playwright/test';

const testEnv: Record<string, string> = {
   MONGODB_URI: 'mongodb://127.0.0.1:27017/tipohiz',
   AUTH_SECRET: 'ci-test-auth-secret',
   NEXTAUTH_SECRET: 'ci-test-auth-secret',
   AUTH_URL: 'http://127.0.0.1:3000',
   AUTH_TRUST_HOST: 'true',
   NEXTAUTH_URL: 'http://127.0.0.1:3000',
   GOOGLE_CLIENT_ID: 'ci-test',
   GOOGLE_CLIENT_SECRET: 'ci-test',
   GITHUB_CLIENT_ID: 'ci-test',
   GITHUB_CLIENT_SECRET: 'ci-test',
   TWITTER_CLIENT_ID: 'ci-test',
   TWITTER_CLIENT_SECRET: 'ci-test',
};

const isCI = !!process.env.CI;

export default defineConfig({
   testDir: './e2e',
   fullyParallel: false,
   forbidOnly: isCI,
   retries: 0,
   workers: 1,
   timeout: 40_000,
   expect: {
      timeout: 20_000,
   },
   use: {
      baseURL: 'http://127.0.0.1:3000',
      trace: 'retain-on-failure',
   },
   projects: [
      {
         name: 'chromium',
         use: { ...devices['Desktop Chrome'] },
      },
   ],
   webServer: {
      command: isCI ? 'pnpm start' : 'pnpm dev',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: !isCI,
      timeout: 120_000,
      env: {
         ...testEnv,
         PORT: '3000',
         HOSTNAME: '127.0.0.1',
      },
   },
});
