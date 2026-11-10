# Themes

The theme control previews a palette on hover and saves it on click. The saved value is the next-themes `localStorage` key `theme`. It survives reload.

## Sub-features

-  `theme-open` opens the dialog from the trigger whose name is the current theme.
-  `theme-hover` paints `nord` on `<html>` without writing `theme` to `nord`.
-  `theme-save` writes `nord` and keeps that class after reload, with the passage still present.

## How to get to it (user POV)

-  On `/`, choose the theme trigger. On a fresh profile its name is `dark-gray`.
-  Hover a theme, move the pointer off it, or click it.
-  The dialog heading is `Choose a Theme`.

## Driving it with Playwright

Preconditions:

-  `doctor` prints `"ok": true` for this home.
-  The fresh context has no `localStorage.theme` yet. The app default is `dark-gray`.

Run `.cursor/skills/verify-tipohiz/scripts/tipohiz-verify.mjs drive themes`.

-  **Open.** Wait for the button named `dark-gray` (exact) and click it. Heading `Choose a Theme` is visible.
-  **Hover.** Hover the button named `nord` (exact). `<html>` class contains `nord` and `localStorage.theme` is not `nord`.
-  **Leave.** Hover the heading `Choose a Theme`. `<html>` class contains `dark-gray` and does not contain `nord`. `evidence/themes/preview-cleared.png` shows the dialog after the preview drops.
-  **Save.** Click `nord`. `<html>` class contains `nord` and `localStorage.theme` is `nord`.
-  **Reload.** Reload `/`. The passage again has more than 8 words, the class still contains `nord`, and the stored theme is `nord`. `evidence/themes/reloaded.png` and `evidence/themes/theme.json` record it.

## Gotchas

-  Use exact accessible names. `dark` is also a theme id and is a substring of `dark-gray`, `dark-green`, and `dark-orange`.
-  Hover must not count as a save. Read `localStorage.theme` while the preview class is `nord`.
-  The trigger is not labelled `Choose a Theme`. That string is the dialog title.
-  Theme buttons mount with the dialog. Before the click, only the trigger is named `dark-gray`.
