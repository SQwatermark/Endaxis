# Field component browser tests

Run `npm run test:browser:fields` after installing dependencies and the supported
Playwright Chromium browser (`npx playwright install chromium`). The dedicated
configuration starts Vite on port 4188 and serves this test-only HTML entry. It
imports the real `DefinitionField`, `DefinitionValueCreator`, and
`NodeInspectorFields` components; no production route or browser-global hook is
added. The ordinary application browser suite excludes this component spec.

Optional environment variables:

- `PLAYWRIGHT_FIELDS_BASE_URL`: an already running Vite origin serving this checkout
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE`: a supported local Chromium executable path

Coverage includes union/optional/array/record reference identity, empty and absent
catalogs, unresolved values, creator cancellation and fresh drafts, optional draft
restoration, rejected node submissions, and Escape discard. P2 adds strict catalog
fixtures, duplicate/invisible identity diagnostics, read-only target navigation,
and submit-time revalidation that retains stale creator drafts. P3 adds atomic string operand literal/read switching, cancellation, and literal draft revalidation after a catalog changes. These browser assertions remain unexecuted in the authoring environment. Host undo checks only
immutable state round-tripping in this fixture. It is **not** application command
history, persistence, or full end-to-end undo verification.

`npm run type-check:browser` validates the test/config TypeScript. `npm run
test:browser:fields -- --list` validates test discovery. Neither runs a browser or
establishes that the assertions pass. The harness Vue entry must also compile.

The initial authoring environment could compile/discover this suite, but could
not run Chromium: both ordinary and approved elevated launch attempts failed at
process-singleton `socket()` with `Operation not permitted`. Its supported cloud
browser separately blocked the loopback harness URL with `ERR_BLOCKED_BY_CLIENT`.
Do not treat those infrastructure failures as a passing browser result; run the
suite in an authorized browser-capable environment.
