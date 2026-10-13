const PRODUCTION_ORIGIN = 'https://tipohiz.vercel.app';
const PREVIEW_ORIGIN = 'https://tipohiz-preview.vercel.app';
const FEATURE_PREVIEW_ORIGIN =
   'https://tipohiz-git-feature-better-auth-jhohannesks-projects.vercel.app';

function withHttps(host: string | undefined): string | undefined {
   if (!host) return undefined;
   if (host.startsWith('http://') || host.startsWith('https://')) return host;
   return `https://${host}`;
}

/**
 * Prefer an explicit BETTER_AUTH_URL. On Vercel, fall back to the stable
 * branch host so OAuth callbacks stay on the URL registered with providers
 * instead of the per-deployment host.
 */
export function resolveAuthBaseUrl(): string | undefined {
   if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;

   if (
      process.env.VERCEL_ENV === 'production' &&
      process.env.VERCEL_PROJECT_PRODUCTION_URL
   ) {
      return withHttps(process.env.VERCEL_PROJECT_PRODUCTION_URL);
   }

   return withHttps(process.env.VERCEL_BRANCH_URL);
}

export function authTrustedOrigins(): string[] {
   return [PRODUCTION_ORIGIN, PREVIEW_ORIGIN, FEATURE_PREVIEW_ORIGIN];
}
