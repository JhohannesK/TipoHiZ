## 👨‍💻 Prerequisite Skills to Contribute

### Contribute in Components/CSS

-  [Typescript](https://www.typescriptlang.org/)
-  [TailwindCSS](https://tailwindcss.com/)

### Contribute in framework

-  [Next.js 16](https://nextjs.org/docs) — also read [`AGENTS.md`](AGENTS.md) and `node_modules/next/dist/docs/` before App Router changes (`proxy.ts`, no `next lint`)

### Contribute in state-management

-  [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)

---

## 💥 How to Contribute

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/JhohannesK/TipoHiZ/pulls)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.png?v=103)](https://github.com/JhohannesK/)

-  Take a look at the existing [Issues](https://github.com/JhohannesK/TipoHiZ/issues) or [create a new issue](https://github.com/JhohannesK/TipoHiZ/issues/new/choose)!
-  [Fork the Repo](https://github.com/JhohannesK/TipoHiZ/fork). Then, create a branch for any issue that you are working on. Finally, commit your work.
-  Create a **[Pull Request](https://github.com/JhohannesK/TipoHiZ/compare)** (_PR_), which will be promptly reviewed and given suggestions for improvements by the community.
-  Add screenshots or screen captures to your Pull Request to help us understand the effects of the changes proposed in your PR.

---

## 🤓 HOW TO MAKE A PULL REQUEST:

**1.** Start by making a Fork of the [**TipoHiZ**](https://github.com/JhohannesK/TipoHiZ) repository. Click on the <a href="https://github.com/JhohannesK/TipoHiZ/fork"><img src="https://i.imgur.com/G4z1kEe.png" height="20" width="20"></a>Fork symbol at the top right corner.

**2.** Clone your new fork of the repository in the terminal/CLI on your computer with the following command:

```bash
git clone https://github.com/<your-github-username>/TipoHiZ
```

**3.** Navigate to the newly created TipoHiZ project directory:

```bash
cd TipoHiZ
```

**4.** Set upstream command:

```bash
git remote add upstream https://github.com/JhohannesK/TipoHiZ.git
```

**5.** Create a new branch:

```bash
git checkout -b YourBranchName
```

**6.** Sync your fork or your local repository with the origin repository:

-  In your forked repository, click on "Fetch upstream"
-  Click "Fetch and merge"

### Alternatively, Git CLI way to Sync forked repository with origin repository:

```bash
git fetch upstream
```

```bash
git merge upstream/preview
```

### [Github Docs](https://docs.github.com/en/github/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-on-github) for Syncing

**7.** Make your changes to the source code.

**8.** Stage your changes:

⚠️ This repo uses **pnpm** (`pnpm-lock.yaml`). Do not add a `package-lock.json`. If you change `package.json` / `pnpm-lock.yaml`, say why in the PR and add the `dependencies` label (see `.github/pull_request_template.md`).

<!-- ⚠️ **Make sure** not to run the commands `git add .` or `git add *` -->

<!-- > Instead, stage your changes for each file/folder
>
> By using public path it means it will add all files and folders under that folder, it is better to be specific -->

```bash
git add .
```

_or_

```bash
git add "<files_you_have_changed>"
```

**9.** Commit your changes:

```bash
git commit -m "<your_commit_message>"
```

**10.** Push your local commits to the remote repository:

```bash
git push origin YourBranchName
```

**11.** Create a [Pull Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request)! to the `preview` branch.

**12.** **Congratulations!** You've made your first contribution to [**TipoHiZ**](https://github.com/JhohannesK/TipoHiZ/graphs/contributors)! 🎉🙌🏼

---

## Building and Running TipoHiZ

Once you have completed the above steps, you are ready to build and run TipoHiZ.

1. Run `pnpm install` in the project root (`postinstall` runs `prisma generate`).
2. Copy `.env.example` to `.env`. Typing works with empty values. For login/register/OAuth set `MONGODB_URI`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL`.
3. Run `pnpm dev` to start a local dev server on [port 3000](http://localhost:3000). Use <kbd>Ctrl+C</kbd> to kill it.
4. Optional: `pnpm ts-check`, `pnpm lint`. Pre-commit (husky) runs both plus Prettier (`npx prettier --write .` then `git add .`). CI does **not** run Prettier. Do not use `bin/install.sh` (`pnpm ci` is unimplemented).
5. Tests (same order as `.github/workflows/ci.yml` on PRs to `preview`):

```bash
pnpm test:unit              # Vitest, no env
pnpm exec playwright install chromium   # first e2e only
pnpm build && CI=true pnpm test:e2e     # production server; auth stubbed
```

`e2e/known-failures.spec.ts` uses `test.fail` — those cases passing as expected-fail does **not** mean the product bugs are fixed. See README **Testing**.

### Language word lists

Home-page Globe selector writes `userConfig.language` (`english` | `spanish` | `french`) and calls `resetTest`. `TextArea.tsx` loads from `modules/TextFiles/` as:

| `language`           | `type=default` | `type=punctuation`                                      | `type=numbers` |
| -------------------- | -------------- | ------------------------------------------------------- | -------------- |
| `english`            | `default.json` | `punctuation.json`                                      | `numbers.json` |
| `spanish` / `french` | `{lang}.json`  | `{lang}_punctuation.json` (fallback `punctuation.json`) | `numbers.json` |

`category` (`time` \| `words`) is a real mode switch, not a label. It changes the palette row (`time` vs `wordCount`), `generatePassage` length, which clock starts (`useTimer` vs `useElapsed`), the finish condition, and the results card (`formatTestMode` → `words N` vs `time Ns …`). `modules/TextFiles/code.json` is unused (`Constants.options.type` has no `code`; palette removed it).

To add a typing language:

1. Add `{language}.json` (and optionally `{language}_punctuation.json`) under `modules/TextFiles/`.
2. Extend `Language` + `languageOptions` in `lib/i18n/translations.ts`.
3. Do not add German unless you also add `german.json` — the settings dialog option is a no-op.

Three language UIs:

| Surface                     | Wired?                                   |
| --------------------------- | ---------------------------------------- |
| Home Globe                  | Yes → `userConfig.language`              |
| Settings `<select>`         | No (`onChange` missing; includes German) |
| Results language `<select>` | Decorative                               |

`lib/i18n/translations.ts` chrome strings are unused. UI chrome stays English.

### Time vs words

Defaults live in `modules/_constants.ts`: `TimeSec: 30`, `WordCount: 10`, times `[15, 30, 60, 120]`, words `[10, 25, 50, 100]`. Invalid word counts fall back through `resolveWordCount()`.

| | Time | Words |
| --- | --- | --- |
| Passage | `generatePassage(bank)` — full shuffled bank | `generatePassage(bank, resolveWordCount(wordCount))` |
| Start | first printable key → `countdown.run()` (`useTimer`) | first printable key → `elapsed.run()` (`useElapsed`) |
| During | countdown digits | countdown slot is an empty `min-h-7`; `data-testid="words-progress"` (`3/10`) only while `elapsed.running && !disabled` |
| Finish | remaining time hits **1s** (`hooks/useTimer.ts`) | `wordsTestFinished()` in `lib/words.ts`: `nextIndex >= total`, **or** last word typed exactly. A wrong last word does not finish until it is fixed or Space advances `nextIndex` |
| Duration for stats | configured `time` seconds, not wall clock | max keystroke `timestampMs`, `durationMs = max(elapsed, 1)` (`testDuration()`) |

`TextArea.tsx` reloads the word bank on `[type, language]` only. Category / wordCount / time changes must go through `resetTest` (`lib/reset.ts`). That path bumps a monotonic `resetGeneration` so a stale async load cannot overwrite a newer passage. Do not add those fields to the TextArea effect.

Mobile: hidden textarea + `onKeyDown` → `HandleText` (composing / modifier / Enter / Tab ignored). If keys do nothing on a phone, the hidden input lost focus. Header collapses to a hamburger below `md` (`components/header.tsx`) so 320–414px does not scroll sideways.

### Keystroke log and results

Every handled key is appended in `lib/stats/record.ts` (`appendKeystroke`). Timestamps are ms from the first key after `resetKeystrokeClock()` (`lib/stats/clock.ts`). Extra letters cap at `MAX_EXTRA_LETTERS = 10`.

Authoritative stats: `lib/stats/calculate.ts` → `calculateStats({ log, words, durationMs })`. Consistency is MonkeyType-style kogasa on **per-second raw WPM**, window trimmed to first→last **non-zero** sample so a trailing zero tail from configured duration does not force 0%.

`syncKeystrokeStats()` updates store `errorCount` / `typedEntries` with a **1s placeholder** duration. Do not wire a live WPM HUD off that helper without passing real `durationMs`.

`lib/utils.ts` (`accurateWPM`, `calculateAccuracy`) is still used by **Vercel usage events**, not the results page. Words-mode `test_finished.duration` is `userConfig.time`, not elapsed.

`persistFinishedTest()` (`lib/stats/persist-client.ts`) builds `SavedTestResult` and:

| Mode | Where |
| ---- | ----- |
| Guest | `localStorage` `tipohiz.results` (cap `GUEST_RESULT_LIMIT = 50`) + `sessionStorage` `tipohiz.lastResult` |
| Account | `POST /api/results` `{ result: submissionOf(result) }`. On failure, falls back to guest storage |
| Sign-in | `components/result-sync.tsx` sets account mode and `POST /api/results/migrate` (max 50) |

Results page (`app/(Base)/results/page.tsx`) shows net + raw WPM lines, error dots, hover/focus tooltip, keyboard arrows. The per-second table stays in the DOM inside `sr-only` for a11y / e2e.

### Restart shortcuts

`userConfig` (category, time, wordCount, type, language) is never cleared by restart.

| Context | Shortcut | Behavior |
| ------- | -------- | -------- |
| Home | **Shift+Enter** or **Tab then Enter** | `reset-test-button.tsx` → `resetTest` + timer reset. `test_restarted` `{ how: 'shortcut' }` |
| Home | Restart button | same path, `{ how: 'button' }` |
| Home | Tab alone | `preventDefault`; arms the Tab+Enter chord |
| Results | **Shift+Enter** | `resetStates()`, `/`, `test_restarted` `{ how: 'shortcut' }` |
| Results | **Tab** (not on an interactive control) | same navigation, **no** `test_restarted` event |

Footer copy matches the home chord. Results Tab is a different handler (`lib/results/restart-key.ts`).

### Themes

21 ids in `components/expo/theme.constant.ts` (includes `serika-dark`, `nord`, `dracula`, `carbon`, `botanical`, `olivia`). Default `dark-gray` (`app/layout.tsx`). Hover/focus preview: `hooks/useThemePreview.ts` paints the class on `<html>`; click commits via next-themes. Persistence is **`localStorage` key `theme`**. `userConfig.theme` / `ConfigActions.setTheme` exist and are unused by the theme UI — do not mix the two.

### Auth (optional)

| Path                 | Role                                                     |
| -------------------- | -------------------------------------------------------- |
| `/login`             | Credentials + OAuth entry. Provider errors land here.    |
| `/register`          | Server action; schema in `lib/validation/auth.schema.ts` |
| `/api/auth/[...all]` | Better Auth `GET`/`POST` handlers                        |
| `GET\|POST /api/results` | Session required. Server **recomputes** stats from `log` + `words` + client `durationSeconds` |
| `POST /api/results/migrate` | Session required. Max 50 guest results |

Typing does not require a session. `proxy.ts` only redirects signed-in visitors away from `/login` and `/register`. Register password rule of thumb: ≥8, upper, lower, digit. The special-character regex currently requires the literal prefix `A-Za-z0-9` — treat that as a known trap, not a real complexity rule. Trusted origins come from `BETTER_AUTH_TRUSTED_ORIGINS` (comma-separated) plus `BETTER_AUTH_URL` and `VERCEL_URL`. A trailing slash on `BETTER_AUTH_URL` is stripped. Rate limits use the database. The first auth use ensures a unique index on `rateLimit.key`, and a MongoDB outage is logged without stopping startup. The dashboard plugin is `dash()` and uses optional `BETTER_AUTH_API_KEY`.

Credential failures always render **`Invalid email or password`**. Duplicate sign-up uses generic copy, and some duplicate codes return `{ success: true }` so the client cannot tell the email is already registered (`lib/auth/error-messages.ts`).

`resultSubmissionSchema` (`lib/validation/result.schema.ts`): `durationSeconds` positive max 3600, `wordCount` 0–10000, `words` max 2000, `log` max 20000. Client-sent WPM fields are ignored. The server **trusts client `durationSeconds`** for WPM scaling (a shortened duration inflates WPM) and **trusts client `wordCount`** on the dashboard recent list. Stats themselves are replayed from the log.

### 🐳 Docker (optional, stale)

`Dockerfile` uses **npm**, not pnpm, and compose does not pass env or start MongoDB. Auth will not work. Prefer `pnpm install && pnpm dev` locally.

-  **Ensure Docker is Running**
-  `docker compose up` (or `-d`) from the repo root
-  Open http://localhost:3000
-  `docker compose down` when done. Other commands: [Docker Compose getting started](https://docs.docker.com/compose/gettingstarted/).

**_:🏆🏆🏆: After this, the maintainers will review the PR and will merge it if it helps move the TipoHiZ project forward. Otherwise, it will be given constructive feedback and suggestions for the changes needed to add the PR to the codebase._**

---
