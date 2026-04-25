import { describe, expect, it } from 'vitest';
import { generatePlaywrightSpec } from '../../src/core/generator/generatePlaywrightSpec';
import type { RecordingSession } from '../../src/shared/types';

const session: RecordingSession = {
  id: 'one',
  title: 'Checkout flow',
  url: 'https://example.com',
  startedAt: '2026-04-25T00:00:00.000Z',
  updatedAt: '2026-04-25T00:00:00.000Z',
  status: 'idle',
  steps: [
    { id: '1', type: 'goto', url: 'https://example.com', label: 'Go', timestamp: 1 },
    { id: '2', type: 'click', selector: 'page.getByRole("button", { name: "Buy" })', label: 'Click', timestamp: 2 },
    { id: '3', type: 'fill', selector: 'page.getByLabel("Email")', value: 'user@example.com', label: 'Fill', timestamp: 3 },
  ],
};

describe('generatePlaywrightSpec', () => {
  it('exports a runnable Playwright test', () => {
    const code = generatePlaywrightSpec(session, true);
    expect(code).toContain("import { test, expect } from '@playwright/test';");
    expect(code).toContain('await page.goto("https://example.com");');
    expect(code).toContain('await page.getByRole("button", { name: "Buy" }).click();');
    expect(code).toContain('await page.getByLabel("Email").fill("user@example.com");');
    expect(code).toContain('await expect(page).toHaveURL("https://example.com");');
  });
});
