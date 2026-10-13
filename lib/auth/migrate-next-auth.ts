import { MongoClient, ObjectId, type Db, type Document } from 'mongodb';

export const LEGACY_USER_COLLECTION = 'User';
export const LEGACY_ACCOUNT_COLLECTION = 'Account';
export const BETTER_AUTH_USER_COLLECTION = 'user';
export const BETTER_AUTH_ACCOUNT_COLLECTION = 'account';
export const CREDENTIAL_PROVIDER_ID = 'credential';

export type MigrationMode = 'dry-run' | 'apply';

export type SeparateReason = 'unverified' | 'missing-email' | 'email-taken';

export type LegacyUser = {
   id: string;
   name: string | null;
   email: string | null;
   emailVerified: Date | string | null;
   password: string | null;
   image: string | null;
   createdAt: Date | string;
   updatedAt: Date | string;
};

export type LegacyAccount = {
   id: string;
   userId: string;
   provider: string;
   providerAccountId: string;
   refresh_token?: string | null;
   access_token?: string | null;
   expires_at?: number | null;
   scope?: string | null;
   id_token?: string | null;
   createdAt?: Date | string | null;
   updatedAt?: Date | string | null;
};

export type PlannedUser = {
   id: string;
   name: string;
   email: string;
   emailVerified: boolean;
   image: string | null;
   createdAt: Date;
   updatedAt: Date;
   sourceUserIds: string[];
};

export type PlannedAccount = {
   legacyId: string | null;
   accountId: string;
   providerId: string;
   userId: string;
   password: string | null;
   accessToken: string | null;
   refreshToken: string | null;
   idToken: string | null;
   accessTokenExpiresAt: Date | null;
   scope: string | null;
   createdAt: Date;
   updatedAt: Date;
};

export type PlannedMerge = {
   email: string;
   sourceUserIds: string[];
   canonicalUserId: string;
};

export type SeparateUser = {
   userId: string;
   email: string | null;
   reason: SeparateReason;
};

export type MigrationPlan = {
   users: PlannedUser[];
   accounts: PlannedAccount[];
   merges: PlannedMerge[];
   separate: SeparateUser[];
   orphanAccountIds: string[];
   droppedCredentialPasswords: number;
   counts: {
      legacyUsers: number;
      legacyAccounts: number;
      plannedUsers: number;
      plannedAccounts: number;
      merges: number;
      separate: number;
   };
};

export type MigrationWrites = {
   insertedUsers: number;
   updatedUsers: number;
   unchangedUsers: number;
   insertedAccounts: number;
   updatedAccounts: number;
   unchangedAccounts: number;
};

export type MigrationReport = {
   mode: MigrationMode;
   plan: MigrationPlan;
   writes: MigrationWrites;
};

export interface MigrationRepository {
   listLegacyUsers(): Promise<LegacyUser[]>;
   listLegacyAccounts(): Promise<LegacyAccount[]>;
   findUserById(id: string): Promise<PlannedUser | null>;
   insertUser(user: PlannedUser): Promise<void>;
   updateUser(user: PlannedUser): Promise<void>;
   findAccount(
      providerId: string,
      accountId: string
   ): Promise<PlannedAccount | null>;
   insertAccount(account: PlannedAccount): Promise<void>;
   updateAccount(account: PlannedAccount): Promise<void>;
}

export type MemoryMigrationRepository = MigrationRepository & {
   operations: Array<
      'insertUser' | 'updateUser' | 'insertAccount' | 'updateAccount'
   >;
   snapshot(): { users: PlannedUser[]; accounts: PlannedAccount[] };
};

const EMPTY_WRITES: MigrationWrites = {
   insertedUsers: 0,
   updatedUsers: 0,
   unchangedUsers: 0,
   insertedAccounts: 0,
   updatedAccounts: 0,
   unchangedAccounts: 0,
};

export function parseMigrationArgs(argv: string[]): MigrationMode {
   const flags = argv.filter((arg) => arg !== '--');
   const unknown = flags.filter(
      (flag) => flag !== '--dry-run' && flag !== '--apply'
   );
   if (unknown.length > 0) {
      throw new Error(
         `Unknown argument ${unknown.join(', ')}. Use --dry-run or --apply.`
      );
   }

   const apply = flags.includes('--apply');
   const dryRun = flags.includes('--dry-run');
   if (apply && dryRun) {
      throw new Error('Pass only one of --dry-run or --apply.');
   }

   return apply ? 'apply' : 'dry-run';
}

export function normalizeEmail(
   email: string | null | undefined
): string | null {
   if (!email) return null;
   const trimmed = email.trim().toLowerCase();
   return trimmed.length > 0 ? trimmed : null;
}

export function planMigration(
   users: LegacyUser[],
   accounts: LegacyAccount[]
): MigrationPlan {
   const sortedUsers = [...users].sort(compareUsers);
   const verifiedGroups = new Map<string, LegacyUser[]>();
   const unverified: LegacyUser[] = [];

   for (const user of sortedUsers) {
      const email = normalizeEmail(user.email);
      if (email && hasVerifiedEmail(user)) {
         const group = verifiedGroups.get(email) ?? [];
         group.push(user);
         verifiedGroups.set(email, group);
      } else {
         unverified.push(user);
      }
   }

   const claimedEmails = new Set<string>();
   const sourceToTarget = new Map<string, string>();
   const plannedUsers: PlannedUser[] = [];
   const merges: PlannedMerge[] = [];
   const separate: SeparateUser[] = [];

   const verifiedEntries = [...verifiedGroups.entries()].sort((left, right) =>
      left[0].localeCompare(right[0])
   );

   for (const [email, group] of verifiedEntries) {
      const canonical = group[0];
      if (!canonical) continue;
      claimedEmails.add(email);
      plannedUsers.push(buildUser(canonical, group, email, true));
      for (const member of group) {
         sourceToTarget.set(member.id, canonical.id);
      }
      if (group.length > 1) {
         merges.push({
            email,
            sourceUserIds: group.map((member) => member.id),
            canonicalUserId: canonical.id,
         });
      }
   }

   for (const user of unverified) {
      const email = normalizeEmail(user.email);
      const assignment = assignUnverifiedEmail(user.id, email, claimedEmails);
      claimedEmails.add(assignment.email);
      sourceToTarget.set(user.id, user.id);
      plannedUsers.push(buildUser(user, [user], assignment.email, false));
      separate.push({
         userId: user.id,
         email,
         reason: assignment.reason,
      });
   }

   const knownUserIds = new Set(users.map((user) => user.id));
   const orphanAccountIds = accounts
      .filter((account) => !knownUserIds.has(account.userId))
      .map((account) => account.id);

   const plannedAccounts: PlannedAccount[] = [];
   const seenAccountKeys = new Set<string>();
   const sortedAccounts = [...accounts].sort(compareAccounts);

   for (const account of sortedAccounts) {
      if (!knownUserIds.has(account.userId)) continue;
      if (isCredentialProvider(account.provider)) continue;

      const targetUserId = sourceToTarget.get(account.userId);
      if (!targetUserId) continue;

      const key = accountKey(account.provider, account.providerAccountId);
      if (seenAccountKeys.has(key)) continue;
      seenAccountKeys.add(key);
      plannedAccounts.push(mapOAuthAccount(account, targetUserId));
   }

   const passwordsByTarget = new Map<
      string,
      Array<{ password: string; createdAt: Date; updatedAt: Date }>
   >();

   for (const user of sortedUsers) {
      if (!user.password) continue;
      const targetUserId = sourceToTarget.get(user.id);
      if (!targetUserId) continue;
      const list = passwordsByTarget.get(targetUserId) ?? [];
      list.push({
         password: user.password,
         createdAt: toDate(user.createdAt),
         updatedAt: toDate(user.updatedAt),
      });
      passwordsByTarget.set(targetUserId, list);
   }

   let droppedCredentialPasswords = 0;
   for (const [targetUserId, passwords] of passwordsByTarget) {
      const kept = passwords[0];
      if (!kept) continue;
      droppedCredentialPasswords += Math.max(0, passwords.length - 1);
      const key = accountKey(CREDENTIAL_PROVIDER_ID, targetUserId);
      if (seenAccountKeys.has(key)) continue;
      seenAccountKeys.add(key);
      plannedAccounts.push({
         legacyId: null,
         accountId: targetUserId,
         providerId: CREDENTIAL_PROVIDER_ID,
         userId: targetUserId,
         password: kept.password,
         accessToken: null,
         refreshToken: null,
         idToken: null,
         accessTokenExpiresAt: null,
         scope: null,
         createdAt: kept.createdAt,
         updatedAt: kept.updatedAt,
      });
   }

   return {
      users: plannedUsers,
      accounts: plannedAccounts,
      merges,
      separate,
      orphanAccountIds,
      droppedCredentialPasswords,
      counts: {
         legacyUsers: users.length,
         legacyAccounts: accounts.length,
         plannedUsers: plannedUsers.length,
         plannedAccounts: plannedAccounts.length,
         merges: merges.length,
         separate: separate.length,
      },
   };
}

export async function runMigration(
   repository: MigrationRepository,
   mode: MigrationMode
): Promise<MigrationReport> {
   const [users, accounts] = await Promise.all([
      repository.listLegacyUsers(),
      repository.listLegacyAccounts(),
   ]);
   const plan = planMigration(users, accounts);

   if (mode === 'dry-run') {
      return { mode, plan, writes: { ...EMPTY_WRITES } };
   }

   if (mode !== 'apply') {
      const unreachable: never = mode;
      throw new Error(`Unknown migration mode ${String(unreachable)}`);
   }

   const writes: MigrationWrites = { ...EMPTY_WRITES };

   for (const user of plan.users) {
      const existing = await repository.findUserById(user.id);
      if (!existing) {
         await repository.insertUser(user);
         writes.insertedUsers += 1;
      } else if (!sameUser(existing, user)) {
         await repository.updateUser(user);
         writes.updatedUsers += 1;
      } else {
         writes.unchangedUsers += 1;
      }
   }

   for (const account of plan.accounts) {
      const existing = await repository.findAccount(
         account.providerId,
         account.accountId
      );
      if (!existing) {
         await repository.insertAccount(account);
         writes.insertedAccounts += 1;
      } else if (!sameAccount(existing, account)) {
         await repository.updateAccount(account);
         writes.updatedAccounts += 1;
      } else {
         writes.unchangedAccounts += 1;
      }
   }

   return { mode, plan, writes };
}

export function formatMigrationReport(report: MigrationReport): string {
   const lines = [
      `Better Auth migration (${report.mode})`,
      `Legacy users: ${report.plan.counts.legacyUsers}`,
      `Legacy accounts: ${report.plan.counts.legacyAccounts}`,
      `Planned users: ${report.plan.counts.plannedUsers}`,
      `Planned accounts: ${report.plan.counts.plannedAccounts}`,
      `Planned merges: ${report.plan.counts.merges}`,
   ];

   if (report.plan.merges.length === 0) {
      lines.push('  none');
   } else {
      for (const merge of report.plan.merges) {
         lines.push(
            `  ${merge.email}: ${merge.sourceUserIds.join(', ')} -> ${
               merge.canonicalUserId
            }`
         );
      }
   }

   lines.push(
      `Kept separate: ${report.plan.counts.separate}`,
      ...report.plan.separate.map(
         (entry) => `  ${entry.userId} ${describeSeparateReason(entry.reason)}`
      )
   );

   if (report.plan.orphanAccountIds.length > 0) {
      lines.push(
         `Orphan accounts skipped: ${report.plan.orphanAccountIds.join(', ')}`
      );
   }

   if (report.plan.droppedCredentialPasswords > 0) {
      lines.push(
         `Extra passwords dropped on merge: ${report.plan.droppedCredentialPasswords}`
      );
   }

   if (report.mode === 'dry-run') {
      lines.push('Writes: none');
   } else {
      lines.push(
         `Inserted users: ${report.writes.insertedUsers}`,
         `Updated users: ${report.writes.updatedUsers}`,
         `Unchanged users: ${report.writes.unchangedUsers}`,
         `Inserted accounts: ${report.writes.insertedAccounts}`,
         `Updated accounts: ${report.writes.updatedAccounts}`,
         `Unchanged accounts: ${report.writes.unchangedAccounts}`
      );
   }

   lines.push(
      'Source collections User and Account were not modified or deleted.',
      'Sessions are not copied. Existing NextAuth sessions stop working after cutover.'
   );

   return lines.join('\n');
}

export function createMemoryMigrationRepository(input: {
   users: LegacyUser[];
   accounts: LegacyAccount[];
}): MemoryMigrationRepository {
   const storedUsers = new Map<string, PlannedUser>();
   const storedAccounts = new Map<string, PlannedAccount>();
   const operations: MemoryMigrationRepository['operations'] = [];

   return {
      operations,
      async listLegacyUsers() {
         return input.users.map((user) => ({ ...user }));
      },
      async listLegacyAccounts() {
         return input.accounts.map((account) => ({ ...account }));
      },
      async findUserById(id) {
         const user = storedUsers.get(id);
         if (!user) return null;
         // The user collection does not store merge bookkeeping.
         return { ...cloneUser(user), sourceUserIds: [user.id] };
      },
      async insertUser(user) {
         operations.push('insertUser');
         storedUsers.set(user.id, cloneUser(user));
      },
      async updateUser(user) {
         operations.push('updateUser');
         storedUsers.set(user.id, cloneUser(user));
      },
      async findAccount(providerId, accountId) {
         const account = storedAccounts.get(accountKey(providerId, accountId));
         return account ? cloneAccount(account) : null;
      },
      async insertAccount(account) {
         operations.push('insertAccount');
         storedAccounts.set(
            accountKey(account.providerId, account.accountId),
            cloneAccount(account)
         );
      },
      async updateAccount(account) {
         operations.push('updateAccount');
         storedAccounts.set(
            accountKey(account.providerId, account.accountId),
            cloneAccount(account)
         );
      },
      snapshot() {
         return {
            users: [...storedUsers.values()].map(cloneUser),
            accounts: [...storedAccounts.values()].map(cloneAccount),
         };
      },
   };
}

export function createMongoMigrationRepository(db: Db): MigrationRepository {
   const legacyUsers = db.collection(LEGACY_USER_COLLECTION);
   const legacyAccounts = db.collection(LEGACY_ACCOUNT_COLLECTION);
   const users = db.collection(BETTER_AUTH_USER_COLLECTION);
   const accounts = db.collection(BETTER_AUTH_ACCOUNT_COLLECTION);

   return {
      async listLegacyUsers() {
         const docs = await legacyUsers.find({}).toArray();
         return docs.map(readLegacyUser);
      },
      async listLegacyAccounts() {
         const docs = await legacyAccounts.find({}).toArray();
         return docs.map(readLegacyAccount);
      },
      async findUserById(id) {
         const doc = await users.findOne({ _id: toObjectId(id, 'user id') });
         return doc ? readPlannedUser(doc) : null;
      },
      async insertUser(user) {
         await users.insertOne(userDocument(user));
      },
      async updateUser(user) {
         const { _id, ...fields } = userDocument(user);
         await users.updateOne({ _id }, { $set: fields });
      },
      async findAccount(providerId, accountId) {
         const doc = await accounts.findOne({ providerId, accountId });
         return doc ? readPlannedAccount(doc) : null;
      },
      async insertAccount(account) {
         await accounts.insertOne(accountDocument(account));
      },
      async updateAccount(account) {
         await accounts.updateOne(
            { providerId: account.providerId, accountId: account.accountId },
            { $set: accountFields(account) }
         );
      },
   };
}

export async function connectAndRunMigration(
   uri: string,
   mode: MigrationMode
): Promise<MigrationReport> {
   const client = new MongoClient(uri);
   await client.connect();
   try {
      return await runMigration(
         createMongoMigrationRepository(client.db()),
         mode
      );
   } finally {
      await client.close();
   }
}

function assignUnverifiedEmail(
   userId: string,
   email: string | null,
   claimedEmails: Set<string>
): { email: string; reason: SeparateReason } {
   if (!email) {
      return {
         email: placeholderEmail(userId, 'missing'),
         reason: 'missing-email',
      };
   }

   if (claimedEmails.has(email)) {
      return {
         email: placeholderEmail(userId, 'unverified'),
         reason: 'email-taken',
      };
   }

   return { email, reason: 'unverified' };
}

function placeholderEmail(
   userId: string,
   kind: 'missing' | 'unverified'
): string {
   return `${kind}+${userId}@users.tipohiz.placeholder.invalid`;
}

function buildUser(
   canonical: LegacyUser,
   group: LegacyUser[],
   email: string,
   emailVerified: boolean
): PlannedUser {
   const ordered = [...group].sort(compareUsers);
   return {
      id: canonical.id,
      name: firstText(ordered.map((user) => user.name)),
      email,
      emailVerified,
      image: firstText(ordered.map((user) => user.image)) || null,
      createdAt: toDate(canonical.createdAt),
      updatedAt: new Date(
         Math.max(...ordered.map((user) => toDate(user.updatedAt).getTime()))
      ),
      sourceUserIds: ordered.map((user) => user.id),
   };
}

function mapOAuthAccount(
   account: LegacyAccount,
   targetUserId: string
): PlannedAccount {
   const createdAt = account.createdAt
      ? toDate(account.createdAt)
      : new Date(0);
   const updatedAt = account.updatedAt ? toDate(account.updatedAt) : createdAt;
   return {
      legacyId: account.id,
      accountId: account.providerAccountId,
      providerId: account.provider,
      userId: targetUserId,
      password: null,
      accessToken: account.access_token ?? null,
      refreshToken: account.refresh_token ?? null,
      idToken: account.id_token ?? null,
      accessTokenExpiresAt:
         account.expires_at == null
            ? null
            : new Date(account.expires_at * 1000),
      scope: account.scope ?? null,
      createdAt,
      updatedAt,
   };
}

function hasVerifiedEmail(user: LegacyUser): boolean {
   if (!normalizeEmail(user.email) || user.emailVerified == null) return false;
   return !Number.isNaN(toDate(user.emailVerified).getTime());
}

function isCredentialProvider(provider: string): boolean {
   return provider === CREDENTIAL_PROVIDER_ID || provider === 'credentials';
}

function compareUsers(left: LegacyUser, right: LegacyUser): number {
   const created =
      toDate(left.createdAt).getTime() - toDate(right.createdAt).getTime();
   if (created !== 0) return created;
   if (left.id < right.id) return -1;
   if (left.id > right.id) return 1;
   return 0;
}

function compareAccounts(left: LegacyAccount, right: LegacyAccount): number {
   const leftCreated = left.createdAt ? toDate(left.createdAt).getTime() : 0;
   const rightCreated = right.createdAt ? toDate(right.createdAt).getTime() : 0;
   if (leftCreated !== rightCreated) return leftCreated - rightCreated;
   if (left.id < right.id) return -1;
   if (left.id > right.id) return 1;
   return 0;
}

function toDate(value: Date | string): Date {
   if (value instanceof Date) return value;
   return new Date(value);
}

function firstText(values: Array<string | null | undefined>): string {
   for (const value of values) {
      if (value && value.trim()) return value;
   }
   return '';
}

function accountKey(providerId: string, accountId: string): string {
   return `${providerId}\0${accountId}`;
}

function sameUser(left: PlannedUser, right: PlannedUser): boolean {
   return (
      left.id === right.id &&
      left.name === right.name &&
      left.email === right.email &&
      left.emailVerified === right.emailVerified &&
      left.image === right.image &&
      left.createdAt.getTime() === right.createdAt.getTime() &&
      left.updatedAt.getTime() === right.updatedAt.getTime()
   );
}

function sameAccount(left: PlannedAccount, right: PlannedAccount): boolean {
   return (
      left.accountId === right.accountId &&
      left.providerId === right.providerId &&
      left.userId === right.userId &&
      left.password === right.password &&
      left.accessToken === right.accessToken &&
      left.refreshToken === right.refreshToken &&
      left.idToken === right.idToken &&
      left.scope === right.scope &&
      sameOptionalDate(left.accessTokenExpiresAt, right.accessTokenExpiresAt) &&
      left.createdAt.getTime() === right.createdAt.getTime() &&
      left.updatedAt.getTime() === right.updatedAt.getTime()
   );
}

function sameOptionalDate(left: Date | null, right: Date | null): boolean {
   if (left === null || right === null) return left === right;
   return left.getTime() === right.getTime();
}

function describeSeparateReason(reason: SeparateReason): string {
   switch (reason) {
      case 'unverified':
         return 'unverified email, kept separate';
      case 'missing-email':
         return 'no email, kept separate';
      case 'email-taken':
         return 'email already used by a verified account, kept separate';
      default: {
         const unreachable: never = reason;
         return unreachable;
      }
   }
}

function cloneUser(user: PlannedUser): PlannedUser {
   return {
      ...user,
      sourceUserIds: [...user.sourceUserIds],
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
   };
}

function cloneAccount(account: PlannedAccount): PlannedAccount {
   return {
      ...account,
      accessTokenExpiresAt: account.accessTokenExpiresAt
         ? new Date(account.accessTokenExpiresAt)
         : null,
      createdAt: new Date(account.createdAt),
      updatedAt: new Date(account.updatedAt),
   };
}

function readLegacyUser(doc: Document): LegacyUser {
   return {
      id: requiredId(doc._id, 'User _id'),
      name: asNullableString(doc.name),
      email: asNullableString(doc.email),
      emailVerified: asDateLike(doc.emailVerified),
      password: asNullableString(doc.password),
      image: asNullableString(doc.image),
      createdAt: asDateLike(doc.createdAt) ?? new Date(0),
      updatedAt: asDateLike(doc.updatedAt) ?? new Date(0),
   };
}

function readLegacyAccount(doc: Document): LegacyAccount {
   return {
      id: requiredId(doc._id, 'Account _id'),
      userId: requiredId(doc.userId, 'Account userId'),
      provider: asNullableString(doc.provider) ?? '',
      providerAccountId: asNullableString(doc.providerAccountId) ?? '',
      refresh_token: asNullableString(doc.refresh_token),
      access_token: asNullableString(doc.access_token),
      expires_at: typeof doc.expires_at === 'number' ? doc.expires_at : null,
      scope: asNullableString(doc.scope),
      id_token: asNullableString(doc.id_token),
      createdAt: asDateLike(doc.createdAt),
      updatedAt: asDateLike(doc.updatedAt),
   };
}

function readPlannedUser(doc: Document): PlannedUser {
   return {
      id: requiredId(doc._id, 'user _id'),
      name: asNullableString(doc.name) ?? '',
      email: asNullableString(doc.email) ?? '',
      emailVerified: doc.emailVerified === true,
      image: asNullableString(doc.image),
      createdAt: asDateLike(doc.createdAt) ?? new Date(0),
      updatedAt: asDateLike(doc.updatedAt) ?? new Date(0),
      sourceUserIds: [requiredId(doc._id, 'user _id')],
   };
}

function readPlannedAccount(doc: Document): PlannedAccount {
   return {
      legacyId: idString(doc._id),
      accountId: asNullableString(doc.accountId) ?? '',
      providerId: asNullableString(doc.providerId) ?? '',
      userId: requiredId(doc.userId, 'account userId'),
      password: asNullableString(doc.password),
      accessToken: asNullableString(doc.accessToken),
      refreshToken: asNullableString(doc.refreshToken),
      idToken: asNullableString(doc.idToken),
      accessTokenExpiresAt: asDateLike(doc.accessTokenExpiresAt),
      scope: asNullableString(doc.scope),
      createdAt: asDateLike(doc.createdAt) ?? new Date(0),
      updatedAt: asDateLike(doc.updatedAt) ?? new Date(0),
   };
}

function userDocument(user: PlannedUser): Document {
   return {
      _id: toObjectId(user.id, 'user id'),
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
   };
}

function accountDocument(account: PlannedAccount): Document {
   return {
      ...(account.legacyId
         ? { _id: toObjectId(account.legacyId, 'account id') }
         : {}),
      ...accountFields(account),
   };
}

function accountFields(account: PlannedAccount): Document {
   return {
      accountId: account.accountId,
      providerId: account.providerId,
      userId: toObjectId(account.userId, 'account userId'),
      password: account.password,
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
      idToken: account.idToken,
      accessTokenExpiresAt: account.accessTokenExpiresAt,
      scope: account.scope,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
   };
}

function toObjectId(id: string, label: string): ObjectId {
   if (!ObjectId.isValid(id)) {
      throw new Error(`${label} is not a Mongo ObjectId: ${id}`);
   }
   return new ObjectId(id);
}

function requiredId(value: unknown, label: string): string {
   const id = idString(value);
   if (!id) throw new Error(`Missing ${label}`);
   return id;
}

function idString(value: unknown): string | null {
   if (typeof value === 'string' && value.length > 0) return value;
   if (
      value &&
      typeof value === 'object' &&
      'toHexString' in value &&
      typeof value.toHexString === 'function'
   ) {
      return value.toHexString();
   }
   return null;
}

function asNullableString(value: unknown): string | null {
   return typeof value === 'string' ? value : null;
}

function asDateLike(value: unknown): Date | null {
   if (value instanceof Date) return value;
   if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
   }
   return null;
}
