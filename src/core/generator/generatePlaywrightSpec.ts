import type { RecordingSession, RecordingStep } from '../../shared/types';

function lineForStep(step: RecordingStep): string | null {
  switch (step.type) {
    case 'goto':
      return step.url ? `  await page.goto(${JSON.stringify(step.url)});` : null;
    case 'click':
      return step.selector ? `  await ${step.selector}.click();` : null;
    case 'fill':
      return step.selector ? `  await ${step.selector}.fill(${JSON.stringify(step.value ?? '')});` : null;
    case 'select':
      return step.selector ? `  await ${step.selector}.selectOption(${JSON.stringify(step.value ?? '')});` : null;
    case 'press':
      return step.selector ? `  await ${step.selector}.press(${JSON.stringify(step.key ?? 'Enter')});` : null;
    default:
      return null;
  }
}

function safeTestName(title: string): string {
  return title.replace(/[\r\n]+/g, ' ').trim().slice(0, 80) || 'recorded flow';
}

export function generatePlaywrightSpec(session: RecordingSession, includeUrlAssertions = true): string {
  const lines = session.steps.map(lineForStep).filter((line): line is string => Boolean(line));
  const lastUrl = [...session.steps].reverse().find((step) => step.type === 'goto' && step.url)?.url;
  const assertions = includeUrlAssertions && lastUrl ? [`  await expect(page).toHaveURL(${JSON.stringify(lastUrl)});`] : [];
  return [
    "import { test, expect } from '@playwright/test';",
    '',
    `test(${JSON.stringify(safeTestName(session.title))}, async ({ page }) => {`,
    ...lines,
    ...assertions,
    '});',
    '',
  ].join('\n');
}
