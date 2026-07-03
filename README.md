# Simple Playwright Project

![Playwright](https://img.shields.io/badge/Playwright-1.51-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node-%E2%89%A520-339933?logo=node.js&logoColor=white)
![CI](https://img.shields.io/github/actions/workflow/status/krishnakv-25/simple-playwright-project/playwright.yml?label=CI&logo=githubactions)
![License](https://img.shields.io/badge/license-MIT-blue)

A production-style test automation framework built with **Playwright + TypeScript**, showcasing the architecture, tooling, and CI/CD practices expected from a senior SDET — not just a folder of `.spec.ts` files.

It exercises two free, public, open-source-friendly demo targets:

- UI: **[saucedemo.com](https://www.saucedemo.com)** — a Sauce Labs e-commerce demo app
- API: **[reqres.in](https://reqres.in)** — a public REST test API

> 📖 See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for design rationale and [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) for contributor guidelines.

---

## Why this project

Most Playwright portfolio repos are a single flat folder of tests. This one is structured the way a real regression suite in a mid-to-large org would be, to demonstrate:

- **Page Object Model** wired through **custom Playwright fixtures** (no `new Page()` calls inside specs, no repeated login boilerplate)
- **API testing** with a typed client layer and contract/negative-case coverage
- **Visual regression testing** with pixel-diff baselines
- **Accessibility testing** (WCAG 2.1 A/AA) via `axe-core`
- **Cross-browser + mobile viewport** coverage (Chromium, Firefox, WebKit, Pixel 7)
- **Data-driven tests** using `@faker-js/faker` instead of hardcoded fixtures
- **Multi-environment config** (dev/staging/prod) via `.env`
- **CI/CD** on GitHub Actions with parallel matrix jobs, staged fast-to-slow feedback, and artifact uploads
- **Dockerized execution** for environment-agnostic runs
- **Structured logging** (`pino`), triple reporting (HTML + JUnit + Allure)
- **Linting, formatting, type-checking, and pre-commit hooks** enforced identically in CI and locally

---

## Tech stack

| Concern            | Tool                                                         |
| ------------------ | ------------------------------------------------------------ |
| Test runner        | Playwright Test                                              |
| Language           | TypeScript (strict mode)                                     |
| API testing        | Playwright `APIRequestContext` + typed client                |
| Accessibility      | `@axe-core/playwright`                                       |
| Test data          | `@faker-js/faker`                                            |
| Logging            | `pino` / `pino-pretty`                                       |
| Reporting          | Playwright HTML, JUnit XML, Allure                           |
| Linting/formatting | ESLint (flat config) + `eslint-plugin-playwright` + Prettier |
| Git hooks          | Husky + lint-staged                                          |
| CI/CD              | GitHub Actions (matrixed, staged)                            |
| Containerization   | Docker + Docker Compose (official Playwright image)          |

---

## Project structure

```
simple-playwright-project/
├── .github/workflows/playwright.yml   # CI pipeline: lint → API → UI matrix → visual/a11y
├── src/
│   ├── pages/                         # Page Object Model
│   ├── api/                           # Typed API client + request/response contracts
│   ├── fixtures/                      # Custom Playwright fixtures (POM + auth + API injection)
│   ├── utils/                         # Logger, Faker-based data generator
│   └── config/                        # Environment resolution (dev/staging/prod)
├── tests/
│   ├── ui/                            # Functional UI specs (login, inventory, checkout)
│   ├── api/                           # API contract & negative-path specs
│   ├── visual/                        # Pixel-diff visual regression specs
│   └── accessibility/                 # axe-core WCAG specs
├── test-data/                         # Static fixture data (users, product names)
├── docs/                              # ARCHITECTURE.md, CONTRIBUTING.md
├── playwright.config.ts               # Multi-project config (ui/api/visual/a11y, per-browser)
├── Dockerfile / docker-compose.yml
└── .github/workflows/playwright.yml
```

---

## Quick start

```bash
git clone https://github.com/krishnakv-25/simple-playwright-project.git
cd simple-playwright-project
npm install
npx playwright install --with-deps
cp .env.example .env

npm test                 # run everything
npm run test:smoke       # fast confidence check (@smoke tagged tests)
npm run test:ui-mode     # Playwright's interactive UI mode
npm run report           # open the last HTML report
```

### Run a specific layer

```bash
npm run test:ui          # cross-browser functional UI tests
npm run test:api         # API contract tests (no browser)
npm run test:visual      # visual regression
npm run test:a11y        # accessibility audit
```

### Run against a different environment

```bash
ENV=staging npm test
```

### Run in Docker

```bash
npm run docker:run
```

---

## Sample test — what a spec looks like

```ts
test('@smoke @e2e user can complete a purchase end to end', async ({ authenticatedPage, cartPage, checkoutPage }) => {
  const checkoutInfo = DataGenerator.checkoutInfo();

  await authenticatedPage.addItemToCartByName('Sauce Labs Backpack');
  await authenticatedPage.goToCart();
  await cartPage.proceedToCheckout();
  await checkoutPage.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);

  await checkoutPage.finishOrder();
  expect(await checkoutPage.getConfirmationText()).toContain('Thank you for your order');
});
```

No selectors, no manual login, no hardcoded data — the fixture and Page Object layers keep the spec reading like a business scenario.

---

## CI/CD pipeline

GitHub Actions runs on every push/PR, nightly on schedule, and on demand:

1. **Lint & type-check** — gate everything else
2. **API tests** — fastest signal, runs first
3. **UI tests** — matrixed across Chromium / Firefox / WebKit in parallel
4. **Visual & accessibility** — run after lint passes, independent of UI matrix
5. **Report artifacts** — HTML/JUnit/Allure results uploaded per job, retained 14 days

See [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml).

---

## Test tagging strategy

| Tag           | Purpose                                       |
| ------------- | --------------------------------------------- |
| `@smoke`      | Minimal set for fast confidence on every push |
| `@regression` | Full functional coverage                      |
| `@e2e`        | Multi-step business-critical flows            |
| `@api`        | API-layer only                                |
| `@visual`     | Pixel-diff snapshots                          |
| `@a11y`       | Accessibility audits                          |
| `@mobile`     | Mobile-viewport specific                      |

```bash
npx playwright test --grep @smoke
```

---

## License

MIT — free to fork and adapt for your own portfolio.
