# Words mode

Words mode ends when the last word matches, or when Space is pressed past a mistyped last word. The countdown is hidden. A `1/10` counter appears after the first keystroke.

## Sub-features

-  `words-open` switches the visible palette to word counts 10, 25, 50, and 100.
-  `words-count` loads a passage of exactly 10 words and hides the counter until typing starts.
-  `words-run` shows `1/10` after the first character.
-  `words-finish` opens `/results` with mode `words 10` and a dashboard row that says `10 words`.

## How to get to it (user POV)

-  Open `/`.
-  Choose `words` in the config bar.
-  Choose `10`, `25`, `50`, or `100`.

## Driving it with Playwright

Preconditions:

-  `doctor` prints `"ok": true` for this home.
-  No `tipohiz.results` entry exists in the fresh context.

Run `.cursor/skills/verify-tipohiz/scripts/tipohiz-verify.mjs drive words`.

-  **Choose words.** Click visible `div.category button[value="words"]`. The visible `div.words` has `data-active="true"`.
-  **Choose 10.** Click visible `div.words button[value="10"]`. The passage settles at 10 non-empty words. `[data-testid="words-progress"]` is absent.
-  **First key.** Click `div.h-28` and type the first character of the first word. The counter reads `1/10`. `evidence/words/typing.png` shows that counter.
-  **Finish the passage.** Type the rest of the first word, then Space, then each remaining word. Space separates words. Do not press Space after the last correct word. The path becomes `/results`.
-  **Results.** Heading `wpm:` is visible and the `mode:` stat reads `words 10`. `evidence/words/results.png` and `evidence/words/results.aria.txt` capture that screen.
-  **Stored result.** `localStorage['tipohiz.results'][0]` has `category` `words` and `wordCount` `10`. `sessionStorage['tipohiz.lastResult'].words` has length 10. Written to `evidence/words/storage.json`.
-  **Second view.** Open `/dashboard`. A line matches `10 words`. `evidence/words/dashboard.png` shows it.

## Gotchas

-  The counter is the word you are on, not how many you have finished. After two completed words it reads `3/10`.
-  The last correct word ends the test without Space. Space on a wrong last word also ends it. Do not add a trailing Space on the correct last word or the assertion races the navigation.
-  Language options are `English`, `Español`, and `Français` on the combobox. Changing language reloads the passage and keeps the word count. This drive does not switch language.
-  Guest saves do not call `/api/results`. A dashboard row after a fresh context is the persistence check.
