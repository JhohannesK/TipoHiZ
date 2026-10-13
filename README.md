# About

Tipohiz is a sleek and customizable typing test platform designed to enhance your typing skills. Our user-friendly interface offers a variety of test modes to challenge typists of all levels. Whether you're a beginner looking to boost your typing speed or a seasoned typist aiming to break your personal record, Tipohiz offers the tools and features you need to succeed. Start your typing journey with Tipohiz today and watch your skills soar!

> **Note**
>
> -  This project is built using Nextjs <br>
> -  Inspired by MonkeyType

# Features

-  minimalistic design
-  live errors, wpm, and accuracy displays
-  punctuation and numbers modes (`default` \| `punctuation` \| `numbers`)
-  timed tests: 15 / 30 / 60 / 120 seconds (palette `category: words` is **label-only** — it does not switch to a word-count test)
-  typing languages: English, Spanish, French (home-page Globe; word lists in `modules/TextFiles/`)
-  results after the timer hits the 1s bound: `/results` with gross WPM, adjusted WPM, accuracy (`lib/utils.ts`)
-  themes and optional key sounds
-  optional accounts (`/login`, `/register`, Google / GitHub / Twitter) via Better Auth + MongoDB — typing works without signing in
-  config persistence in `localStorage` (Zustand persist key `userConfig`)

# Future Features

-  quotes mode
-  real-time typing challenges with other users
-  UI chrome translations (word lists are live; `lib/i18n/translations.ts` is not wired into settings/header yet)

# Local development

Package manager is **pnpm@10.34.6** (`package.json` `packageManager` field). Enable Corepack or install that version. There is no `install-all` / `install-win` script. **`bin/install.sh` is legacy and broken** (`pnpm ci` is unimplemented); **`bin/install.cmd` is unused**. Use `pnpm install`. Node.js **20.9+** locally; CI uses **Node 22**.

This is **Next.js 16.4**. `next dev` / `next build` use Turbopack by default. Request interception lives in `proxy.ts` (not `middleware.ts`). Lint is `eslint .` (`pnpm lint`) — there is no `next lint`. Read `AGENTS.md` and `node_modules/next/dist/docs/` before App Router changes.

```bash
pnpm install          # postinstall runs prisma generate
cp .env.example .env  # required only for auth / MongoDB
pnpm prisma:push      # optional; legacy Prisma models only. Better Auth creates its own collections
pnpm dev              # http://localhost:3000
```

pnpm 10 skips dependency lifecycle scripts unless they are in `pnpm-workspace.yaml` `allowBuilds` (`prisma`, `@prisma/client`, husky, sharp, esbuild). If `prisma generate` is skipped after install, that file is why.

Typing tests run with **no env vars**. Auth needs:

| Variable                       | Required for                                                                           |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| `MONGODB_URI`                  | Better Auth MongoDB adapter                                                            |
| `BETTER_AUTH_SECRET`           | Session signing                                                                        |
| `BETTER_AUTH_URL`              | Public origin used for OAuth callbacks. A trailing slash is stripped                   |
| `BETTER_AUTH_TRUSTED_ORIGINS`  | Extra comma-separated origins. `BETTER_AUTH_URL` and `VERCEL_URL` are included as well |
| `BETTER_AUTH_API_KEY`          | Optional Better Auth dashboard key. Auth still runs when it is unset                   |
| `GOOGLE_CLIENT_ID` / `SECRET`  | Google OAuth                                                                           |
| `GITHUB_CLIENT_ID` / `SECRET`  | GitHub OAuth                                                                           |
| `TWITTER_CLIENT_ID` / `SECRET` | Twitter/X OAuth                                                                        |

`proxy.ts` redirects a signed-in visitor away from `/login` and `/register`. It does not gate the typing test. Anonymous use is expected.

Auth routes: `GET|POST /api/auth/[...all]`. Credentials login min password length 8. Register (`lib/validation/auth.schema.ts`): name ≥3, email, password ≥8 with upper / lower / digit. The “special character” regex is `/^A-Za-z0-9/` — it matches a literal prefix, not a special char; if register fails unexpectedly, look there first. Auth rate limits are stored in MongoDB, not in process memory. Better Auth marks `rateLimit.key` unique, and the Mongo adapter creates that unique index on the first rate-limit write. `dash()` from `@better-auth/infra` powers the dashboard and reads `BETTER_AUTH_API_KEY`. A missing key does not stop the app.

Prisma client is generated to `prisma/generated/prisma` (`output` in `prisma/schema.prisma`). That tree is **committed** — do not hand-edit it. `pnpm build` runs `prisma generate && next build`.

Docker (`Dockerfile` + `docker-compose.yaml`) is npm-based and does not inject env or MongoDB — not the recommended local path. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Testing

CI (`.github/workflows/ci.yml`) runs on PRs to **`preview`**: typecheck → lint → unit → production build → Playwright Chromium. It does **not** call `pnpm test`; steps are separate. pnpm version comes from `package.json` `packageManager` (`pnpm/action-setup@v4` with **no** `version:` — an explicit version breaks on the Corepack integrity hash). Auth/Mongo env in CI and Playwright are placeholders; e2e stubs `**/api/auth/**`.

| Script           | What                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `pnpm test:unit` | Vitest (`vitest.config.ts`, jsdom). No env. Files `**/*.{test,spec}.{ts,tsx}` except `e2e/`. |
| `pnpm test:e2e`  | Playwright Chromium (`e2e/`). First run: `pnpm exec playwright install chromium`.            |
| `pnpm test`      | unit then e2e                                                                                |

Match CI locally:

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm test:unit
pnpm build
CI=true pnpm test:e2e
```

`CI=true` makes Playwright run `pnpm start` against the production build. Without a prior `pnpm build`, that path fails. Dev-mode e2e (`pnpm test:e2e` with no `CI`) hits `pnpm dev` on `127.0.0.1:3000` and can stall on Next 16 cross-origin HMR.

-  `e2e/smoke.spec.ts` — happy-path 15s test → `/results`.
-  `e2e/known-failures.spec.ts` — three `test.fail` P0s (timer restart, countdown at 0, mistype scoring). Those failures **count as passes**. Green CI does not mean those bugs are gone.

Husky pre-commit: `pnpm ts-check`, `pnpm lint`, `npx prettier --write .`, then `git add .`. CI does **not** run Prettier.

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Eslint](https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Nextjs](https://img.shields.io/badge/nextjs-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-brown?style=for-the-badge&logo=zustand&logoColor=black)
![Tailwind](https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![Docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![RadixUI](https://img.shields.io/badge/radixui-161618?style=for-the-badge&logo=radixui&logoColor=white)

## Do you like to see how tipoHiZ looks like?

Use the link below:
[https://tipohiz.vercel.app/](https://tipohiz.vercel.app/)

For contributers, you merged PRs do not immediately go live. Instead, they are deployed on a preview link first and if it looks okay, they are pushed to main.
**Preview Link**: https://tipohiz-preview.vercel.app/

# Bug report or Feature request

If you encounter a bug or have a feature request, [create an issue](https://github.com/jhohannesK/tipohiz/issues),
[create a discussion thread](https://github.com/JhohannesK/TipoHiZ/discussions) <br/>

# Want to Contribute?

-  Contributions make the open source community such an amazing place to learn, inspire, and create.
-  Any contributions you make are **truly appreciated**.

Refer to [CONTRIBUTING.md](CONTRIBUTING.md).

# Code of Conduct

Before contributing to this repository, please read the [code of conduct](CODE_OF_CONDUCT.md).

## 🛡️ License

TipoHiZ is licensed under the GNU GENERAL PUBLIC LICENSE - see the [LICENSE](LICENSE) file for details.

# Security

To report a security vulnerability, please refer to [SECURITY.md](SECURITY.md).

## 🙏 Support

This project needs a ⭐️ from you. Don't forget to leave a star ⭐️ <br/>

Join our [discord](https://discord.gg/8Z67Fv8z)

## 💪 Thanks to all Contributors

Thanks a lot for spending your time helping TipoHiz grow. Thanks a lot! Keep on code-jamming 🍻

[![Contributors](https://contrib.rocks/image?repo=JhohannesK/TipoHiz)](https://github.com/JhohannesK/TipoHiz/graphs/contributors)

## Credits

Logo Credit - [Puneet Upadhyay](https://github.com/debianbaker) <br/>
Designs - [Kwaw Kumi Miezah](https://github.com/Kay-kwaw)
