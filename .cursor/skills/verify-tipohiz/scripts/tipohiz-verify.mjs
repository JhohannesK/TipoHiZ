#!/usr/bin/env node
import { execFileSync, spawn } from 'node:child_process';
import {
   closeSync,
   existsSync,
   openSync,
   readFileSync,
   readdirSync,
   readlinkSync,
   realpathSync,
} from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const repoRoot = realpathSync(
   path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
);
const home = process.env.TIPOHIZ_VERIFY_HOME || '/tmp/tipohiz-verify/default';
const host = process.env.TIPOHIZ_VERIFY_HOST || '127.0.0.1';
const port = Number(process.env.TIPOHIZ_VERIFY_PORT || 4173);
const baseUrl = `http://${host}:${port}`;
const evidenceRoot = path.join(home, 'evidence');
const runPath = path.join(home, 'run.json');
const logPath = path.join(home, 'server.log');
const viewport = { width: 1280, height: 800 };
const authKeys = [
   'MONGODB_URI',
   'BETTER_AUTH_SECRET',
   'BETTER_AUTH_URL',
   'BETTER_AUTH_TRUSTED_ORIGINS',
   'BETTER_AUTH_API_KEY',
   'GOOGLE_CLIENT_ID',
   'GOOGLE_CLIENT_SECRET',
   'GITHUB_CLIENT_ID',
   'GITHUB_CLIENT_SECRET',
   'TWITTER_CLIENT_ID',
   'TWITTER_CLIENT_SECRET',
   'CI',
];

function delay(ms) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}

function usage() {
   console.error(
      'usage: tipohiz-verify.mjs <launch|doctor|drive|cleanup> [time|words|restart|results|themes]'
   );
   process.exit(1);
}

function gitSha() {
   return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: repoRoot,
      encoding: 'utf8',
   }).trim();
}

function childEnv() {
   const env = { ...process.env, PORT: String(port), HOSTNAME: host };
   env.NODE_ENV = 'development';
   for (const key of authKeys) delete env[key];
   return env;
}

function cmdline(pid) {
   try {
      return readFileSync(`/proc/${pid}/cmdline`)
         .toString()
         .replaceAll('\0', ' ');
   } catch {
      return '';
   }
}

function alive(pid) {
   return Boolean(pid) && existsSync(`/proc/${pid}`);
}

function listProcs() {
   const procs = [];
   for (const name of readdirSync('/proc')) {
      if (!/^\d+$/.test(name)) continue;
      const pid = Number(name);
      try {
         const stat = readFileSync(`/proc/${pid}/stat`, 'utf8');
         const rest = stat.slice(stat.lastIndexOf(')') + 2).split(' ');
         let cwd = '';
         try {
            cwd = readlinkSync(`/proc/${pid}/cwd`);
         } catch {
            cwd = '';
         }
         procs.push({
            pid,
            ppid: Number(rest[1]),
            cwd,
            cmd: cmdline(pid),
         });
      } catch {
         continue;
      }
   }
   return procs;
}

function ancestors(pid, procs) {
   const byPid = new Map(procs.map((proc) => [proc.pid, proc]));
   const chain = [];
   const seen = new Set();
   let current = pid;
   while (current && !seen.has(current)) {
      seen.add(current);
      chain.push(current);
      current = byPid.get(current)?.ppid;
   }
   return chain;
}

function listenInodes(targetPort) {
   const hexPort = targetPort.toString(16).toUpperCase().padStart(4, '0');
   const inodes = new Set();
   for (const file of ['/proc/net/tcp', '/proc/net/tcp6']) {
      let text = '';
      try {
         text = readFileSync(file, 'utf8');
      } catch {
         continue;
      }
      for (const line of text.trim().split('\n').slice(1)) {
         const cols = line.trim().split(/\s+/);
         const local = cols[1] || '';
         const state = cols[3];
         const inode = cols[9];
         const localPort = (local.split(':')[1] || '').toUpperCase();
         if (state === '0A' && localPort === hexPort && inode)
            inodes.add(inode);
      }
   }
   return inodes;
}

function listenerPids(targetPort) {
   const inodes = listenInodes(targetPort);
   if (inodes.size === 0) return [];
   const pids = new Set();
   for (const name of readdirSync('/proc')) {
      if (!/^\d+$/.test(name)) continue;
      let fds = [];
      try {
         fds = readdirSync(`/proc/${name}/fd`);
      } catch {
         continue;
      }
      for (const fd of fds) {
         try {
            const link = readlinkSync(`/proc/${name}/fd/${fd}`);
            const match = /^socket:\[(\d+)\]$/.exec(link);
            if (match && inodes.has(match[1])) pids.add(Number(name));
         } catch {
            continue;
         }
      }
   }
   return [...pids];
}

function isRepoNext(proc) {
   if (proc.cwd !== repoRoot) return false;
   const cmd = proc.cmd;
   if (cmd.includes('tipohiz-verify.mjs')) return false;
   return (
      (cmd.includes('next') &&
         (cmd.includes('dev') || cmd.includes('start'))) ||
      (cmd.includes('pnpm') && cmd.includes(' dev'))
   );
}

async function writeJson(file, value) {
   await mkdir(path.dirname(file), { recursive: true });
   await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function readRun() {
   try {
      return JSON.parse(readFileSync(runPath, 'utf8'));
   } catch {
      return null;
   }
}

function ownsPort(run, procs) {
   const listeners = listenerPids(port);
   if (listeners.length === 0) return false;
   return listeners.every(
      (pid) =>
         ancestors(pid, procs).includes(run.pid) ||
         (run.listenerPids || []).includes(pid)
   );
}

async function signalRecorded(run, signal) {
   const command = cmdline(run.pid);
   if (command) {
      const allowed =
         command.includes('pnpm') ||
         command.includes('next') ||
         command.includes(repoRoot);
      if (!allowed) {
         throw new Error(
            `refusing to signal pid ${run.pid}; cmdline is ${JSON.stringify(
               command
            )}`
         );
      }
      try {
         process.kill(-run.pid, signal);
      } catch (error) {
         if (error.code !== 'ESRCH') throw error;
      }
      return;
   }

   for (const pid of run.listenerPids || []) {
      const listenerCmd = cmdline(pid);
      if (!listenerCmd.includes('next')) continue;
      let cwd = '';
      try {
         cwd = readlinkSync(`/proc/${pid}/cwd`);
      } catch {
         continue;
      }
      if (cwd !== repoRoot) continue;
      try {
         process.kill(pid, signal);
      } catch (error) {
         if (error.code !== 'ESRCH') throw error;
      }
   }
}

async function stopRecorded(run) {
   const watched = [run.pid, ...(run.listenerPids || [])];
   await signalRecorded(run, 'SIGTERM');
   const start = Date.now();
   while (Date.now() - start < 5000) {
      if (watched.every((pid) => !alive(pid))) return;
      await delay(100);
   }
   await signalRecorded(run, 'SIGKILL');
   await delay(200);
}

async function waitFor(label, timeoutMs, fn) {
   const start = Date.now();
   let last = 'none';
   while (Date.now() - start < timeoutMs) {
      try {
         const value = await fn();
         if (value) return value;
         last = JSON.stringify(value);
      } catch (error) {
         last = error instanceof Error ? error.message : String(error);
      }
      await delay(100);
   }
   throw new Error(`${label} timed out (${last})`);
}

async function readWords(page) {
   const words = await page
      .locator('div.h-28 > div')
      .evaluateAll((nodes) =>
         nodes
            .map((node) => (node.textContent || '').trim())
            .filter((word) => word)
      );
   return words;
}

async function waitForPassage(page, min) {
   let previous = '';
   return waitFor('passage', 20000, async () => {
      const words = await readWords(page);
      const joined = words.join('\n');
      const stable = words.length > min && joined === previous;
      previous = joined;
      return stable ? words : null;
   });
}

async function waitForCount(page, count) {
   let previous = '';
   return waitFor(`${count} words`, 20000, async () => {
      const words = await readWords(page);
      const joined = words.join('\n');
      const stable =
         words.length === count && joined.length > 0 && joined === previous;
      previous = joined;
      return stable ? words : null;
   });
}

async function waitForNewPassage(page, before, count) {
   const previousJoined = before.join('\n');
   let last = '';
   return waitFor('restarted passage', 20000, async () => {
      const words = await readWords(page);
      const joined = words.join('\n');
      const longEnough =
         count === undefined ? words.length > 8 : words.length === count;
      const stable = longEnough && joined !== previousJoined && joined === last;
      last = joined;
      return stable ? words : null;
   });
}

async function openHome(page) {
   await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
   return waitForPassage(page, 8);
}

async function clickVisible(page, selector) {
   await page.locator(selector).locator('visible=true').click();
}

async function timerText(page) {
   return (await page.locator('div.text-accent').first().innerText()).trim();
}

async function statText(page, label) {
   const heading = page.getByRole('heading', { name: label });
   const card = heading.locator('..');
   return (await card.locator('p').innerText()).trim();
}

async function storedConfig(page) {
   return page.evaluate(() =>
      JSON.parse(localStorage.getItem('userConfig') || '{}')
   );
}

async function storedResults(page) {
   return page.evaluate(() => ({
      history: JSON.parse(localStorage.getItem('tipohiz.results') || '[]'),
      last: JSON.parse(sessionStorage.getItem('tipohiz.lastResult') || 'null'),
      config: JSON.parse(localStorage.getItem('userConfig') || '{}'),
      theme: localStorage.getItem('theme'),
   }));
}

async function withPage(fn) {
   const browser = await chromium.launch();
   try {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      return await fn(page);
   } finally {
      await browser.close();
   }
}

async function readShell(page) {
   const words = await readWords(page);
   const timer = await timerText(page);
   const login = await page
      .getByRole('link', { name: 'Login', exact: true })
      .count();
   const brand = await page.getByText('TipoHiz.__').count();
   const cookies = await page.context().cookies();
   const sessionCookie = cookies.some((cookie) => /session/i.test(cookie.name));
   return {
      words: words.length,
      timer,
      login: login > 0,
      brand: brand > 0,
      sessionCookie,
      ready:
         words.length > 8 &&
         timer === '30' &&
         login > 0 &&
         brand > 0 &&
         !sessionCookie,
   };
}

async function usableSnapshot(shotPath, timeoutMs) {
   return withPage(async (page) => {
      let ticks = 0;
      const ready = await waitFor(`usable ${baseUrl}`, timeoutMs, async () => {
         ticks += 1;
         if (!page.url().startsWith(baseUrl) || ticks % 20 === 0) {
            await page.goto(`${baseUrl}/`, {
               waitUntil: 'domcontentloaded',
               timeout: 5000,
            });
         }
         const shell = await readShell(page);
         return shell.ready ? shell : null;
      });
      if (shotPath) await page.screenshot({ path: shotPath, fullPage: true });
      return ready;
   });
}

async function sessionStatus() {
   try {
      const response = await fetch(`${baseUrl}/api/auth/get-session`, {
         signal: AbortSignal.timeout(5000),
      });
      return response.status;
   } catch {
      return 0;
   }
}

function assertRepo() {
   const pkg = JSON.parse(
      readFileSync(path.join(repoRoot, 'package.json'), 'utf8')
   );
   if (pkg.name !== 'tipohiz') {
      throw new Error(`expected package tipohiz at ${repoRoot}`);
   }
   if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error(`invalid TIPOHIZ_VERIFY_PORT ${port}`);
   }
}

async function launch() {
   assertRepo();
   const procs = listProcs();
   const existing = await readRun();
   if (
      existing &&
      (alive(existing.pid) || (existing.listenerPids || []).some(alive))
   ) {
      throw new Error(
         `already running at ${baseUrl} (pid ${existing.pid}); cleanup that home first`
      );
   }
   const other = procs.find(isRepoNext);
   if (other) {
      throw new Error(
         `this checkout already has next running as pid ${other.pid}; one dev server per checkout`
      );
   }
   const taken = listenerPids(port);
   if (taken.length > 0) {
      throw new Error(
         `port ${port} is already taken by pid ${taken.join(',')}`
      );
   }

   await mkdir(home, { recursive: true });
   await mkdir(evidenceRoot, { recursive: true });
   const logFd = openSync(logPath, 'w');
   const child = spawn(
      'pnpm',
      ['dev', '--hostname', host, '--port', String(port)],
      {
         cwd: repoRoot,
         env: childEnv(),
         detached: true,
         stdio: ['ignore', logFd, logFd],
      }
   );
   closeSync(logFd);
   if (!child.pid) throw new Error('pnpm dev did not start');
   child.unref();

   const run = {
      pid: child.pid,
      port,
      host,
      cwd: repoRoot,
      gitSha: gitSha(),
      startedAt: new Date().toISOString(),
      listenerPids: [],
      mode: 'next dev',
   };
   await writeJson(runPath, run);

   try {
      const listeners = await waitFor(
         `listeners on ${port}`,
         120000,
         async () => {
            const current = listProcs();
            const pids = listenerPids(port);
            if (pids.length === 0) return null;
            const foreign = pids.filter(
               (pid) => !ancestors(pid, current).includes(run.pid)
            );
            if (foreign.length > 0) {
               throw new Error(
                  `port ${port} is owned by pid ${foreign.join(',')}`
               );
            }
            return pids;
         }
      );
      run.listenerPids = listeners;
      await writeJson(runPath, run);

      const ready = await usableSnapshot(
         path.join(evidenceRoot, 'launch.png'),
         120000
      );

      const launchEvidence = {
         url: baseUrl,
         pid: run.pid,
         listenerPids: run.listenerPids,
         gitSha: run.gitSha,
         mode: run.mode,
         words: ready.words,
         timer: ready.timer,
         guest: true,
      };
      await writeJson(path.join(evidenceRoot, 'launch.json'), launchEvidence);
      console.log(JSON.stringify({ ok: true, ...launchEvidence }));
   } catch (error) {
      const latest = (await readRun()) || run;
      await stopRecorded(latest);
      await rm(runPath, { force: true });
      throw error;
   }
}

async function doctor() {
   const run = await readRun();
   if (!run) throw new Error(`no run file at ${runPath}`);
   const procs = listProcs();
   const processUp = alive(run.pid) || (run.listenerPids || []).some(alive);
   const portOwned = ownsPort(run, procs);
   const sha = gitSha();
   const snap = await usableSnapshot(undefined, 30000);
   const session = await sessionStatus();
   const report = {
      ok:
         processUp &&
         portOwned &&
         sha === run.gitSha &&
         run.mode === 'next dev' &&
         snap.words > 8 &&
         snap.timer === '30' &&
         snap.login &&
         snap.brand &&
         !snap.sessionCookie,
      url: baseUrl,
      pid: run.pid,
      processUp,
      portOwned,
      mode: run.mode,
      gitSha: sha,
      launchedGitSha: run.gitSha,
      words: snap.words,
      timer: snap.timer,
      guest: snap.login && !snap.sessionCookie,
      sessionEndpoint: session,
   };
   console.log(JSON.stringify(report));
   if (!report.ok) process.exitCode = 1;
}

async function assertRunning() {
   const run = await readRun();
   if (!run) throw new Error('run launch before drive');
   const procs = listProcs();
   if (!alive(run.pid) && !(run.listenerPids || []).some(alive)) {
      throw new Error('recorded server is not running');
   }
   if (!ownsPort(run, procs)) {
      throw new Error(`port ${port} is not owned by pid ${run.pid}`);
   }
   return run;
}

async function shot(page, dir, name) {
   await page.screenshot({ path: path.join(dir, name), fullPage: true });
}

async function finishTenWords(page) {
   await openHome(page);
   await clickVisible(page, 'div.category button[value="words"]');
   await waitFor('words palette', 10000, async () => {
      const active = await page
         .locator('div.words')
         .locator('visible=true')
         .getAttribute('data-active');
      return active === 'true' ? true : null;
   });
   await clickVisible(page, 'div.words button[value="10"]');
   const words = await waitForCount(page, 10);
   if ((await page.getByTestId('words-progress').count()) !== 0) {
      throw new Error('words-progress is visible before the first keystroke');
   }
   await page.locator('div.h-28').click();
   await page.keyboard.type((words[0] || 'a').slice(0, 1), { delay: 0 });
   await waitFor('1/10', 10000, async () =>
      (await page.getByTestId('words-progress').innerText()) === '1/10'
         ? true
         : null
   );
   return words;
}

async function typeRest(page, words) {
   await page.keyboard.type(`${(words[0] || '').slice(1)} `, { delay: 0 });
   for (let index = 1; index < words.length; index += 1) {
      await page.keyboard.type(words[index] || '', { delay: 0 });
      if (index < words.length - 1) await page.keyboard.press('Space');
   }
   await waitFor('results url', 20000, async () =>
      page.url().includes('/results') ? page.url() : null
   );
}

async function driveWords(page, dir) {
   const words = await finishTenWords(page);
   await shot(page, dir, 'typing.png');
   await typeRest(page, words);
   await waitFor('wpm', 15000, async () =>
      (await page.getByRole('heading', { name: /^wpm:$/i }).isVisible())
         ? true
         : null
   );
   const mode = await statText(page, /^mode:$/i);
   if (mode !== 'words 10') throw new Error(`mode stat is ${mode}`);
   const stored = await storedResults(page);
   if (
      stored.history[0]?.category !== 'words' ||
      stored.history[0]?.wordCount !== 10
   ) {
      throw new Error('guest history did not record a 10 word test');
   }
   if (!Array.isArray(stored.last?.words) || stored.last.words.length !== 10) {
      throw new Error('last result is missing the 10 typed words');
   }
   await writeJson(path.join(dir, 'storage.json'), stored);
   await shot(page, dir, 'results.png');
   await writeFile(
      path.join(dir, 'results.aria.txt'),
      await page.locator('body').ariaSnapshot()
   );
   await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'domcontentloaded' });
   await waitFor('dashboard row', 15000, async () =>
      (await page.getByText(/10 words/).count()) > 0 ? true : null
   );
   await shot(page, dir, 'dashboard.png');
}

async function driveTime(page, dir) {
   await openHome(page);
   await clickVisible(page, 'div.time button[value="15"]');
   await waitFor('timer 15', 10000, async () =>
      (await timerText(page)) === '15' ? true : null
   );
   const words = await waitForPassage(page, 8);
   await page.locator('div.h-28').click();
   for (const word of words.slice(0, 8)) {
      await page.keyboard.type(`${word} `, { delay: 0 });
   }
   await shot(page, dir, 'typing.png');
   await waitFor('results url', 25000, async () =>
      page.url().includes('/results') ? page.url() : null
   );
   await waitFor('wpm', 15000, async () =>
      (await page.getByRole('heading', { name: /^wpm:$/i }).isVisible())
         ? true
         : null
   );
   if (
      (await page.getByRole('heading', { name: /^accuracy:$/i }).count()) === 0
   ) {
      throw new Error('accuracy heading is missing');
   }
   const stored = await storedResults(page);
   if (stored.history[0]?.category !== 'time') {
      throw new Error('guest history did not record a time test');
   }
   await writeJson(path.join(dir, 'storage.json'), stored);
   await shot(page, dir, 'results.png');
   await writeFile(
      path.join(dir, 'results.aria.txt'),
      await page.locator('body').ariaSnapshot()
   );
}

async function driveRestart(page, dir) {
   await openHome(page);
   await clickVisible(page, 'div.time button[value="15"]');
   const before = await waitForPassage(page, 8);
   await waitFor('timer 15', 10000, async () =>
      (await timerText(page)) === '15' ? true : null
   );
   await page.keyboard.press('Tab');
   await page.keyboard.press('Enter');
   await waitFor('timer reset', 5000, async () =>
      (await timerText(page)) === '15' ? true : null
   );
   const after = await waitForNewPassage(page, before);
   const config = await storedConfig(page);
   if (config.state?.time !== 15 || config.state?.category !== 'time') {
      throw new Error(
         `config after tab restart is ${JSON.stringify(config.state)}`
      );
   }
   await shot(page, dir, 'tab-restart.png');
   await writeJson(path.join(dir, 'after-tab.json'), {
      words: after.length,
      config: config.state,
   });

   await clickVisible(page, 'div.category button[value="words"]');
   const words = await waitForCount(page, 10);
   await page.locator('div.h-28').click();
   await page.keyboard.press('Shift+Enter');
   await waitForNewPassage(page, words, 10);
   const kept = await storedConfig(page);
   if (
      kept.state?.category !== 'words' ||
      kept.state?.time !== 15 ||
      kept.state?.wordCount !== 10
   ) {
      throw new Error(
         `config after shift+enter is ${JSON.stringify(kept.state)}`
      );
   }
   await shot(page, dir, 'shift-enter.png');
   await writeJson(path.join(dir, 'after-shift-enter.json'), kept.state);
}

async function driveResults(page, dir) {
   const words = await finishTenWords(page);
   await typeRest(page, words);
   await waitFor('chart', 15000, async () =>
      (await page.getByRole('heading', { name: 'Speed by second' }).isVisible())
         ? true
         : null
   );
   if (
      (await page
         .getByRole('button', { name: /per-second speed/i })
         .count()) === 0
   ) {
      throw new Error('chart plot is missing');
   }
   const rows = await page.locator('table tbody tr').count();
   if (rows < 1) throw new Error('chart table has no rows');
   const stored = await storedResults(page);
   const reported = Number.parseFloat(await statText(page, /^wpm:$/i));
   const saved = stored.last?.stats?.wpm;
   if (!Number.isFinite(reported) || Math.abs(reported - saved) > 0.11) {
      throw new Error(
         `reported wpm ${reported} does not match stored ${saved}`
      );
   }
   await shot(page, dir, 'results.png');
   await writeFile(
      path.join(dir, 'results.aria.txt'),
      await page.locator('body').ariaSnapshot()
   );
   await writeJson(path.join(dir, 'storage.json'), stored);
   await page.getByRole('link', { name: 'Retake', exact: true }).click();
   await waitFor('home', 15000, async () =>
      new URL(page.url()).pathname === '/' ? true : null
   );
   const again = await waitForCount(page, 10);
   if ((await page.getByTestId('words-progress').count()) !== 0) {
      throw new Error('retake left the word counter up');
   }
   await shot(page, dir, 'retake.png');
   await writeJson(path.join(dir, 'retake.json'), { words: again.length });
}

async function driveThemes(page, dir) {
   await openHome(page);
   const trigger = page.getByRole('button', { name: 'dark-gray', exact: true });
   await waitFor('theme trigger', 15000, async () =>
      (await trigger.count()) > 0 ? true : null
   );
   await trigger.click();
   await waitFor('theme dialog', 10000, async () =>
      (await page.getByRole('heading', { name: 'Choose a Theme' }).isVisible())
         ? true
         : null
   );
   const nord = page.getByRole('button', { name: 'nord', exact: true });
   await nord.hover();
   await waitFor('nord preview', 5000, async () => {
      const html = (await page.locator('html').getAttribute('class')) || '';
      const theme = await page.evaluate(() => localStorage.getItem('theme'));
      return html.includes('nord') && theme !== 'nord' ? true : null;
   });
   await page.getByRole('heading', { name: 'Choose a Theme' }).hover();
   await waitFor('preview cleared', 5000, async () => {
      const html = (await page.locator('html').getAttribute('class')) || '';
      return html.includes('dark-gray') && !html.includes('nord') ? true : null;
   });
   await shot(page, dir, 'preview-cleared.png');
   await nord.click();
   await waitFor('nord saved', 10000, async () => {
      const html = (await page.locator('html').getAttribute('class')) || '';
      const theme = await page.evaluate(() => localStorage.getItem('theme'));
      return html.includes('nord') && theme === 'nord' ? true : null;
   });
   await page.reload({ waitUntil: 'domcontentloaded' });
   await waitForPassage(page, 8);
   const html = (await page.locator('html').getAttribute('class')) || '';
   const theme = await page.evaluate(() => localStorage.getItem('theme'));
   if (!html.includes('nord') || theme !== 'nord') {
      throw new Error(`theme did not survive reload (${theme}, ${html})`);
   }
   await shot(page, dir, 'reloaded.png');
   await writeJson(path.join(dir, 'theme.json'), { theme, html });
}

const drives = {
   time: driveTime,
   words: driveWords,
   restart: driveRestart,
   results: driveResults,
   themes: driveThemes,
};

async function drive(feature) {
   const fn = drives[feature];
   if (!fn) usage();
   const run = await assertRunning();
   const dir = path.join(evidenceRoot, feature);
   await mkdir(dir, { recursive: true });
   await withPage(async (page) => {
      await fn(page, dir);
   });
   await writeJson(path.join(dir, 'meta.json'), {
      feature,
      url: baseUrl,
      gitSha: run.gitSha,
      entry: feature,
   });
   console.log(JSON.stringify({ ok: true, feature, evidence: dir }));
}

async function cleanup() {
   const run = await readRun();
   if (!run) {
      console.log(
         JSON.stringify({ ok: true, stopped: false, evidence: evidenceRoot })
      );
      return;
   }
   await stopRecorded(run);
   await rm(runPath, { force: true });
   await rm(logPath, { force: true });
   console.log(
      JSON.stringify({
         ok: true,
         stopped: true,
         pid: run.pid,
         evidence: evidenceRoot,
      })
   );
}

const [command, feature] = process.argv.slice(2);

try {
   if (command === 'launch') await launch();
   else if (command === 'doctor') await doctor();
   else if (command === 'drive') await drive(feature);
   else if (command === 'cleanup') await cleanup();
   else usage();
} catch (error) {
   const message = error instanceof Error ? error.message : String(error);
   const hint = message.includes("Executable doesn't exist")
      ? '\nInstall the browser with: pnpm exec playwright install chromium'
      : '';
   console.error(message + hint);
   process.exit(1);
}
