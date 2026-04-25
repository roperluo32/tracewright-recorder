# Tracewright Recorder

Tracewright Recorder is a free browser extension that records browser flows locally and exports clean Playwright tests.

## MVP Features

- Start, pause, resume, and stop recording on the active tab.
- Capture navigation, clicks, text input, select changes, and key presses.
- Prefer readable selectors such as test id, label, role, and text before CSS fallback.
- Redact password and token-like inputs by default.
- Preview, copy, and download generated `.spec.ts` Playwright code.
- Store recent recordings locally in browser storage.
- Configure locale, test id attribute, URL assertions, and history size.

## Privacy

Tracewright records only after the user starts recording. Recording data stays in browser storage and is not uploaded by the extension.

## Development

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm build:chrome
pnpm build:firefox
```
