import { mergeStep } from '../src/core/events/eventBuffer';
import { createGotoStep, normalizeClickEvent, normalizeInputEvent, normalizeKeyEvent } from '../src/core/events/normalizeEvent';
import type { RecordingSession, RecorderSettings, RecordingStep, RuntimeMessage } from '../src/shared/types';

export default defineUnlistedScript(() => {
let session: RecordingSession | null = null;
let settings: RecorderSettings | null = null;
let status: 'idle' | 'recording' | 'paused' = 'idle';
let lastUrl = location.href;

function publish() {
  if (!session) return;
  const updatedSession: RecordingSession = { ...session, title: document.title || session.title, url: location.href, updatedAt: new Date().toISOString() };
  session = updatedSession;
  void browser.storage.local.set({ tracewrightActiveSession: updatedSession }).catch(() => undefined);
  void browser.runtime.sendMessage({ type: 'TRACEWRIGHT_STEPS_CHANGED', steps: updatedSession.steps, title: updatedSession.title, url: updatedSession.url } satisfies RuntimeMessage).catch(() => undefined);
}

function addStep(step: RecordingStep) {
  if (!session || status !== 'recording') return;
  session.steps = mergeStep(session.steps, step);
  session.updatedAt = new Date().toISOString();
  publish();
}

function handleClick(event: MouseEvent) {
  if (!session || !settings || status !== 'recording') return;
  const target = event.target instanceof Element ? event.target.closest('button,a,input,select,textarea,[role="button"],[role="link"],[tabindex]') : null;
  if (!target) return;
  addStep(normalizeClickEvent(target, settings.testIdAttribute));
}

function handleInput(event: Event) {
  if (!settings || status !== 'recording') return;
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;
  const step = normalizeInputEvent(target, settings.testIdAttribute);
  if (step) addStep(step);
}

function handleKeydown(event: KeyboardEvent) {
  if (status !== 'recording') return;
  const step = normalizeKeyEvent(event);
  if (step) addStep(step);
}

function checkNavigation() {
  if (!session || status !== 'recording' || location.href === lastUrl) return;
  lastUrl = location.href;
  addStep(createGotoStep(location.href));
}

function attach() {
  document.addEventListener('click', handleClick, true);
  document.addEventListener('input', handleInput, true);
  document.addEventListener('change', handleInput, true);
  document.addEventListener('keydown', handleKeydown, true);
  window.addEventListener('popstate', checkNavigation, true);
  window.setInterval(checkNavigation, 800);
}

attach();

browser.runtime.onMessage.addListener((message: RuntimeMessage) => {
  if (message.type === 'TRACEWRIGHT_START') {
    session = { ...message.session, title: document.title || message.session.title, url: location.href };
    settings = message.settings;
    status = 'recording';
    lastUrl = location.href;
    if (session.steps.length === 0) addStep(createGotoStep(location.href));
    return Promise.resolve({ ok: true, session });
  }
  if (message.type === 'TRACEWRIGHT_PAUSE') {
    status = 'paused';
    if (session) { session.status = 'paused'; void browser.storage.local.set({ tracewrightActiveSession: session }).catch(() => undefined); }
    return Promise.resolve({ ok: true, session });
  }
  if (message.type === 'TRACEWRIGHT_RESUME') {
    status = 'recording';
    if (session) { session.status = 'recording'; void browser.storage.local.set({ tracewrightActiveSession: session }).catch(() => undefined); }
    return Promise.resolve({ ok: true, session });
  }
  if (message.type === 'TRACEWRIGHT_STOP') {
    status = 'idle';
    if (session) session.status = 'idle';
    const stopped = session;
    session = null;
    void browser.storage.local.remove('tracewrightActiveSession').catch(() => undefined);
    return Promise.resolve({ ok: true, session: stopped });
  }
  if (message.type === 'TRACEWRIGHT_GET_STEPS') {
    return Promise.resolve({ ok: true, session });
  }
  return undefined;
});

});
