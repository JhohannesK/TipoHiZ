type SocialEnv = {
   [key: string]: string | undefined;
   GOOGLE_CLIENT_ID?: string;
   GOOGLE_CLIENT_SECRET?: string;
   GITHUB_CLIENT_ID?: string;
   GITHUB_CLIENT_SECRET?: string;
   TWITTER_CLIENT_ID?: string;
   TWITTER_CLIENT_SECRET?: string;
};

export type AuthPolicyInput = {
   googleClientId?: string;
   googleClientSecret?: string;
   githubClientId?: string;
   githubClientSecret?: string;
   twitterClientId?: string;
   twitterClientSecret?: string;
};

function credential(value: string | undefined): string {
   return value ?? '';
}

/**
 * Serializable Better Auth policy. Keep linking strict, store rate limits
 * in Mongo, and never auto-sign-in on register.
 */
export function authPolicy(input: AuthPolicyInput = {}) {
   return {
      rateLimit: {
         storage: 'database' as const,
      },
      emailAndPassword: {
         enabled: true,
         // Register still sends the user to /login. false also makes
         // duplicate sign-ups return a synthetic success so the
         // response does not reveal that the email is registered.
         autoSignIn: false,
      },
      socialProviders: {
         google: {
            clientId: credential(input.googleClientId),
            clientSecret: credential(input.googleClientSecret),
         },
         github: {
            clientId: credential(input.githubClientId),
            clientSecret: credential(input.githubClientSecret),
         },
         twitter: {
            clientId: credential(input.twitterClientId),
            clientSecret: credential(input.twitterClientSecret),
         },
      },
      account: {
         accountLinking: {
            enabled: true,
            allowDifferentEmails: false,
            requireLocalEmailVerified: true,
            // Keep empty so missing/unverified provider emails cannot
            // auto-link. Twitter is omitted on purpose.
            trustedProviders: [] as string[],
         },
      },
      onAPIError: {
         errorURL: '/login',
      },
   };
}

export function authPolicyFromEnv(env: SocialEnv = process.env) {
   return authPolicy({
      googleClientId: env.GOOGLE_CLIENT_ID,
      googleClientSecret: env.GOOGLE_CLIENT_SECRET,
      githubClientId: env.GITHUB_CLIENT_ID,
      githubClientSecret: env.GITHUB_CLIENT_SECRET,
      twitterClientId: env.TWITTER_CLIENT_ID,
      twitterClientSecret: env.TWITTER_CLIENT_SECRET,
   });
}
