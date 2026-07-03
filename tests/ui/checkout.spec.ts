import { test, expect } from '@fixtures/test-fixtures';
import { DataGenerator } from '@utils/data-generator';

test.describe('Checkout flow', () => {
  test('@smoke @e2e user can complete a purchase end to end', async ({ authenticatedPage, cartPage, checkoutPage }) => {
    const checkoutInfo = DataGenerator.checkoutInfo();

    await authenticatedPage.addItemToCartByName('Sauce Labs Backpack');
    await authenticatedPage.addItemToCartByName('Sauce Labs Fleece Jacket');
    await authenticatedPage.goToCart();

    expect(await cartPage.getCartItemCount()).toBe(2);

    await cartPage.proceedToCheckout();
    await checkoutPage.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);

    const total = await checkoutPage.getSummaryTotal();
    expect(total).toMatch(/Total: \$\d+\.\d{2}/);

    await checkoutPage.finishOrder();
    expect(await checkoutPage.getConfirmationText()).toContain('Thank you for your order');
  });

  test('@regression checkout blocks submission when required fields are empty', async ({
    authenticatedPage,
    cartPage,
    checkoutPage,
  }) => {
    await authenticatedPage.addItemToCartByName('Sauce Labs Backpack');
    await authenticatedPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillInfo('', '', '');
    expect(await checkoutPage.getErrorText()).toContain('First Name is required');
  });
});
