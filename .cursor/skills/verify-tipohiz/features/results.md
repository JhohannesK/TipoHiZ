# Results

The results screen shows net WPM, accuracy, and a per-second chart for the test that just finished. Retake returns to a new passage in the same mode.

## Sub-features

-  `results-chart` shows `Speed by second`, the plot, and one table row per sample.
-  `results-wpm` shows a WPM that matches the stored guest result.
-  `results-retake` follows `Retake` back to a 10-word passage with the counter hidden.

## How to get to it (user POV)

-  Finish a words test or let a timed test hit its bound.
-  On `/results`, choose `Retake`.

## Driving it with Playwright

Preconditions:

-  `doctor` prints `"ok": true` for this home.
-  The context has not finished a test yet.

Run `.cursor/skills/verify-tipohiz/scripts/tipohiz-verify.mjs drive results`.

-  **Finish 10 words.** Same path as words mode: visible `words`, visible `10`, type the passage with Space between words and no Space after the last correct word. Land on `/results`.
-  **Chart.** Heading `Speed by second` is visible. A button whose name matches `/per-second speed/i` is present. `table tbody tr` has at least one row.
-  **WPM matches storage.** The `wpm:` stat parses to a number within `0.1` of `sessionStorage['tipohiz.lastResult'].stats.wpm`. `evidence/results/results.png`, `evidence/results/results.aria.txt`, and `evidence/results/storage.json` capture the screen and the store.
-  **Retake.** Click the link named `Retake`. The path is `/`, the passage has 10 words, and `[data-testid="words-progress"]` is absent. `evidence/results/retake.png` shows that home screen.

## Gotchas

-  Opening `/results` with an empty keystroke log shows the configured duration (30s on a fresh profile) and no chart. That is not this feature.
-  The chart renders only when `typedEntries > 0`. A drive that injects `tipohiz.results` without typing skips the user path.
-  `Game Results page` is an sr-only h1. Assert it in the ARIA snapshot if you need the page title. Visibility checks belong on `wpm:` and `Speed by second`.
-  Retake calls `resetStates` and loads a new passage. The stored `userConfig` stays on words / 10.
