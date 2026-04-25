export function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function quoteForPlaywright(value: string): string {
  return JSON.stringify(value);
}
