import { chromium, expect, test } from '@playwright/test';
import { createServer, type Server } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const extensionPath = path.join(root, '.output/chrome-mv3');
const hasSmokePermissions = process.env.TRACEWRIGHT_E2E_HOST_PERMISSIONS === '1';

async function serveFixture(): Promise<{ server: Server; url: string }> {
  const html = await readFile(path.join(root, 'tests/fixtures/login-form.html'), 'utf8');
  const server = createServer((_, response) => {
    response.writeHead(200, { 'content-type': 'text/html' });
    response.end(html);
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Could not start fixture server');
  return { server, url: `http://127.0.0.1:${address.port}/login-form.html` };
}

test.skip(!hasSmokePermissions, 'Requires temporary localhost host permissions for automated extension injection.');

test('records a simple login flow and generates Playwright code', async () => {
  const { server, url } = await serveFixture();
  const context = await chromium.launchPersistentContext('', {
    headless: false,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });
  try {
    const page = await context.newPage();
    await page.goto(url);
    let extensionId = '';
    await expect.poll(async () => {
      const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker', { timeout: 5_000 }).catch(() => null);
      extensionId = worker?.url().split('/')[2] ?? '';
      return extensionId;
    }).not.toBe('');

    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html?recordUrl=${encodeURIComponent(url)}`);
    const [{ id: targetTabId }] = await popup.evaluate((targetUrl) => chrome.tabs.query({}).then((tabs) => tabs.filter((tab) => tab.url === targetUrl).map((tab) => ({ id: tab.id }))), url);
    if (!targetTabId) throw new Error('Could not find target tab');
    await popup.evaluate(async (tabId) => {
      await chrome.scripting.executeScript({ target: { tabId }, files: ['/recorder.js'] });
      const now = new Date().toISOString();
      const session = { id: `e2e-${Date.now()}`, title: 'Smoke flow', url: '', startedAt: now, updatedAt: now, status: 'recording', steps: [] };
      await chrome.tabs.sendMessage(tabId, { type: 'TRACEWRIGHT_START', session, settings: { testIdAttribute: 'data-testid', maxHistoryItems: 20, includeUrlAssertions: true } });
    }, targetTabId);
    await page.getByLabel('Email').fill('smoke@example.com');
    await page.getByLabel('Password').fill('super-secret');
    await page.waitForTimeout(300);
    const active = await popup.evaluate(() => chrome.storage.local.get('tracewrightActiveSession').then((data) => data.tracewrightActiveSession));
    await popup.evaluate((activeSession) => chrome.storage.local.set({ tracewrightActiveSession: activeSession }), active);
    await popup.reload();
    await popup.screenshot({ path: path.join(root, 'store-assets/captures/popup-before-assert.png'), fullPage: true });
    await expect(popup.getByText('fill').first()).toBeVisible();
    await expect(popup.locator('pre')).toContainText('page.getByLabel("Email")');
    await expect(popup.locator('pre')).toContainText('<redacted>');
    await expect(popup.locator('pre')).not.toContainText('super-secret');
    await popup.screenshot({ path: path.join(root, 'store-assets/captures/popup-smoke.png'), fullPage: true });
  } finally {
    await context.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
