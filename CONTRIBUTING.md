## 👨‍💻 Prerequisite Skills to Contribute

### Contribute in Components/CSS

-  [Typescript](https://www.typescriptlang.org/)
-  [TailwindCSS](https://tailwindcss.com/)

### Contribute in framework

-  [Nextjs](<[https://graphql.org/](https://nextjs.org/docs)>)

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
2. Copy `.env.example` to `.env`. Typing works with empty values. For login/register/OAuth set `MONGODB_URI` + `AUTH_SECRET`, then `pnpm prisma:push`.
3. Run `pnpm dev` to start a local dev server on [port 3000](http://localhost:3000). Use <kbd>Ctrl+C</kbd> to kill it.
4. Optional: `pnpm ts-check`, `pnpm lint`. Pre-commit (husky) runs both plus Prettier.

### Language word lists

Home-page Globe selector writes `userConfig.language` (`english` | `spanish` | `french`) and calls `resetTest`. `TextArea.tsx` loads from `modules/TextFiles/` as:

| `language`           | `type=default` | `type=punctuation`                                      | `type=numbers` |
| -------------------- | -------------- | ------------------------------------------------------- | -------------- |
| `english`            | `default.json` | `punctuation.json`                                      | `numbers.json` |
| `spanish` / `french` | `{lang}.json`  | `{lang}_punctuation.json` (fallback `punctuation.json`) | `numbers.json` |

`category` (`time` \| `words`) is stored and shown as the results card label. It does **not** change word loading or the timer. `modules/TextFiles/code.json` is unused (`Constants.options.type` has no `code`; palette removed it).

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

### Timer → results

`useTimer(1, time)` on the home test. First printable key via `HandleText` starts the clock (`run()`). When remaining time hits the 1s bound, navigate to `/results`. Metrics in `lib/utils.ts`:

-  gross WPM: `((typedEntries / 5) * 60) / time`
-  adjusted WPM: `max(typedEntries - errorCount, 0) / 5 / (time / 60)`
-  accuracy: `max(0, (typedEntries - errorCount) / typedEntries) * 100` (100 if nothing typed)

Mobile: hidden textarea + `onKeyDown` → `HandleText` (composing / modifier / Enter / Tab ignored). If keys do nothing on a phone, the hidden input lost focus.

### Auth (optional)

| Path                      | Role                                                     |
| ------------------------- | -------------------------------------------------------- |
| `/login`                  | Credentials + OAuth entry (`auth.ts` `pages.signIn`)     |
| `/register`               | Server action; schema in `lib/validation/auth.schema.ts` |
| `/api/auth/[...nextAuth]` | NextAuth `GET`/`POST` handlers                           |

Typing does not require a session. `proxy.ts` re-exports `auth` with no matcher. Register password rule of thumb: ≥8, upper, lower, digit. The special-character regex currently requires the literal prefix `A-Za-z0-9` — treat that as a known trap, not a real complexity rule.

### 🐳 Docker (optional, stale)

`Dockerfile` uses **npm**, not pnpm, and compose does not pass env or start MongoDB. Auth will not work. Prefer `pnpm install && pnpm dev` locally.

-  **Ensure Docker is Running**
-  `docker compose up` (or `-d`) from the repo root
-  Open http://localhost:3000
-  `docker compose down` when done. Other commands: [Docker Compose getting started](https://docs.docker.com/compose/gettingstarted/).

**_:🏆🏆🏆: After this, the maintainers will review the PR and will merge it if it helps move the TipoHiZ project forward. Otherwise, it will be given constructive feedback and suggestions for the changes needed to add the PR to the codebase._**

---
