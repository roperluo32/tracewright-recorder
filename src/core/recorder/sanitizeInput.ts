const sensitiveNamePattern = /(password|passcode|token|secret|api[-_]?key|auth|credential|private)/i;

export function isSensitiveInput(element: Element): boolean {
  if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) return false;
  const type = element instanceof HTMLInputElement ? element.type.toLowerCase() : '';
  const joined = [element.id, element.getAttribute('name'), element.getAttribute('autocomplete'), element.getAttribute('aria-label'), element.placeholder]
    .filter(Boolean)
    .join(' ');
  return type === 'password' || type === 'hidden' || sensitiveNamePattern.test(joined);
}

export function sanitizeInputValue(element: Element, value: string): { value: string; redacted: boolean } {
  if (isSensitiveInput(element)) return { value: '<redacted>', redacted: true };
  return { value, redacted: false };
}
