# Contributing

Small, focused improvements are welcome. Please open an issue before adding a new layout or expanding the schema.

Use Node.js 22.12+ and `npm ci`. Run `npm test`, `npm run build`, then `npx playwright install chromium` and `npm run test:browser`. Keep the preview and export on the same renderer. Never add uploads, telemetry, or remote fonts as an incidental change.

Good first contributions:

- Add a short fictional example showing another practical use of one existing template, with a still PNG and description.
- Improve keyboard navigation or error wording, with a reproduction of the problem and a focused verification.

For rendering changes, check both themes and the smallest/largest supported node counts. Include before/after screenshots generated from fictional data. Generated test files belong in `test-results/`, not in a commit. Only intentionally published samples belong in `assets/`.
