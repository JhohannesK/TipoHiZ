---
name: verify-tipohiz
description: Drive the TipoHiZ Next.js typing UI in a real browser and save proof. Use when a change to the home test, results, restart shortcuts, or themes needs a user-path check.
---

# Verify TipoHiZ

TipoHiZ is a Next.js App Router typing test. The primary surface is the home page at `/`. `/results` and `/dashboard` show the test that just finished. `/login` and `/register` are optional accounts. Guest typing does not need them.

API routes, not the thing to drive for a typing proof:

-  `GET` and `POST` `/api/auth/[...all]` (Better Auth). Without `MONGODB_URI`, `getAuth()` throws `MONGODB_URI is not set`.
-  `GET` and `POST` `/api/results`, `POST` `/api/results/migrate` for a signed-in save. Guests persist to `localStorage` key `tipohiz.results` (cap 50) and `sessionStorage` key `tipohiz.lastResult`.

Word lists ship in `modules/TextFiles/`. A fresh profile needs no seed. Default config is time mode, 30 seconds, English, word count 10. `userConfig` is the Zustand `localStorage` key. The theme is the next-themes key `theme`, not `userConfig.theme`.

Keep this map current with `/maintain-verification-skill`.

## Launch

From the repo root, with Node 24 and pnpm 10.34.6:

```bash
pnpm exec playwright install chromium
TIPOHIZ_VERIFY_HOME=/tmp/tipohiz-verify/default \
  .cursor/skills/verify-tipohiz/scripts/tipohiz-verify.mjs launch
```

`TIPOHIZ_VERIFY_PORT` defaults to `4173`. `TIPOHIZ_VERIFY_HOST` defaults to `127.0.0.1`. The script runs `pnpm dev --hostname <host> --port <port>` in this checkout. It strips `MONGODB_URI`, `BETTER_AUTH_*`, OAuth client vars, and `CI` from the child so the run stays on the guest path and does not attach to a developer's database.

Ready means a fresh browser shows all of these, not merely that the port accepts TCP:

-  the header text `TipoHiz.__`
-  more than 8 words in `div.h-28 > div`
-  the first `div.text-accent` text is `30`
-  a `Login` link
-  no cookie whose name contains `session`

Launch writes `evidence/launch.json` and `evidence/launch.png` under the home directory. It exits non-zero and kills the process it started if that shell never appears. A log line from `next dev` is not readiness. An empty passage means the dev JS did not hydrate. Browse the bind host (`127.0.0.1`). `next.config.js` lists that origin in `allowedDevOrigins`; a mismatched host leaves the passage empty.

One `next dev` or `next start` per checkout. They share `.next`. Launch refuses when this repo already has one, when this home already has a live pid, or when the port is taken. It does not kill those processes. A second instance needs another git worktree, another `TIPOHIZ_VERIFY_HOME`, and another port.

## Doctor

```bash
.cursor/skills/verify-tipohiz/scripts/tipohiz-verify.mjs doctor
```

Read-only. Prints one JSON object and does not write a file. `ok` is true only when the recorded pid (or a listener pid saved at launch) is alive, that process owns the port, `git rev-parse HEAD` still equals the sha stored at launch, `mode` is `next dev`, and the fresh-browser checks above pass. `sessionEndpoint` is the status of `GET /api/auth/get-session`. `500` is expected with auth env stripped. `guest` stays true when the `Login` link is visible and the browser has no session cookie. Do not stub `/api/auth/**`. Drive only a server this run launched. `ok: false` means do not drive.

## Drive

Viewport `1280x800`. Under `640px` the desktop bar is `display: none` and the mobile control is the `Test settings` chip. Both bars are in the DOM. Every config click goes through `locator('visible=true')`.

Shared handles:

-  Passage words: `div.h-28 > div` text. Focus by clicking `div.h-28` (the hidden textarea is `data-typing-field="true"`).
-  Time: `div.time button[value="15|30|60|120"]`. Countdown text: first `div.text-accent`. It never renders `0`; the run leaves for `/results` while the digit is `1`.
-  Category: `div.category button[value="time|words"]`.
-  Word count: `div.words button[value="10|25|50|100"]`. The visible group exposes `data-active="true"`.
-  Progress: `[data-testid="words-progress"]`. Absent until the first keystroke in words mode. The label is the 1-based word you are on (`1/10` after the first character). There is no `elapsed-time` node.
-  Restart control: button name `button to restart test`. Home shortcuts: `Tab` then `Enter`, or `Shift+Enter`. `Tab` is swallowed by a real text field (`lib/restart-shortcut.ts`). The typing textarea is excluded via `data-typing-field`.
-  Language: combobox, then option `English`, `Español`, or `Français`.
-  Theme trigger: button whose accessible name is the active theme. Default text is `dark-gray`. Dialog heading `Choose a Theme`. Choice buttons use the theme id (`nord`) with an exact name match. Close control name is `Close`.
-  Results: URL path `/results`. Heading `Game Results page` is sr-only. Visible headings include `wpm:`, `accuracy:`, and, after a real test, `Speed by second`. Chart plot button name matches `/per-second speed/i`. Retake is the link `Retake`.
-  Guest side effects: `localStorage['tipohiz.results']`, `sessionStorage['tipohiz.lastResult']`, `localStorage['userConfig']`, `localStorage['theme']`.

Each drive starts a new empty browser context against the launched origin. Run one feature:

```bash
.cursor/skills/verify-tipohiz/scripts/tipohiz-verify.mjs drive words
```

`time`, `restart`, `results`, and `themes` are the other ids. Recipes and proof files are under `features/`.

## Evidence

Artifacts go to `$TIPOHIZ_VERIFY_HOME/evidence/<feature>/` (default `/tmp/tipohiz-verify/default/evidence`). Launch also writes `evidence/launch.json` and `evidence/launch.png`.

A proof is a real user path: clicks, keystrokes, and navigation. Do not call Zustand setters, `localStorage.setItem` for the result under test, or test-only routes. There is no test-only results endpoint. Capture the action (for example `typing.png` with `1/10`) and the resulting state (`results.png`, an ARIA snapshot, and `storage.json`). Read the side effect back from `/dashboard` or from storage after the UI says it saved. Mocks stop at boundaries the app already has. Do not stub `/api/auth/**` or `/api/results` for these guest journeys. Vercel Analytics is absent unless `VERCEL` is set; do not add a fake `window.va` to make a journey pass.

`meta.json` in the feature directory records the feature id, origin, and launch git sha.

## Cleanup

```bash
.cursor/skills/verify-tipohiz/scripts/tipohiz-verify.mjs cleanup
```

Reads `run.json` in the home directory and signals that pid's process group (`SIGTERM`, then `SIGKILL`). If that pid is already gone, it signals only listener pids saved at launch whose cwd is this repo and whose cmdline contains `next`. It refuses to signal a pid whose cmdline is something else. It deletes `run.json` and `server.log`. It does not delete `evidence/`. It never kills by process name.

## Helpers

The helper is executable:

```bash
.cursor/skills/verify-tipohiz/scripts/tipohiz-verify.mjs launch
.cursor/skills/verify-tipohiz/scripts/tipohiz-verify.mjs doctor
.cursor/skills/verify-tipohiz/scripts/tipohiz-verify.mjs drive <time|words|restart|results|themes>
.cursor/skills/verify-tipohiz/scripts/tipohiz-verify.mjs cleanup
```

Run it from the repo root so `pnpm` and `playwright` resolve. If Chromium is missing, the script prints `pnpm exec playwright install chromium`.
