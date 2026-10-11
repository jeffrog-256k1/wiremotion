# Contributing

Small, focused improvements are welcome. Please open an issue before adding a new layout or expanding the schema.

Use Node.js 22.12+ and `npm ci`. Run `npm test`, `npm run build`, then `npx playwright install chromium` and `npm run test:browser`. Keep the preview and export on the same renderer. Never add uploads, telemetry, or remote fonts as an incidental change.

Good first contributions:

- Add a short fictional example showing another practical use of one existing template, with a still PNG and description.
- Improve keyboard navigation or error wording, with a reproduction of the problem and a focused verification.
- Improve a translation in `README.ko.md`, `README.zh-CN.md`, `README.ja.md`, or `README.es.md`. Keep the same capabilities and limitations as `README.md` and retain all five language links.

UI messages live in `src/i18n.ts`, in English / Korean / Simplified Chinese / Japanese / Spanish order. TypeScript requires five entries for every message. Add a stable error code for new validation messages; do not translate JSON keys or mutate a user's diagram when changing UI language. The browser checks cover language persistence, optional storage, invalid drafts, exports, and 320px layouts. Technical reference documents and CLI output currently use English.

For rendering changes, check both themes and the smallest/largest supported node counts. Include before/after screenshots generated from fictional data. Generated test files belong in `test-results/`, not in a commit. Only intentionally published samples belong in `assets/`.
