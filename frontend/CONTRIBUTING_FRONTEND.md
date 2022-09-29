## Building and Running TipoHiZ-Frontend

Once you have completed the above steps, you are ready to build and run Monkeytype.

1. Run `npm run install-all` in the project root to install all dependencies.
   -  If you are on Windows, use `npm run install-windows`.
   -  If neither works, you will have to run `npm install` in root, frontend, and backend directories.
2. Run `npm run dev` (`npm run dev-fe` if you skipped the Backend section) to start a local dev server on [port 3000](http://localhost:3000). It will watch for changes and rebuild when you edit files in `src/` or `public/` directories. Note that rebuilding doesn't happen instantaneously so be patient for changes to appear. Use <kbd>Ctrl+C</kbd> to kill it.

## Standards and Guidelines

Code style is enforced by [Prettier](https://prettier.io/docs/en/install.html), which automatically runs every time you make a commit (`git commit`) (if you've followed the above instructions properly).
