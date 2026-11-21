# Time mode

Time mode is the default test. The countdown starts at the selected duration, typing starts it, and the run ends on `/results` with a guest result saved.

## Sub-features

-  `time-open` shows a fresh visit on 30 seconds with a passage longer than 8 words.
-  `time-select` switches the visible duration to 15.
-  `time-run` types the first eight words and waits out the clock.
-  `time-finish` opens `/results` and stores `category: "time"` in `tipohiz.results`.

## How to get to it (user POV)

-  Open `/`.
-  Choose `15`, `30`, `60`, or `120` in the config bar.

## Driving it with Playwright

Preconditions:

-  `doctor` prints `"ok": true` for this home.
-  The drive uses a fresh context, so the countdown starts at `30` before the click.

Run `.cursor/skills/verify-tipohiz/scripts/tipohiz-verify.mjs drive time`.

-  **Open.** Load `/`. The first `div.text-accent` reads `30` and `div.h-28 > div` has more than 8 words.
-  **Select 15.** Click visible `div.time button[value="15"]`. The countdown reads `15`.
-  **Type.** Click `div.h-28` and type the first 8 words, each followed by Space. `evidence/time/typing.png` shows the run in progress.
-  **Finish.** Wait until the path is `/results` (about 15 seconds after the first key). Heading `wpm:` and heading `accuracy:` are present. `evidence/time/results.png` and `evidence/time/results.aria.txt` show that screen.
-  **Stored result.** `localStorage['tipohiz.results'][0].category` is `time`. The helper writes `evidence/time/storage.json`.

## Gotchas

-  The countdown's lower bound is 1. The page navigates to `/results` without ever showing `0`. Do not require a `0` frame.
-  `div.text-accent` is the countdown wrapper. `[data-testid="words-progress"]` is not used in time mode.
-  The config bar fades while the clock is running. Select the duration before the first key.
-  A proof that only reloads `/results` without typing does not count. The empty results page echoes the configured duration.
