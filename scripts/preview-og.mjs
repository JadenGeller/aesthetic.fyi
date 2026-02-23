/**
 * Screenshots 5 sample OG cards and opens them in Finder to preview.
 * Starts the Astro dev server automatically.
 *
 * Usage: npm run preview:og
 */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { spawn, execSync } from 'node:child_process';

const SAMPLES = ['brutalism', 'cyberpunk', 'vaporwave', 'cottagecore', 'pastel'];
const OUT_DIR = join(process.cwd(), '.og-samples');
// --- Start dev server ---
console.log('Starting dev server...');
const server = spawn('npx', ['astro', 'dev'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

server.stderr.on('data', (d) => process.stderr.write(d));

let BASE_URL;
await new Promise((resolve, reject) => {
  server.stdout.on('data', (data) => {
    const text = data.toString();
    process.stdout.write(text);
    const match = text.match(/Local\s+(http:\/\/localhost:\d+)/);
    if (match) {
      BASE_URL = match[1];
      resolve();
    }
  });
  server.on('error', reject);
  server.on('exit', (code) => reject(new Error(`Dev server exited with code ${code}`)));
  setTimeout(() => reject(new Error('Dev server timed out')), 30_000);
});

// Small buffer for full startup
await new Promise((r) => setTimeout(r, 800));

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  // 600×314 logical px × deviceScaleFactor 2 = 1200×628 physical px (standard OG size)
  viewport: { width: 600, height: 314 },
  deviceScaleFactor: 2,
});

console.log('\nScreenshotting...');
for (const slug of SAMPLES) {
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/card-preview/${slug}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const outPath = join(OUT_DIR, `${slug}.png`);
  await page.screenshot({ path: outPath });
  await page.close();
  console.log(`  ✓ ${slug}`);
}

await browser.close();
server.kill();

execSync(`open "${OUT_DIR}"`);
console.log(`\nOpened .og-samples/ — check how they look!`);
