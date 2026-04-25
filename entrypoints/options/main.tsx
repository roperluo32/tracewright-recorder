import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { localeNames, supportedLocales, t, type AppLocale } from '../../src/i18n';
import { getSettings, getStoredLocale, saveSettings, setStoredLocale } from '../../src/shared/settings';
import { clearHistory, getHistory } from '../../src/shared/storage';
import type { HistoryEntry, RecorderSettings } from '../../src/shared/types';
import './options.css';

function App() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [locale, setLocale] = useState<AppLocale>('en');
  const [settings, setSettings] = useState<RecorderSettings>({ testIdAttribute: 'data-testid', maxHistoryItems: 20, includeUrlAssertions: true });
  const [notice, setNotice] = useState('');

  useEffect(() => { void Promise.all([getHistory(), getStoredLocale(), getSettings()]).then(([items, storedLocale, storedSettings]) => { setHistory(items); setLocale(storedLocale); setSettings(storedSettings); }); }, []);

  async function resetHistory() {
    await clearHistory();
    setHistory([]);
  }

  async function changeLocale(next: AppLocale) {
    setLocale(next);
    await setStoredLocale(next);
  }

  async function persistSettings() {
    await saveSettings(settings);
    setNotice(t(locale, 'settingsSaved'));
  }

  return <main className="options-shell"><section className="panel">
    <p className="kicker">{t(locale, 'optionsKicker')}</p>
    <h1>{t(locale, 'optionsTitle')}</h1>
    <p>{t(locale, 'optionsBody')}</p>
    <label>{t(locale, 'language')}<select value={locale} onChange={(event) => void changeLocale(event.target.value as AppLocale)}>{supportedLocales.map((item) => <option key={item} value={item}>{localeNames[item]}</option>)}</select></label>
    <label>{t(locale, 'testIdAttribute')}<input value={settings.testIdAttribute} onChange={(event) => setSettings({ ...settings, testIdAttribute: event.target.value.trim() || 'data-testid' })} /></label>
    <label>{t(locale, 'maxHistoryItems')}<input type="number" min="1" max="100" value={settings.maxHistoryItems} onChange={(event) => setSettings({ ...settings, maxHistoryItems: Number(event.target.value) || 20 })} /></label>
    <label className="checkbox"><input type="checkbox" checked={settings.includeUrlAssertions} onChange={(event) => setSettings({ ...settings, includeUrlAssertions: event.target.checked })} />{t(locale, 'includeUrlAssertions')}</label>
    <div className="actions"><button className="primary" onClick={persistSettings}>{t(locale, 'saveSettings')}</button><button onClick={resetHistory}>{t(locale, 'clearHistory')}</button></div>
    {notice && <div className="notice">{notice}</div>}
    <div className="history-count">{t(locale, 'savedRecordings')}: {history.length}</div>
  </section></main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
