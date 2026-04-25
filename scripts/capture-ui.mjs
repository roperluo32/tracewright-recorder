import { chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const extensionPath = path.join(root, '.output/chrome-mv3');
const outDir = path.join(root, 'store-assets/captures');

const context = await chromium.launchPersistentContext('', {
  headless: false,
  viewport: { width: 1280, height: 900 },
  args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
});
try {
  let extensionId = '';
  const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker', { timeout: 5000 });
  extensionId = worker.url().split('/')[2];

  const popup = await context.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  await popup.screenshot({ path: path.join(outDir, 'popup-empty.png'), fullPage: true });

  const options = await context.newPage();
  await options.goto(`chrome-extension://${extensionId}/options.html`);
  await options.screenshot({ path: path.join(outDir, 'options.png'), fullPage: true });
} finally {
  await context.close();
}
