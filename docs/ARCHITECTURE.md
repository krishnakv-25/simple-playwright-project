# Architecture

## Design goals

This framework is built to demonstrate the design decisions a senior SDET is expected to own, not just script individual tests:

1. **Separation of concerns** — Page Objects describe _what_ a page can do, spec files describe _what should happen_, fixtures wire the two together. No locator ever appears in a spec file.
2. **Test-type isolation** — UI, API, visual, and accessibility tests live in separate Playwright _projects_ so they can be triggered, parallelized, and reported on independently in CI.
3. **Fast feedback first** — the CI pipeline runs API tests (seconds) before full cross-browser UI runs (minutes), so a broken contract fails the build before burning browser-matrix time.
4. **No hardcoded test data** — `@faker-js/faker` generates realistic data per run, avoiding collisions and brittle fixtures shared across parallel workers.
5. **Reproducibility** — the entire suite runs identically on a laptop, in Docker, or in GitHub Actions via the official Playwright container image.

## Layers

```
tests/            → WHAT should happen (assertions, business scenarios)
src/fixtures/     → WIRING — instantiates Page Objects & API clients, injects an authenticated session
src/pages/        → HOW to interact with a page (locators, actions)
src/api/          → HOW to call an API (typed client, request/response contracts)
src/utils/        → cross-cutting concerns (logging, data generation)
src/config/       → environment resolution (dev/staging/prod, headless, retries)
```

## Why a fixture-based POM instead of a plain POM

Standard POM still requires every spec to `new LoginPage(page)` and repeat login steps. The custom fixtures in `src/fixtures/test-fixtures.ts` go further:

- Page Objects are injected as typed fixtures (`{ loginPage, inventoryPage }`) — specs never instantiate anything.
- `authenticatedPage` performs login once as a _precondition fixture_, so 90% of tests can skip straight to the scenario under test.
- `apiClient` creates and disposes its own `APIRequestContext` per test, keeping API tests fully isolated from the browser context.

## Test types and what each one catches

| Project                                    | Catches                                                              | Speed           |
| ------------------------------------------ | -------------------------------------------------------------------- | --------------- |
| `api`                                      | Contract breaks, status codes, schema drift, latency SLA breaches    | Seconds         |
| `chromium-ui` / `firefox-ui` / `webkit-ui` | Functional regressions, cross-browser rendering/behavior differences | Minutes         |
| `mobile-chrome`                            | Responsive/mobile-viewport regressions                               | Minutes         |
| `visual`                                   | Unintended UI/CSS changes via pixel-diff snapshots                   | Minutes         |
| `accessibility`                            | WCAG 2.1 A/AA violations via axe-core, tagged by severity            | Seconds–Minutes |

## Reporting

Three reporters run by default: Playwright's built-in HTML report (local debugging, trace viewer), JUnit XML (CI test-result ingestion, e.g. GitHub Checks / Jenkins), and Allure (trend history, categorized failures, suited for stakeholder-facing dashboards).

## Extending the framework

- **New page**: add a class under `src/pages/`, extend `BasePage`, register it as a fixture in `test-fixtures.ts`.
- **New API resource**: add a typed client under `src/api/clients/`, add request/response types to `src/api/types.ts`.
- **New environment**: add an entry to `src/config/environments.ts`; select it via `ENV=staging npm test`.
- **New test tag**: use `@tagname` in the test title and filter with `--grep @tagname` (see `test:smoke` / `test:regression` scripts).
