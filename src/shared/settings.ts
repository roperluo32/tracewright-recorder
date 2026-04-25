import { extStorage } from './browser';
import { normalizeLocale, type AppLocale } from '../i18n';
import type { RecorderSettings } from './types';

const LOCALE_KEY = 'tracewrightLocale';
const SETTINGS_KEY = 'tracewrightSettings';

export const defaultSettings: RecorderSettings = {
  testIdAttribute: 'data-testid',
  maxHistoryItems: 20,
  includeUrlAssertions: true,
};

export async function getStoredLocale(): Promise<AppLocale> {
  const data = await extStorage.get(LOCALE_KEY);
  return normalizeLocale((data[LOCALE_KEY] as string | undefined) || navigator.language);
}

export async function setStoredLocale(locale: AppLocale): Promise<void> {
  await extStorage.set({ [LOCALE_KEY]: locale });
}

export async function getSettings(): Promise<RecorderSettings> {
  const data = await extStorage.get(SETTINGS_KEY);
  return { ...defaultSettings, ...((data[SETTINGS_KEY] as Partial<RecorderSettings> | undefined) ?? {}) };
}

export async function saveSettings(settings: RecorderSettings): Promise<void> {
  await extStorage.set({ [SETTINGS_KEY]: settings });
}
