# Tracewright Recorder Store Upload Guide

## Current Release

- Version: `0.1.0`
- Chrome package: `release/tracewright-recorder-0.1.0-chrome.zip`
- Edge package: `release/tracewright-recorder-0.1.0-edge.zip`
- Firefox package: `release/tracewright-recorder-0.1.0-firefox.zip`
- Privacy page: `site/privacy.html`
- Store copy source: `docs/store-listing.md`
- Localized copy source: `docs/store-listing-localized.md`
- Store asset index: `docs/store-assets.md`

## Category

Use Developer Tools where available.

## Support

- Support email: `858338966@qq.com`
- Support site: use the public GitHub repository or GitHub Pages URL after deployment.

## Permission Explanation

- `activeTab`: accesses the active tab only after the user starts recording.
- `scripting`: injects the local recorder into the active tab.
- `storage`: saves local settings and recording history.
- `tabs`: reads the active tab title and URL for recording metadata.
- `downloads`: downloads generated `.spec.ts` files.

## Review Notes

Tracewright Recorder records only after the user clicks Start recording. It runs locally, stores recordings in browser storage, redacts password and token-like fields, and does not upload page content, user input, screenshots, or generated tests.

## Upload Order

1. Chrome Web Store: upload `release/tracewright-recorder-0.1.0-chrome.zip`.
2. Microsoft Edge Add-ons: upload `release/tracewright-recorder-0.1.0-edge.zip`.
3. Firefox Add-ons: upload `release/tracewright-recorder-0.1.0-firefox.zip`.

## Pre-submit Check

- Confirm package permissions show no broad host permissions.
- Confirm privacy policy URL is public.
- Confirm screenshots match the current free local-only feature set.
- Confirm there are no mentions of account login, cloud sync, paid plans, or remote test execution.
