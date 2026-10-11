import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, preview } from 'vite';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (args.includes('--help') || !args.length) {
  console.log(
    'Usage: npm run render -- examples/pipeline.json [--out renders/wiremotion] [--force]\nInstall Chromium first: npx playwright install chromium\nOptional: WIREMOTION_BROWSER_CHANNEL=chrome uses installed Chrome.',
  );
  process.exit(0);
}
let output = 'renders/wiremotion',
  force = false;
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--out' && args[i + 1]) output = args[++i];
  else if (args[i] === '--force') force = true;
  else throw new Error(`Unknown or incomplete option: ${args[i]}`);
}
const base = resolve(output),
  name = basename(base);
if (!/^[a-zA-Z0-9_-]+$/.test(name))
  throw new Error(
    'Output name must use letters, numbers, underscores or hyphens, without a file extension.',
  );
const input = await readFile(resolve(args[0]));
if (input.length > 16384) throw new Error('JSON must be 16 KiB or smaller.');
const diagram = JSON.parse(input.toString('utf8'));
for (const suffix of ['gif', 'png', 'md'])
  if (!force) {
    try {
      await access(`${base}.${suffix}`);
      throw new Error(
        `${name}.${suffix} already exists. Choose another --out name or use --force.`,
      );
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
await build({ root, logLevel: 'error' });
const server = await preview({
  root,
  logLevel: 'error',
  preview: { host: '127.0.0.1', port: 0, strictPort: false },
});
let browser;
try {
  browser = await chromium.launch({ channel: process.env.WIREMOTION_BROWSER_CHANNEL || undefined });
  const page = await browser.newPage();
  await page.goto(server.resolvedUrls.local[0]);
  await page.waitForFunction(() => Boolean(window.wiremotion));
  const files = await page.evaluate((input) => window.wiremotion.render(input), diagram);
  await mkdir(dirname(base), { recursive: true });
  await writeFile(`${base}.gif`, Buffer.from(files.gif, 'base64'));
  await writeFile(`${base}.png`, Buffer.from(files.png, 'base64'));
  const snippet = `<picture>\n  <source media="(prefers-reduced-motion: reduce)" srcset="${name}.png">\n  <img src="${name}.gif" alt="Diagram of your workflow" width="${diagram.width || 1280}">\n</picture>\n\n[View the still image](${name}.png)\n`;
  await writeFile(`${base}.md`, snippet);
  console.log(
    `Exported ${name}.gif, ${name}.png, ${name}.md (${(Buffer.byteLength(files.gif, 'base64') / 1048576).toFixed(2)} MiB GIF).`,
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
