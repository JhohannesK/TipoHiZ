import { describe, expect, it } from 'vitest';
import {
   createMemoryMigrationRepository,
   formatMigrationReport,
   parseMigrationArgs,
   planMigration,
   runMigration,
   type LegacyAccount,
   type LegacyUser,
} from './migrate-next-auth';

const bcryptHash = '$2b$04$existinghash';

function user(
   overrides: Partial<LegacyUser> & Pick<LegacyUser, 'id'>
): LegacyUser {
   return {
      name: 'Ada',
      email: null,
      emailVerified: null,
      password: null,
      image: null,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      ...overrides,
   };
}

function account(
   overrides: Partial<LegacyAccount> &
      Pick<LegacyAccount, 'id' | 'userId' | 'provider' | 'providerAccountId'>
): LegacyAccount {
   return {
      access_token: 'access',
      refresh_token: 'refresh',
      id_token: 'id-token',
      expires_at: 1_700_000_000,
      scope: 'email',
      createdAt: new Date('2024-01-03T00:00:00.000Z'),
      updatedAt: new Date('2024-01-04T00:00:00.000Z'),
      ...overrides,
   };
}

const verifiedGoogle = user({
   id: 'u-google',
   email: 'Ada@Example.com',
   emailVerified: new Date('2024-01-01T00:00:00.000Z'),
   createdAt: new Date('2024-01-01T00:00:00.000Z'),
   name: 'Ada Lovelace',
});

const verifiedGithub = user({
   id: 'u-github',
   email: 'ada@example.com',
   emailVerified: new Date('2024-02-01T00:00:00.000Z'),
   createdAt: new Date('2024-02-01T00:00:00.000Z'),
   name: 'Ada',
   password: bcryptHash,
});

const googleAccount = account({
   id: 'acc-google',
   userId: 'u-google',
   provider: 'google',
   providerAccountId: 'google-subject',
});

const githubAccount = account({
   id: 'acc-github',
   userId: 'u-github',
   provider: 'github',
   providerAccountId: 'github-subject',
});

describe('planMigration', () => {
   it('should merge users who share a verified email and map oauth accounts onto the canonical user', () => {
      const plan = planMigration(
         [verifiedGithub, verifiedGoogle],
         [githubAccount, googleAccount]
      );

      expect(plan.merges).toEqual([
         {
            email: 'ada@example.com',
            sourceUserIds: ['u-google', 'u-github'],
            canonicalUserId: 'u-google',
         },
      ]);
      expect(plan.users).toHaveLength(1);
      expect(plan.users[0]).toMatchObject({
         id: 'u-google',
         email: 'ada@example.com',
         emailVerified: true,
         name: 'Ada Lovelace',
      });

      const linked = plan.accounts.filter(
         (entry) => entry.userId === 'u-google'
      );
      expect(linked.map((entry) => entry.providerId).sort()).toEqual([
         'credential',
         'github',
         'google',
      ]);
      expect(
         linked.find((entry) => entry.providerId === 'google')
      ).toMatchObject({
         accountId: 'google-subject',
         providerId: 'google',
         legacyId: 'acc-google',
         accessToken: 'access',
         refreshToken: 'refresh',
         idToken: 'id-token',
         scope: 'email',
         accessTokenExpiresAt: new Date(1_700_000_000 * 1000),
      });
      expect(
         linked.find((entry) => entry.providerId === 'credential')
      ).toMatchObject({
         accountId: 'u-google',
         password: bcryptHash,
      });
   });

   it('should keep an unverified Twitter account separate when it has no email', () => {
      const twitter = user({
         id: 'u-twitter',
         name: 'No Email',
         email: null,
         emailVerified: null,
      });
      const twitterAccount = account({
         id: 'acc-twitter',
         userId: 'u-twitter',
         provider: 'twitter',
         providerAccountId: 'twitter-subject',
      });

      const plan = planMigration(
         [verifiedGoogle, twitter],
         [googleAccount, twitterAccount]
      );

      const migratedTwitter = plan.users.find(
         (entry) => entry.id === 'u-twitter'
      );
      expect(migratedTwitter).toMatchObject({
         emailVerified: false,
         email: 'missing+u-twitter@users.tipohiz.placeholder.invalid',
      });
      expect(plan.separate).toContainEqual({
         userId: 'u-twitter',
         email: null,
         reason: 'missing-email',
      });
      expect(
         plan.accounts.find((entry) => entry.providerId === 'twitter')
      ).toMatchObject({
         userId: 'u-twitter',
         accountId: 'twitter-subject',
         providerId: 'twitter',
      });
      expect(
         plan.accounts.find((entry) => entry.providerId === 'google')?.userId
      ).toBe('u-google');
   });

   it('should keep an unverified Twitter account separate when its email matches a verified user', () => {
      const twitter = user({
         id: 'u-twitter',
         email: 'ada@example.com',
         emailVerified: null,
         createdAt: new Date('2024-03-01T00:00:00.000Z'),
      });
      const twitterAccount = account({
         id: 'acc-twitter',
         userId: 'u-twitter',
         provider: 'twitter',
         providerAccountId: 'twitter-subject',
      });

      const plan = planMigration(
         [verifiedGoogle, twitter],
         [googleAccount, twitterAccount]
      );

      expect(plan.merges).toEqual([]);
      expect(plan.users.map((entry) => entry.id).sort()).toEqual([
         'u-google',
         'u-twitter',
      ]);
      expect(plan.users.find((entry) => entry.id === 'u-google')?.email).toBe(
         'ada@example.com'
      );
      expect(
         plan.users.find((entry) => entry.id === 'u-twitter')
      ).toMatchObject({
         emailVerified: false,
         email: 'unverified+u-twitter@users.tipohiz.placeholder.invalid',
      });
      expect(plan.separate).toContainEqual({
         userId: 'u-twitter',
         email: 'ada@example.com',
         reason: 'email-taken',
      });
      expect(
         plan.accounts.find((entry) => entry.providerId === 'twitter')?.userId
      ).toBe('u-twitter');
   });

   it('should merge a Twitter account when its email is verified', () => {
      const twitter = user({
         id: 'u-twitter',
         email: 'ada@example.com',
         emailVerified: new Date('2024-03-01T00:00:00.000Z'),
         createdAt: new Date('2024-03-01T00:00:00.000Z'),
      });
      const twitterAccount = account({
         id: 'acc-twitter',
         userId: 'u-twitter',
         provider: 'twitter',
         providerAccountId: 'twitter-subject',
      });

      const plan = planMigration(
         [verifiedGoogle, twitter],
         [googleAccount, twitterAccount]
      );

      expect(plan.merges).toEqual([
         {
            email: 'ada@example.com',
            sourceUserIds: ['u-google', 'u-twitter'],
            canonicalUserId: 'u-google',
         },
      ]);
      expect(
         plan.accounts.find((entry) => entry.providerId === 'twitter')?.userId
      ).toBe('u-google');
   });
});

describe('runMigration', () => {
   const users = [verifiedGoogle, verifiedGithub];
   const accounts = [googleAccount, githubAccount];

   it('should write nothing on the default dry-run', async () => {
      const repository = createMemoryMigrationRepository({ users, accounts });

      const report = await runMigration(repository, 'dry-run');

      expect(parseMigrationArgs([])).toBe('dry-run');
      expect(parseMigrationArgs(['--dry-run'])).toBe('dry-run');
      expect(repository.operations).toEqual([]);
      expect(repository.snapshot()).toEqual({ users: [], accounts: [] });
      expect(report.writes).toEqual({
         insertedUsers: 0,
         updatedUsers: 0,
         unchangedUsers: 0,
         insertedAccounts: 0,
         updatedAccounts: 0,
         unchangedAccounts: 0,
      });
      expect(formatMigrationReport(report)).toContain('Writes: none');
      expect(formatMigrationReport(report)).toContain(
         'ada@example.com: u-google, u-github -> u-google'
      );
      expect(formatMigrationReport(report)).toContain(
         'Source collections User and Account were not modified or deleted.'
      );
   });

   it('should leave stored rows unchanged on a second apply', async () => {
      const repository = createMemoryMigrationRepository({ users, accounts });

      const first = await runMigration(repository, 'apply');
      const afterFirst = repository.snapshot();
      repository.operations.length = 0;

      const second = await runMigration(repository, 'apply');

      expect(first.writes.insertedUsers).toBe(1);
      expect(first.writes.insertedAccounts).toBe(3);
      expect(repository.operations).toEqual([]);
      expect(second.writes).toMatchObject({
         insertedUsers: 0,
         updatedUsers: 0,
         unchangedUsers: 1,
         insertedAccounts: 0,
         updatedAccounts: 0,
         unchangedAccounts: 3,
      });
      expect(repository.snapshot()).toEqual(afterFirst);
   });
});
