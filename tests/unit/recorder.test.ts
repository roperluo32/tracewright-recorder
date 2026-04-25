import { describe, expect, it } from 'vitest';
import { mergeStep } from '../../src/core/events/eventBuffer';
import { isSensitiveInput, sanitizeInputValue } from '../../src/core/recorder/sanitizeInput';
import type { RecordingStep } from '../../src/shared/types';

describe('sanitizeInputValue', () => {
  it('redacts password values', () => {
    const input = document.createElement('input');
    input.type = 'password';
    expect(isSensitiveInput(input)).toBe(true);
    expect(sanitizeInputValue(input, 'secret')).toEqual({ value: '<redacted>', redacted: true });
  });

  it('keeps regular text values', () => {
    const input = document.createElement('input');
    input.name = 'email';
    expect(sanitizeInputValue(input, 'user@example.com')).toEqual({ value: 'user@example.com', redacted: false });
  });
});

describe('mergeStep', () => {
  it('coalesces consecutive fill steps for the same selector', () => {
    const first: RecordingStep = { id: 'a', type: 'fill', selector: 'page.getByLabel("Email")', value: 'u', label: 'Fill', timestamp: 1 };
    const second: RecordingStep = { id: 'b', type: 'fill', selector: 'page.getByLabel("Email")', value: 'user@example.com', label: 'Fill', timestamp: 2 };
    expect(mergeStep([first], second)).toEqual([{ ...second, id: 'a' }]);
  });
});
