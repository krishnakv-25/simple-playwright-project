import { test as base, request as playwrightRequest, type APIRequestContext } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { CartPage, CheckoutPage } from '@pages/CartPage';
import { DummyJsonClient } from '@api/clients/DummyJsonClient';
import { config } from '@config/environments';

/**
 * Fixture map — extends Playwright's base test with:
 *  - Page Object instances (auto-instantiated per test, no manual `new` in specs)
 *  - An authenticated `authenticatedPage` fixture (login runs once, reused as a precondition)
 *  - A typed API client bound to a fresh request context per test
 *
 * This keeps spec files declarative: `test('...', async ({ inventoryPage }) => { ... })`
 */
type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authenticatedPage: InventoryPage;
  apiClient: DummyJsonClient;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  // Pre-authenticated session — saves every UI test from repeating login steps
  authenticatedPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(config.defaultUser.username, config.defaultUser.password);
    await page.waitForURL(/inventory/);
    await use(new InventoryPage(page));
  },

  // eslint-disable-next-line no-empty-pattern -- Playwright requires the object destructuring pattern here
  apiClient: async ({}, use) => {
    const context: APIRequestContext = await playwrightRequest.newContext({
      baseURL: config.apiBaseUrl,
    });
    await use(new DummyJsonClient(context));
    await context.dispose();
  },
});

export { expect } from '@playwright/test';
