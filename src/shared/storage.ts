import { extStorage } from './browser';
import { getSettings } from './settings';
import type { HistoryEntry, RecordingSession } from './types';

const HISTORY_KEY = 'tracewrightRecordingHistory';
const ACTIVE_SESSION_KEY = 'tracewrightActiveSession';

export async function getHistory(): Promise<HistoryEntry[]> {
  const data = await extStorage.get(HISTORY_KEY);
  return Array.isArray(data[HISTORY_KEY]) ? (data[HISTORY_KEY] as HistoryEntry[]) : [];
}

export async function saveRecording(session: RecordingSession): Promise<HistoryEntry[]> {
  const [history, settings] = await Promise.all([getHistory(), getSettings()]);
  const entry: HistoryEntry = { ...session, savedAt: new Date().toISOString(), status: 'idle' };
  const next = [entry, ...history.filter((item) => item.id !== session.id)].slice(0, settings.maxHistoryItems);
  await extStorage.set({ [HISTORY_KEY]: next });
  return next;
}

export async function clearHistory(): Promise<void> {
  await extStorage.remove(HISTORY_KEY);
}

export async function getActiveSession(): Promise<RecordingSession | null> {
  const data = await extStorage.get(ACTIVE_SESSION_KEY);
  return (data[ACTIVE_SESSION_KEY] as RecordingSession | undefined) ?? null;
}

export async function setActiveSession(session: RecordingSession | null): Promise<void> {
  if (session) await extStorage.set({ [ACTIVE_SESSION_KEY]: session });
  else await extStorage.remove(ACTIVE_SESSION_KEY);
}
