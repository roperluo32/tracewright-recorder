import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');

test('chrome build keeps low-risk extension permissions', async () => {
  const manifest = JSON.parse(await readFile(path.join(root, '.output/chrome-mv3/manifest.json'), 'utf8')) as {
    permissions?: string[];
    host_permissions?: string[];
    content_scripts?: unknown[];
  };
  expect(manifest.permissions).toEqual(expect.arrayContaining(['activeTab', 'scripting', 'storage', 'tabs', 'downloads']));
  expect(manifest.host_permissions ?? []).toEqual([]);
  expect(manifest.content_scripts ?? []).toEqual([]);
});
