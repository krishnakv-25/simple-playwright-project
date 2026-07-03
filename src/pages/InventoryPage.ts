import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  private readonly inventoryItems: Locator;
  private readonly cartBadge: Locator;
  private readonly cartIcon: Locator;
  private readonly sortDropdown: Locator;
  private readonly itemNames: Locator;
  private readonly itemPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
  }

  async addItemToCartByName(itemName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: itemName });
    await this.clickWhenReady(item.getByRole('button', { name: /add to cart/i }));
  }

  async removeItemFromCartByName(itemName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: itemName });
    await this.clickWhenReady(item.getByRole('button', { name: /remove/i }));
  }

  async getCartCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) return 0;
    return Number(await this.cartBadge.textContent());
  }

  async goToCart(): Promise<void> {
    await this.clickWhenReady(this.cartIcon);
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getItemNamesInOrder(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async getItemPricesInOrder(): Promise<number[]> {
    const raw = await this.itemPrices.allTextContents();
    return raw.map((p) => Number(p.replace('$', '')));
  }

  async getItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }
}
