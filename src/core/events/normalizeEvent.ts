import type { RecordingStep } from '../../shared/types';
import { chooseSelector } from '../selectors/chooseSelector';
import { sanitizeInputValue } from '../recorder/sanitizeInput';

function stepId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createGotoStep(url: string): RecordingStep {
  return { id: stepId(), type: 'goto', url, label: `Go to ${url}`, timestamp: Date.now() };
}

export function normalizeInputEvent(element: Element, testIdAttribute: string): RecordingStep | null {
  if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) return null;
  const selector = chooseSelector(element, testIdAttribute);
  if (element instanceof HTMLSelectElement) {
    return { id: stepId(), type: 'select', selector, value: element.value, label: `Select ${element.value}`, timestamp: Date.now() };
  }
  const sanitized = sanitizeInputValue(element, element.value);
  return { id: stepId(), type: 'fill', selector, value: sanitized.value, label: sanitized.redacted ? 'Fill redacted value' : `Fill ${sanitized.value}`, timestamp: Date.now(), redacted: sanitized.redacted };
}

export function normalizeClickEvent(element: Element, testIdAttribute: string): RecordingStep {
  const selector = chooseSelector(element, testIdAttribute);
  return { id: stepId(), type: 'click', selector, label: `Click ${selector}`, timestamp: Date.now() };
}

export function normalizeKeyEvent(event: KeyboardEvent): RecordingStep | null {
  if (!['Enter', 'Escape', 'Tab'].includes(event.key)) return null;
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return null;
  return { id: stepId(), type: 'press', selector: chooseSelector(target), key: event.key, label: `Press ${event.key}`, timestamp: Date.now() };
}
