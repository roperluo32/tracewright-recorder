import { getCssFallback } from './getCssFallback';
import { getLabelSelector } from './getLabelSelector';
import { getRoleSelector } from './getRoleSelector';
import { getTestIdSelector } from './getTestIdSelector';
import { getTextSelector } from './getTextSelector';

export function chooseSelector(element: Element, testIdAttribute = 'data-testid'): string {
  return getTestIdSelector(element, testIdAttribute)
    ?? getLabelSelector(element)
    ?? getRoleSelector(element)
    ?? getTextSelector(element)
    ?? getCssFallback(element);
}
