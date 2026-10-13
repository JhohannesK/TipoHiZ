type AuthEnv = {
   [key: string]: string | undefined;
   BETTER_AUTH_URL?: string;
   BETTER_AUTH_TRUSTED_ORIGINS?: string;
   VERCEL_URL?: string;
   VERCEL_ENV?: string;
   VERCEL_BRANCH_URL?: string;
   VERCEL_PROJECT_PRODUCTION_URL?: string;
};

function withHttps(host: string | undefined): string | undefined {
   if (!host) return undefined;
   const trimmed = host.trim();
   if (!trimmed) return undefined;
   if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
   }
   return `https://${trimmed}`;
}

/**
 * Prefer an explicit BETTER_AUTH_URL. On Vercel, fall back to the stable
 * branch host so OAuth callbacks stay on the URL registered with providers
 * instead of the per-deployment host.
 */
export function resolveAuthBaseUrl(
   env: AuthEnv = process.env
): string | undefined {
   if (env.BETTER_AUTH_URL) return env.BETTER_AUTH_URL;

   if (env.VERCEL_ENV === 'production' && env.VERCEL_PROJECT_PRODUCTION_URL) {
      return withHttps(env.VERCEL_PROJECT_PRODUCTION_URL);
   }

   return withHttps(env.VERCEL_BRANCH_URL);
}

function listedOrigins(value: string | undefined): string[] {
   if (!value) return [];
   return value
      .split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0);
}

/**
 * Origins Better Auth will accept. Comes from BETTER_AUTH_TRUSTED_ORIGINS
 * (comma-separated), plus BETTER_AUTH_URL and VERCEL_URL. Nothing is hardcoded.
 */
export function authTrustedOrigins(env: AuthEnv = process.env): string[] {
   const origins = [
      ...listedOrigins(env.BETTER_AUTH_TRUSTED_ORIGINS),
      env.BETTER_AUTH_URL?.trim() || undefined,
      withHttps(env.VERCEL_URL),
   ].filter((origin): origin is string => Boolean(origin));

   return [...new Set(origins)];
}
