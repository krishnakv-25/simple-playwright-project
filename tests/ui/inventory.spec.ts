import { test, expect } from '@fixtures/test-fixtures';

test.describe('Inventory', () => {
  test('@smoke user can add and remove an item from the cart', async ({ authenticatedPage }) => {
    await authenticatedPage.addItemToCartByName('Sauce Labs Backpack');
    expect(await authenticatedPage.getCartCount()).toBe(1);

    await authenticatedPage.removeItemFromCartByName('Sauce Labs Backpack');
    expect(await authenticatedPage.getCartCount()).toBe(0);
  });

  test('@regression cart badge accumulates multiple items', async ({ authenticatedPage }) => {
    await authenticatedPage.addItemToCartByName('Sauce Labs Backpack');
    await authenticatedPage.addItemToCartByName('Sauce Labs Bike Light');
    await authenticatedPage.addItemToCartByName('Sauce Labs Bolt T-Shirt');

    expect(await authenticatedPage.getCartCount()).toBe(3);
  });

  test('@regression products can be sorted A to Z', async ({ authenticatedPage }) => {
    await authenticatedPage.sortBy('az');
    const names = await authenticatedPage.getItemNamesInOrder();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));

    expect(names).toEqual(sorted);
  });

  test('@regression products can be sorted price low to high', async ({ authenticatedPage }) => {
    await authenticatedPage.sortBy('lohi');
    const prices = await authenticatedPage.getItemPricesInOrder();
    const sorted = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sorted);
  });
});
