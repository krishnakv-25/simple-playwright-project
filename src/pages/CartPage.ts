import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly checkoutButton: Locator;
  private readonly cartItems: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItems = page.locator('.cart_item');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async proceedToCheckout(): Promise<void> {
    await this.clickWhenReady(this.checkoutButton);
  }

  async continueShopping(): Promise<void> {
    await this.clickWhenReady(this.continueShoppingButton);
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return this.cartItems.locator('.inventory_item_name').allTextContents();
  }
}

export class CheckoutPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly completeHeader: Locator;
  private readonly summaryTotalLabel: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('.complete-header');
    this.summaryTotalLabel = page.locator('.summary_total_label');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillField(this.firstNameInput, firstName);
    await this.fillField(this.lastNameInput, lastName);
    await this.fillField(this.postalCodeInput, postalCode);
    await this.clickWhenReady(this.continueButton);
  }

  async getErrorText(): Promise<string> {
    await this.waitForVisible(this.errorMessage);
    return (await this.errorMessage.textContent()) ?? '';
  }

  async finishOrder(): Promise<void> {
    await this.clickWhenReady(this.finishButton);
  }

  async getConfirmationText(): Promise<string> {
    await this.waitForVisible(this.completeHeader);
    return (await this.completeHeader.textContent()) ?? '';
  }

  async getSummaryTotal(): Promise<string> {
    return (await this.summaryTotalLabel.textContent()) ?? '';
  }
}
