import { test, expect } from '@fixtures/test-fixtures';
import { config } from '@config/environments';

test.describe('Visual regression', () => {
  test('@visual login page matches baseline', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('login-page.png', { fullPage: true });
  });

  test('@visual inventory page matches baseline after login', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(config.defaultUser.username, config.defaultUser.password);
    await page.waitForURL(/inventory/);

    // Mask the price/name grid area if it were dynamic; here everything is static demo data.
    await expect(page).toHaveScreenshot('inventory-page.png', { fullPage: true });
  });

  test('@visual product card renders consistently', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(config.defaultUser.username, config.defaultUser.password);
    await page.waitForURL(/inventory/);

    const firstCard = page.locator('.inventory_item').first();
    await expect(firstCard).toHaveScreenshot('product-card.png');
  });
});
