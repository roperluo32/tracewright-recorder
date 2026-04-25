import { quoteForPlaywright } from './text';

export function getTestIdSelector(element: Element, testIdAttribute = 'data-testid'): string | null {
  const value = element.getAttribute(testIdAttribute);
  return value ? `page.getByTestId(${quoteForPlaywright(value)})` : null;
}
