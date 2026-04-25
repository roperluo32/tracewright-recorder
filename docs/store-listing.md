# Tracewright Recorder 商店文案草稿

## 标题

Tracewright Recorder

## 短描述

Record browser flows locally and export clean Playwright tests.

## 长描述

Tracewright Recorder helps developers and QA engineers turn manual browser flows into Playwright test drafts.

Start recording on the active tab, complete your flow, then copy or download a generated `.spec.ts` file. Tracewright focuses on readable selectors and local-first privacy.

### Features

- Record clicks, input, select changes, keyboard actions, and navigation.
- Export Playwright TypeScript test code.
- Prefer test id, label, role, and text selectors before CSS fallback.
- Redact password and token-like fields by default.
- Save recent recordings locally.
- Configure the test id attribute and URL assertion behavior.

### Privacy

Tracewright works locally. It does not upload page content, screenshots, user input, or generated tests.

### Permissions

- activeTab: access the active tab only after the user starts recording.
- scripting: inject the local recorder into the active tab.
- storage: save local settings and recording history.
- tabs: read the active tab title and URL.
- downloads: download generated `.spec.ts` files.

## 关键词

Playwright, test recorder, QA automation, browser testing, E2E testing, developer tools, test generator.
