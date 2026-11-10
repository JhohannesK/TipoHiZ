# Restart

Restart deals a new passage without dropping the saved duration or mode. The home test accepts the restart button, Tab then Enter, and Shift+Enter.

## Sub-features

-  `restart-tab` resets a 15 second test to `15` and replaces the passage.
-  `restart-shift` keeps words mode, word count 10, and the stored time of 15.

## How to get to it (user POV)

-  On the home test, press Tab, then Enter.
-  On the home test, press Shift+Enter.
-  Choose the button named `button to restart test` (the control also says `Restart test`).

## Driving it with Playwright

Preconditions:

-  `doctor` prints `"ok": true` for this home.
-  Focus is not in a login field or any other real text box. The passage textarea is safe.

Run `.cursor/skills/verify-tipohiz/scripts/tipohiz-verify.mjs drive restart`.

-  **Select 15.** Click visible `div.time button[value="15"]`. The countdown reads `15` and the passage has more than 8 words.
-  **Tab then Enter.** Press `Tab`, then `Enter`. The countdown reads `15` again and the passage text changes. `localStorage['userConfig']` state is `time` `15` and `category` `time`. `evidence/restart/tab-restart.png` and `evidence/restart/after-tab.json` record it.
-  **Switch to words.** Click visible `div.category button[value="words"]`. The passage settles at 10 words.
-  **Shift+Enter.** Click `div.h-28`, then press `Shift+Enter`. The new passage still has 10 words. Stored state is `category` `words`, `wordCount` `10`, and `time` `15`. `evidence/restart/shift-enter.png` and `evidence/restart/after-shift-enter.json` record it.

## Gotchas

-  Tab inside a normal input types nothing useful and does not arm the shortcut. The passage field is marked `data-typing-field`, so Tab still arms restart there.
-  On `/results`, Tab does not restart when focus is on a link or button (`isRestartBlockedTarget`). Shift+Enter still returns home from results. This drive stays on the home test.
-  The button entry is a third path. This drive does not click it. Do not treat the shortcut run as proof of the button.
-  Restart must change the passage. Comparing the joined words with the pre-restart passage is the check. A second of identical text is a failed restart, not a pass.
