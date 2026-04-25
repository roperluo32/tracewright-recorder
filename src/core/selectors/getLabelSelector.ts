import { normalizeText, quoteForPlaywright } from './text';

export function getLabelSelector(element: Element): string | null {
  if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) return null;
  const ariaLabel = normalizeText(element.getAttribute('aria-label') ?? '');
  if (ariaLabel) return `page.getByLabel(${quoteForPlaywright(ariaLabel)})`;
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelText = labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? '').map(normalizeText).filter(Boolean).join(' ');
    if (labelText) return `page.getByLabel(${quoteForPlaywright(labelText)})`;
  }
  if (element.id) {
    const label = document.querySelector(`label[for="${CSS.escape(element.id)}"]`);
    const text = normalizeText(label?.textContent ?? '');
    if (text) return `page.getByLabel(${quoteForPlaywright(text)})`;
  }
  const wrappingLabel = element.closest('label');
  const wrappingText = normalizeText(wrappingLabel?.textContent ?? '');
  return wrappingText ? `page.getByLabel(${quoteForPlaywright(wrappingText)})` : null;
}
