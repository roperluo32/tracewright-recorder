import { normalizeText, quoteForPlaywright } from './text';

export function getTextSelector(element: Element): string | null {
  const tag = element.tagName.toLowerCase();
  if (!['button', 'a', 'summary', 'label'].includes(tag)) return null;
  const text = normalizeText(element.textContent ?? '');
  return text ? `page.getByText(${quoteForPlaywright(text)})` : null;
}
