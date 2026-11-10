# TipoHiZ verification map

This directory is the maintained source for verifying the user-facing behavior of TipoHiZ. Read the index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

-  Launch with `.cursor/skills/verify-tipohiz/scripts/tipohiz-verify.mjs launch`.
-  Default origin is `http://127.0.0.1:4173`. Override with `TIPOHIZ_VERIFY_PORT` and `TIPOHIZ_VERIFY_HOST` before launch.
-  Set `TIPOHIZ_VERIFY_HOME` to a directory this run owns. Default is `/tmp/tipohiz-verify/default`.
-  Guest typing needs no Mongo seed. A fresh browser context is the empty state.
-  `doctor` must print `"ok": true` before a drive. The git sha must still match launch.
-  Never drive a server this run did not start. One `next dev` per checkout.

## Driving conventions

-  Start every drive from a fresh browser context. The helper does that.
-  Viewport is `1280x800` so the desktop config bar is the visible one.
-  Prefer the role, accessible name, or `data-testid` named in the feature file. Config buttons are duplicated for the mobile bar; click `visible=true`.
-  The helper command is the literal command. Feature bullets are the actions that command performs, in order.
-  Do not delete `evidence/` during cleanup.

## Proof and skip reporting

-  Capture the user action and the resulting state, not only the final screen.
-  UI proof includes an ARIA snapshot and a screenshot that shows `TipoHiz.__`.
-  Mutation proof includes the guest storage JSON and a second view (`/dashboard` or a reload).
-  Record the feature id in `meta.json`.
-  Report an unreachable path with the command that failed and the unmet precondition.
-  Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 and one paragraph. Then exactly four H2 sections, in order:

1. `Sub-features`
2. `How to get to it (user POV)`
3. `Driving it with Playwright`
4. `Gotchas`

## Features

-  [Time mode](./time-mode.md) covers the default 30s shell, a 15s run, and the guest result saved when the timer ends.
-  [Words mode](./words-mode.md) covers a 10-word passage, the `1/10` counter, `/results`, and the dashboard row.
-  [Restart](./restart.md) covers Tab then Enter, and Shift+Enter after switching to words.
-  [Results](./results.md) covers the chart, the stored WPM, and Retake.
-  [Themes](./themes.md) covers hover preview, click to persist `nord`, and reload.

Punctuation, numbers, key sounds, login, and register are not in this map.
