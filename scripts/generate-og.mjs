/**
 * Generates OG images for all 86 aesthetics → public/og/[slug].png
 * Run whenever cards change: npm run generate:og
 */

import { chromium } from 'playwright';
import { mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const DATA_DIR = join(process.cwd(), 'src/data/aesthetics');
const OUT_DIR = join(process.cwd(), 'public/og');
const CONCURRENCY = 6;

const files = await readdir(DATA_DIR);
const slugs = files.filter((f) => f.endsWith('.yaml')).map((f) => f.replace('.yaml', ''));

// --- Start dev server ---
console.log(`Generating OG images for ${slugs.length} aesthetics...\n`);
const server = spawn('npx', ['astro', 'dev'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});
server.stderr.on('data', (d) => process.stderr.write(d));

let BASE_URL;
await new Promise((resolve, reject) => {
  server.stdout.on('data', (data) => {
    const text = data.toString();
    const match = text.match(/Local\s+(http:\/\/localhost:\d+)/);
    if (match) { BASE_URL = match[1]; resolve(); }
  });
  server.on('error', reject);
  server.on('exit', (code) => reject(new Error(`Dev server exited (${code})`)));
  setTimeout(() => reject(new Error('Dev server timed out')), 30_000);
});
await new Promise((r) => setTimeout(r, 800));

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 400, height: 210 },
  deviceScaleFactor: 3,
});

// Homepage OG card — use 2x scale so content isn't blown up as much
const homeContext = await browser.newContext({
  viewport: { width: 600, height: 315 },
  deviceScaleFactor: 2,
});
const homePage = await homeContext.newPage();
await homePage.goto(`${BASE_URL}/card-preview/`, { waitUntil: 'networkidle' });
await homePage.evaluate(() => document.fonts.ready);
await homePage.screenshot({ path: join(OUT_DIR, 'index.png') });
await homePage.close();
await homeContext.close();
console.log('  ✓ index (homepage)');

let done = 0;
async function screenshotSlug(slug) {
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/card-preview/${slug}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(OUT_DIR, `${slug}.png`) });
  await page.close();
  done++;
  process.stdout.write(`\r  ${done}/${slugs.length}  ✓ ${slug.padEnd(30)}`);
}

// Run in parallel batches
for (let i = 0; i < slugs.length; i += CONCURRENCY) {
  await Promise.all(slugs.slice(i, i + CONCURRENCY).map(screenshotSlug));
}

await browser.close();
server.kill();
console.log(`\n\nDone. ${slugs.length} images written to public/og/`);
