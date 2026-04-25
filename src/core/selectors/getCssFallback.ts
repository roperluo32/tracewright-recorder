function simpleSelector(element: Element): string {
  const tag = element.tagName.toLowerCase();
  if (element.id) return `${tag}#${CSS.escape(element.id)}`;
  const stableClass = Array.from(element.classList).find((item) => !/^([a-z0-9]{6,}|css-|sc-|_)/i.test(item));
  if (stableClass) return `${tag}.${CSS.escape(stableClass)}`;
  const parent = element.parentElement;
  if (!parent) return tag;
  const siblings = Array.from(parent.children).filter((item) => item.tagName === element.tagName);
  if (siblings.length <= 1) return tag;
  return `${tag}:nth-of-type(${siblings.indexOf(element) + 1})`;
}

export function getCssFallback(element: Element): string {
  const parts: string[] = [];
  let current: Element | null = element;
  while (current && current !== document.documentElement && parts.length < 4) {
    parts.unshift(simpleSelector(current));
    if (current.id) break;
    current = current.parentElement;
  }
  return `page.locator(${JSON.stringify(parts.join(' > '))})`;
}
