import { test, expect } from '@fixtures/test-fixtures';
import { config } from '@config/environments';

test.describe('Login', () => {
  test('@smoke user can log in with valid credentials', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.open();
    await loginPage.login(config.defaultUser.username, config.defaultUser.password);

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    expect(await inventoryPage.getItemCount()).toBeGreaterThan(0);
  });

  test('@regression locked-out user sees a descriptive error', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login('locked_out_user', 'secret_sauce');

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorText()).toContain('locked out');
  });

  test('@regression invalid password is rejected', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(config.defaultUser.username, 'wrong_password');

    expect(await loginPage.getErrorText()).toContain('do not match');
  });

  const emptyFieldCases = [
    { username: '', password: 'secret_sauce', expectedFragment: 'Username is required' },
    { username: 'standard_user', password: '', expectedFragment: 'Password is required' },
  ];

  for (const { username, password, expectedFragment } of emptyFieldCases) {
    test(`@regression shows validation error when field missing: "${expectedFragment}"`, async ({ loginPage }) => {
      await loginPage.open();
      await loginPage.login(username, password);
      expect(await loginPage.getErrorText()).toContain(expectedFragment);
    });
  }
});
