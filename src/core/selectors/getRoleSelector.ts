import { normalizeText, quoteForPlaywright } from './text';

type RoleMatch = { role: string; name?: string };

function inferRole(element: Element): RoleMatch | null {
  const explicitRole = element.getAttribute('role');
  const text = normalizeText(element.textContent ?? element.getAttribute('aria-label') ?? '');
  if (explicitRole) return { role: explicitRole, name: text || undefined };
  const tag = element.tagName.toLowerCase();
  if (tag === 'button') return { role: 'button', name: text || undefined };
  if (tag === 'a' && element.getAttribute('href')) return { role: 'link', name: text || undefined };
  if (tag === 'select') return { role: 'combobox', name: element.getAttribute('aria-label') ?? undefined };
  if (tag === 'textarea') return { role: 'textbox', name: element.getAttribute('aria-label') ?? undefined };
  if (tag === 'input') {
    const input = element as HTMLInputElement;
    if (['button', 'submit', 'reset'].includes(input.type)) return { role: 'button', name: input.value || text || undefined };
    if (input.type === 'checkbox') return { role: 'checkbox', name: element.getAttribute('aria-label') ?? undefined };
    if (input.type === 'radio') return { role: 'radio', name: element.getAttribute('aria-label') ?? undefined };
    return { role: 'textbox', name: element.getAttribute('aria-label') ?? undefined };
  }
  return null;
}

export function getRoleSelector(element: Element): string | null {
  const match = inferRole(element);
  if (!match) return null;
  if (match.name) return `page.getByRole(${quoteForPlaywright(match.role)}, { name: ${quoteForPlaywright(match.name)} })`;
  return `page.getByRole(${quoteForPlaywright(match.role)})`;
}
