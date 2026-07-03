# Contributing

## Getting set up

```bash
git clone https://github.com/krishnakv-25/simple-playwright-project.git
cd simple-playwright-project
npm install
npx playwright install --with-deps
cp .env.example .env
npm run prepare   # installs git hooks
```

## Before opening a PR

```bash
npm run lint
npm run typecheck
npm run format:check
npm test
```

All four must pass locally — the same checks gate CI.

## Conventions

- **Locators**: prefer `getByRole`, `getByPlaceholder`, `getByText` over CSS selectors. Fall back to `data-test` attributes where the app exposes them (SauceDemo does). Avoid XPath and brittle nth-child selectors.
- **Assertions**: use Playwright's web-first `expect(locator).toBeVisible()` style assertions (auto-retrying) rather than manual waits + static assertions.
- **Test tags**: every test should carry at least one of `@smoke`, `@regression`, `@e2e`, `@visual`, `@a11y`, `@api`, `@mobile` in its title so it can be filtered in CI or locally.
- **No sleep/timeouts**: never use `page.waitForTimeout()` as a synchronization strategy. Use `waitFor`, `waitForURL`, or auto-retrying assertions.
- **Page Objects stay dumb**: no assertions inside Page Object methods — they return data/state, specs assert on it.
- **Commit messages**: Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).

## Updating visual baselines

Only update snapshots intentionally, and review the diff:

```bash
npm run test:update-snapshots
```

## Adding a new test

1. Pick the right `tests/<type>/` folder.
2. Reuse or extend a fixture from `src/fixtures/test-fixtures.ts` — don't instantiate Page Objects manually in the spec.
3. Tag the test.
4. Run it in isolation first: `npx playwright test path/to/spec.ts --project=chromium-ui`.
