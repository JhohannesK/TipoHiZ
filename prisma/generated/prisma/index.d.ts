/**
 * Client
 **/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;
/**
 * Model Account
 *
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>;
/**
 * Model Session
 *
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>;
/**
 * Model VerificationToken
 *
 */
export type VerificationToken =
   $Result.DefaultSelection<Prisma.$VerificationTokenPayload>;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
   ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
   const U = 'log' extends keyof ClientOptions
      ? ClientOptions['log'] extends Array<
           Prisma.LogLevel | Prisma.LogDefinition
        >
         ? Prisma.GetEvents<ClientOptions['log']>
         : never
      : never,
   ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
   [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

   /**
    * ##  Prisma Client ʲˢ
    *
    * Type-safe database client for TypeScript & Node.js
    * @example
    * ```
    * const prisma = new PrismaClient()
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    *
    *
    * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
    */

   constructor(
      optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>
   );
   $on<V extends U>(
      eventType: V,
      callback: (
         event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent
      ) => void
   ): PrismaClient;

   /**
    * Connect with the database
    */
   $connect(): $Utils.JsPromise<void>;

   /**
    * Disconnect from the database
    */
   $disconnect(): $Utils.JsPromise<void>;

   /**
    * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
    * @example
    * ```
    * const [george, bob, alice] = await prisma.$transaction([
    *   prisma.user.create({ data: { name: 'George' } }),
    *   prisma.user.create({ data: { name: 'Bob' } }),
    *   prisma.user.create({ data: { name: 'Alice' } }),
    * ])
    * ```
    *
    * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
    */
   $transaction<P extends Prisma.PrismaPromise<any>[]>(
      arg: [...P]
   ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

   $transaction<R>(
      fn: (
         prisma: Omit<PrismaClient, runtime.ITXClientDenyList>
      ) => $Utils.JsPromise<R>,
      options?: { maxWait?: number; timeout?: number }
   ): $Utils.JsPromise<R>;

   /**
    * Executes a raw MongoDB command and returns the result of it.
    * @example
    * ```
    * const user = await prisma.$runCommandRaw({
    *   aggregate: 'User',
    *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
    *   explain: false,
    * })
    * ```
    *
    * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
    */
   $runCommandRaw(
      command: Prisma.InputJsonObject
   ): Prisma.PrismaPromise<Prisma.JsonObject>;

   $extends: $Extensions.ExtendsHook<
      'extends',
      Prisma.TypeMapCb<ClientOptions>,
      ExtArgs,
      $Utils.Call<
         Prisma.TypeMapCb<ClientOptions>,
         {
            extArgs: ExtArgs;
         }
      >
   >;

   /**
    * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
   get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

   /**
    * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
   get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

   /**
    * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
   get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

   /**
    * `prisma.verificationToken`: Exposes CRUD operations for the **VerificationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationTokens
    * const verificationTokens = await prisma.verificationToken.findMany()
    * ```
    */
   get verificationToken(): Prisma.VerificationTokenDelegate<
      ExtArgs,
      ClientOptions
   >;
}

export namespace Prisma {
   export import DMMF = runtime.DMMF;

   export type PrismaPromise<T> = $Public.PrismaPromise<T>;

   /**
    * Validator
    */
   export import validator = runtime.Public.validator;

   /**
    * Prisma Errors
    */
   export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
   export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
   export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
   export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
   export import PrismaClientValidationError = runtime.PrismaClientValidationError;

   /**
    * Re-export of sql-template-tag
    */
   export import sql = runtime.sqltag;
   export import empty = runtime.empty;
   export import join = runtime.join;
   export import raw = runtime.raw;
   export import Sql = runtime.Sql;

   /**
    * Decimal.js
    */
   export import Decimal = runtime.Decimal;

   export type DecimalJsLike = runtime.DecimalJsLike;

   /**
    * Metrics
    */
   export type Metrics = runtime.Metrics;
   export type Metric<T> = runtime.Metric<T>;
   export type MetricHistogram = runtime.MetricHistogram;
   export type MetricHistogramBucket = runtime.MetricHistogramBucket;

   /**
    * Extensions
    */
   export import Extension = $Extensions.UserArgs;
   export import getExtensionContext = runtime.Extensions.getExtensionContext;
   export import Args = $Public.Args;
   export import Payload = $Public.Payload;
   export import Result = $Public.Result;
   export import Exact = $Public.Exact;

   /**
    * Prisma Client JS version: 6.16.3
    * Query Engine version: bb420e667c1820a8c05a38023385f6cc7ef8e83a
    */
   export type PrismaVersion = {
      client: string;
   };

   export const prismaVersion: PrismaVersion;

   /**
    * Utility Types
    */

   export import JsonObject = runtime.JsonObject;
   export import JsonArray = runtime.JsonArray;
   export import JsonValue = runtime.JsonValue;
   export import InputJsonObject = runtime.InputJsonObject;
   export import InputJsonArray = runtime.InputJsonArray;
   export import InputJsonValue = runtime.InputJsonValue;

   /**
    * Types of the values used to represent different kinds of `null` values when working with JSON fields.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
   namespace NullTypes {
      /**
       * Type of `Prisma.DbNull`.
       *
       * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
       *
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
       */
      class DbNull {
         private DbNull: never;
         private constructor();
      }

      /**
       * Type of `Prisma.JsonNull`.
       *
       * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
       *
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
       */
      class JsonNull {
         private JsonNull: never;
         private constructor();
      }

      /**
       * Type of `Prisma.AnyNull`.
       *
       * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
       *
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
       */
      class AnyNull {
         private AnyNull: never;
         private constructor();
      }
   }

   /**
    * Helper for filtering JSON entries that have `null` on the database (empty on the db)
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
   export const DbNull: NullTypes.DbNull;

   /**
    * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
   export const JsonNull: NullTypes.JsonNull;

   /**
    * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
   export const AnyNull: NullTypes.AnyNull;

   type SelectAndInclude = {
      select: any;
      include: any;
   };

   type SelectAndOmit = {
      select: any;
      omit: any;
   };

   /**
    * Get the type of the value, that the Promise holds.
    */
   export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<
      infer U
   >
      ? U
      : T;

   /**
    * Get the return type of a function which returns a Promise.
    */
   export type PromiseReturnType<
      T extends (...args: any) => $Utils.JsPromise<any>
   > = PromiseType<ReturnType<T>>;

   /**
    * From T, pick a set of properties whose keys are in the union K
    */
   type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
   };

   export type Enumerable<T> = T | Array<T>;

   export type RequiredKeys<T> = {
      [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
   }[keyof T];

   export type TruthyKeys<T> = keyof {
      [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
   };

   export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

   /**
    * Subset
    * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
    */
   export type Subset<T, U> = {
      [key in keyof T]: key extends keyof U ? T[key] : never;
   };

   /**
    * SelectSubset
    * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
    * Additionally, it validates, if both select and include are present. If the case, it errors.
    */
   export type SelectSubset<T, U> = {
      [key in keyof T]: key extends keyof U ? T[key] : never;
   } & (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {});

   /**
    * Subset + Intersection
    * @desc From `T` pick properties that exist in `U` and intersect `K`
    */
   export type SubsetIntersection<T, U, K> = {
      [key in keyof T]: key extends keyof U ? T[key] : never;
   } & K;

   type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

   /**
    * XOR is needed to have a real mutually exclusive union type
    * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
    */
   type XOR<T, U> = T extends object
      ? U extends object
         ? (Without<T, U> & U) | (Without<U, T> & T)
         : U
      : T;

   /**
    * Is T a Record?
    */
   type IsObject<T extends any> = T extends Array<any>
      ? False
      : T extends Date
      ? False
      : T extends Uint8Array
      ? False
      : T extends BigInt
      ? False
      : T extends object
      ? True
      : False;

   /**
    * If it's T[], return T
    */
   export type UnEnumerate<T extends unknown> = T extends Array<infer U>
      ? U
      : T;

   /**
    * From ts-toolbelt
    */

   type __Either<O extends object, K extends Key> = Omit<O, K> &
      {
         // Merge all but K
         [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
      }[K];

   type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

   type EitherLoose<O extends object, K extends Key> = ComputeRaw<
      __Either<O, K>
   >;

   type _Either<O extends object, K extends Key, strict extends Boolean> = {
      1: EitherStrict<O, K>;
      0: EitherLoose<O, K>;
   }[strict];

   type Either<
      O extends object,
      K extends Key,
      strict extends Boolean = 1
   > = O extends unknown ? _Either<O, K, strict> : never;

   export type Union = any;

   type PatchUndefined<O extends object, O1 extends object> = {
      [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
   } & {};

   /** Helper Types for "Merge" **/
   export type IntersectOf<U extends Union> = (
      U extends unknown ? (k: U) => void : never
   ) extends (k: infer I) => void
      ? I
      : never;

   export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
   } & {};

   type _Merge<U extends object> = IntersectOf<
      Overwrite<
         U,
         {
            [K in keyof U]-?: At<U, K>;
         }
      >
   >;

   type Key = string | number | symbol;
   type AtBasic<O extends object, K extends Key> = K extends keyof O
      ? O[K]
      : never;
   type AtStrict<O extends object, K extends Key> = O[K & keyof O];
   type AtLoose<O extends object, K extends Key> = O extends unknown
      ? AtStrict<O, K>
      : never;
   export type At<
      O extends object,
      K extends Key,
      strict extends Boolean = 1
   > = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
   }[strict];

   export type ComputeRaw<A extends any> = A extends Function
      ? A
      : {
           [K in keyof A]: A[K];
        } & {};

   export type OptionalFlat<O> = {
      [K in keyof O]?: O[K];
   } & {};

   type _Record<K extends keyof any, T> = {
      [P in K]: T;
   };

   // cause typescript not to expand types and preserve names
   type NoExpand<T> = T extends unknown ? T : never;

   // this type assumes the passed object is entirely optional
   type AtLeast<O extends object, K extends string> = NoExpand<
      O extends unknown
         ?
              | (K extends keyof O ? { [P in K]: O[P] } & O : O)
              | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
         : never
   >;

   type _Strict<U, _U = U> = U extends unknown
      ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
      : never;

   export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
   /** End Helper Types for "Merge" **/

   export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

   /**
  A [[Boolean]]
  */
   export type Boolean = True | False;

   // /**
   // 1
   // */
   export type True = 1;

   /**
  0
  */
   export type False = 0;

   export type Not<B extends Boolean> = {
      0: 1;
      1: 0;
   }[B];

   export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
      ? 0 // anything `never` is false
      : A1 extends A2
      ? 1
      : 0;

   export type Has<U extends Union, U1 extends Union> = Not<
      Extends<Exclude<U1, U>, U1>
   >;

   export type Or<B1 extends Boolean, B2 extends Boolean> = {
      0: {
         0: 0;
         1: 1;
      };
      1: {
         0: 1;
         1: 1;
      };
   }[B1][B2];

   export type Keys<U extends Union> = U extends unknown ? keyof U : never;

   type Cast<A, B> = A extends B ? A : B;

   export const type: unique symbol;

   /**
    * Used by group by
    */

   export type GetScalarType<T, O> = O extends object
      ? {
           [P in keyof T]: P extends keyof O ? O[P] : never;
        }
      : never;

   type FieldPaths<
      T,
      U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
   > = IsObject<T> extends True ? U : T;

   type GetHavingFields<T> = {
      [K in keyof T]: Or<
         Or<Extends<'OR', K>, Extends<'AND', K>>,
         Extends<'NOT', K>
      > extends True
         ? // infer is only needed to not hit TS limit
           // based on the brilliant idea of Pierre-Antoine Mills
           // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
           T[K] extends infer TK
            ? GetHavingFields<
                 UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never
              >
            : never
         : {} extends FieldPaths<T[K]>
         ? never
         : K;
   }[keyof T];

   /**
    * Convert tuple to union
    */
   type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
   type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
   type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

   /**
    * Like `Pick`, but additionally can also accept an array of keys
    */
   type PickEnumerable<
      T,
      K extends Enumerable<keyof T> | keyof T
   > = Prisma__Pick<T, MaybeTupleToUnion<K>>;

   /**
    * Exclude all keys with underscores
    */
   type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
      ? never
      : T;

   export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

   type FieldRefInputType<Model, FieldType> = Model extends never
      ? never
      : FieldRef<Model, FieldType>;

   export const ModelName: {
      User: 'User';
      Account: 'Account';
      Session: 'Session';
      VerificationToken: 'VerificationToken';
   };

   export type ModelName = (typeof ModelName)[keyof typeof ModelName];

   export type Datasources = {
      db?: Datasource;
   };

   interface TypeMapCb<ClientOptions = {}>
      extends $Utils.Fn<
         { extArgs: $Extensions.InternalArgs },
         $Utils.Record<string, any>
      > {
      returns: Prisma.TypeMap<
         this['params']['extArgs'],
         ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
      >;
   }

   export type TypeMap<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {}
   > = {
      globalOmitOptions: {
         omit: GlobalOmitOptions;
      };
      meta: {
         modelProps: 'user' | 'account' | 'session' | 'verificationToken';
         txIsolationLevel: never;
      };
      model: {
         User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
               findUnique: {
                  args: Prisma.UserFindUniqueArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
               };
               findUniqueOrThrow: {
                  args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload>;
               };
               findFirst: {
                  args: Prisma.UserFindFirstArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
               };
               findFirstOrThrow: {
                  args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload>;
               };
               findMany: {
                  args: Prisma.UserFindManyArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
               };
               create: {
                  args: Prisma.UserCreateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload>;
               };
               createMany: {
                  args: Prisma.UserCreateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               delete: {
                  args: Prisma.UserDeleteArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload>;
               };
               update: {
                  args: Prisma.UserUpdateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload>;
               };
               deleteMany: {
                  args: Prisma.UserDeleteManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               updateMany: {
                  args: Prisma.UserUpdateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               upsert: {
                  args: Prisma.UserUpsertArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload>;
               };
               aggregate: {
                  args: Prisma.UserAggregateArgs<ExtArgs>;
                  result: $Utils.Optional<AggregateUser>;
               };
               groupBy: {
                  args: Prisma.UserGroupByArgs<ExtArgs>;
                  result: $Utils.Optional<UserGroupByOutputType>[];
               };
               findRaw: {
                  args: Prisma.UserFindRawArgs<ExtArgs>;
                  result: JsonObject;
               };
               aggregateRaw: {
                  args: Prisma.UserAggregateRawArgs<ExtArgs>;
                  result: JsonObject;
               };
               count: {
                  args: Prisma.UserCountArgs<ExtArgs>;
                  result:
                     | $Utils.Optional<UserCountAggregateOutputType>
                     | number;
               };
            };
         };
         Account: {
            payload: Prisma.$AccountPayload<ExtArgs>;
            fields: Prisma.AccountFieldRefs;
            operations: {
               findUnique: {
                  args: Prisma.AccountFindUniqueArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null;
               };
               findUniqueOrThrow: {
                  args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
               };
               findFirst: {
                  args: Prisma.AccountFindFirstArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null;
               };
               findFirstOrThrow: {
                  args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
               };
               findMany: {
                  args: Prisma.AccountFindManyArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$AccountPayload>[];
               };
               create: {
                  args: Prisma.AccountCreateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
               };
               createMany: {
                  args: Prisma.AccountCreateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               delete: {
                  args: Prisma.AccountDeleteArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
               };
               update: {
                  args: Prisma.AccountUpdateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
               };
               deleteMany: {
                  args: Prisma.AccountDeleteManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               updateMany: {
                  args: Prisma.AccountUpdateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               upsert: {
                  args: Prisma.AccountUpsertArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
               };
               aggregate: {
                  args: Prisma.AccountAggregateArgs<ExtArgs>;
                  result: $Utils.Optional<AggregateAccount>;
               };
               groupBy: {
                  args: Prisma.AccountGroupByArgs<ExtArgs>;
                  result: $Utils.Optional<AccountGroupByOutputType>[];
               };
               findRaw: {
                  args: Prisma.AccountFindRawArgs<ExtArgs>;
                  result: JsonObject;
               };
               aggregateRaw: {
                  args: Prisma.AccountAggregateRawArgs<ExtArgs>;
                  result: JsonObject;
               };
               count: {
                  args: Prisma.AccountCountArgs<ExtArgs>;
                  result:
                     | $Utils.Optional<AccountCountAggregateOutputType>
                     | number;
               };
            };
         };
         Session: {
            payload: Prisma.$SessionPayload<ExtArgs>;
            fields: Prisma.SessionFieldRefs;
            operations: {
               findUnique: {
                  args: Prisma.SessionFindUniqueArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null;
               };
               findUniqueOrThrow: {
                  args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
               };
               findFirst: {
                  args: Prisma.SessionFindFirstArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null;
               };
               findFirstOrThrow: {
                  args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
               };
               findMany: {
                  args: Prisma.SessionFindManyArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$SessionPayload>[];
               };
               create: {
                  args: Prisma.SessionCreateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
               };
               createMany: {
                  args: Prisma.SessionCreateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               delete: {
                  args: Prisma.SessionDeleteArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
               };
               update: {
                  args: Prisma.SessionUpdateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
               };
               deleteMany: {
                  args: Prisma.SessionDeleteManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               updateMany: {
                  args: Prisma.SessionUpdateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               upsert: {
                  args: Prisma.SessionUpsertArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
               };
               aggregate: {
                  args: Prisma.SessionAggregateArgs<ExtArgs>;
                  result: $Utils.Optional<AggregateSession>;
               };
               groupBy: {
                  args: Prisma.SessionGroupByArgs<ExtArgs>;
                  result: $Utils.Optional<SessionGroupByOutputType>[];
               };
               findRaw: {
                  args: Prisma.SessionFindRawArgs<ExtArgs>;
                  result: JsonObject;
               };
               aggregateRaw: {
                  args: Prisma.SessionAggregateRawArgs<ExtArgs>;
                  result: JsonObject;
               };
               count: {
                  args: Prisma.SessionCountArgs<ExtArgs>;
                  result:
                     | $Utils.Optional<SessionCountAggregateOutputType>
                     | number;
               };
            };
         };
         VerificationToken: {
            payload: Prisma.$VerificationTokenPayload<ExtArgs>;
            fields: Prisma.VerificationTokenFieldRefs;
            operations: {
               findUnique: {
                  args: Prisma.VerificationTokenFindUniqueArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null;
               };
               findUniqueOrThrow: {
                  args: Prisma.VerificationTokenFindUniqueOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>;
               };
               findFirst: {
                  args: Prisma.VerificationTokenFindFirstArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null;
               };
               findFirstOrThrow: {
                  args: Prisma.VerificationTokenFindFirstOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>;
               };
               findMany: {
                  args: Prisma.VerificationTokenFindManyArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[];
               };
               create: {
                  args: Prisma.VerificationTokenCreateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>;
               };
               createMany: {
                  args: Prisma.VerificationTokenCreateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               delete: {
                  args: Prisma.VerificationTokenDeleteArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>;
               };
               update: {
                  args: Prisma.VerificationTokenUpdateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>;
               };
               deleteMany: {
                  args: Prisma.VerificationTokenDeleteManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               updateMany: {
                  args: Prisma.VerificationTokenUpdateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               upsert: {
                  args: Prisma.VerificationTokenUpsertArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>;
               };
               aggregate: {
                  args: Prisma.VerificationTokenAggregateArgs<ExtArgs>;
                  result: $Utils.Optional<AggregateVerificationToken>;
               };
               groupBy: {
                  args: Prisma.VerificationTokenGroupByArgs<ExtArgs>;
                  result: $Utils.Optional<VerificationTokenGroupByOutputType>[];
               };
               findRaw: {
                  args: Prisma.VerificationTokenFindRawArgs<ExtArgs>;
                  result: JsonObject;
               };
               aggregateRaw: {
                  args: Prisma.VerificationTokenAggregateRawArgs<ExtArgs>;
                  result: JsonObject;
               };
               count: {
                  args: Prisma.VerificationTokenCountArgs<ExtArgs>;
                  result:
                     | $Utils.Optional<VerificationTokenCountAggregateOutputType>
                     | number;
               };
            };
         };
      };
   } & {
      other: {
         payload: any;
         operations: {
            $runCommandRaw: {
               args: Prisma.InputJsonObject;
               result: Prisma.JsonObject;
            };
         };
      };
   };
   export const defineExtension: $Extensions.ExtendsHook<
      'define',
      Prisma.TypeMapCb,
      $Extensions.DefaultArgs
   >;
   export type DefaultPrismaClient = PrismaClient;
   export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
   export interface PrismaClientOptions {
      /**
       * Overwrites the datasource url from your schema.prisma file
       */
      datasources?: Datasources;
      /**
       * Overwrites the datasource url from your schema.prisma file
       */
      datasourceUrl?: string;
      /**
       * @default "colorless"
       */
      errorFormat?: ErrorFormat;
      /**
       * @example
       * ```
       * // Shorthand for `emit: 'stdout'`
       * log: ['query', 'info', 'warn', 'error']
       *
       * // Emit as events only
       * log: [
       *   { emit: 'event', level: 'query' },
       *   { emit: 'event', level: 'info' },
       *   { emit: 'event', level: 'warn' }
       *   { emit: 'event', level: 'error' }
       * ]
       *
       * / Emit as events and log to stdout
       * og: [
       *  { emit: 'stdout', level: 'query' },
       *  { emit: 'stdout', level: 'info' },
       *  { emit: 'stdout', level: 'warn' }
       *  { emit: 'stdout', level: 'error' }
       *
       * ```
       * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
       */
      log?: (LogLevel | LogDefinition)[];
      /**
       * The default values for transactionOptions
       * maxWait ?= 2000
       * timeout ?= 5000
       */
      transactionOptions?: {
         maxWait?: number;
         timeout?: number;
      };
      /**
       * Global configuration for omitting model fields by default.
       *
       * @example
       * ```
       * const prisma = new PrismaClient({
       *   omit: {
       *     user: {
       *       password: true
       *     }
       *   }
       * })
       * ```
       */
      omit?: Prisma.GlobalOmitConfig;
   }
   export type GlobalOmitConfig = {
      user?: UserOmit;
      account?: AccountOmit;
      session?: SessionOmit;
      verificationToken?: VerificationTokenOmit;
   };

   /* Types for Logging */
   export type LogLevel = 'info' | 'query' | 'warn' | 'error';
   export type LogDefinition = {
      level: LogLevel;
      emit: 'stdout' | 'event';
   };

   export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

   export type GetLogType<T> = CheckIsLogLevel<
      T extends LogDefinition ? T['level'] : T
   >;

   export type GetEvents<T extends any[]> = T extends Array<
      LogLevel | LogDefinition
   >
      ? GetLogType<T[number]>
      : never;

   export type QueryEvent = {
      timestamp: Date;
      query: string;
      params: string;
      duration: number;
      target: string;
   };

   export type LogEvent = {
      timestamp: Date;
      message: string;
      target: string;
   };
   /* End Types for Logging */

   export type PrismaAction =
      | 'findUnique'
      | 'findUniqueOrThrow'
      | 'findMany'
      | 'findFirst'
      | 'findFirstOrThrow'
      | 'create'
      | 'createMany'
      | 'createManyAndReturn'
      | 'update'
      | 'updateMany'
      | 'updateManyAndReturn'
      | 'upsert'
      | 'delete'
      | 'deleteMany'
      | 'executeRaw'
      | 'queryRaw'
      | 'aggregate'
      | 'count'
      | 'runCommandRaw'
      | 'findRaw'
      | 'groupBy';

   // tested in getLogLevel.test.ts
   export function getLogLevel(
      log: Array<LogLevel | LogDefinition>
   ): LogLevel | undefined;

   /**
    * `PrismaClient` proxy available in interactive transactions.
    */
   export type TransactionClient = Omit<
      Prisma.DefaultPrismaClient,
      runtime.ITXClientDenyList
   >;

   export type Datasource = {
      url?: string;
   };

   /**
    * Count Types
    */

   /**
    * Count Type UserCountOutputType
    */

   export type UserCountOutputType = {
      accounts: number;
      sessions: number;
   };

   export type UserCountOutputTypeSelect<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      accounts?: boolean | UserCountOutputTypeCountAccountsArgs;
      sessions?: boolean | UserCountOutputTypeCountSessionsArgs;
   };

   // Custom InputTypes
   /**
    * UserCountOutputType without action
    */
   export type UserCountOutputTypeDefaultArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the UserCountOutputType
       */
      select?: UserCountOutputTypeSelect<ExtArgs> | null;
   };

   /**
    * UserCountOutputType without action
    */
   export type UserCountOutputTypeCountAccountsArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      where?: AccountWhereInput;
   };

   /**
    * UserCountOutputType without action
    */
   export type UserCountOutputTypeCountSessionsArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      where?: SessionWhereInput;
   };

   /**
    * Models
    */

   /**
    * Model User
    */

   export type AggregateUser = {
      _count: UserCountAggregateOutputType | null;
      _min: UserMinAggregateOutputType | null;
      _max: UserMaxAggregateOutputType | null;
   };

   export type UserMinAggregateOutputType = {
      id: string | null;
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      password: string | null;
      image: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
   };

   export type UserMaxAggregateOutputType = {
      id: string | null;
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      password: string | null;
      image: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
   };

   export type UserCountAggregateOutputType = {
      id: number;
      name: number;
      email: number;
      emailVerified: number;
      password: number;
      image: number;
      createdAt: number;
      updatedAt: number;
      _all: number;
   };

   export type UserMinAggregateInputType = {
      id?: true;
      name?: true;
      email?: true;
      emailVerified?: true;
      password?: true;
      image?: true;
      createdAt?: true;
      updatedAt?: true;
   };

   export type UserMaxAggregateInputType = {
      id?: true;
      name?: true;
      email?: true;
      emailVerified?: true;
      password?: true;
      image?: true;
      createdAt?: true;
      updatedAt?: true;
   };

   export type UserCountAggregateInputType = {
      id?: true;
      name?: true;
      email?: true;
      emailVerified?: true;
      password?: true;
      image?: true;
      createdAt?: true;
      updatedAt?: true;
      _all?: true;
   };

   export type UserAggregateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Filter which User to aggregate.
       */
      where?: UserWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Users to fetch.
       */
      orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the start position
       */
      cursor?: UserWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Users from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Users.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Count returned Users
       **/
      _count?: true | UserCountAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the minimum value
       **/
      _min?: UserMinAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the maximum value
       **/
      _max?: UserMaxAggregateInputType;
   };

   export type GetUserAggregateType<T extends UserAggregateArgs> = {
      [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
         ? T[P] extends true
            ? number
            : GetScalarType<T[P], AggregateUser[P]>
         : GetScalarType<T[P], AggregateUser[P]>;
   };

   export type UserGroupByArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      where?: UserWhereInput;
      orderBy?:
         | UserOrderByWithAggregationInput
         | UserOrderByWithAggregationInput[];
      by: UserScalarFieldEnum[] | UserScalarFieldEnum;
      having?: UserScalarWhereWithAggregatesInput;
      take?: number;
      skip?: number;
      _count?: UserCountAggregateInputType | true;
      _min?: UserMinAggregateInputType;
      _max?: UserMaxAggregateInputType;
   };

   export type UserGroupByOutputType = {
      id: string;
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      password: string | null;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
      _count: UserCountAggregateOutputType | null;
      _min: UserMinAggregateOutputType | null;
      _max: UserMaxAggregateOutputType | null;
   };

   type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
      Array<
         PickEnumerable<UserGroupByOutputType, T['by']> & {
            [P in keyof T & keyof UserGroupByOutputType]: P extends '_count'
               ? T[P] extends boolean
                  ? number
                  : GetScalarType<T[P], UserGroupByOutputType[P]>
               : GetScalarType<T[P], UserGroupByOutputType[P]>;
         }
      >
   >;

   export type UserSelect<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = $Extensions.GetSelect<
      {
         id?: boolean;
         name?: boolean;
         email?: boolean;
         emailVerified?: boolean;
         password?: boolean;
         image?: boolean;
         createdAt?: boolean;
         updatedAt?: boolean;
         accounts?: boolean | User$accountsArgs<ExtArgs>;
         sessions?: boolean | User$sessionsArgs<ExtArgs>;
         _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['user']
   >;

   export type UserSelectScalar = {
      id?: boolean;
      name?: boolean;
      email?: boolean;
      emailVerified?: boolean;
      password?: boolean;
      image?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
   };

   export type UserOmit<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = $Extensions.GetOmit<
      | 'id'
      | 'name'
      | 'email'
      | 'emailVerified'
      | 'password'
      | 'image'
      | 'createdAt'
      | 'updatedAt',
      ExtArgs['result']['user']
   >;
   export type UserInclude<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      accounts?: boolean | User$accountsArgs<ExtArgs>;
      sessions?: boolean | User$sessionsArgs<ExtArgs>;
      _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
   };

   export type $UserPayload<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      name: 'User';
      objects: {
         accounts: Prisma.$AccountPayload<ExtArgs>[];
         sessions: Prisma.$SessionPayload<ExtArgs>[];
      };
      scalars: $Extensions.GetPayloadResult<
         {
            id: string;
            name: string | null;
            email: string | null;
            emailVerified: Date | null;
            password: string | null;
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
         },
         ExtArgs['result']['user']
      >;
      composites: {};
   };

   type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> =
      $Result.GetResult<Prisma.$UserPayload, S>;

   type UserCountArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true;
   };

   export interface UserDelegate<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {}
   > {
      [K: symbol]: {
         types: Prisma.TypeMap<ExtArgs>['model']['User'];
         meta: { name: 'User' };
      };
      /**
       * Find zero or one User that matches the filter.
       * @param {UserFindUniqueArgs} args - Arguments to find a User
       * @example
       * // Get one User
       * const user = await prisma.user.findUnique({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUnique<T extends UserFindUniqueArgs>(
         args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>
      ): Prisma__UserClient<
         $Result.GetResult<
            Prisma.$UserPayload<ExtArgs>,
            T,
            'findUnique',
            GlobalOmitOptions
         > | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find one User that matches the filter or throw an error with `error.code='P2025'`
       * if no matches were found.
       * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
       * @example
       * // Get one User
       * const user = await prisma.user.findUniqueOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
         args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>
      ): Prisma__UserClient<
         $Result.GetResult<
            Prisma.$UserPayload<ExtArgs>,
            T,
            'findUniqueOrThrow',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first User that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {UserFindFirstArgs} args - Arguments to find a User
       * @example
       * // Get one User
       * const user = await prisma.user.findFirst({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirst<T extends UserFindFirstArgs>(
         args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>
      ): Prisma__UserClient<
         $Result.GetResult<
            Prisma.$UserPayload<ExtArgs>,
            T,
            'findFirst',
            GlobalOmitOptions
         > | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first User that matches the filter or
       * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
       * @example
       * // Get one User
       * const user = await prisma.user.findFirstOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
         args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>
      ): Prisma__UserClient<
         $Result.GetResult<
            Prisma.$UserPayload<ExtArgs>,
            T,
            'findFirstOrThrow',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find zero or more Users that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
       * @example
       * // Get all Users
       * const users = await prisma.user.findMany()
       *
       * // Get first 10 Users
       * const users = await prisma.user.findMany({ take: 10 })
       *
       * // Only select the `id`
       * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
       *
       */
      findMany<T extends UserFindManyArgs>(
         args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<
            Prisma.$UserPayload<ExtArgs>,
            T,
            'findMany',
            GlobalOmitOptions
         >
      >;

      /**
       * Create a User.
       * @param {UserCreateArgs} args - Arguments to create a User.
       * @example
       * // Create one User
       * const User = await prisma.user.create({
       *   data: {
       *     // ... data to create a User
       *   }
       * })
       *
       */
      create<T extends UserCreateArgs>(
         args: SelectSubset<T, UserCreateArgs<ExtArgs>>
      ): Prisma__UserClient<
         $Result.GetResult<
            Prisma.$UserPayload<ExtArgs>,
            T,
            'create',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Create many Users.
       * @param {UserCreateManyArgs} args - Arguments to create many Users.
       * @example
       * // Create many Users
       * const user = await prisma.user.createMany({
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       */
      createMany<T extends UserCreateManyArgs>(
         args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Delete a User.
       * @param {UserDeleteArgs} args - Arguments to delete one User.
       * @example
       * // Delete one User
       * const User = await prisma.user.delete({
       *   where: {
       *     // ... filter to delete one User
       *   }
       * })
       *
       */
      delete<T extends UserDeleteArgs>(
         args: SelectSubset<T, UserDeleteArgs<ExtArgs>>
      ): Prisma__UserClient<
         $Result.GetResult<
            Prisma.$UserPayload<ExtArgs>,
            T,
            'delete',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Update one User.
       * @param {UserUpdateArgs} args - Arguments to update one User.
       * @example
       * // Update one User
       * const user = await prisma.user.update({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      update<T extends UserUpdateArgs>(
         args: SelectSubset<T, UserUpdateArgs<ExtArgs>>
      ): Prisma__UserClient<
         $Result.GetResult<
            Prisma.$UserPayload<ExtArgs>,
            T,
            'update',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Delete zero or more Users.
       * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
       * @example
       * // Delete a few Users
       * const { count } = await prisma.user.deleteMany({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       *
       */
      deleteMany<T extends UserDeleteManyArgs>(
         args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Update zero or more Users.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
       * @example
       * // Update many Users
       * const user = await prisma.user.updateMany({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      updateMany<T extends UserUpdateManyArgs>(
         args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Create or update one User.
       * @param {UserUpsertArgs} args - Arguments to update or create a User.
       * @example
       * // Update or create a User
       * const user = await prisma.user.upsert({
       *   create: {
       *     // ... data to create a User
       *   },
       *   update: {
       *     // ... in case it already exists, update
       *   },
       *   where: {
       *     // ... the filter for the User we want to update
       *   }
       * })
       */
      upsert<T extends UserUpsertArgs>(
         args: SelectSubset<T, UserUpsertArgs<ExtArgs>>
      ): Prisma__UserClient<
         $Result.GetResult<
            Prisma.$UserPayload<ExtArgs>,
            T,
            'upsert',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find zero or more Users that matches the filter.
       * @param {UserFindRawArgs} args - Select which filters you would like to apply.
       * @example
       * const user = await prisma.user.findRaw({
       *   filter: { age: { $gt: 25 } }
       * })
       */
      findRaw(args?: UserFindRawArgs): Prisma.PrismaPromise<JsonObject>;

      /**
       * Perform aggregation operations on a User.
       * @param {UserAggregateRawArgs} args - Select which aggregations you would like to apply.
       * @example
       * const user = await prisma.user.aggregateRaw({
       *   pipeline: [
       *     { $match: { status: "registered" } },
       *     { $group: { _id: "$country", total: { $sum: 1 } } }
       *   ]
       * })
       */
      aggregateRaw(
         args?: UserAggregateRawArgs
      ): Prisma.PrismaPromise<JsonObject>;

      /**
       * Count the number of Users.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {UserCountArgs} args - Arguments to filter Users to count.
       * @example
       * // Count the number of Users
       * const count = await prisma.user.count({
       *   where: {
       *     // ... the filter for the Users we want to count
       *   }
       * })
       **/
      count<T extends UserCountArgs>(
         args?: Subset<T, UserCountArgs>
      ): Prisma.PrismaPromise<
         T extends $Utils.Record<'select', any>
            ? T['select'] extends true
               ? number
               : GetScalarType<T['select'], UserCountAggregateOutputType>
            : number
      >;

      /**
       * Allows you to perform aggregations operations on a User.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
       * @example
       * // Ordered by age ascending
       * // Where email contains prisma.io
       * // Limited to the 10 users
       * const aggregations = await prisma.user.aggregate({
       *   _avg: {
       *     age: true,
       *   },
       *   where: {
       *     email: {
       *       contains: "prisma.io",
       *     },
       *   },
       *   orderBy: {
       *     age: "asc",
       *   },
       *   take: 10,
       * })
       **/
      aggregate<T extends UserAggregateArgs>(
         args: Subset<T, UserAggregateArgs>
      ): Prisma.PrismaPromise<GetUserAggregateType<T>>;

      /**
       * Group by User.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {UserGroupByArgs} args - Group by arguments.
       * @example
       * // Group by city, order by createdAt, get count
       * const result = await prisma.user.groupBy({
       *   by: ['city', 'createdAt'],
       *   orderBy: {
       *     createdAt: true
       *   },
       *   _count: {
       *     _all: true
       *   },
       * })
       *
       **/
      groupBy<
         T extends UserGroupByArgs,
         HasSelectOrTake extends Or<
            Extends<'skip', Keys<T>>,
            Extends<'take', Keys<T>>
         >,
         OrderByArg extends True extends HasSelectOrTake
            ? { orderBy: UserGroupByArgs['orderBy'] }
            : { orderBy?: UserGroupByArgs['orderBy'] },
         OrderFields extends ExcludeUnderscoreKeys<
            Keys<MaybeTupleToUnion<T['orderBy']>>
         >,
         ByFields extends MaybeTupleToUnion<T['by']>,
         ByValid extends Has<ByFields, OrderFields>,
         HavingFields extends GetHavingFields<T['having']>,
         HavingValid extends Has<ByFields, HavingFields>,
         ByEmpty extends T['by'] extends never[] ? True : False,
         InputErrors extends ByEmpty extends True
            ? `Error: "by" must not be empty.`
            : HavingValid extends False
            ? {
                 [P in HavingFields]: P extends ByFields
                    ? never
                    : P extends string
                    ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                    : [
                         Error,
                         'Field ',
                         P,
                         ` in "having" needs to be provided in "by"`
                      ];
              }[HavingFields]
            : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
               ? ByValid extends True
                  ? {}
                  : {
                       [P in OrderFields]: P extends ByFields
                          ? never
                          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
               : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
            ? 'orderBy' extends Keys<T>
               ? ByValid extends True
                  ? {}
                  : {
                       [P in OrderFields]: P extends ByFields
                          ? never
                          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
               : 'Error: If you provide "skip", you also need to provide "orderBy"'
            : ByValid extends True
            ? {}
            : {
                 [P in OrderFields]: P extends ByFields
                    ? never
                    : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
      >(
         args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors
      ): {} extends InputErrors
         ? GetUserGroupByPayload<T>
         : Prisma.PrismaPromise<InputErrors>;
      /**
       * Fields of the User model
       */
      readonly fields: UserFieldRefs;
   }

   /**
    * The delegate class that acts as a "Promise-like" for User.
    * Why is this prefixed with `Prisma__`?
    * Because we want to prevent naming conflicts as mentioned in
    * https://github.com/prisma/prisma-client-js/issues/707
    */
   export interface Prisma__UserClient<
      T,
      Null = never,
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {}
   > extends Prisma.PrismaPromise<T> {
      readonly [Symbol.toStringTag]: 'PrismaPromise';
      accounts<T extends User$accountsArgs<ExtArgs> = {}>(
         args?: Subset<T, User$accountsArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         | $Result.GetResult<
              Prisma.$AccountPayload<ExtArgs>,
              T,
              'findMany',
              GlobalOmitOptions
           >
         | Null
      >;
      sessions<T extends User$sessionsArgs<ExtArgs> = {}>(
         args?: Subset<T, User$sessionsArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         | $Result.GetResult<
              Prisma.$SessionPayload<ExtArgs>,
              T,
              'findMany',
              GlobalOmitOptions
           >
         | Null
      >;
      /**
       * Attaches callbacks for the resolution and/or rejection of the Promise.
       * @param onfulfilled The callback to execute when the Promise is resolved.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of which ever callback is executed.
       */
      then<TResult1 = T, TResult2 = never>(
         onfulfilled?:
            | ((value: T) => TResult1 | PromiseLike<TResult1>)
            | undefined
            | null,
         onrejected?:
            | ((reason: any) => TResult2 | PromiseLike<TResult2>)
            | undefined
            | null
      ): $Utils.JsPromise<TResult1 | TResult2>;
      /**
       * Attaches a callback for only the rejection of the Promise.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of the callback.
       */
      catch<TResult = never>(
         onrejected?:
            | ((reason: any) => TResult | PromiseLike<TResult>)
            | undefined
            | null
      ): $Utils.JsPromise<T | TResult>;
      /**
       * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
       * resolved value cannot be modified from the callback.
       * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
       * @returns A Promise for the completion of the callback.
       */
      finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
   }

   /**
    * Fields of the User model
    */
   interface UserFieldRefs {
      readonly id: FieldRef<'User', 'String'>;
      readonly name: FieldRef<'User', 'String'>;
      readonly email: FieldRef<'User', 'String'>;
      readonly emailVerified: FieldRef<'User', 'DateTime'>;
      readonly password: FieldRef<'User', 'String'>;
      readonly image: FieldRef<'User', 'String'>;
      readonly createdAt: FieldRef<'User', 'DateTime'>;
      readonly updatedAt: FieldRef<'User', 'DateTime'>;
   }

   // Custom InputTypes
   /**
    * User findUnique
    */
   export type UserFindUniqueArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * Filter, which User to fetch.
       */
      where: UserWhereUniqueInput;
   };

   /**
    * User findUniqueOrThrow
    */
   export type UserFindUniqueOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * Filter, which User to fetch.
       */
      where: UserWhereUniqueInput;
   };

   /**
    * User findFirst
    */
   export type UserFindFirstArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * Filter, which User to fetch.
       */
      where?: UserWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Users to fetch.
       */
      orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Users.
       */
      cursor?: UserWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Users from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Users.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Users.
       */
      distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
   };

   /**
    * User findFirstOrThrow
    */
   export type UserFindFirstOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * Filter, which User to fetch.
       */
      where?: UserWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Users to fetch.
       */
      orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Users.
       */
      cursor?: UserWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Users from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Users.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Users.
       */
      distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
   };

   /**
    * User findMany
    */
   export type UserFindManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * Filter, which Users to fetch.
       */
      where?: UserWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Users to fetch.
       */
      orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for listing Users.
       */
      cursor?: UserWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Users from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Users.
       */
      skip?: number;
      distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
   };

   /**
    * User create
    */
   export type UserCreateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * The data needed to create a User.
       */
      data: XOR<UserCreateInput, UserUncheckedCreateInput>;
   };

   /**
    * User createMany
    */
   export type UserCreateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * The data used to create many Users.
       */
      data: UserCreateManyInput | UserCreateManyInput[];
   };

   /**
    * User update
    */
   export type UserUpdateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * The data needed to update a User.
       */
      data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
      /**
       * Choose, which User to update.
       */
      where: UserWhereUniqueInput;
   };

   /**
    * User updateMany
    */
   export type UserUpdateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * The data used to update Users.
       */
      data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
      /**
       * Filter which Users to update
       */
      where?: UserWhereInput;
      /**
       * Limit how many Users to update.
       */
      limit?: number;
   };

   /**
    * User upsert
    */
   export type UserUpsertArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * The filter to search for the User to update in case it exists.
       */
      where: UserWhereUniqueInput;
      /**
       * In case the User found by the `where` argument doesn't exist, create a new User with this data.
       */
      create: XOR<UserCreateInput, UserUncheckedCreateInput>;
      /**
       * In case the User was found with the provided `where` argument, update it with this data.
       */
      update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
   };

   /**
    * User delete
    */
   export type UserDeleteArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * Filter which User to delete.
       */
      where: UserWhereUniqueInput;
   };

   /**
    * User deleteMany
    */
   export type UserDeleteManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Filter which Users to delete
       */
      where?: UserWhereInput;
      /**
       * Limit how many Users to delete.
       */
      limit?: number;
   };

   /**
    * User findRaw
    */
   export type UserFindRawArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
       */
      filter?: InputJsonValue;
      /**
       * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
       */
      options?: InputJsonValue;
   };

   /**
    * User aggregateRaw
    */
   export type UserAggregateRawArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
       */
      pipeline?: InputJsonValue[];
      /**
       * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
       */
      options?: InputJsonValue;
   };

   /**
    * User.accounts
    */
   export type User$accountsArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Account
       */
      select?: AccountSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Account
       */
      omit?: AccountOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AccountInclude<ExtArgs> | null;
      where?: AccountWhereInput;
      orderBy?:
         | AccountOrderByWithRelationInput
         | AccountOrderByWithRelationInput[];
      cursor?: AccountWhereUniqueInput;
      take?: number;
      skip?: number;
      distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
   };

   /**
    * User.sessions
    */
   export type User$sessionsArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Session
       */
      select?: SessionSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Session
       */
      omit?: SessionOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: SessionInclude<ExtArgs> | null;
      where?: SessionWhereInput;
      orderBy?:
         | SessionOrderByWithRelationInput
         | SessionOrderByWithRelationInput[];
      cursor?: SessionWhereUniqueInput;
      take?: number;
      skip?: number;
      distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
   };

   /**
    * User without action
    */
   export type UserDefaultArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
   };

   /**
    * Model Account
    */

   export type AggregateAccount = {
      _count: AccountCountAggregateOutputType | null;
      _avg: AccountAvgAggregateOutputType | null;
      _sum: AccountSumAggregateOutputType | null;
      _min: AccountMinAggregateOutputType | null;
      _max: AccountMaxAggregateOutputType | null;
   };

   export type AccountAvgAggregateOutputType = {
      expires_at: number | null;
   };

   export type AccountSumAggregateOutputType = {
      expires_at: number | null;
   };

   export type AccountMinAggregateOutputType = {
      id: string | null;
      userId: string | null;
      type: string | null;
      provider: string | null;
      providerAccountId: string | null;
      refresh_token: string | null;
      access_token: string | null;
      expires_at: number | null;
      token_type: string | null;
      scope: string | null;
      id_token: string | null;
      session_state: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
   };

   export type AccountMaxAggregateOutputType = {
      id: string | null;
      userId: string | null;
      type: string | null;
      provider: string | null;
      providerAccountId: string | null;
      refresh_token: string | null;
      access_token: string | null;
      expires_at: number | null;
      token_type: string | null;
      scope: string | null;
      id_token: string | null;
      session_state: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
   };

   export type AccountCountAggregateOutputType = {
      id: number;
      userId: number;
      type: number;
      provider: number;
      providerAccountId: number;
      refresh_token: number;
      access_token: number;
      expires_at: number;
      token_type: number;
      scope: number;
      id_token: number;
      session_state: number;
      createdAt: number;
      updatedAt: number;
      _all: number;
   };

   export type AccountAvgAggregateInputType = {
      expires_at?: true;
   };

   export type AccountSumAggregateInputType = {
      expires_at?: true;
   };

   export type AccountMinAggregateInputType = {
      id?: true;
      userId?: true;
      type?: true;
      provider?: true;
      providerAccountId?: true;
      refresh_token?: true;
      access_token?: true;
      expires_at?: true;
      token_type?: true;
      scope?: true;
      id_token?: true;
      session_state?: true;
      createdAt?: true;
      updatedAt?: true;
   };

   export type AccountMaxAggregateInputType = {
      id?: true;
      userId?: true;
      type?: true;
      provider?: true;
      providerAccountId?: true;
      refresh_token?: true;
      access_token?: true;
      expires_at?: true;
      token_type?: true;
      scope?: true;
      id_token?: true;
      session_state?: true;
      createdAt?: true;
      updatedAt?: true;
   };

   export type AccountCountAggregateInputType = {
      id?: true;
      userId?: true;
      type?: true;
      provider?: true;
      providerAccountId?: true;
      refresh_token?: true;
      access_token?: true;
      expires_at?: true;
      token_type?: true;
      scope?: true;
      id_token?: true;
      session_state?: true;
      createdAt?: true;
      updatedAt?: true;
      _all?: true;
   };

   export type AccountAggregateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Filter which Account to aggregate.
       */
      where?: AccountWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Accounts to fetch.
       */
      orderBy?:
         | AccountOrderByWithRelationInput
         | AccountOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the start position
       */
      cursor?: AccountWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Accounts from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Accounts.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Count returned Accounts
       **/
      _count?: true | AccountCountAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to average
       **/
      _avg?: AccountAvgAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to sum
       **/
      _sum?: AccountSumAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the minimum value
       **/
      _min?: AccountMinAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the maximum value
       **/
      _max?: AccountMaxAggregateInputType;
   };

   export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
      [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
         ? T[P] extends true
            ? number
            : GetScalarType<T[P], AggregateAccount[P]>
         : GetScalarType<T[P], AggregateAccount[P]>;
   };

   export type AccountGroupByArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      where?: AccountWhereInput;
      orderBy?:
         | AccountOrderByWithAggregationInput
         | AccountOrderByWithAggregationInput[];
      by: AccountScalarFieldEnum[] | AccountScalarFieldEnum;
      having?: AccountScalarWhereWithAggregatesInput;
      take?: number;
      skip?: number;
      _count?: AccountCountAggregateInputType | true;
      _avg?: AccountAvgAggregateInputType;
      _sum?: AccountSumAggregateInputType;
      _min?: AccountMinAggregateInputType;
      _max?: AccountMaxAggregateInputType;
   };

   export type AccountGroupByOutputType = {
      id: string;
      userId: string;
      type: string;
      provider: string;
      providerAccountId: string;
      refresh_token: string | null;
      access_token: string | null;
      expires_at: number | null;
      token_type: string | null;
      scope: string | null;
      id_token: string | null;
      session_state: string | null;
      createdAt: Date;
      updatedAt: Date;
      _count: AccountCountAggregateOutputType | null;
      _avg: AccountAvgAggregateOutputType | null;
      _sum: AccountSumAggregateOutputType | null;
      _min: AccountMinAggregateOutputType | null;
      _max: AccountMaxAggregateOutputType | null;
   };

   type GetAccountGroupByPayload<T extends AccountGroupByArgs> =
      Prisma.PrismaPromise<
         Array<
            PickEnumerable<AccountGroupByOutputType, T['by']> & {
               [P in keyof T &
                  keyof AccountGroupByOutputType]: P extends '_count'
                  ? T[P] extends boolean
                     ? number
                     : GetScalarType<T[P], AccountGroupByOutputType[P]>
                  : GetScalarType<T[P], AccountGroupByOutputType[P]>;
            }
         >
      >;

   export type AccountSelect<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = $Extensions.GetSelect<
      {
         id?: boolean;
         userId?: boolean;
         type?: boolean;
         provider?: boolean;
         providerAccountId?: boolean;
         refresh_token?: boolean;
         access_token?: boolean;
         expires_at?: boolean;
         token_type?: boolean;
         scope?: boolean;
         id_token?: boolean;
         session_state?: boolean;
         createdAt?: boolean;
         updatedAt?: boolean;
         user?: boolean | UserDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['account']
   >;

   export type AccountSelectScalar = {
      id?: boolean;
      userId?: boolean;
      type?: boolean;
      provider?: boolean;
      providerAccountId?: boolean;
      refresh_token?: boolean;
      access_token?: boolean;
      expires_at?: boolean;
      token_type?: boolean;
      scope?: boolean;
      id_token?: boolean;
      session_state?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
   };

   export type AccountOmit<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = $Extensions.GetOmit<
      | 'id'
      | 'userId'
      | 'type'
      | 'provider'
      | 'providerAccountId'
      | 'refresh_token'
      | 'access_token'
      | 'expires_at'
      | 'token_type'
      | 'scope'
      | 'id_token'
      | 'session_state'
      | 'createdAt'
      | 'updatedAt',
      ExtArgs['result']['account']
   >;
   export type AccountInclude<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      user?: boolean | UserDefaultArgs<ExtArgs>;
   };

   export type $AccountPayload<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      name: 'Account';
      objects: {
         user: Prisma.$UserPayload<ExtArgs>;
      };
      scalars: $Extensions.GetPayloadResult<
         {
            id: string;
            userId: string;
            type: string;
            provider: string;
            providerAccountId: string;
            refresh_token: string | null;
            access_token: string | null;
            expires_at: number | null;
            token_type: string | null;
            scope: string | null;
            id_token: string | null;
            session_state: string | null;
            createdAt: Date;
            updatedAt: Date;
         },
         ExtArgs['result']['account']
      >;
      composites: {};
   };

   type AccountGetPayload<
      S extends boolean | null | undefined | AccountDefaultArgs
   > = $Result.GetResult<Prisma.$AccountPayload, S>;

   type AccountCountArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true;
   };

   export interface AccountDelegate<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {}
   > {
      [K: symbol]: {
         types: Prisma.TypeMap<ExtArgs>['model']['Account'];
         meta: { name: 'Account' };
      };
      /**
       * Find zero or one Account that matches the filter.
       * @param {AccountFindUniqueArgs} args - Arguments to find a Account
       * @example
       * // Get one Account
       * const account = await prisma.account.findUnique({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUnique<T extends AccountFindUniqueArgs>(
         args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>
      ): Prisma__AccountClient<
         $Result.GetResult<
            Prisma.$AccountPayload<ExtArgs>,
            T,
            'findUnique',
            GlobalOmitOptions
         > | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find one Account that matches the filter or throw an error with `error.code='P2025'`
       * if no matches were found.
       * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
       * @example
       * // Get one Account
       * const account = await prisma.account.findUniqueOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(
         args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>
      ): Prisma__AccountClient<
         $Result.GetResult<
            Prisma.$AccountPayload<ExtArgs>,
            T,
            'findUniqueOrThrow',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first Account that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {AccountFindFirstArgs} args - Arguments to find a Account
       * @example
       * // Get one Account
       * const account = await prisma.account.findFirst({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirst<T extends AccountFindFirstArgs>(
         args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>
      ): Prisma__AccountClient<
         $Result.GetResult<
            Prisma.$AccountPayload<ExtArgs>,
            T,
            'findFirst',
            GlobalOmitOptions
         > | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first Account that matches the filter or
       * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
       * @example
       * // Get one Account
       * const account = await prisma.account.findFirstOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(
         args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>
      ): Prisma__AccountClient<
         $Result.GetResult<
            Prisma.$AccountPayload<ExtArgs>,
            T,
            'findFirstOrThrow',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find zero or more Accounts that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
       * @example
       * // Get all Accounts
       * const accounts = await prisma.account.findMany()
       *
       * // Get first 10 Accounts
       * const accounts = await prisma.account.findMany({ take: 10 })
       *
       * // Only select the `id`
       * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
       *
       */
      findMany<T extends AccountFindManyArgs>(
         args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<
            Prisma.$AccountPayload<ExtArgs>,
            T,
            'findMany',
            GlobalOmitOptions
         >
      >;

      /**
       * Create a Account.
       * @param {AccountCreateArgs} args - Arguments to create a Account.
       * @example
       * // Create one Account
       * const Account = await prisma.account.create({
       *   data: {
       *     // ... data to create a Account
       *   }
       * })
       *
       */
      create<T extends AccountCreateArgs>(
         args: SelectSubset<T, AccountCreateArgs<ExtArgs>>
      ): Prisma__AccountClient<
         $Result.GetResult<
            Prisma.$AccountPayload<ExtArgs>,
            T,
            'create',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Create many Accounts.
       * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
       * @example
       * // Create many Accounts
       * const account = await prisma.account.createMany({
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       */
      createMany<T extends AccountCreateManyArgs>(
         args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Delete a Account.
       * @param {AccountDeleteArgs} args - Arguments to delete one Account.
       * @example
       * // Delete one Account
       * const Account = await prisma.account.delete({
       *   where: {
       *     // ... filter to delete one Account
       *   }
       * })
       *
       */
      delete<T extends AccountDeleteArgs>(
         args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>
      ): Prisma__AccountClient<
         $Result.GetResult<
            Prisma.$AccountPayload<ExtArgs>,
            T,
            'delete',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Update one Account.
       * @param {AccountUpdateArgs} args - Arguments to update one Account.
       * @example
       * // Update one Account
       * const account = await prisma.account.update({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      update<T extends AccountUpdateArgs>(
         args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>
      ): Prisma__AccountClient<
         $Result.GetResult<
            Prisma.$AccountPayload<ExtArgs>,
            T,
            'update',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Delete zero or more Accounts.
       * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
       * @example
       * // Delete a few Accounts
       * const { count } = await prisma.account.deleteMany({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       *
       */
      deleteMany<T extends AccountDeleteManyArgs>(
         args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Update zero or more Accounts.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
       * @example
       * // Update many Accounts
       * const account = await prisma.account.updateMany({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      updateMany<T extends AccountUpdateManyArgs>(
         args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Create or update one Account.
       * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
       * @example
       * // Update or create a Account
       * const account = await prisma.account.upsert({
       *   create: {
       *     // ... data to create a Account
       *   },
       *   update: {
       *     // ... in case it already exists, update
       *   },
       *   where: {
       *     // ... the filter for the Account we want to update
       *   }
       * })
       */
      upsert<T extends AccountUpsertArgs>(
         args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>
      ): Prisma__AccountClient<
         $Result.GetResult<
            Prisma.$AccountPayload<ExtArgs>,
            T,
            'upsert',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find zero or more Accounts that matches the filter.
       * @param {AccountFindRawArgs} args - Select which filters you would like to apply.
       * @example
       * const account = await prisma.account.findRaw({
       *   filter: { age: { $gt: 25 } }
       * })
       */
      findRaw(args?: AccountFindRawArgs): Prisma.PrismaPromise<JsonObject>;

      /**
       * Perform aggregation operations on a Account.
       * @param {AccountAggregateRawArgs} args - Select which aggregations you would like to apply.
       * @example
       * const account = await prisma.account.aggregateRaw({
       *   pipeline: [
       *     { $match: { status: "registered" } },
       *     { $group: { _id: "$country", total: { $sum: 1 } } }
       *   ]
       * })
       */
      aggregateRaw(
         args?: AccountAggregateRawArgs
      ): Prisma.PrismaPromise<JsonObject>;

      /**
       * Count the number of Accounts.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
       * @example
       * // Count the number of Accounts
       * const count = await prisma.account.count({
       *   where: {
       *     // ... the filter for the Accounts we want to count
       *   }
       * })
       **/
      count<T extends AccountCountArgs>(
         args?: Subset<T, AccountCountArgs>
      ): Prisma.PrismaPromise<
         T extends $Utils.Record<'select', any>
            ? T['select'] extends true
               ? number
               : GetScalarType<T['select'], AccountCountAggregateOutputType>
            : number
      >;

      /**
       * Allows you to perform aggregations operations on a Account.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
       * @example
       * // Ordered by age ascending
       * // Where email contains prisma.io
       * // Limited to the 10 users
       * const aggregations = await prisma.user.aggregate({
       *   _avg: {
       *     age: true,
       *   },
       *   where: {
       *     email: {
       *       contains: "prisma.io",
       *     },
       *   },
       *   orderBy: {
       *     age: "asc",
       *   },
       *   take: 10,
       * })
       **/
      aggregate<T extends AccountAggregateArgs>(
         args: Subset<T, AccountAggregateArgs>
      ): Prisma.PrismaPromise<GetAccountAggregateType<T>>;

      /**
       * Group by Account.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {AccountGroupByArgs} args - Group by arguments.
       * @example
       * // Group by city, order by createdAt, get count
       * const result = await prisma.user.groupBy({
       *   by: ['city', 'createdAt'],
       *   orderBy: {
       *     createdAt: true
       *   },
       *   _count: {
       *     _all: true
       *   },
       * })
       *
       **/
      groupBy<
         T extends AccountGroupByArgs,
         HasSelectOrTake extends Or<
            Extends<'skip', Keys<T>>,
            Extends<'take', Keys<T>>
         >,
         OrderByArg extends True extends HasSelectOrTake
            ? { orderBy: AccountGroupByArgs['orderBy'] }
            : { orderBy?: AccountGroupByArgs['orderBy'] },
         OrderFields extends ExcludeUnderscoreKeys<
            Keys<MaybeTupleToUnion<T['orderBy']>>
         >,
         ByFields extends MaybeTupleToUnion<T['by']>,
         ByValid extends Has<ByFields, OrderFields>,
         HavingFields extends GetHavingFields<T['having']>,
         HavingValid extends Has<ByFields, HavingFields>,
         ByEmpty extends T['by'] extends never[] ? True : False,
         InputErrors extends ByEmpty extends True
            ? `Error: "by" must not be empty.`
            : HavingValid extends False
            ? {
                 [P in HavingFields]: P extends ByFields
                    ? never
                    : P extends string
                    ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                    : [
                         Error,
                         'Field ',
                         P,
                         ` in "having" needs to be provided in "by"`
                      ];
              }[HavingFields]
            : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
               ? ByValid extends True
                  ? {}
                  : {
                       [P in OrderFields]: P extends ByFields
                          ? never
                          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
               : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
            ? 'orderBy' extends Keys<T>
               ? ByValid extends True
                  ? {}
                  : {
                       [P in OrderFields]: P extends ByFields
                          ? never
                          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
               : 'Error: If you provide "skip", you also need to provide "orderBy"'
            : ByValid extends True
            ? {}
            : {
                 [P in OrderFields]: P extends ByFields
                    ? never
                    : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
      >(
         args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> &
            InputErrors
      ): {} extends InputErrors
         ? GetAccountGroupByPayload<T>
         : Prisma.PrismaPromise<InputErrors>;
      /**
       * Fields of the Account model
       */
      readonly fields: AccountFieldRefs;
   }

   /**
    * The delegate class that acts as a "Promise-like" for Account.
    * Why is this prefixed with `Prisma__`?
    * Because we want to prevent naming conflicts as mentioned in
    * https://github.com/prisma/prisma-client-js/issues/707
    */
   export interface Prisma__AccountClient<
      T,
      Null = never,
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {}
   > extends Prisma.PrismaPromise<T> {
      readonly [Symbol.toStringTag]: 'PrismaPromise';
      user<T extends UserDefaultArgs<ExtArgs> = {}>(
         args?: Subset<T, UserDefaultArgs<ExtArgs>>
      ): Prisma__UserClient<
         | $Result.GetResult<
              Prisma.$UserPayload<ExtArgs>,
              T,
              'findUniqueOrThrow',
              GlobalOmitOptions
           >
         | Null,
         Null,
         ExtArgs,
         GlobalOmitOptions
      >;
      /**
       * Attaches callbacks for the resolution and/or rejection of the Promise.
       * @param onfulfilled The callback to execute when the Promise is resolved.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of which ever callback is executed.
       */
      then<TResult1 = T, TResult2 = never>(
         onfulfilled?:
            | ((value: T) => TResult1 | PromiseLike<TResult1>)
            | undefined
            | null,
         onrejected?:
            | ((reason: any) => TResult2 | PromiseLike<TResult2>)
            | undefined
            | null
      ): $Utils.JsPromise<TResult1 | TResult2>;
      /**
       * Attaches a callback for only the rejection of the Promise.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of the callback.
       */
      catch<TResult = never>(
         onrejected?:
            | ((reason: any) => TResult | PromiseLike<TResult>)
            | undefined
            | null
      ): $Utils.JsPromise<T | TResult>;
      /**
       * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
       * resolved value cannot be modified from the callback.
       * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
       * @returns A Promise for the completion of the callback.
       */
      finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
   }

   /**
    * Fields of the Account model
    */
   interface AccountFieldRefs {
      readonly id: FieldRef<'Account', 'String'>;
      readonly userId: FieldRef<'Account', 'String'>;
      readonly type: FieldRef<'Account', 'String'>;
      readonly provider: FieldRef<'Account', 'String'>;
      readonly providerAccountId: FieldRef<'Account', 'String'>;
      readonly refresh_token: FieldRef<'Account', 'String'>;
      readonly access_token: FieldRef<'Account', 'String'>;
      readonly expires_at: FieldRef<'Account', 'Int'>;
      readonly token_type: FieldRef<'Account', 'String'>;
      readonly scope: FieldRef<'Account', 'String'>;
      readonly id_token: FieldRef<'Account', 'String'>;
      readonly session_state: FieldRef<'Account', 'String'>;
      readonly createdAt: FieldRef<'Account', 'DateTime'>;
      readonly updatedAt: FieldRef<'Account', 'DateTime'>;
   }

   // Custom InputTypes
   /**
    * Account findUnique
    */
   export type AccountFindUniqueArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Account
       */
      select?: AccountSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Account
       */
      omit?: AccountOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AccountInclude<ExtArgs> | null;
      /**
       * Filter, which Account to fetch.
       */
      where: AccountWhereUniqueInput;
   };

   /**
    * Account findUniqueOrThrow
    */
   export type AccountFindUniqueOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Account
       */
      select?: AccountSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Account
       */
      omit?: AccountOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AccountInclude<ExtArgs> | null;
      /**
       * Filter, which Account to fetch.
       */
      where: AccountWhereUniqueInput;
   };

   /**
    * Account findFirst
    */
   export type AccountFindFirstArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Account
       */
      select?: AccountSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Account
       */
      omit?: AccountOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AccountInclude<ExtArgs> | null;
      /**
       * Filter, which Account to fetch.
       */
      where?: AccountWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Accounts to fetch.
       */
      orderBy?:
         | AccountOrderByWithRelationInput
         | AccountOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Accounts.
       */
      cursor?: AccountWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Accounts from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Accounts.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Accounts.
       */
      distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
   };

   /**
    * Account findFirstOrThrow
    */
   export type AccountFindFirstOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Account
       */
      select?: AccountSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Account
       */
      omit?: AccountOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AccountInclude<ExtArgs> | null;
      /**
       * Filter, which Account to fetch.
       */
      where?: AccountWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Accounts to fetch.
       */
      orderBy?:
         | AccountOrderByWithRelationInput
         | AccountOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Accounts.
       */
      cursor?: AccountWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Accounts from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Accounts.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Accounts.
       */
      distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
   };

   /**
    * Account findMany
    */
   export type AccountFindManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Account
       */
      select?: AccountSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Account
       */
      omit?: AccountOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AccountInclude<ExtArgs> | null;
      /**
       * Filter, which Accounts to fetch.
       */
      where?: AccountWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Accounts to fetch.
       */
      orderBy?:
         | AccountOrderByWithRelationInput
         | AccountOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for listing Accounts.
       */
      cursor?: AccountWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Accounts from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Accounts.
       */
      skip?: number;
      distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
   };

   /**
    * Account create
    */
   export type AccountCreateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Account
       */
      select?: AccountSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Account
       */
      omit?: AccountOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AccountInclude<ExtArgs> | null;
      /**
       * The data needed to create a Account.
       */
      data: XOR<AccountCreateInput, AccountUncheckedCreateInput>;
   };

   /**
    * Account createMany
    */
   export type AccountCreateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * The data used to create many Accounts.
       */
      data: AccountCreateManyInput | AccountCreateManyInput[];
   };

   /**
    * Account update
    */
   export type AccountUpdateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Account
       */
      select?: AccountSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Account
       */
      omit?: AccountOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AccountInclude<ExtArgs> | null;
      /**
       * The data needed to update a Account.
       */
      data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>;
      /**
       * Choose, which Account to update.
       */
      where: AccountWhereUniqueInput;
   };

   /**
    * Account updateMany
    */
   export type AccountUpdateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * The data used to update Accounts.
       */
      data: XOR<
         AccountUpdateManyMutationInput,
         AccountUncheckedUpdateManyInput
      >;
      /**
       * Filter which Accounts to update
       */
      where?: AccountWhereInput;
      /**
       * Limit how many Accounts to update.
       */
      limit?: number;
   };

   /**
    * Account upsert
    */
   export type AccountUpsertArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Account
       */
      select?: AccountSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Account
       */
      omit?: AccountOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AccountInclude<ExtArgs> | null;
      /**
       * The filter to search for the Account to update in case it exists.
       */
      where: AccountWhereUniqueInput;
      /**
       * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
       */
      create: XOR<AccountCreateInput, AccountUncheckedCreateInput>;
      /**
       * In case the Account was found with the provided `where` argument, update it with this data.
       */
      update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>;
   };

   /**
    * Account delete
    */
   export type AccountDeleteArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Account
       */
      select?: AccountSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Account
       */
      omit?: AccountOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AccountInclude<ExtArgs> | null;
      /**
       * Filter which Account to delete.
       */
      where: AccountWhereUniqueInput;
   };

   /**
    * Account deleteMany
    */
   export type AccountDeleteManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Filter which Accounts to delete
       */
      where?: AccountWhereInput;
      /**
       * Limit how many Accounts to delete.
       */
      limit?: number;
   };

   /**
    * Account findRaw
    */
   export type AccountFindRawArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
       */
      filter?: InputJsonValue;
      /**
       * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
       */
      options?: InputJsonValue;
   };

   /**
    * Account aggregateRaw
    */
   export type AccountAggregateRawArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
       */
      pipeline?: InputJsonValue[];
      /**
       * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
       */
      options?: InputJsonValue;
   };

   /**
    * Account without action
    */
   export type AccountDefaultArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Account
       */
      select?: AccountSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Account
       */
      omit?: AccountOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AccountInclude<ExtArgs> | null;
   };

   /**
    * Model Session
    */

   export type AggregateSession = {
      _count: SessionCountAggregateOutputType | null;
      _min: SessionMinAggregateOutputType | null;
      _max: SessionMaxAggregateOutputType | null;
   };

   export type SessionMinAggregateOutputType = {
      id: string | null;
      sessionToken: string | null;
      userId: string | null;
      expires: Date | null;
      createdAt: Date | null;
      updatedAt: Date | null;
   };

   export type SessionMaxAggregateOutputType = {
      id: string | null;
      sessionToken: string | null;
      userId: string | null;
      expires: Date | null;
      createdAt: Date | null;
      updatedAt: Date | null;
   };

   export type SessionCountAggregateOutputType = {
      id: number;
      sessionToken: number;
      userId: number;
      expires: number;
      createdAt: number;
      updatedAt: number;
      _all: number;
   };

   export type SessionMinAggregateInputType = {
      id?: true;
      sessionToken?: true;
      userId?: true;
      expires?: true;
      createdAt?: true;
      updatedAt?: true;
   };

   export type SessionMaxAggregateInputType = {
      id?: true;
      sessionToken?: true;
      userId?: true;
      expires?: true;
      createdAt?: true;
      updatedAt?: true;
   };

   export type SessionCountAggregateInputType = {
      id?: true;
      sessionToken?: true;
      userId?: true;
      expires?: true;
      createdAt?: true;
      updatedAt?: true;
      _all?: true;
   };

   export type SessionAggregateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Filter which Session to aggregate.
       */
      where?: SessionWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Sessions to fetch.
       */
      orderBy?:
         | SessionOrderByWithRelationInput
         | SessionOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the start position
       */
      cursor?: SessionWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Sessions from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Sessions.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Count returned Sessions
       **/
      _count?: true | SessionCountAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the minimum value
       **/
      _min?: SessionMinAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the maximum value
       **/
      _max?: SessionMaxAggregateInputType;
   };

   export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
      [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
         ? T[P] extends true
            ? number
            : GetScalarType<T[P], AggregateSession[P]>
         : GetScalarType<T[P], AggregateSession[P]>;
   };

   export type SessionGroupByArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      where?: SessionWhereInput;
      orderBy?:
         | SessionOrderByWithAggregationInput
         | SessionOrderByWithAggregationInput[];
      by: SessionScalarFieldEnum[] | SessionScalarFieldEnum;
      having?: SessionScalarWhereWithAggregatesInput;
      take?: number;
      skip?: number;
      _count?: SessionCountAggregateInputType | true;
      _min?: SessionMinAggregateInputType;
      _max?: SessionMaxAggregateInputType;
   };

   export type SessionGroupByOutputType = {
      id: string;
      sessionToken: string;
      userId: string;
      expires: Date;
      createdAt: Date;
      updatedAt: Date;
      _count: SessionCountAggregateOutputType | null;
      _min: SessionMinAggregateOutputType | null;
      _max: SessionMaxAggregateOutputType | null;
   };

   type GetSessionGroupByPayload<T extends SessionGroupByArgs> =
      Prisma.PrismaPromise<
         Array<
            PickEnumerable<SessionGroupByOutputType, T['by']> & {
               [P in keyof T &
                  keyof SessionGroupByOutputType]: P extends '_count'
                  ? T[P] extends boolean
                     ? number
                     : GetScalarType<T[P], SessionGroupByOutputType[P]>
                  : GetScalarType<T[P], SessionGroupByOutputType[P]>;
            }
         >
      >;

   export type SessionSelect<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = $Extensions.GetSelect<
      {
         id?: boolean;
         sessionToken?: boolean;
         userId?: boolean;
         expires?: boolean;
         createdAt?: boolean;
         updatedAt?: boolean;
         user?: boolean | UserDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['session']
   >;

   export type SessionSelectScalar = {
      id?: boolean;
      sessionToken?: boolean;
      userId?: boolean;
      expires?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
   };

   export type SessionOmit<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = $Extensions.GetOmit<
      'id' | 'sessionToken' | 'userId' | 'expires' | 'createdAt' | 'updatedAt',
      ExtArgs['result']['session']
   >;
   export type SessionInclude<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      user?: boolean | UserDefaultArgs<ExtArgs>;
   };

   export type $SessionPayload<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      name: 'Session';
      objects: {
         user: Prisma.$UserPayload<ExtArgs>;
      };
      scalars: $Extensions.GetPayloadResult<
         {
            id: string;
            sessionToken: string;
            userId: string;
            expires: Date;
            createdAt: Date;
            updatedAt: Date;
         },
         ExtArgs['result']['session']
      >;
      composites: {};
   };

   type SessionGetPayload<
      S extends boolean | null | undefined | SessionDefaultArgs
   > = $Result.GetResult<Prisma.$SessionPayload, S>;

   type SessionCountArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true;
   };

   export interface SessionDelegate<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {}
   > {
      [K: symbol]: {
         types: Prisma.TypeMap<ExtArgs>['model']['Session'];
         meta: { name: 'Session' };
      };
      /**
       * Find zero or one Session that matches the filter.
       * @param {SessionFindUniqueArgs} args - Arguments to find a Session
       * @example
       * // Get one Session
       * const session = await prisma.session.findUnique({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUnique<T extends SessionFindUniqueArgs>(
         args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>
      ): Prisma__SessionClient<
         $Result.GetResult<
            Prisma.$SessionPayload<ExtArgs>,
            T,
            'findUnique',
            GlobalOmitOptions
         > | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find one Session that matches the filter or throw an error with `error.code='P2025'`
       * if no matches were found.
       * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
       * @example
       * // Get one Session
       * const session = await prisma.session.findUniqueOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(
         args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>
      ): Prisma__SessionClient<
         $Result.GetResult<
            Prisma.$SessionPayload<ExtArgs>,
            T,
            'findUniqueOrThrow',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first Session that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {SessionFindFirstArgs} args - Arguments to find a Session
       * @example
       * // Get one Session
       * const session = await prisma.session.findFirst({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirst<T extends SessionFindFirstArgs>(
         args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>
      ): Prisma__SessionClient<
         $Result.GetResult<
            Prisma.$SessionPayload<ExtArgs>,
            T,
            'findFirst',
            GlobalOmitOptions
         > | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first Session that matches the filter or
       * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
       * @example
       * // Get one Session
       * const session = await prisma.session.findFirstOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(
         args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>
      ): Prisma__SessionClient<
         $Result.GetResult<
            Prisma.$SessionPayload<ExtArgs>,
            T,
            'findFirstOrThrow',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find zero or more Sessions that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
       * @example
       * // Get all Sessions
       * const sessions = await prisma.session.findMany()
       *
       * // Get first 10 Sessions
       * const sessions = await prisma.session.findMany({ take: 10 })
       *
       * // Only select the `id`
       * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
       *
       */
      findMany<T extends SessionFindManyArgs>(
         args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<
            Prisma.$SessionPayload<ExtArgs>,
            T,
            'findMany',
            GlobalOmitOptions
         >
      >;

      /**
       * Create a Session.
       * @param {SessionCreateArgs} args - Arguments to create a Session.
       * @example
       * // Create one Session
       * const Session = await prisma.session.create({
       *   data: {
       *     // ... data to create a Session
       *   }
       * })
       *
       */
      create<T extends SessionCreateArgs>(
         args: SelectSubset<T, SessionCreateArgs<ExtArgs>>
      ): Prisma__SessionClient<
         $Result.GetResult<
            Prisma.$SessionPayload<ExtArgs>,
            T,
            'create',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Create many Sessions.
       * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
       * @example
       * // Create many Sessions
       * const session = await prisma.session.createMany({
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       */
      createMany<T extends SessionCreateManyArgs>(
         args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Delete a Session.
       * @param {SessionDeleteArgs} args - Arguments to delete one Session.
       * @example
       * // Delete one Session
       * const Session = await prisma.session.delete({
       *   where: {
       *     // ... filter to delete one Session
       *   }
       * })
       *
       */
      delete<T extends SessionDeleteArgs>(
         args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>
      ): Prisma__SessionClient<
         $Result.GetResult<
            Prisma.$SessionPayload<ExtArgs>,
            T,
            'delete',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Update one Session.
       * @param {SessionUpdateArgs} args - Arguments to update one Session.
       * @example
       * // Update one Session
       * const session = await prisma.session.update({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      update<T extends SessionUpdateArgs>(
         args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>
      ): Prisma__SessionClient<
         $Result.GetResult<
            Prisma.$SessionPayload<ExtArgs>,
            T,
            'update',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Delete zero or more Sessions.
       * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
       * @example
       * // Delete a few Sessions
       * const { count } = await prisma.session.deleteMany({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       *
       */
      deleteMany<T extends SessionDeleteManyArgs>(
         args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Update zero or more Sessions.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
       * @example
       * // Update many Sessions
       * const session = await prisma.session.updateMany({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      updateMany<T extends SessionUpdateManyArgs>(
         args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Create or update one Session.
       * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
       * @example
       * // Update or create a Session
       * const session = await prisma.session.upsert({
       *   create: {
       *     // ... data to create a Session
       *   },
       *   update: {
       *     // ... in case it already exists, update
       *   },
       *   where: {
       *     // ... the filter for the Session we want to update
       *   }
       * })
       */
      upsert<T extends SessionUpsertArgs>(
         args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>
      ): Prisma__SessionClient<
         $Result.GetResult<
            Prisma.$SessionPayload<ExtArgs>,
            T,
            'upsert',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find zero or more Sessions that matches the filter.
       * @param {SessionFindRawArgs} args - Select which filters you would like to apply.
       * @example
       * const session = await prisma.session.findRaw({
       *   filter: { age: { $gt: 25 } }
       * })
       */
      findRaw(args?: SessionFindRawArgs): Prisma.PrismaPromise<JsonObject>;

      /**
       * Perform aggregation operations on a Session.
       * @param {SessionAggregateRawArgs} args - Select which aggregations you would like to apply.
       * @example
       * const session = await prisma.session.aggregateRaw({
       *   pipeline: [
       *     { $match: { status: "registered" } },
       *     { $group: { _id: "$country", total: { $sum: 1 } } }
       *   ]
       * })
       */
      aggregateRaw(
         args?: SessionAggregateRawArgs
      ): Prisma.PrismaPromise<JsonObject>;

      /**
       * Count the number of Sessions.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
       * @example
       * // Count the number of Sessions
       * const count = await prisma.session.count({
       *   where: {
       *     // ... the filter for the Sessions we want to count
       *   }
       * })
       **/
      count<T extends SessionCountArgs>(
         args?: Subset<T, SessionCountArgs>
      ): Prisma.PrismaPromise<
         T extends $Utils.Record<'select', any>
            ? T['select'] extends true
               ? number
               : GetScalarType<T['select'], SessionCountAggregateOutputType>
            : number
      >;

      /**
       * Allows you to perform aggregations operations on a Session.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
       * @example
       * // Ordered by age ascending
       * // Where email contains prisma.io
       * // Limited to the 10 users
       * const aggregations = await prisma.user.aggregate({
       *   _avg: {
       *     age: true,
       *   },
       *   where: {
       *     email: {
       *       contains: "prisma.io",
       *     },
       *   },
       *   orderBy: {
       *     age: "asc",
       *   },
       *   take: 10,
       * })
       **/
      aggregate<T extends SessionAggregateArgs>(
         args: Subset<T, SessionAggregateArgs>
      ): Prisma.PrismaPromise<GetSessionAggregateType<T>>;

      /**
       * Group by Session.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {SessionGroupByArgs} args - Group by arguments.
       * @example
       * // Group by city, order by createdAt, get count
       * const result = await prisma.user.groupBy({
       *   by: ['city', 'createdAt'],
       *   orderBy: {
       *     createdAt: true
       *   },
       *   _count: {
       *     _all: true
       *   },
       * })
       *
       **/
      groupBy<
         T extends SessionGroupByArgs,
         HasSelectOrTake extends Or<
            Extends<'skip', Keys<T>>,
            Extends<'take', Keys<T>>
         >,
         OrderByArg extends True extends HasSelectOrTake
            ? { orderBy: SessionGroupByArgs['orderBy'] }
            : { orderBy?: SessionGroupByArgs['orderBy'] },
         OrderFields extends ExcludeUnderscoreKeys<
            Keys<MaybeTupleToUnion<T['orderBy']>>
         >,
         ByFields extends MaybeTupleToUnion<T['by']>,
         ByValid extends Has<ByFields, OrderFields>,
         HavingFields extends GetHavingFields<T['having']>,
         HavingValid extends Has<ByFields, HavingFields>,
         ByEmpty extends T['by'] extends never[] ? True : False,
         InputErrors extends ByEmpty extends True
            ? `Error: "by" must not be empty.`
            : HavingValid extends False
            ? {
                 [P in HavingFields]: P extends ByFields
                    ? never
                    : P extends string
                    ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                    : [
                         Error,
                         'Field ',
                         P,
                         ` in "having" needs to be provided in "by"`
                      ];
              }[HavingFields]
            : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
               ? ByValid extends True
                  ? {}
                  : {
                       [P in OrderFields]: P extends ByFields
                          ? never
                          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
               : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
            ? 'orderBy' extends Keys<T>
               ? ByValid extends True
                  ? {}
                  : {
                       [P in OrderFields]: P extends ByFields
                          ? never
                          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
               : 'Error: If you provide "skip", you also need to provide "orderBy"'
            : ByValid extends True
            ? {}
            : {
                 [P in OrderFields]: P extends ByFields
                    ? never
                    : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
      >(
         args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> &
            InputErrors
      ): {} extends InputErrors
         ? GetSessionGroupByPayload<T>
         : Prisma.PrismaPromise<InputErrors>;
      /**
       * Fields of the Session model
       */
      readonly fields: SessionFieldRefs;
   }

   /**
    * The delegate class that acts as a "Promise-like" for Session.
    * Why is this prefixed with `Prisma__`?
    * Because we want to prevent naming conflicts as mentioned in
    * https://github.com/prisma/prisma-client-js/issues/707
    */
   export interface Prisma__SessionClient<
      T,
      Null = never,
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {}
   > extends Prisma.PrismaPromise<T> {
      readonly [Symbol.toStringTag]: 'PrismaPromise';
      user<T extends UserDefaultArgs<ExtArgs> = {}>(
         args?: Subset<T, UserDefaultArgs<ExtArgs>>
      ): Prisma__UserClient<
         | $Result.GetResult<
              Prisma.$UserPayload<ExtArgs>,
              T,
              'findUniqueOrThrow',
              GlobalOmitOptions
           >
         | Null,
         Null,
         ExtArgs,
         GlobalOmitOptions
      >;
      /**
       * Attaches callbacks for the resolution and/or rejection of the Promise.
       * @param onfulfilled The callback to execute when the Promise is resolved.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of which ever callback is executed.
       */
      then<TResult1 = T, TResult2 = never>(
         onfulfilled?:
            | ((value: T) => TResult1 | PromiseLike<TResult1>)
            | undefined
            | null,
         onrejected?:
            | ((reason: any) => TResult2 | PromiseLike<TResult2>)
            | undefined
            | null
      ): $Utils.JsPromise<TResult1 | TResult2>;
      /**
       * Attaches a callback for only the rejection of the Promise.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of the callback.
       */
      catch<TResult = never>(
         onrejected?:
            | ((reason: any) => TResult | PromiseLike<TResult>)
            | undefined
            | null
      ): $Utils.JsPromise<T | TResult>;
      /**
       * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
       * resolved value cannot be modified from the callback.
       * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
       * @returns A Promise for the completion of the callback.
       */
      finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
   }

   /**
    * Fields of the Session model
    */
   interface SessionFieldRefs {
      readonly id: FieldRef<'Session', 'String'>;
      readonly sessionToken: FieldRef<'Session', 'String'>;
      readonly userId: FieldRef<'Session', 'String'>;
      readonly expires: FieldRef<'Session', 'DateTime'>;
      readonly createdAt: FieldRef<'Session', 'DateTime'>;
      readonly updatedAt: FieldRef<'Session', 'DateTime'>;
   }

   // Custom InputTypes
   /**
    * Session findUnique
    */
   export type SessionFindUniqueArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Session
       */
      select?: SessionSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Session
       */
      omit?: SessionOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: SessionInclude<ExtArgs> | null;
      /**
       * Filter, which Session to fetch.
       */
      where: SessionWhereUniqueInput;
   };

   /**
    * Session findUniqueOrThrow
    */
   export type SessionFindUniqueOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Session
       */
      select?: SessionSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Session
       */
      omit?: SessionOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: SessionInclude<ExtArgs> | null;
      /**
       * Filter, which Session to fetch.
       */
      where: SessionWhereUniqueInput;
   };

   /**
    * Session findFirst
    */
   export type SessionFindFirstArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Session
       */
      select?: SessionSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Session
       */
      omit?: SessionOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: SessionInclude<ExtArgs> | null;
      /**
       * Filter, which Session to fetch.
       */
      where?: SessionWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Sessions to fetch.
       */
      orderBy?:
         | SessionOrderByWithRelationInput
         | SessionOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Sessions.
       */
      cursor?: SessionWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Sessions from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Sessions.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Sessions.
       */
      distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
   };

   /**
    * Session findFirstOrThrow
    */
   export type SessionFindFirstOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Session
       */
      select?: SessionSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Session
       */
      omit?: SessionOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: SessionInclude<ExtArgs> | null;
      /**
       * Filter, which Session to fetch.
       */
      where?: SessionWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Sessions to fetch.
       */
      orderBy?:
         | SessionOrderByWithRelationInput
         | SessionOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Sessions.
       */
      cursor?: SessionWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Sessions from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Sessions.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Sessions.
       */
      distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
   };

   /**
    * Session findMany
    */
   export type SessionFindManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Session
       */
      select?: SessionSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Session
       */
      omit?: SessionOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: SessionInclude<ExtArgs> | null;
      /**
       * Filter, which Sessions to fetch.
       */
      where?: SessionWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Sessions to fetch.
       */
      orderBy?:
         | SessionOrderByWithRelationInput
         | SessionOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for listing Sessions.
       */
      cursor?: SessionWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Sessions from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Sessions.
       */
      skip?: number;
      distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
   };

   /**
    * Session create
    */
   export type SessionCreateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Session
       */
      select?: SessionSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Session
       */
      omit?: SessionOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: SessionInclude<ExtArgs> | null;
      /**
       * The data needed to create a Session.
       */
      data: XOR<SessionCreateInput, SessionUncheckedCreateInput>;
   };

   /**
    * Session createMany
    */
   export type SessionCreateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * The data used to create many Sessions.
       */
      data: SessionCreateManyInput | SessionCreateManyInput[];
   };

   /**
    * Session update
    */
   export type SessionUpdateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Session
       */
      select?: SessionSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Session
       */
      omit?: SessionOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: SessionInclude<ExtArgs> | null;
      /**
       * The data needed to update a Session.
       */
      data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>;
      /**
       * Choose, which Session to update.
       */
      where: SessionWhereUniqueInput;
   };

   /**
    * Session updateMany
    */
   export type SessionUpdateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * The data used to update Sessions.
       */
      data: XOR<
         SessionUpdateManyMutationInput,
         SessionUncheckedUpdateManyInput
      >;
      /**
       * Filter which Sessions to update
       */
      where?: SessionWhereInput;
      /**
       * Limit how many Sessions to update.
       */
      limit?: number;
   };

   /**
    * Session upsert
    */
   export type SessionUpsertArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Session
       */
      select?: SessionSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Session
       */
      omit?: SessionOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: SessionInclude<ExtArgs> | null;
      /**
       * The filter to search for the Session to update in case it exists.
       */
      where: SessionWhereUniqueInput;
      /**
       * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
       */
      create: XOR<SessionCreateInput, SessionUncheckedCreateInput>;
      /**
       * In case the Session was found with the provided `where` argument, update it with this data.
       */
      update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>;
   };

   /**
    * Session delete
    */
   export type SessionDeleteArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Session
       */
      select?: SessionSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Session
       */
      omit?: SessionOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: SessionInclude<ExtArgs> | null;
      /**
       * Filter which Session to delete.
       */
      where: SessionWhereUniqueInput;
   };

   /**
    * Session deleteMany
    */
   export type SessionDeleteManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Filter which Sessions to delete
       */
      where?: SessionWhereInput;
      /**
       * Limit how many Sessions to delete.
       */
      limit?: number;
   };

   /**
    * Session findRaw
    */
   export type SessionFindRawArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
       */
      filter?: InputJsonValue;
      /**
       * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
       */
      options?: InputJsonValue;
   };

   /**
    * Session aggregateRaw
    */
   export type SessionAggregateRawArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
       */
      pipeline?: InputJsonValue[];
      /**
       * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
       */
      options?: InputJsonValue;
   };

   /**
    * Session without action
    */
   export type SessionDefaultArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the Session
       */
      select?: SessionSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Session
       */
      omit?: SessionOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: SessionInclude<ExtArgs> | null;
   };

   /**
    * Model VerificationToken
    */

   export type AggregateVerificationToken = {
      _count: VerificationTokenCountAggregateOutputType | null;
      _min: VerificationTokenMinAggregateOutputType | null;
      _max: VerificationTokenMaxAggregateOutputType | null;
   };

   export type VerificationTokenMinAggregateOutputType = {
      id: string | null;
      identifier: string | null;
      token: string | null;
      expires: Date | null;
   };

   export type VerificationTokenMaxAggregateOutputType = {
      id: string | null;
      identifier: string | null;
      token: string | null;
      expires: Date | null;
   };

   export type VerificationTokenCountAggregateOutputType = {
      id: number;
      identifier: number;
      token: number;
      expires: number;
      _all: number;
   };

   export type VerificationTokenMinAggregateInputType = {
      id?: true;
      identifier?: true;
      token?: true;
      expires?: true;
   };

   export type VerificationTokenMaxAggregateInputType = {
      id?: true;
      identifier?: true;
      token?: true;
      expires?: true;
   };

   export type VerificationTokenCountAggregateInputType = {
      id?: true;
      identifier?: true;
      token?: true;
      expires?: true;
      _all?: true;
   };

   export type VerificationTokenAggregateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Filter which VerificationToken to aggregate.
       */
      where?: VerificationTokenWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of VerificationTokens to fetch.
       */
      orderBy?:
         | VerificationTokenOrderByWithRelationInput
         | VerificationTokenOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the start position
       */
      cursor?: VerificationTokenWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` VerificationTokens from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` VerificationTokens.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Count returned VerificationTokens
       **/
      _count?: true | VerificationTokenCountAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the minimum value
       **/
      _min?: VerificationTokenMinAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the maximum value
       **/
      _max?: VerificationTokenMaxAggregateInputType;
   };

   export type GetVerificationTokenAggregateType<
      T extends VerificationTokenAggregateArgs
   > = {
      [P in keyof T & keyof AggregateVerificationToken]: P extends
         | '_count'
         | 'count'
         ? T[P] extends true
            ? number
            : GetScalarType<T[P], AggregateVerificationToken[P]>
         : GetScalarType<T[P], AggregateVerificationToken[P]>;
   };

   export type VerificationTokenGroupByArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      where?: VerificationTokenWhereInput;
      orderBy?:
         | VerificationTokenOrderByWithAggregationInput
         | VerificationTokenOrderByWithAggregationInput[];
      by: VerificationTokenScalarFieldEnum[] | VerificationTokenScalarFieldEnum;
      having?: VerificationTokenScalarWhereWithAggregatesInput;
      take?: number;
      skip?: number;
      _count?: VerificationTokenCountAggregateInputType | true;
      _min?: VerificationTokenMinAggregateInputType;
      _max?: VerificationTokenMaxAggregateInputType;
   };

   export type VerificationTokenGroupByOutputType = {
      id: string;
      identifier: string;
      token: string;
      expires: Date;
      _count: VerificationTokenCountAggregateOutputType | null;
      _min: VerificationTokenMinAggregateOutputType | null;
      _max: VerificationTokenMaxAggregateOutputType | null;
   };

   type GetVerificationTokenGroupByPayload<
      T extends VerificationTokenGroupByArgs
   > = Prisma.PrismaPromise<
      Array<
         PickEnumerable<VerificationTokenGroupByOutputType, T['by']> & {
            [P in keyof T &
               keyof VerificationTokenGroupByOutputType]: P extends '_count'
               ? T[P] extends boolean
                  ? number
                  : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
               : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>;
         }
      >
   >;

   export type VerificationTokenSelect<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = $Extensions.GetSelect<
      {
         id?: boolean;
         identifier?: boolean;
         token?: boolean;
         expires?: boolean;
      },
      ExtArgs['result']['verificationToken']
   >;

   export type VerificationTokenSelectScalar = {
      id?: boolean;
      identifier?: boolean;
      token?: boolean;
      expires?: boolean;
   };

   export type VerificationTokenOmit<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = $Extensions.GetOmit<
      'id' | 'identifier' | 'token' | 'expires',
      ExtArgs['result']['verificationToken']
   >;

   export type $VerificationTokenPayload<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      name: 'VerificationToken';
      objects: {};
      scalars: $Extensions.GetPayloadResult<
         {
            id: string;
            identifier: string;
            token: string;
            expires: Date;
         },
         ExtArgs['result']['verificationToken']
      >;
      composites: {};
   };

   type VerificationTokenGetPayload<
      S extends boolean | null | undefined | VerificationTokenDefaultArgs
   > = $Result.GetResult<Prisma.$VerificationTokenPayload, S>;

   type VerificationTokenCountArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = Omit<
      VerificationTokenFindManyArgs,
      'select' | 'include' | 'distinct' | 'omit'
   > & {
      select?: VerificationTokenCountAggregateInputType | true;
   };

   export interface VerificationTokenDelegate<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {}
   > {
      [K: symbol]: {
         types: Prisma.TypeMap<ExtArgs>['model']['VerificationToken'];
         meta: { name: 'VerificationToken' };
      };
      /**
       * Find zero or one VerificationToken that matches the filter.
       * @param {VerificationTokenFindUniqueArgs} args - Arguments to find a VerificationToken
       * @example
       * // Get one VerificationToken
       * const verificationToken = await prisma.verificationToken.findUnique({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUnique<T extends VerificationTokenFindUniqueArgs>(
         args: SelectSubset<T, VerificationTokenFindUniqueArgs<ExtArgs>>
      ): Prisma__VerificationTokenClient<
         $Result.GetResult<
            Prisma.$VerificationTokenPayload<ExtArgs>,
            T,
            'findUnique',
            GlobalOmitOptions
         > | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find one VerificationToken that matches the filter or throw an error with `error.code='P2025'`
       * if no matches were found.
       * @param {VerificationTokenFindUniqueOrThrowArgs} args - Arguments to find a VerificationToken
       * @example
       * // Get one VerificationToken
       * const verificationToken = await prisma.verificationToken.findUniqueOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUniqueOrThrow<T extends VerificationTokenFindUniqueOrThrowArgs>(
         args: SelectSubset<T, VerificationTokenFindUniqueOrThrowArgs<ExtArgs>>
      ): Prisma__VerificationTokenClient<
         $Result.GetResult<
            Prisma.$VerificationTokenPayload<ExtArgs>,
            T,
            'findUniqueOrThrow',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first VerificationToken that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {VerificationTokenFindFirstArgs} args - Arguments to find a VerificationToken
       * @example
       * // Get one VerificationToken
       * const verificationToken = await prisma.verificationToken.findFirst({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirst<T extends VerificationTokenFindFirstArgs>(
         args?: SelectSubset<T, VerificationTokenFindFirstArgs<ExtArgs>>
      ): Prisma__VerificationTokenClient<
         $Result.GetResult<
            Prisma.$VerificationTokenPayload<ExtArgs>,
            T,
            'findFirst',
            GlobalOmitOptions
         > | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first VerificationToken that matches the filter or
       * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {VerificationTokenFindFirstOrThrowArgs} args - Arguments to find a VerificationToken
       * @example
       * // Get one VerificationToken
       * const verificationToken = await prisma.verificationToken.findFirstOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirstOrThrow<T extends VerificationTokenFindFirstOrThrowArgs>(
         args?: SelectSubset<T, VerificationTokenFindFirstOrThrowArgs<ExtArgs>>
      ): Prisma__VerificationTokenClient<
         $Result.GetResult<
            Prisma.$VerificationTokenPayload<ExtArgs>,
            T,
            'findFirstOrThrow',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find zero or more VerificationTokens that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {VerificationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
       * @example
       * // Get all VerificationTokens
       * const verificationTokens = await prisma.verificationToken.findMany()
       *
       * // Get first 10 VerificationTokens
       * const verificationTokens = await prisma.verificationToken.findMany({ take: 10 })
       *
       * // Only select the `id`
       * const verificationTokenWithIdOnly = await prisma.verificationToken.findMany({ select: { id: true } })
       *
       */
      findMany<T extends VerificationTokenFindManyArgs>(
         args?: SelectSubset<T, VerificationTokenFindManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<
            Prisma.$VerificationTokenPayload<ExtArgs>,
            T,
            'findMany',
            GlobalOmitOptions
         >
      >;

      /**
       * Create a VerificationToken.
       * @param {VerificationTokenCreateArgs} args - Arguments to create a VerificationToken.
       * @example
       * // Create one VerificationToken
       * const VerificationToken = await prisma.verificationToken.create({
       *   data: {
       *     // ... data to create a VerificationToken
       *   }
       * })
       *
       */
      create<T extends VerificationTokenCreateArgs>(
         args: SelectSubset<T, VerificationTokenCreateArgs<ExtArgs>>
      ): Prisma__VerificationTokenClient<
         $Result.GetResult<
            Prisma.$VerificationTokenPayload<ExtArgs>,
            T,
            'create',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Create many VerificationTokens.
       * @param {VerificationTokenCreateManyArgs} args - Arguments to create many VerificationTokens.
       * @example
       * // Create many VerificationTokens
       * const verificationToken = await prisma.verificationToken.createMany({
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       */
      createMany<T extends VerificationTokenCreateManyArgs>(
         args?: SelectSubset<T, VerificationTokenCreateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Delete a VerificationToken.
       * @param {VerificationTokenDeleteArgs} args - Arguments to delete one VerificationToken.
       * @example
       * // Delete one VerificationToken
       * const VerificationToken = await prisma.verificationToken.delete({
       *   where: {
       *     // ... filter to delete one VerificationToken
       *   }
       * })
       *
       */
      delete<T extends VerificationTokenDeleteArgs>(
         args: SelectSubset<T, VerificationTokenDeleteArgs<ExtArgs>>
      ): Prisma__VerificationTokenClient<
         $Result.GetResult<
            Prisma.$VerificationTokenPayload<ExtArgs>,
            T,
            'delete',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Update one VerificationToken.
       * @param {VerificationTokenUpdateArgs} args - Arguments to update one VerificationToken.
       * @example
       * // Update one VerificationToken
       * const verificationToken = await prisma.verificationToken.update({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      update<T extends VerificationTokenUpdateArgs>(
         args: SelectSubset<T, VerificationTokenUpdateArgs<ExtArgs>>
      ): Prisma__VerificationTokenClient<
         $Result.GetResult<
            Prisma.$VerificationTokenPayload<ExtArgs>,
            T,
            'update',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Delete zero or more VerificationTokens.
       * @param {VerificationTokenDeleteManyArgs} args - Arguments to filter VerificationTokens to delete.
       * @example
       * // Delete a few VerificationTokens
       * const { count } = await prisma.verificationToken.deleteMany({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       *
       */
      deleteMany<T extends VerificationTokenDeleteManyArgs>(
         args?: SelectSubset<T, VerificationTokenDeleteManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Update zero or more VerificationTokens.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {VerificationTokenUpdateManyArgs} args - Arguments to update one or more rows.
       * @example
       * // Update many VerificationTokens
       * const verificationToken = await prisma.verificationToken.updateMany({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      updateMany<T extends VerificationTokenUpdateManyArgs>(
         args: SelectSubset<T, VerificationTokenUpdateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Create or update one VerificationToken.
       * @param {VerificationTokenUpsertArgs} args - Arguments to update or create a VerificationToken.
       * @example
       * // Update or create a VerificationToken
       * const verificationToken = await prisma.verificationToken.upsert({
       *   create: {
       *     // ... data to create a VerificationToken
       *   },
       *   update: {
       *     // ... in case it already exists, update
       *   },
       *   where: {
       *     // ... the filter for the VerificationToken we want to update
       *   }
       * })
       */
      upsert<T extends VerificationTokenUpsertArgs>(
         args: SelectSubset<T, VerificationTokenUpsertArgs<ExtArgs>>
      ): Prisma__VerificationTokenClient<
         $Result.GetResult<
            Prisma.$VerificationTokenPayload<ExtArgs>,
            T,
            'upsert',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find zero or more VerificationTokens that matches the filter.
       * @param {VerificationTokenFindRawArgs} args - Select which filters you would like to apply.
       * @example
       * const verificationToken = await prisma.verificationToken.findRaw({
       *   filter: { age: { $gt: 25 } }
       * })
       */
      findRaw(
         args?: VerificationTokenFindRawArgs
      ): Prisma.PrismaPromise<JsonObject>;

      /**
       * Perform aggregation operations on a VerificationToken.
       * @param {VerificationTokenAggregateRawArgs} args - Select which aggregations you would like to apply.
       * @example
       * const verificationToken = await prisma.verificationToken.aggregateRaw({
       *   pipeline: [
       *     { $match: { status: "registered" } },
       *     { $group: { _id: "$country", total: { $sum: 1 } } }
       *   ]
       * })
       */
      aggregateRaw(
         args?: VerificationTokenAggregateRawArgs
      ): Prisma.PrismaPromise<JsonObject>;

      /**
       * Count the number of VerificationTokens.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {VerificationTokenCountArgs} args - Arguments to filter VerificationTokens to count.
       * @example
       * // Count the number of VerificationTokens
       * const count = await prisma.verificationToken.count({
       *   where: {
       *     // ... the filter for the VerificationTokens we want to count
       *   }
       * })
       **/
      count<T extends VerificationTokenCountArgs>(
         args?: Subset<T, VerificationTokenCountArgs>
      ): Prisma.PrismaPromise<
         T extends $Utils.Record<'select', any>
            ? T['select'] extends true
               ? number
               : GetScalarType<
                    T['select'],
                    VerificationTokenCountAggregateOutputType
                 >
            : number
      >;

      /**
       * Allows you to perform aggregations operations on a VerificationToken.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {VerificationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
       * @example
       * // Ordered by age ascending
       * // Where email contains prisma.io
       * // Limited to the 10 users
       * const aggregations = await prisma.user.aggregate({
       *   _avg: {
       *     age: true,
       *   },
       *   where: {
       *     email: {
       *       contains: "prisma.io",
       *     },
       *   },
       *   orderBy: {
       *     age: "asc",
       *   },
       *   take: 10,
       * })
       **/
      aggregate<T extends VerificationTokenAggregateArgs>(
         args: Subset<T, VerificationTokenAggregateArgs>
      ): Prisma.PrismaPromise<GetVerificationTokenAggregateType<T>>;

      /**
       * Group by VerificationToken.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {VerificationTokenGroupByArgs} args - Group by arguments.
       * @example
       * // Group by city, order by createdAt, get count
       * const result = await prisma.user.groupBy({
       *   by: ['city', 'createdAt'],
       *   orderBy: {
       *     createdAt: true
       *   },
       *   _count: {
       *     _all: true
       *   },
       * })
       *
       **/
      groupBy<
         T extends VerificationTokenGroupByArgs,
         HasSelectOrTake extends Or<
            Extends<'skip', Keys<T>>,
            Extends<'take', Keys<T>>
         >,
         OrderByArg extends True extends HasSelectOrTake
            ? { orderBy: VerificationTokenGroupByArgs['orderBy'] }
            : { orderBy?: VerificationTokenGroupByArgs['orderBy'] },
         OrderFields extends ExcludeUnderscoreKeys<
            Keys<MaybeTupleToUnion<T['orderBy']>>
         >,
         ByFields extends MaybeTupleToUnion<T['by']>,
         ByValid extends Has<ByFields, OrderFields>,
         HavingFields extends GetHavingFields<T['having']>,
         HavingValid extends Has<ByFields, HavingFields>,
         ByEmpty extends T['by'] extends never[] ? True : False,
         InputErrors extends ByEmpty extends True
            ? `Error: "by" must not be empty.`
            : HavingValid extends False
            ? {
                 [P in HavingFields]: P extends ByFields
                    ? never
                    : P extends string
                    ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                    : [
                         Error,
                         'Field ',
                         P,
                         ` in "having" needs to be provided in "by"`
                      ];
              }[HavingFields]
            : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
               ? ByValid extends True
                  ? {}
                  : {
                       [P in OrderFields]: P extends ByFields
                          ? never
                          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
               : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
            ? 'orderBy' extends Keys<T>
               ? ByValid extends True
                  ? {}
                  : {
                       [P in OrderFields]: P extends ByFields
                          ? never
                          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
               : 'Error: If you provide "skip", you also need to provide "orderBy"'
            : ByValid extends True
            ? {}
            : {
                 [P in OrderFields]: P extends ByFields
                    ? never
                    : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
      >(
         args: SubsetIntersection<T, VerificationTokenGroupByArgs, OrderByArg> &
            InputErrors
      ): {} extends InputErrors
         ? GetVerificationTokenGroupByPayload<T>
         : Prisma.PrismaPromise<InputErrors>;
      /**
       * Fields of the VerificationToken model
       */
      readonly fields: VerificationTokenFieldRefs;
   }

   /**
    * The delegate class that acts as a "Promise-like" for VerificationToken.
    * Why is this prefixed with `Prisma__`?
    * Because we want to prevent naming conflicts as mentioned in
    * https://github.com/prisma/prisma-client-js/issues/707
    */
   export interface Prisma__VerificationTokenClient<
      T,
      Null = never,
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {}
   > extends Prisma.PrismaPromise<T> {
      readonly [Symbol.toStringTag]: 'PrismaPromise';
      /**
       * Attaches callbacks for the resolution and/or rejection of the Promise.
       * @param onfulfilled The callback to execute when the Promise is resolved.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of which ever callback is executed.
       */
      then<TResult1 = T, TResult2 = never>(
         onfulfilled?:
            | ((value: T) => TResult1 | PromiseLike<TResult1>)
            | undefined
            | null,
         onrejected?:
            | ((reason: any) => TResult2 | PromiseLike<TResult2>)
            | undefined
            | null
      ): $Utils.JsPromise<TResult1 | TResult2>;
      /**
       * Attaches a callback for only the rejection of the Promise.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of the callback.
       */
      catch<TResult = never>(
         onrejected?:
            | ((reason: any) => TResult | PromiseLike<TResult>)
            | undefined
            | null
      ): $Utils.JsPromise<T | TResult>;
      /**
       * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
       * resolved value cannot be modified from the callback.
       * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
       * @returns A Promise for the completion of the callback.
       */
      finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
   }

   /**
    * Fields of the VerificationToken model
    */
   interface VerificationTokenFieldRefs {
      readonly id: FieldRef<'VerificationToken', 'String'>;
      readonly identifier: FieldRef<'VerificationToken', 'String'>;
      readonly token: FieldRef<'VerificationToken', 'String'>;
      readonly expires: FieldRef<'VerificationToken', 'DateTime'>;
   }

   // Custom InputTypes
   /**
    * VerificationToken findUnique
    */
   export type VerificationTokenFindUniqueArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the VerificationToken
       */
      select?: VerificationTokenSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the VerificationToken
       */
      omit?: VerificationTokenOmit<ExtArgs> | null;
      /**
       * Filter, which VerificationToken to fetch.
       */
      where: VerificationTokenWhereUniqueInput;
   };

   /**
    * VerificationToken findUniqueOrThrow
    */
   export type VerificationTokenFindUniqueOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the VerificationToken
       */
      select?: VerificationTokenSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the VerificationToken
       */
      omit?: VerificationTokenOmit<ExtArgs> | null;
      /**
       * Filter, which VerificationToken to fetch.
       */
      where: VerificationTokenWhereUniqueInput;
   };

   /**
    * VerificationToken findFirst
    */
   export type VerificationTokenFindFirstArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the VerificationToken
       */
      select?: VerificationTokenSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the VerificationToken
       */
      omit?: VerificationTokenOmit<ExtArgs> | null;
      /**
       * Filter, which VerificationToken to fetch.
       */
      where?: VerificationTokenWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of VerificationTokens to fetch.
       */
      orderBy?:
         | VerificationTokenOrderByWithRelationInput
         | VerificationTokenOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for VerificationTokens.
       */
      cursor?: VerificationTokenWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` VerificationTokens from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` VerificationTokens.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of VerificationTokens.
       */
      distinct?:
         | VerificationTokenScalarFieldEnum
         | VerificationTokenScalarFieldEnum[];
   };

   /**
    * VerificationToken findFirstOrThrow
    */
   export type VerificationTokenFindFirstOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the VerificationToken
       */
      select?: VerificationTokenSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the VerificationToken
       */
      omit?: VerificationTokenOmit<ExtArgs> | null;
      /**
       * Filter, which VerificationToken to fetch.
       */
      where?: VerificationTokenWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of VerificationTokens to fetch.
       */
      orderBy?:
         | VerificationTokenOrderByWithRelationInput
         | VerificationTokenOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for VerificationTokens.
       */
      cursor?: VerificationTokenWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` VerificationTokens from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` VerificationTokens.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of VerificationTokens.
       */
      distinct?:
         | VerificationTokenScalarFieldEnum
         | VerificationTokenScalarFieldEnum[];
   };

   /**
    * VerificationToken findMany
    */
   export type VerificationTokenFindManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the VerificationToken
       */
      select?: VerificationTokenSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the VerificationToken
       */
      omit?: VerificationTokenOmit<ExtArgs> | null;
      /**
       * Filter, which VerificationTokens to fetch.
       */
      where?: VerificationTokenWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of VerificationTokens to fetch.
       */
      orderBy?:
         | VerificationTokenOrderByWithRelationInput
         | VerificationTokenOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for listing VerificationTokens.
       */
      cursor?: VerificationTokenWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` VerificationTokens from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` VerificationTokens.
       */
      skip?: number;
      distinct?:
         | VerificationTokenScalarFieldEnum
         | VerificationTokenScalarFieldEnum[];
   };

   /**
    * VerificationToken create
    */
   export type VerificationTokenCreateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the VerificationToken
       */
      select?: VerificationTokenSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the VerificationToken
       */
      omit?: VerificationTokenOmit<ExtArgs> | null;
      /**
       * The data needed to create a VerificationToken.
       */
      data: XOR<
         VerificationTokenCreateInput,
         VerificationTokenUncheckedCreateInput
      >;
   };

   /**
    * VerificationToken createMany
    */
   export type VerificationTokenCreateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * The data used to create many VerificationTokens.
       */
      data:
         | VerificationTokenCreateManyInput
         | VerificationTokenCreateManyInput[];
   };

   /**
    * VerificationToken update
    */
   export type VerificationTokenUpdateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the VerificationToken
       */
      select?: VerificationTokenSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the VerificationToken
       */
      omit?: VerificationTokenOmit<ExtArgs> | null;
      /**
       * The data needed to update a VerificationToken.
       */
      data: XOR<
         VerificationTokenUpdateInput,
         VerificationTokenUncheckedUpdateInput
      >;
      /**
       * Choose, which VerificationToken to update.
       */
      where: VerificationTokenWhereUniqueInput;
   };

   /**
    * VerificationToken updateMany
    */
   export type VerificationTokenUpdateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * The data used to update VerificationTokens.
       */
      data: XOR<
         VerificationTokenUpdateManyMutationInput,
         VerificationTokenUncheckedUpdateManyInput
      >;
      /**
       * Filter which VerificationTokens to update
       */
      where?: VerificationTokenWhereInput;
      /**
       * Limit how many VerificationTokens to update.
       */
      limit?: number;
   };

   /**
    * VerificationToken upsert
    */
   export type VerificationTokenUpsertArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the VerificationToken
       */
      select?: VerificationTokenSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the VerificationToken
       */
      omit?: VerificationTokenOmit<ExtArgs> | null;
      /**
       * The filter to search for the VerificationToken to update in case it exists.
       */
      where: VerificationTokenWhereUniqueInput;
      /**
       * In case the VerificationToken found by the `where` argument doesn't exist, create a new VerificationToken with this data.
       */
      create: XOR<
         VerificationTokenCreateInput,
         VerificationTokenUncheckedCreateInput
      >;
      /**
       * In case the VerificationToken was found with the provided `where` argument, update it with this data.
       */
      update: XOR<
         VerificationTokenUpdateInput,
         VerificationTokenUncheckedUpdateInput
      >;
   };

   /**
    * VerificationToken delete
    */
   export type VerificationTokenDeleteArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the VerificationToken
       */
      select?: VerificationTokenSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the VerificationToken
       */
      omit?: VerificationTokenOmit<ExtArgs> | null;
      /**
       * Filter which VerificationToken to delete.
       */
      where: VerificationTokenWhereUniqueInput;
   };

   /**
    * VerificationToken deleteMany
    */
   export type VerificationTokenDeleteManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Filter which VerificationTokens to delete
       */
      where?: VerificationTokenWhereInput;
      /**
       * Limit how many VerificationTokens to delete.
       */
      limit?: number;
   };

   /**
    * VerificationToken findRaw
    */
   export type VerificationTokenFindRawArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
       */
      filter?: InputJsonValue;
      /**
       * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
       */
      options?: InputJsonValue;
   };

   /**
    * VerificationToken aggregateRaw
    */
   export type VerificationTokenAggregateRawArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
       */
      pipeline?: InputJsonValue[];
      /**
       * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
       */
      options?: InputJsonValue;
   };

   /**
    * VerificationToken without action
    */
   export type VerificationTokenDefaultArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
   > = {
      /**
       * Select specific fields to fetch from the VerificationToken
       */
      select?: VerificationTokenSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the VerificationToken
       */
      omit?: VerificationTokenOmit<ExtArgs> | null;
   };

   /**
    * Enums
    */

   export const UserScalarFieldEnum: {
      id: 'id';
      name: 'name';
      email: 'email';
      emailVerified: 'emailVerified';
      password: 'password';
      image: 'image';
      createdAt: 'createdAt';
      updatedAt: 'updatedAt';
   };

   export type UserScalarFieldEnum =
      (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];

   export const AccountScalarFieldEnum: {
      id: 'id';
      userId: 'userId';
      type: 'type';
      provider: 'provider';
      providerAccountId: 'providerAccountId';
      refresh_token: 'refresh_token';
      access_token: 'access_token';
      expires_at: 'expires_at';
      token_type: 'token_type';
      scope: 'scope';
      id_token: 'id_token';
      session_state: 'session_state';
      createdAt: 'createdAt';
      updatedAt: 'updatedAt';
   };

   export type AccountScalarFieldEnum =
      (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum];

   export const SessionScalarFieldEnum: {
      id: 'id';
      sessionToken: 'sessionToken';
      userId: 'userId';
      expires: 'expires';
      createdAt: 'createdAt';
      updatedAt: 'updatedAt';
   };

   export type SessionScalarFieldEnum =
      (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];

   export const VerificationTokenScalarFieldEnum: {
      id: 'id';
      identifier: 'identifier';
      token: 'token';
      expires: 'expires';
   };

   export type VerificationTokenScalarFieldEnum =
      (typeof VerificationTokenScalarFieldEnum)[keyof typeof VerificationTokenScalarFieldEnum];

   export const SortOrder: {
      asc: 'asc';
      desc: 'desc';
   };

   export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

   export const QueryMode: {
      default: 'default';
      insensitive: 'insensitive';
   };

   export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

   /**
    * Field references
    */

   /**
    * Reference to a field of type 'String'
    */
   export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<
      $PrismaModel,
      'String'
   >;

   /**
    * Reference to a field of type 'String[]'
    */
   export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<
      $PrismaModel,
      'String[]'
   >;

   /**
    * Reference to a field of type 'DateTime'
    */
   export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
      $PrismaModel,
      'DateTime'
   >;

   /**
    * Reference to a field of type 'DateTime[]'
    */
   export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
      $PrismaModel,
      'DateTime[]'
   >;

   /**
    * Reference to a field of type 'Int'
    */
   export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<
      $PrismaModel,
      'Int'
   >;

   /**
    * Reference to a field of type 'Int[]'
    */
   export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<
      $PrismaModel,
      'Int[]'
   >;

   /**
    * Reference to a field of type 'Float'
    */
   export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<
      $PrismaModel,
      'Float'
   >;

   /**
    * Reference to a field of type 'Float[]'
    */
   export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<
      $PrismaModel,
      'Float[]'
   >;

   /**
    * Deep Input Types
    */

   export type UserWhereInput = {
      AND?: UserWhereInput | UserWhereInput[];
      OR?: UserWhereInput[];
      NOT?: UserWhereInput | UserWhereInput[];
      id?: StringFilter<'User'> | string;
      name?: StringNullableFilter<'User'> | string | null;
      email?: StringNullableFilter<'User'> | string | null;
      emailVerified?: DateTimeNullableFilter<'User'> | Date | string | null;
      password?: StringNullableFilter<'User'> | string | null;
      image?: StringNullableFilter<'User'> | string | null;
      createdAt?: DateTimeFilter<'User'> | Date | string;
      updatedAt?: DateTimeFilter<'User'> | Date | string;
      accounts?: AccountListRelationFilter;
      sessions?: SessionListRelationFilter;
   };

   export type UserOrderByWithRelationInput = {
      id?: SortOrder;
      name?: SortOrder;
      email?: SortOrder;
      emailVerified?: SortOrder;
      password?: SortOrder;
      image?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      accounts?: AccountOrderByRelationAggregateInput;
      sessions?: SessionOrderByRelationAggregateInput;
   };

   export type UserWhereUniqueInput = Prisma.AtLeast<
      {
         id?: string;
         email?: string;
         AND?: UserWhereInput | UserWhereInput[];
         OR?: UserWhereInput[];
         NOT?: UserWhereInput | UserWhereInput[];
         name?: StringNullableFilter<'User'> | string | null;
         emailVerified?: DateTimeNullableFilter<'User'> | Date | string | null;
         password?: StringNullableFilter<'User'> | string | null;
         image?: StringNullableFilter<'User'> | string | null;
         createdAt?: DateTimeFilter<'User'> | Date | string;
         updatedAt?: DateTimeFilter<'User'> | Date | string;
         accounts?: AccountListRelationFilter;
         sessions?: SessionListRelationFilter;
      },
      'id' | 'email'
   >;

   export type UserOrderByWithAggregationInput = {
      id?: SortOrder;
      name?: SortOrder;
      email?: SortOrder;
      emailVerified?: SortOrder;
      password?: SortOrder;
      image?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      _count?: UserCountOrderByAggregateInput;
      _max?: UserMaxOrderByAggregateInput;
      _min?: UserMinOrderByAggregateInput;
   };

   export type UserScalarWhereWithAggregatesInput = {
      AND?:
         | UserScalarWhereWithAggregatesInput
         | UserScalarWhereWithAggregatesInput[];
      OR?: UserScalarWhereWithAggregatesInput[];
      NOT?:
         | UserScalarWhereWithAggregatesInput
         | UserScalarWhereWithAggregatesInput[];
      id?: StringWithAggregatesFilter<'User'> | string;
      name?: StringNullableWithAggregatesFilter<'User'> | string | null;
      email?: StringNullableWithAggregatesFilter<'User'> | string | null;
      emailVerified?:
         | DateTimeNullableWithAggregatesFilter<'User'>
         | Date
         | string
         | null;
      password?: StringNullableWithAggregatesFilter<'User'> | string | null;
      image?: StringNullableWithAggregatesFilter<'User'> | string | null;
      createdAt?: DateTimeWithAggregatesFilter<'User'> | Date | string;
      updatedAt?: DateTimeWithAggregatesFilter<'User'> | Date | string;
   };

   export type AccountWhereInput = {
      AND?: AccountWhereInput | AccountWhereInput[];
      OR?: AccountWhereInput[];
      NOT?: AccountWhereInput | AccountWhereInput[];
      id?: StringFilter<'Account'> | string;
      userId?: StringFilter<'Account'> | string;
      type?: StringFilter<'Account'> | string;
      provider?: StringFilter<'Account'> | string;
      providerAccountId?: StringFilter<'Account'> | string;
      refresh_token?: StringNullableFilter<'Account'> | string | null;
      access_token?: StringNullableFilter<'Account'> | string | null;
      expires_at?: IntNullableFilter<'Account'> | number | null;
      token_type?: StringNullableFilter<'Account'> | string | null;
      scope?: StringNullableFilter<'Account'> | string | null;
      id_token?: StringNullableFilter<'Account'> | string | null;
      session_state?: StringNullableFilter<'Account'> | string | null;
      createdAt?: DateTimeFilter<'Account'> | Date | string;
      updatedAt?: DateTimeFilter<'Account'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
   };

   export type AccountOrderByWithRelationInput = {
      id?: SortOrder;
      userId?: SortOrder;
      type?: SortOrder;
      provider?: SortOrder;
      providerAccountId?: SortOrder;
      refresh_token?: SortOrder;
      access_token?: SortOrder;
      expires_at?: SortOrder;
      token_type?: SortOrder;
      scope?: SortOrder;
      id_token?: SortOrder;
      session_state?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      user?: UserOrderByWithRelationInput;
   };

   export type AccountWhereUniqueInput = Prisma.AtLeast<
      {
         id?: string;
         provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput;
         AND?: AccountWhereInput | AccountWhereInput[];
         OR?: AccountWhereInput[];
         NOT?: AccountWhereInput | AccountWhereInput[];
         userId?: StringFilter<'Account'> | string;
         type?: StringFilter<'Account'> | string;
         provider?: StringFilter<'Account'> | string;
         providerAccountId?: StringFilter<'Account'> | string;
         refresh_token?: StringNullableFilter<'Account'> | string | null;
         access_token?: StringNullableFilter<'Account'> | string | null;
         expires_at?: IntNullableFilter<'Account'> | number | null;
         token_type?: StringNullableFilter<'Account'> | string | null;
         scope?: StringNullableFilter<'Account'> | string | null;
         id_token?: StringNullableFilter<'Account'> | string | null;
         session_state?: StringNullableFilter<'Account'> | string | null;
         createdAt?: DateTimeFilter<'Account'> | Date | string;
         updatedAt?: DateTimeFilter<'Account'> | Date | string;
         user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      },
      'id' | 'provider_providerAccountId'
   >;

   export type AccountOrderByWithAggregationInput = {
      id?: SortOrder;
      userId?: SortOrder;
      type?: SortOrder;
      provider?: SortOrder;
      providerAccountId?: SortOrder;
      refresh_token?: SortOrder;
      access_token?: SortOrder;
      expires_at?: SortOrder;
      token_type?: SortOrder;
      scope?: SortOrder;
      id_token?: SortOrder;
      session_state?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      _count?: AccountCountOrderByAggregateInput;
      _avg?: AccountAvgOrderByAggregateInput;
      _max?: AccountMaxOrderByAggregateInput;
      _min?: AccountMinOrderByAggregateInput;
      _sum?: AccountSumOrderByAggregateInput;
   };

   export type AccountScalarWhereWithAggregatesInput = {
      AND?:
         | AccountScalarWhereWithAggregatesInput
         | AccountScalarWhereWithAggregatesInput[];
      OR?: AccountScalarWhereWithAggregatesInput[];
      NOT?:
         | AccountScalarWhereWithAggregatesInput
         | AccountScalarWhereWithAggregatesInput[];
      id?: StringWithAggregatesFilter<'Account'> | string;
      userId?: StringWithAggregatesFilter<'Account'> | string;
      type?: StringWithAggregatesFilter<'Account'> | string;
      provider?: StringWithAggregatesFilter<'Account'> | string;
      providerAccountId?: StringWithAggregatesFilter<'Account'> | string;
      refresh_token?:
         | StringNullableWithAggregatesFilter<'Account'>
         | string
         | null;
      access_token?:
         | StringNullableWithAggregatesFilter<'Account'>
         | string
         | null;
      expires_at?: IntNullableWithAggregatesFilter<'Account'> | number | null;
      token_type?:
         | StringNullableWithAggregatesFilter<'Account'>
         | string
         | null;
      scope?: StringNullableWithAggregatesFilter<'Account'> | string | null;
      id_token?: StringNullableWithAggregatesFilter<'Account'> | string | null;
      session_state?:
         | StringNullableWithAggregatesFilter<'Account'>
         | string
         | null;
      createdAt?: DateTimeWithAggregatesFilter<'Account'> | Date | string;
      updatedAt?: DateTimeWithAggregatesFilter<'Account'> | Date | string;
   };

   export type SessionWhereInput = {
      AND?: SessionWhereInput | SessionWhereInput[];
      OR?: SessionWhereInput[];
      NOT?: SessionWhereInput | SessionWhereInput[];
      id?: StringFilter<'Session'> | string;
      sessionToken?: StringFilter<'Session'> | string;
      userId?: StringFilter<'Session'> | string;
      expires?: DateTimeFilter<'Session'> | Date | string;
      createdAt?: DateTimeFilter<'Session'> | Date | string;
      updatedAt?: DateTimeFilter<'Session'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
   };

   export type SessionOrderByWithRelationInput = {
      id?: SortOrder;
      sessionToken?: SortOrder;
      userId?: SortOrder;
      expires?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      user?: UserOrderByWithRelationInput;
   };

   export type SessionWhereUniqueInput = Prisma.AtLeast<
      {
         id?: string;
         sessionToken?: string;
         AND?: SessionWhereInput | SessionWhereInput[];
         OR?: SessionWhereInput[];
         NOT?: SessionWhereInput | SessionWhereInput[];
         userId?: StringFilter<'Session'> | string;
         expires?: DateTimeFilter<'Session'> | Date | string;
         createdAt?: DateTimeFilter<'Session'> | Date | string;
         updatedAt?: DateTimeFilter<'Session'> | Date | string;
         user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      },
      'id' | 'sessionToken'
   >;

   export type SessionOrderByWithAggregationInput = {
      id?: SortOrder;
      sessionToken?: SortOrder;
      userId?: SortOrder;
      expires?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      _count?: SessionCountOrderByAggregateInput;
      _max?: SessionMaxOrderByAggregateInput;
      _min?: SessionMinOrderByAggregateInput;
   };

   export type SessionScalarWhereWithAggregatesInput = {
      AND?:
         | SessionScalarWhereWithAggregatesInput
         | SessionScalarWhereWithAggregatesInput[];
      OR?: SessionScalarWhereWithAggregatesInput[];
      NOT?:
         | SessionScalarWhereWithAggregatesInput
         | SessionScalarWhereWithAggregatesInput[];
      id?: StringWithAggregatesFilter<'Session'> | string;
      sessionToken?: StringWithAggregatesFilter<'Session'> | string;
      userId?: StringWithAggregatesFilter<'Session'> | string;
      expires?: DateTimeWithAggregatesFilter<'Session'> | Date | string;
      createdAt?: DateTimeWithAggregatesFilter<'Session'> | Date | string;
      updatedAt?: DateTimeWithAggregatesFilter<'Session'> | Date | string;
   };

   export type VerificationTokenWhereInput = {
      AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[];
      OR?: VerificationTokenWhereInput[];
      NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[];
      id?: StringFilter<'VerificationToken'> | string;
      identifier?: StringFilter<'VerificationToken'> | string;
      token?: StringFilter<'VerificationToken'> | string;
      expires?: DateTimeFilter<'VerificationToken'> | Date | string;
   };

   export type VerificationTokenOrderByWithRelationInput = {
      id?: SortOrder;
      identifier?: SortOrder;
      token?: SortOrder;
      expires?: SortOrder;
   };

   export type VerificationTokenWhereUniqueInput = Prisma.AtLeast<
      {
         id?: string;
         identifier_token?: VerificationTokenIdentifierTokenCompoundUniqueInput;
         AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[];
         OR?: VerificationTokenWhereInput[];
         NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[];
         identifier?: StringFilter<'VerificationToken'> | string;
         token?: StringFilter<'VerificationToken'> | string;
         expires?: DateTimeFilter<'VerificationToken'> | Date | string;
      },
      'id' | 'identifier_token'
   >;

   export type VerificationTokenOrderByWithAggregationInput = {
      id?: SortOrder;
      identifier?: SortOrder;
      token?: SortOrder;
      expires?: SortOrder;
      _count?: VerificationTokenCountOrderByAggregateInput;
      _max?: VerificationTokenMaxOrderByAggregateInput;
      _min?: VerificationTokenMinOrderByAggregateInput;
   };

   export type VerificationTokenScalarWhereWithAggregatesInput = {
      AND?:
         | VerificationTokenScalarWhereWithAggregatesInput
         | VerificationTokenScalarWhereWithAggregatesInput[];
      OR?: VerificationTokenScalarWhereWithAggregatesInput[];
      NOT?:
         | VerificationTokenScalarWhereWithAggregatesInput
         | VerificationTokenScalarWhereWithAggregatesInput[];
      id?: StringWithAggregatesFilter<'VerificationToken'> | string;
      identifier?: StringWithAggregatesFilter<'VerificationToken'> | string;
      token?: StringWithAggregatesFilter<'VerificationToken'> | string;
      expires?:
         | DateTimeWithAggregatesFilter<'VerificationToken'>
         | Date
         | string;
   };

   export type UserCreateInput = {
      id?: string;
      name?: string | null;
      email?: string | null;
      emailVerified?: Date | string | null;
      password?: string | null;
      image?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      accounts?: AccountCreateNestedManyWithoutUserInput;
      sessions?: SessionCreateNestedManyWithoutUserInput;
   };

   export type UserUncheckedCreateInput = {
      id?: string;
      name?: string | null;
      email?: string | null;
      emailVerified?: Date | string | null;
      password?: string | null;
      image?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
      sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
   };

   export type UserUpdateInput = {
      name?: NullableStringFieldUpdateOperationsInput | string | null;
      email?: NullableStringFieldUpdateOperationsInput | string | null;
      emailVerified?:
         | NullableDateTimeFieldUpdateOperationsInput
         | Date
         | string
         | null;
      password?: NullableStringFieldUpdateOperationsInput | string | null;
      image?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      accounts?: AccountUpdateManyWithoutUserNestedInput;
      sessions?: SessionUpdateManyWithoutUserNestedInput;
   };

   export type UserUncheckedUpdateInput = {
      name?: NullableStringFieldUpdateOperationsInput | string | null;
      email?: NullableStringFieldUpdateOperationsInput | string | null;
      emailVerified?:
         | NullableDateTimeFieldUpdateOperationsInput
         | Date
         | string
         | null;
      password?: NullableStringFieldUpdateOperationsInput | string | null;
      image?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
      sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
   };

   export type UserCreateManyInput = {
      id?: string;
      name?: string | null;
      email?: string | null;
      emailVerified?: Date | string | null;
      password?: string | null;
      image?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
   };

   export type UserUpdateManyMutationInput = {
      name?: NullableStringFieldUpdateOperationsInput | string | null;
      email?: NullableStringFieldUpdateOperationsInput | string | null;
      emailVerified?:
         | NullableDateTimeFieldUpdateOperationsInput
         | Date
         | string
         | null;
      password?: NullableStringFieldUpdateOperationsInput | string | null;
      image?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type UserUncheckedUpdateManyInput = {
      name?: NullableStringFieldUpdateOperationsInput | string | null;
      email?: NullableStringFieldUpdateOperationsInput | string | null;
      emailVerified?:
         | NullableDateTimeFieldUpdateOperationsInput
         | Date
         | string
         | null;
      password?: NullableStringFieldUpdateOperationsInput | string | null;
      image?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type AccountCreateInput = {
      id?: string;
      type: string;
      provider: string;
      providerAccountId: string;
      refresh_token?: string | null;
      access_token?: string | null;
      expires_at?: number | null;
      token_type?: string | null;
      scope?: string | null;
      id_token?: string | null;
      session_state?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      user: UserCreateNestedOneWithoutAccountsInput;
   };

   export type AccountUncheckedCreateInput = {
      id?: string;
      userId: string;
      type: string;
      provider: string;
      providerAccountId: string;
      refresh_token?: string | null;
      access_token?: string | null;
      expires_at?: number | null;
      token_type?: string | null;
      scope?: string | null;
      id_token?: string | null;
      session_state?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
   };

   export type AccountUpdateInput = {
      type?: StringFieldUpdateOperationsInput | string;
      provider?: StringFieldUpdateOperationsInput | string;
      providerAccountId?: StringFieldUpdateOperationsInput | string;
      refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
      access_token?: NullableStringFieldUpdateOperationsInput | string | null;
      expires_at?: NullableIntFieldUpdateOperationsInput | number | null;
      token_type?: NullableStringFieldUpdateOperationsInput | string | null;
      scope?: NullableStringFieldUpdateOperationsInput | string | null;
      id_token?: NullableStringFieldUpdateOperationsInput | string | null;
      session_state?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      user?: UserUpdateOneRequiredWithoutAccountsNestedInput;
   };

   export type AccountUncheckedUpdateInput = {
      userId?: StringFieldUpdateOperationsInput | string;
      type?: StringFieldUpdateOperationsInput | string;
      provider?: StringFieldUpdateOperationsInput | string;
      providerAccountId?: StringFieldUpdateOperationsInput | string;
      refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
      access_token?: NullableStringFieldUpdateOperationsInput | string | null;
      expires_at?: NullableIntFieldUpdateOperationsInput | number | null;
      token_type?: NullableStringFieldUpdateOperationsInput | string | null;
      scope?: NullableStringFieldUpdateOperationsInput | string | null;
      id_token?: NullableStringFieldUpdateOperationsInput | string | null;
      session_state?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type AccountCreateManyInput = {
      id?: string;
      userId: string;
      type: string;
      provider: string;
      providerAccountId: string;
      refresh_token?: string | null;
      access_token?: string | null;
      expires_at?: number | null;
      token_type?: string | null;
      scope?: string | null;
      id_token?: string | null;
      session_state?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
   };

   export type AccountUpdateManyMutationInput = {
      type?: StringFieldUpdateOperationsInput | string;
      provider?: StringFieldUpdateOperationsInput | string;
      providerAccountId?: StringFieldUpdateOperationsInput | string;
      refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
      access_token?: NullableStringFieldUpdateOperationsInput | string | null;
      expires_at?: NullableIntFieldUpdateOperationsInput | number | null;
      token_type?: NullableStringFieldUpdateOperationsInput | string | null;
      scope?: NullableStringFieldUpdateOperationsInput | string | null;
      id_token?: NullableStringFieldUpdateOperationsInput | string | null;
      session_state?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type AccountUncheckedUpdateManyInput = {
      userId?: StringFieldUpdateOperationsInput | string;
      type?: StringFieldUpdateOperationsInput | string;
      provider?: StringFieldUpdateOperationsInput | string;
      providerAccountId?: StringFieldUpdateOperationsInput | string;
      refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
      access_token?: NullableStringFieldUpdateOperationsInput | string | null;
      expires_at?: NullableIntFieldUpdateOperationsInput | number | null;
      token_type?: NullableStringFieldUpdateOperationsInput | string | null;
      scope?: NullableStringFieldUpdateOperationsInput | string | null;
      id_token?: NullableStringFieldUpdateOperationsInput | string | null;
      session_state?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type SessionCreateInput = {
      id?: string;
      sessionToken: string;
      expires: Date | string;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      user: UserCreateNestedOneWithoutSessionsInput;
   };

   export type SessionUncheckedCreateInput = {
      id?: string;
      sessionToken: string;
      userId: string;
      expires: Date | string;
      createdAt?: Date | string;
      updatedAt?: Date | string;
   };

   export type SessionUpdateInput = {
      sessionToken?: StringFieldUpdateOperationsInput | string;
      expires?: DateTimeFieldUpdateOperationsInput | Date | string;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      user?: UserUpdateOneRequiredWithoutSessionsNestedInput;
   };

   export type SessionUncheckedUpdateInput = {
      sessionToken?: StringFieldUpdateOperationsInput | string;
      userId?: StringFieldUpdateOperationsInput | string;
      expires?: DateTimeFieldUpdateOperationsInput | Date | string;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type SessionCreateManyInput = {
      id?: string;
      sessionToken: string;
      userId: string;
      expires: Date | string;
      createdAt?: Date | string;
      updatedAt?: Date | string;
   };

   export type SessionUpdateManyMutationInput = {
      sessionToken?: StringFieldUpdateOperationsInput | string;
      expires?: DateTimeFieldUpdateOperationsInput | Date | string;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type SessionUncheckedUpdateManyInput = {
      sessionToken?: StringFieldUpdateOperationsInput | string;
      userId?: StringFieldUpdateOperationsInput | string;
      expires?: DateTimeFieldUpdateOperationsInput | Date | string;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type VerificationTokenCreateInput = {
      id?: string;
      identifier: string;
      token: string;
      expires: Date | string;
   };

   export type VerificationTokenUncheckedCreateInput = {
      id?: string;
      identifier: string;
      token: string;
      expires: Date | string;
   };

   export type VerificationTokenUpdateInput = {
      identifier?: StringFieldUpdateOperationsInput | string;
      token?: StringFieldUpdateOperationsInput | string;
      expires?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type VerificationTokenUncheckedUpdateInput = {
      identifier?: StringFieldUpdateOperationsInput | string;
      token?: StringFieldUpdateOperationsInput | string;
      expires?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type VerificationTokenCreateManyInput = {
      id?: string;
      identifier: string;
      token: string;
      expires: Date | string;
   };

   export type VerificationTokenUpdateManyMutationInput = {
      identifier?: StringFieldUpdateOperationsInput | string;
      token?: StringFieldUpdateOperationsInput | string;
      expires?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type VerificationTokenUncheckedUpdateManyInput = {
      identifier?: StringFieldUpdateOperationsInput | string;
      token?: StringFieldUpdateOperationsInput | string;
      expires?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type StringFilter<$PrismaModel = never> = {
      equals?: string | StringFieldRefInput<$PrismaModel>;
      in?: string[] | ListStringFieldRefInput<$PrismaModel>;
      notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
      lt?: string | StringFieldRefInput<$PrismaModel>;
      lte?: string | StringFieldRefInput<$PrismaModel>;
      gt?: string | StringFieldRefInput<$PrismaModel>;
      gte?: string | StringFieldRefInput<$PrismaModel>;
      contains?: string | StringFieldRefInput<$PrismaModel>;
      startsWith?: string | StringFieldRefInput<$PrismaModel>;
      endsWith?: string | StringFieldRefInput<$PrismaModel>;
      mode?: QueryMode;
      not?: NestedStringFilter<$PrismaModel> | string;
   };

   export type StringNullableFilter<$PrismaModel = never> = {
      equals?: string | StringFieldRefInput<$PrismaModel> | null;
      in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
      notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
      lt?: string | StringFieldRefInput<$PrismaModel>;
      lte?: string | StringFieldRefInput<$PrismaModel>;
      gt?: string | StringFieldRefInput<$PrismaModel>;
      gte?: string | StringFieldRefInput<$PrismaModel>;
      contains?: string | StringFieldRefInput<$PrismaModel>;
      startsWith?: string | StringFieldRefInput<$PrismaModel>;
      endsWith?: string | StringFieldRefInput<$PrismaModel>;
      mode?: QueryMode;
      not?: NestedStringNullableFilter<$PrismaModel> | string | null;
      isSet?: boolean;
   };

   export type DateTimeNullableFilter<$PrismaModel = never> = {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
      notIn?:
         | Date[]
         | string[]
         | ListDateTimeFieldRefInput<$PrismaModel>
         | null;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
      isSet?: boolean;
   };

   export type DateTimeFilter<$PrismaModel = never> = {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
      notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
   };

   export type AccountListRelationFilter = {
      every?: AccountWhereInput;
      some?: AccountWhereInput;
      none?: AccountWhereInput;
   };

   export type SessionListRelationFilter = {
      every?: SessionWhereInput;
      some?: SessionWhereInput;
      none?: SessionWhereInput;
   };

   export type AccountOrderByRelationAggregateInput = {
      _count?: SortOrder;
   };

   export type SessionOrderByRelationAggregateInput = {
      _count?: SortOrder;
   };

   export type UserCountOrderByAggregateInput = {
      id?: SortOrder;
      name?: SortOrder;
      email?: SortOrder;
      emailVerified?: SortOrder;
      password?: SortOrder;
      image?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
   };

   export type UserMaxOrderByAggregateInput = {
      id?: SortOrder;
      name?: SortOrder;
      email?: SortOrder;
      emailVerified?: SortOrder;
      password?: SortOrder;
      image?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
   };

   export type UserMinOrderByAggregateInput = {
      id?: SortOrder;
      name?: SortOrder;
      email?: SortOrder;
      emailVerified?: SortOrder;
      password?: SortOrder;
      image?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
   };

   export type StringWithAggregatesFilter<$PrismaModel = never> = {
      equals?: string | StringFieldRefInput<$PrismaModel>;
      in?: string[] | ListStringFieldRefInput<$PrismaModel>;
      notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
      lt?: string | StringFieldRefInput<$PrismaModel>;
      lte?: string | StringFieldRefInput<$PrismaModel>;
      gt?: string | StringFieldRefInput<$PrismaModel>;
      gte?: string | StringFieldRefInput<$PrismaModel>;
      contains?: string | StringFieldRefInput<$PrismaModel>;
      startsWith?: string | StringFieldRefInput<$PrismaModel>;
      endsWith?: string | StringFieldRefInput<$PrismaModel>;
      mode?: QueryMode;
      not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedStringFilter<$PrismaModel>;
      _max?: NestedStringFilter<$PrismaModel>;
   };

   export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
      equals?: string | StringFieldRefInput<$PrismaModel> | null;
      in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
      notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
      lt?: string | StringFieldRefInput<$PrismaModel>;
      lte?: string | StringFieldRefInput<$PrismaModel>;
      gt?: string | StringFieldRefInput<$PrismaModel>;
      gte?: string | StringFieldRefInput<$PrismaModel>;
      contains?: string | StringFieldRefInput<$PrismaModel>;
      startsWith?: string | StringFieldRefInput<$PrismaModel>;
      endsWith?: string | StringFieldRefInput<$PrismaModel>;
      mode?: QueryMode;
      not?:
         | NestedStringNullableWithAggregatesFilter<$PrismaModel>
         | string
         | null;
      _count?: NestedIntNullableFilter<$PrismaModel>;
      _min?: NestedStringNullableFilter<$PrismaModel>;
      _max?: NestedStringNullableFilter<$PrismaModel>;
      isSet?: boolean;
   };

   export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
      notIn?:
         | Date[]
         | string[]
         | ListDateTimeFieldRefInput<$PrismaModel>
         | null;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?:
         | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
         | Date
         | string
         | null;
      _count?: NestedIntNullableFilter<$PrismaModel>;
      _min?: NestedDateTimeNullableFilter<$PrismaModel>;
      _max?: NestedDateTimeNullableFilter<$PrismaModel>;
      isSet?: boolean;
   };

   export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
      notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedDateTimeFilter<$PrismaModel>;
      _max?: NestedDateTimeFilter<$PrismaModel>;
   };

   export type IntNullableFilter<$PrismaModel = never> = {
      equals?: number | IntFieldRefInput<$PrismaModel> | null;
      in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
      notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
      lt?: number | IntFieldRefInput<$PrismaModel>;
      lte?: number | IntFieldRefInput<$PrismaModel>;
      gt?: number | IntFieldRefInput<$PrismaModel>;
      gte?: number | IntFieldRefInput<$PrismaModel>;
      not?: NestedIntNullableFilter<$PrismaModel> | number | null;
      isSet?: boolean;
   };

   export type UserScalarRelationFilter = {
      is?: UserWhereInput;
      isNot?: UserWhereInput;
   };

   export type AccountProviderProviderAccountIdCompoundUniqueInput = {
      provider: string;
      providerAccountId: string;
   };

   export type AccountCountOrderByAggregateInput = {
      id?: SortOrder;
      userId?: SortOrder;
      type?: SortOrder;
      provider?: SortOrder;
      providerAccountId?: SortOrder;
      refresh_token?: SortOrder;
      access_token?: SortOrder;
      expires_at?: SortOrder;
      token_type?: SortOrder;
      scope?: SortOrder;
      id_token?: SortOrder;
      session_state?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
   };

   export type AccountAvgOrderByAggregateInput = {
      expires_at?: SortOrder;
   };

   export type AccountMaxOrderByAggregateInput = {
      id?: SortOrder;
      userId?: SortOrder;
      type?: SortOrder;
      provider?: SortOrder;
      providerAccountId?: SortOrder;
      refresh_token?: SortOrder;
      access_token?: SortOrder;
      expires_at?: SortOrder;
      token_type?: SortOrder;
      scope?: SortOrder;
      id_token?: SortOrder;
      session_state?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
   };

   export type AccountMinOrderByAggregateInput = {
      id?: SortOrder;
      userId?: SortOrder;
      type?: SortOrder;
      provider?: SortOrder;
      providerAccountId?: SortOrder;
      refresh_token?: SortOrder;
      access_token?: SortOrder;
      expires_at?: SortOrder;
      token_type?: SortOrder;
      scope?: SortOrder;
      id_token?: SortOrder;
      session_state?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
   };

   export type AccountSumOrderByAggregateInput = {
      expires_at?: SortOrder;
   };

   export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
      equals?: number | IntFieldRefInput<$PrismaModel> | null;
      in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
      notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
      lt?: number | IntFieldRefInput<$PrismaModel>;
      lte?: number | IntFieldRefInput<$PrismaModel>;
      gt?: number | IntFieldRefInput<$PrismaModel>;
      gte?: number | IntFieldRefInput<$PrismaModel>;
      not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
      _count?: NestedIntNullableFilter<$PrismaModel>;
      _avg?: NestedFloatNullableFilter<$PrismaModel>;
      _sum?: NestedIntNullableFilter<$PrismaModel>;
      _min?: NestedIntNullableFilter<$PrismaModel>;
      _max?: NestedIntNullableFilter<$PrismaModel>;
      isSet?: boolean;
   };

   export type SessionCountOrderByAggregateInput = {
      id?: SortOrder;
      sessionToken?: SortOrder;
      userId?: SortOrder;
      expires?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
   };

   export type SessionMaxOrderByAggregateInput = {
      id?: SortOrder;
      sessionToken?: SortOrder;
      userId?: SortOrder;
      expires?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
   };

   export type SessionMinOrderByAggregateInput = {
      id?: SortOrder;
      sessionToken?: SortOrder;
      userId?: SortOrder;
      expires?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
   };

   export type VerificationTokenIdentifierTokenCompoundUniqueInput = {
      identifier: string;
      token: string;
   };

   export type VerificationTokenCountOrderByAggregateInput = {
      id?: SortOrder;
      identifier?: SortOrder;
      token?: SortOrder;
      expires?: SortOrder;
   };

   export type VerificationTokenMaxOrderByAggregateInput = {
      id?: SortOrder;
      identifier?: SortOrder;
      token?: SortOrder;
      expires?: SortOrder;
   };

   export type VerificationTokenMinOrderByAggregateInput = {
      id?: SortOrder;
      identifier?: SortOrder;
      token?: SortOrder;
      expires?: SortOrder;
   };

   export type AccountCreateNestedManyWithoutUserInput = {
      create?:
         | XOR<
              AccountCreateWithoutUserInput,
              AccountUncheckedCreateWithoutUserInput
           >
         | AccountCreateWithoutUserInput[]
         | AccountUncheckedCreateWithoutUserInput[];
      connectOrCreate?:
         | AccountCreateOrConnectWithoutUserInput
         | AccountCreateOrConnectWithoutUserInput[];
      createMany?: AccountCreateManyUserInputEnvelope;
      connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
   };

   export type SessionCreateNestedManyWithoutUserInput = {
      create?:
         | XOR<
              SessionCreateWithoutUserInput,
              SessionUncheckedCreateWithoutUserInput
           >
         | SessionCreateWithoutUserInput[]
         | SessionUncheckedCreateWithoutUserInput[];
      connectOrCreate?:
         | SessionCreateOrConnectWithoutUserInput
         | SessionCreateOrConnectWithoutUserInput[];
      createMany?: SessionCreateManyUserInputEnvelope;
      connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
   };

   export type AccountUncheckedCreateNestedManyWithoutUserInput = {
      create?:
         | XOR<
              AccountCreateWithoutUserInput,
              AccountUncheckedCreateWithoutUserInput
           >
         | AccountCreateWithoutUserInput[]
         | AccountUncheckedCreateWithoutUserInput[];
      connectOrCreate?:
         | AccountCreateOrConnectWithoutUserInput
         | AccountCreateOrConnectWithoutUserInput[];
      createMany?: AccountCreateManyUserInputEnvelope;
      connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
   };

   export type SessionUncheckedCreateNestedManyWithoutUserInput = {
      create?:
         | XOR<
              SessionCreateWithoutUserInput,
              SessionUncheckedCreateWithoutUserInput
           >
         | SessionCreateWithoutUserInput[]
         | SessionUncheckedCreateWithoutUserInput[];
      connectOrCreate?:
         | SessionCreateOrConnectWithoutUserInput
         | SessionCreateOrConnectWithoutUserInput[];
      createMany?: SessionCreateManyUserInputEnvelope;
      connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
   };

   export type NullableStringFieldUpdateOperationsInput = {
      set?: string | null;
      unset?: boolean;
   };

   export type NullableDateTimeFieldUpdateOperationsInput = {
      set?: Date | string | null;
      unset?: boolean;
   };

   export type DateTimeFieldUpdateOperationsInput = {
      set?: Date | string;
   };

   export type AccountUpdateManyWithoutUserNestedInput = {
      create?:
         | XOR<
              AccountCreateWithoutUserInput,
              AccountUncheckedCreateWithoutUserInput
           >
         | AccountCreateWithoutUserInput[]
         | AccountUncheckedCreateWithoutUserInput[];
      connectOrCreate?:
         | AccountCreateOrConnectWithoutUserInput
         | AccountCreateOrConnectWithoutUserInput[];
      upsert?:
         | AccountUpsertWithWhereUniqueWithoutUserInput
         | AccountUpsertWithWhereUniqueWithoutUserInput[];
      createMany?: AccountCreateManyUserInputEnvelope;
      set?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
      disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
      delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
      connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
      update?:
         | AccountUpdateWithWhereUniqueWithoutUserInput
         | AccountUpdateWithWhereUniqueWithoutUserInput[];
      updateMany?:
         | AccountUpdateManyWithWhereWithoutUserInput
         | AccountUpdateManyWithWhereWithoutUserInput[];
      deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[];
   };

   export type SessionUpdateManyWithoutUserNestedInput = {
      create?:
         | XOR<
              SessionCreateWithoutUserInput,
              SessionUncheckedCreateWithoutUserInput
           >
         | SessionCreateWithoutUserInput[]
         | SessionUncheckedCreateWithoutUserInput[];
      connectOrCreate?:
         | SessionCreateOrConnectWithoutUserInput
         | SessionCreateOrConnectWithoutUserInput[];
      upsert?:
         | SessionUpsertWithWhereUniqueWithoutUserInput
         | SessionUpsertWithWhereUniqueWithoutUserInput[];
      createMany?: SessionCreateManyUserInputEnvelope;
      set?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
      disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
      delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
      connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
      update?:
         | SessionUpdateWithWhereUniqueWithoutUserInput
         | SessionUpdateWithWhereUniqueWithoutUserInput[];
      updateMany?:
         | SessionUpdateManyWithWhereWithoutUserInput
         | SessionUpdateManyWithWhereWithoutUserInput[];
      deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[];
   };

   export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
      create?:
         | XOR<
              AccountCreateWithoutUserInput,
              AccountUncheckedCreateWithoutUserInput
           >
         | AccountCreateWithoutUserInput[]
         | AccountUncheckedCreateWithoutUserInput[];
      connectOrCreate?:
         | AccountCreateOrConnectWithoutUserInput
         | AccountCreateOrConnectWithoutUserInput[];
      upsert?:
         | AccountUpsertWithWhereUniqueWithoutUserInput
         | AccountUpsertWithWhereUniqueWithoutUserInput[];
      createMany?: AccountCreateManyUserInputEnvelope;
      set?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
      disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
      delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
      connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
      update?:
         | AccountUpdateWithWhereUniqueWithoutUserInput
         | AccountUpdateWithWhereUniqueWithoutUserInput[];
      updateMany?:
         | AccountUpdateManyWithWhereWithoutUserInput
         | AccountUpdateManyWithWhereWithoutUserInput[];
      deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[];
   };

   export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
      create?:
         | XOR<
              SessionCreateWithoutUserInput,
              SessionUncheckedCreateWithoutUserInput
           >
         | SessionCreateWithoutUserInput[]
         | SessionUncheckedCreateWithoutUserInput[];
      connectOrCreate?:
         | SessionCreateOrConnectWithoutUserInput
         | SessionCreateOrConnectWithoutUserInput[];
      upsert?:
         | SessionUpsertWithWhereUniqueWithoutUserInput
         | SessionUpsertWithWhereUniqueWithoutUserInput[];
      createMany?: SessionCreateManyUserInputEnvelope;
      set?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
      disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
      delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
      connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
      update?:
         | SessionUpdateWithWhereUniqueWithoutUserInput
         | SessionUpdateWithWhereUniqueWithoutUserInput[];
      updateMany?:
         | SessionUpdateManyWithWhereWithoutUserInput
         | SessionUpdateManyWithWhereWithoutUserInput[];
      deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[];
   };

   export type UserCreateNestedOneWithoutAccountsInput = {
      create?: XOR<
         UserCreateWithoutAccountsInput,
         UserUncheckedCreateWithoutAccountsInput
      >;
      connectOrCreate?: UserCreateOrConnectWithoutAccountsInput;
      connect?: UserWhereUniqueInput;
   };

   export type StringFieldUpdateOperationsInput = {
      set?: string;
   };

   export type NullableIntFieldUpdateOperationsInput = {
      set?: number | null;
      increment?: number;
      decrement?: number;
      multiply?: number;
      divide?: number;
      unset?: boolean;
   };

   export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
      create?: XOR<
         UserCreateWithoutAccountsInput,
         UserUncheckedCreateWithoutAccountsInput
      >;
      connectOrCreate?: UserCreateOrConnectWithoutAccountsInput;
      upsert?: UserUpsertWithoutAccountsInput;
      connect?: UserWhereUniqueInput;
      update?: XOR<
         XOR<
            UserUpdateToOneWithWhereWithoutAccountsInput,
            UserUpdateWithoutAccountsInput
         >,
         UserUncheckedUpdateWithoutAccountsInput
      >;
   };

   export type UserCreateNestedOneWithoutSessionsInput = {
      create?: XOR<
         UserCreateWithoutSessionsInput,
         UserUncheckedCreateWithoutSessionsInput
      >;
      connectOrCreate?: UserCreateOrConnectWithoutSessionsInput;
      connect?: UserWhereUniqueInput;
   };

   export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
      create?: XOR<
         UserCreateWithoutSessionsInput,
         UserUncheckedCreateWithoutSessionsInput
      >;
      connectOrCreate?: UserCreateOrConnectWithoutSessionsInput;
      upsert?: UserUpsertWithoutSessionsInput;
      connect?: UserWhereUniqueInput;
      update?: XOR<
         XOR<
            UserUpdateToOneWithWhereWithoutSessionsInput,
            UserUpdateWithoutSessionsInput
         >,
         UserUncheckedUpdateWithoutSessionsInput
      >;
   };

   export type NestedStringFilter<$PrismaModel = never> = {
      equals?: string | StringFieldRefInput<$PrismaModel>;
      in?: string[] | ListStringFieldRefInput<$PrismaModel>;
      notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
      lt?: string | StringFieldRefInput<$PrismaModel>;
      lte?: string | StringFieldRefInput<$PrismaModel>;
      gt?: string | StringFieldRefInput<$PrismaModel>;
      gte?: string | StringFieldRefInput<$PrismaModel>;
      contains?: string | StringFieldRefInput<$PrismaModel>;
      startsWith?: string | StringFieldRefInput<$PrismaModel>;
      endsWith?: string | StringFieldRefInput<$PrismaModel>;
      not?: NestedStringFilter<$PrismaModel> | string;
   };

   export type NestedStringNullableFilter<$PrismaModel = never> = {
      equals?: string | StringFieldRefInput<$PrismaModel> | null;
      in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
      notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
      lt?: string | StringFieldRefInput<$PrismaModel>;
      lte?: string | StringFieldRefInput<$PrismaModel>;
      gt?: string | StringFieldRefInput<$PrismaModel>;
      gte?: string | StringFieldRefInput<$PrismaModel>;
      contains?: string | StringFieldRefInput<$PrismaModel>;
      startsWith?: string | StringFieldRefInput<$PrismaModel>;
      endsWith?: string | StringFieldRefInput<$PrismaModel>;
      not?: NestedStringNullableFilter<$PrismaModel> | string | null;
      isSet?: boolean;
   };

   export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
      notIn?:
         | Date[]
         | string[]
         | ListDateTimeFieldRefInput<$PrismaModel>
         | null;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
      isSet?: boolean;
   };

   export type NestedDateTimeFilter<$PrismaModel = never> = {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
      notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
   };

   export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
      equals?: string | StringFieldRefInput<$PrismaModel>;
      in?: string[] | ListStringFieldRefInput<$PrismaModel>;
      notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
      lt?: string | StringFieldRefInput<$PrismaModel>;
      lte?: string | StringFieldRefInput<$PrismaModel>;
      gt?: string | StringFieldRefInput<$PrismaModel>;
      gte?: string | StringFieldRefInput<$PrismaModel>;
      contains?: string | StringFieldRefInput<$PrismaModel>;
      startsWith?: string | StringFieldRefInput<$PrismaModel>;
      endsWith?: string | StringFieldRefInput<$PrismaModel>;
      not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedStringFilter<$PrismaModel>;
      _max?: NestedStringFilter<$PrismaModel>;
   };

   export type NestedIntFilter<$PrismaModel = never> = {
      equals?: number | IntFieldRefInput<$PrismaModel>;
      in?: number[] | ListIntFieldRefInput<$PrismaModel>;
      notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
      lt?: number | IntFieldRefInput<$PrismaModel>;
      lte?: number | IntFieldRefInput<$PrismaModel>;
      gt?: number | IntFieldRefInput<$PrismaModel>;
      gte?: number | IntFieldRefInput<$PrismaModel>;
      not?: NestedIntFilter<$PrismaModel> | number;
   };

   export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> =
      {
         equals?: string | StringFieldRefInput<$PrismaModel> | null;
         in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
         notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
         lt?: string | StringFieldRefInput<$PrismaModel>;
         lte?: string | StringFieldRefInput<$PrismaModel>;
         gt?: string | StringFieldRefInput<$PrismaModel>;
         gte?: string | StringFieldRefInput<$PrismaModel>;
         contains?: string | StringFieldRefInput<$PrismaModel>;
         startsWith?: string | StringFieldRefInput<$PrismaModel>;
         endsWith?: string | StringFieldRefInput<$PrismaModel>;
         not?:
            | NestedStringNullableWithAggregatesFilter<$PrismaModel>
            | string
            | null;
         _count?: NestedIntNullableFilter<$PrismaModel>;
         _min?: NestedStringNullableFilter<$PrismaModel>;
         _max?: NestedStringNullableFilter<$PrismaModel>;
         isSet?: boolean;
      };

   export type NestedIntNullableFilter<$PrismaModel = never> = {
      equals?: number | IntFieldRefInput<$PrismaModel> | null;
      in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
      notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
      lt?: number | IntFieldRefInput<$PrismaModel>;
      lte?: number | IntFieldRefInput<$PrismaModel>;
      gt?: number | IntFieldRefInput<$PrismaModel>;
      gte?: number | IntFieldRefInput<$PrismaModel>;
      not?: NestedIntNullableFilter<$PrismaModel> | number | null;
      isSet?: boolean;
   };

   export type NestedDateTimeNullableWithAggregatesFilter<
      $PrismaModel = never
   > = {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
      notIn?:
         | Date[]
         | string[]
         | ListDateTimeFieldRefInput<$PrismaModel>
         | null;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?:
         | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
         | Date
         | string
         | null;
      _count?: NestedIntNullableFilter<$PrismaModel>;
      _min?: NestedDateTimeNullableFilter<$PrismaModel>;
      _max?: NestedDateTimeNullableFilter<$PrismaModel>;
      isSet?: boolean;
   };

   export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
      notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedDateTimeFilter<$PrismaModel>;
      _max?: NestedDateTimeFilter<$PrismaModel>;
   };

   export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
      equals?: number | IntFieldRefInput<$PrismaModel> | null;
      in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
      notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
      lt?: number | IntFieldRefInput<$PrismaModel>;
      lte?: number | IntFieldRefInput<$PrismaModel>;
      gt?: number | IntFieldRefInput<$PrismaModel>;
      gte?: number | IntFieldRefInput<$PrismaModel>;
      not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
      _count?: NestedIntNullableFilter<$PrismaModel>;
      _avg?: NestedFloatNullableFilter<$PrismaModel>;
      _sum?: NestedIntNullableFilter<$PrismaModel>;
      _min?: NestedIntNullableFilter<$PrismaModel>;
      _max?: NestedIntNullableFilter<$PrismaModel>;
      isSet?: boolean;
   };

   export type NestedFloatNullableFilter<$PrismaModel = never> = {
      equals?: number | FloatFieldRefInput<$PrismaModel> | null;
      in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
      notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
      lt?: number | FloatFieldRefInput<$PrismaModel>;
      lte?: number | FloatFieldRefInput<$PrismaModel>;
      gt?: number | FloatFieldRefInput<$PrismaModel>;
      gte?: number | FloatFieldRefInput<$PrismaModel>;
      not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
      isSet?: boolean;
   };

   export type AccountCreateWithoutUserInput = {
      id?: string;
      type: string;
      provider: string;
      providerAccountId: string;
      refresh_token?: string | null;
      access_token?: string | null;
      expires_at?: number | null;
      token_type?: string | null;
      scope?: string | null;
      id_token?: string | null;
      session_state?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
   };

   export type AccountUncheckedCreateWithoutUserInput = {
      id?: string;
      type: string;
      provider: string;
      providerAccountId: string;
      refresh_token?: string | null;
      access_token?: string | null;
      expires_at?: number | null;
      token_type?: string | null;
      scope?: string | null;
      id_token?: string | null;
      session_state?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
   };

   export type AccountCreateOrConnectWithoutUserInput = {
      where: AccountWhereUniqueInput;
      create: XOR<
         AccountCreateWithoutUserInput,
         AccountUncheckedCreateWithoutUserInput
      >;
   };

   export type AccountCreateManyUserInputEnvelope = {
      data: AccountCreateManyUserInput | AccountCreateManyUserInput[];
   };

   export type SessionCreateWithoutUserInput = {
      id?: string;
      sessionToken: string;
      expires: Date | string;
      createdAt?: Date | string;
      updatedAt?: Date | string;
   };

   export type SessionUncheckedCreateWithoutUserInput = {
      id?: string;
      sessionToken: string;
      expires: Date | string;
      createdAt?: Date | string;
      updatedAt?: Date | string;
   };

   export type SessionCreateOrConnectWithoutUserInput = {
      where: SessionWhereUniqueInput;
      create: XOR<
         SessionCreateWithoutUserInput,
         SessionUncheckedCreateWithoutUserInput
      >;
   };

   export type SessionCreateManyUserInputEnvelope = {
      data: SessionCreateManyUserInput | SessionCreateManyUserInput[];
   };

   export type AccountUpsertWithWhereUniqueWithoutUserInput = {
      where: AccountWhereUniqueInput;
      update: XOR<
         AccountUpdateWithoutUserInput,
         AccountUncheckedUpdateWithoutUserInput
      >;
      create: XOR<
         AccountCreateWithoutUserInput,
         AccountUncheckedCreateWithoutUserInput
      >;
   };

   export type AccountUpdateWithWhereUniqueWithoutUserInput = {
      where: AccountWhereUniqueInput;
      data: XOR<
         AccountUpdateWithoutUserInput,
         AccountUncheckedUpdateWithoutUserInput
      >;
   };

   export type AccountUpdateManyWithWhereWithoutUserInput = {
      where: AccountScalarWhereInput;
      data: XOR<
         AccountUpdateManyMutationInput,
         AccountUncheckedUpdateManyWithoutUserInput
      >;
   };

   export type AccountScalarWhereInput = {
      AND?: AccountScalarWhereInput | AccountScalarWhereInput[];
      OR?: AccountScalarWhereInput[];
      NOT?: AccountScalarWhereInput | AccountScalarWhereInput[];
      id?: StringFilter<'Account'> | string;
      userId?: StringFilter<'Account'> | string;
      type?: StringFilter<'Account'> | string;
      provider?: StringFilter<'Account'> | string;
      providerAccountId?: StringFilter<'Account'> | string;
      refresh_token?: StringNullableFilter<'Account'> | string | null;
      access_token?: StringNullableFilter<'Account'> | string | null;
      expires_at?: IntNullableFilter<'Account'> | number | null;
      token_type?: StringNullableFilter<'Account'> | string | null;
      scope?: StringNullableFilter<'Account'> | string | null;
      id_token?: StringNullableFilter<'Account'> | string | null;
      session_state?: StringNullableFilter<'Account'> | string | null;
      createdAt?: DateTimeFilter<'Account'> | Date | string;
      updatedAt?: DateTimeFilter<'Account'> | Date | string;
   };

   export type SessionUpsertWithWhereUniqueWithoutUserInput = {
      where: SessionWhereUniqueInput;
      update: XOR<
         SessionUpdateWithoutUserInput,
         SessionUncheckedUpdateWithoutUserInput
      >;
      create: XOR<
         SessionCreateWithoutUserInput,
         SessionUncheckedCreateWithoutUserInput
      >;
   };

   export type SessionUpdateWithWhereUniqueWithoutUserInput = {
      where: SessionWhereUniqueInput;
      data: XOR<
         SessionUpdateWithoutUserInput,
         SessionUncheckedUpdateWithoutUserInput
      >;
   };

   export type SessionUpdateManyWithWhereWithoutUserInput = {
      where: SessionScalarWhereInput;
      data: XOR<
         SessionUpdateManyMutationInput,
         SessionUncheckedUpdateManyWithoutUserInput
      >;
   };

   export type SessionScalarWhereInput = {
      AND?: SessionScalarWhereInput | SessionScalarWhereInput[];
      OR?: SessionScalarWhereInput[];
      NOT?: SessionScalarWhereInput | SessionScalarWhereInput[];
      id?: StringFilter<'Session'> | string;
      sessionToken?: StringFilter<'Session'> | string;
      userId?: StringFilter<'Session'> | string;
      expires?: DateTimeFilter<'Session'> | Date | string;
      createdAt?: DateTimeFilter<'Session'> | Date | string;
      updatedAt?: DateTimeFilter<'Session'> | Date | string;
   };

   export type UserCreateWithoutAccountsInput = {
      id?: string;
      name?: string | null;
      email?: string | null;
      emailVerified?: Date | string | null;
      password?: string | null;
      image?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      sessions?: SessionCreateNestedManyWithoutUserInput;
   };

   export type UserUncheckedCreateWithoutAccountsInput = {
      id?: string;
      name?: string | null;
      email?: string | null;
      emailVerified?: Date | string | null;
      password?: string | null;
      image?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
   };

   export type UserCreateOrConnectWithoutAccountsInput = {
      where: UserWhereUniqueInput;
      create: XOR<
         UserCreateWithoutAccountsInput,
         UserUncheckedCreateWithoutAccountsInput
      >;
   };

   export type UserUpsertWithoutAccountsInput = {
      update: XOR<
         UserUpdateWithoutAccountsInput,
         UserUncheckedUpdateWithoutAccountsInput
      >;
      create: XOR<
         UserCreateWithoutAccountsInput,
         UserUncheckedCreateWithoutAccountsInput
      >;
      where?: UserWhereInput;
   };

   export type UserUpdateToOneWithWhereWithoutAccountsInput = {
      where?: UserWhereInput;
      data: XOR<
         UserUpdateWithoutAccountsInput,
         UserUncheckedUpdateWithoutAccountsInput
      >;
   };

   export type UserUpdateWithoutAccountsInput = {
      name?: NullableStringFieldUpdateOperationsInput | string | null;
      email?: NullableStringFieldUpdateOperationsInput | string | null;
      emailVerified?:
         | NullableDateTimeFieldUpdateOperationsInput
         | Date
         | string
         | null;
      password?: NullableStringFieldUpdateOperationsInput | string | null;
      image?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      sessions?: SessionUpdateManyWithoutUserNestedInput;
   };

   export type UserUncheckedUpdateWithoutAccountsInput = {
      name?: NullableStringFieldUpdateOperationsInput | string | null;
      email?: NullableStringFieldUpdateOperationsInput | string | null;
      emailVerified?:
         | NullableDateTimeFieldUpdateOperationsInput
         | Date
         | string
         | null;
      password?: NullableStringFieldUpdateOperationsInput | string | null;
      image?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
   };

   export type UserCreateWithoutSessionsInput = {
      id?: string;
      name?: string | null;
      email?: string | null;
      emailVerified?: Date | string | null;
      password?: string | null;
      image?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      accounts?: AccountCreateNestedManyWithoutUserInput;
   };

   export type UserUncheckedCreateWithoutSessionsInput = {
      id?: string;
      name?: string | null;
      email?: string | null;
      emailVerified?: Date | string | null;
      password?: string | null;
      image?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
   };

   export type UserCreateOrConnectWithoutSessionsInput = {
      where: UserWhereUniqueInput;
      create: XOR<
         UserCreateWithoutSessionsInput,
         UserUncheckedCreateWithoutSessionsInput
      >;
   };

   export type UserUpsertWithoutSessionsInput = {
      update: XOR<
         UserUpdateWithoutSessionsInput,
         UserUncheckedUpdateWithoutSessionsInput
      >;
      create: XOR<
         UserCreateWithoutSessionsInput,
         UserUncheckedCreateWithoutSessionsInput
      >;
      where?: UserWhereInput;
   };

   export type UserUpdateToOneWithWhereWithoutSessionsInput = {
      where?: UserWhereInput;
      data: XOR<
         UserUpdateWithoutSessionsInput,
         UserUncheckedUpdateWithoutSessionsInput
      >;
   };

   export type UserUpdateWithoutSessionsInput = {
      name?: NullableStringFieldUpdateOperationsInput | string | null;
      email?: NullableStringFieldUpdateOperationsInput | string | null;
      emailVerified?:
         | NullableDateTimeFieldUpdateOperationsInput
         | Date
         | string
         | null;
      password?: NullableStringFieldUpdateOperationsInput | string | null;
      image?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      accounts?: AccountUpdateManyWithoutUserNestedInput;
   };

   export type UserUncheckedUpdateWithoutSessionsInput = {
      name?: NullableStringFieldUpdateOperationsInput | string | null;
      email?: NullableStringFieldUpdateOperationsInput | string | null;
      emailVerified?:
         | NullableDateTimeFieldUpdateOperationsInput
         | Date
         | string
         | null;
      password?: NullableStringFieldUpdateOperationsInput | string | null;
      image?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
   };

   export type AccountCreateManyUserInput = {
      id?: string;
      type: string;
      provider: string;
      providerAccountId: string;
      refresh_token?: string | null;
      access_token?: string | null;
      expires_at?: number | null;
      token_type?: string | null;
      scope?: string | null;
      id_token?: string | null;
      session_state?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
   };

   export type SessionCreateManyUserInput = {
      id?: string;
      sessionToken: string;
      expires: Date | string;
      createdAt?: Date | string;
      updatedAt?: Date | string;
   };

   export type AccountUpdateWithoutUserInput = {
      type?: StringFieldUpdateOperationsInput | string;
      provider?: StringFieldUpdateOperationsInput | string;
      providerAccountId?: StringFieldUpdateOperationsInput | string;
      refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
      access_token?: NullableStringFieldUpdateOperationsInput | string | null;
      expires_at?: NullableIntFieldUpdateOperationsInput | number | null;
      token_type?: NullableStringFieldUpdateOperationsInput | string | null;
      scope?: NullableStringFieldUpdateOperationsInput | string | null;
      id_token?: NullableStringFieldUpdateOperationsInput | string | null;
      session_state?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type AccountUncheckedUpdateWithoutUserInput = {
      type?: StringFieldUpdateOperationsInput | string;
      provider?: StringFieldUpdateOperationsInput | string;
      providerAccountId?: StringFieldUpdateOperationsInput | string;
      refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
      access_token?: NullableStringFieldUpdateOperationsInput | string | null;
      expires_at?: NullableIntFieldUpdateOperationsInput | number | null;
      token_type?: NullableStringFieldUpdateOperationsInput | string | null;
      scope?: NullableStringFieldUpdateOperationsInput | string | null;
      id_token?: NullableStringFieldUpdateOperationsInput | string | null;
      session_state?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type AccountUncheckedUpdateManyWithoutUserInput = {
      type?: StringFieldUpdateOperationsInput | string;
      provider?: StringFieldUpdateOperationsInput | string;
      providerAccountId?: StringFieldUpdateOperationsInput | string;
      refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
      access_token?: NullableStringFieldUpdateOperationsInput | string | null;
      expires_at?: NullableIntFieldUpdateOperationsInput | number | null;
      token_type?: NullableStringFieldUpdateOperationsInput | string | null;
      scope?: NullableStringFieldUpdateOperationsInput | string | null;
      id_token?: NullableStringFieldUpdateOperationsInput | string | null;
      session_state?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type SessionUpdateWithoutUserInput = {
      sessionToken?: StringFieldUpdateOperationsInput | string;
      expires?: DateTimeFieldUpdateOperationsInput | Date | string;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type SessionUncheckedUpdateWithoutUserInput = {
      sessionToken?: StringFieldUpdateOperationsInput | string;
      expires?: DateTimeFieldUpdateOperationsInput | Date | string;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type SessionUncheckedUpdateManyWithoutUserInput = {
      sessionToken?: StringFieldUpdateOperationsInput | string;
      expires?: DateTimeFieldUpdateOperationsInput | Date | string;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   /**
    * Batch Payload for updateMany & deleteMany & createMany
    */

   export type BatchPayload = {
      count: number;
   };

   /**
    * DMMF
    */
   export const dmmf: runtime.BaseDMMF;
}
