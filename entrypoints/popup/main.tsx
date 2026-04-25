import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Clipboard, Download, Pause, Play, Save, Settings, Square, Trash2 } from 'lucide-react';
import { generatePlaywrightSpec } from '../../src/core/generator/generatePlaywrightSpec';
import { localeNames, supportedLocales, t, type AppLocale } from '../../src/i18n';
import { extTabs } from '../../src/shared/browser';
import { getSettings } from '../../src/shared/settings';
import { getStoredLocale, setStoredLocale } from '../../src/shared/settings';
import { getActiveSession, getHistory, saveRecording, setActiveSession } from '../../src/shared/storage';
import type { HistoryEntry, RecordingSession, RecorderStatus, RuntimeMessage } from '../../src/shared/types';
import './popup.css';

function newSession(tab: Awaited<ReturnType<typeof extTabs.query>>[number]): RecordingSession {
  const now = new Date().toISOString();
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: tab.title || 'Recorded flow',
    url: tab.url || '',
    startedAt: now,
    updatedAt: now,
    status: 'recording',
    steps: [],
  };
}

function isInternalUrl(url = '') {
  return /^(chrome|edge|about|moz-extension|chrome-extension):/.test(url);
}

function App() {
  const [locale, setLocale] = useState<AppLocale>('en');
  const [session, setSession] = useState<RecordingSession | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [includeAssertions, setIncludeAssertions] = useState(true);

  useEffect(() => { void refreshState(); }, []);
  useEffect(() => {
    const listener = (message: RuntimeMessage) => {
      if (message.type === 'TRACEWRIGHT_STEPS_CHANGED') {
        setSession((current) => {
          if (!current) return current;
          const updated = { ...current, title: message.title || current.title, url: message.url || current.url, steps: message.steps, updatedAt: new Date().toISOString() };
          void setActiveSession(updated);
          return updated;
        });
      }
    };
    browser.runtime.onMessage.addListener(listener);
    return () => browser.runtime.onMessage.removeListener(listener);
  }, []);

  async function refreshState() {
    const [savedHistory, storedLocale, active, settings] = await Promise.all([getHistory(), getStoredLocale(), getActiveSession(), getSettings()]);
    setHistory(savedHistory);
    setLocale(storedLocale);
    setIncludeAssertions(settings.includeUrlAssertions);
    if (active) {
      setSession(active);
      setStatus(active.status);
    }
  }

  async function currentTab() {
    const params = new URLSearchParams(window.location.search);
    const forcedTabId = params.get('tabId');
    const forcedRecordUrl = params.get('recordUrl');
    const tab = forcedTabId
      ? await extTabs.get(Number(forcedTabId))
      : forcedRecordUrl
        ? (await extTabs.query({})).find((candidate) => candidate.url === forcedRecordUrl || candidate.url?.startsWith(forcedRecordUrl))
        : (await extTabs.query({ active: true, currentWindow: true }))[0];
    if (!tab?.id) throw new Error(t(locale, 'cannotFindTab'));
    if (isInternalUrl(tab.url)) throw new Error(t(locale, 'internalPage'));
    return tab;
  }

  async function sendToTab(tabId: number, message: RuntimeMessage) {
    return browser.tabs.sendMessage(tabId, message).catch(async () => {
      await browser.scripting.executeScript({ target: { tabId }, files: ['/recorder.js'] });
      return browser.tabs.sendMessage(tabId, message);
    });
  }

  async function startRecording() {
    setError('');
    setNotice('');
    try {
      const tab = await currentTab();
      const settings = await getSettings();
      const nextSession = newSession(tab);
      const response = await sendToTab(tab.id!, { type: 'TRACEWRIGHT_START', session: nextSession, settings }) as { session?: RecordingSession };
      const startedSession = response.session ?? nextSession;
      setSession(startedSession);
      setStatus('recording');
      await setActiveSession(startedSession);
    } catch (recordingError) {
      setError(recordingError instanceof Error ? recordingError.message : t(locale, 'recordingFailed'));
    }
  }

  async function pauseRecording() {
    const tab = await currentTab();
    await sendToTab(tab.id!, { type: 'TRACEWRIGHT_PAUSE' });
    setStatus('paused');
    if (session) await setActiveSession({ ...session, status: 'paused' });
  }

  async function resumeRecording() {
    const tab = await currentTab();
    await sendToTab(tab.id!, { type: 'TRACEWRIGHT_RESUME' });
    setStatus('recording');
    if (session) await setActiveSession({ ...session, status: 'recording' });
  }

  async function stopRecording() {
    if (!session) return;
    const tab = await currentTab();
    const response = await sendToTab(tab.id!, { type: 'TRACEWRIGHT_STOP' }) as { session?: RecordingSession };
    const finalSession = { ...(response.session ?? session), steps: session.steps, title: session.title, url: session.url, status: 'idle' as const };
    const nextHistory = await saveRecording(finalSession);
    await setActiveSession(null);
    setSession(finalSession);
    setHistory(nextHistory);
    setStatus('idle');
  }

  function deleteStep(id: string) {
    setSession((current) => current ? { ...current, steps: current.steps.filter((step) => step.id !== id), updatedAt: new Date().toISOString() } : current);
  }

  function clearSteps() {
    setSession((current) => current ? { ...current, steps: [], updatedAt: new Date().toISOString() } : current);
  }

  async function changeLocale(next: AppLocale) {
    setLocale(next);
    await setStoredLocale(next);
  }

  const code = useMemo(() => session ? generatePlaywrightSpec(session, includeAssertions) : '', [includeAssertions, session]);

  async function copyCode() {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setNotice(t(locale, 'copied'));
  }

  function downloadCode() {
    if (!code) return;
    const url = URL.createObjectURL(new Blob([code], { type: 'text/typescript' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(session?.title || 'tracewright-recording').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'tracewright-recording'}.spec.ts`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return <main className="popup-shell">
    <section className="hero">
      <div><p className="eyebrow">{t(locale, 'eyebrow')}</p><h1>Tracewright Recorder</h1><p className="subcopy">{t(locale, 'subcopy')}</p></div>
      <select value={locale} onChange={(event) => void changeLocale(event.target.value as AppLocale)} aria-label="Language">{supportedLocales.map((item) => <option key={item} value={item}>{localeNames[item]}</option>)}</select>
    </section>

    <section className="actions">
      {status === 'idle' && <button className="primary" onClick={startRecording}><Play size={16} /> {t(locale, 'start')}</button>}
      {status === 'recording' && <button onClick={pauseRecording}><Pause size={16} /> {t(locale, 'pause')}</button>}
      {status === 'paused' && <button onClick={resumeRecording}><Play size={16} /> {t(locale, 'resume')}</button>}
      {status !== 'idle' && <button className="danger" onClick={stopRecording}><Square size={16} /> {t(locale, 'stop')}</button>}
      <button onClick={() => browser.runtime.openOptionsPage()}><Settings size={16} /></button>
    </section>

    {error && <div className="notice error">{error}</div>}
    {notice && <div className="notice">{notice}</div>}

    {session ? <>
      <section className="session-card"><strong>{session.title}</strong><span>{session.url}</span><em>{status}</em></section>
      <section className="panel-header"><h2>{t(locale, 'steps')} <span>{session.steps.length}</span></h2><button onClick={clearSteps}><Trash2 size={14} /> {t(locale, 'clear')}</button></section>
      <section className="steps">{session.steps.length === 0 ? <p>{t(locale, 'noSteps')}</p> : session.steps.map((step, index) => <article key={step.id}><span>{index + 1}</span><div><strong>{step.type}</strong><code>{step.selector || step.url}</code>{step.value && <small>{step.redacted ? '<redacted>' : step.value}</small>}</div><button onClick={() => deleteStep(step.id)} aria-label={t(locale, 'delete')}><Trash2 size={14} /></button></article>)}</section>
      <section className="panel-header"><h2>{t(locale, 'codePreview')}</h2><div><button onClick={copyCode}><Clipboard size={14} /> {t(locale, 'copy')}</button><button onClick={downloadCode}><Download size={14} /> {t(locale, 'download')}</button></div></section>
      <pre className="code-preview"><code>{code}</code></pre>
    </> : <section className="empty-state"><div className="stamp">TW</div><p>{t(locale, 'empty')}</p></section>}

    <section className="history"><h2>{t(locale, 'recentRecordings')}</h2>{history.slice(0, 5).map((entry) => <button key={entry.id} onClick={() => { setSession(entry); setStatus('idle'); }}><Save size={14} /><strong>{entry.title}</strong><span>{entry.steps.length}</span></button>)}</section>
  </main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
