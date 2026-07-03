import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { stepLogger } from '@utils/logger';

/**
 * BasePage — shared behavior for all Page Objects.
 * Encapsulates waiting strategy, common assertions, and logging
 * so individual page classes stay declarative.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path = '/'): Promise<void> {
    stepLogger(`Navigating to ${path}`);
    await this.page.goto(path);
  }

  async waitForVisible(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async clickWhenReady(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    await locator.click();
  }

  async fillField(locator: Locator, value: string): Promise<void> {
    await this.waitForVisible(locator);
    await locator.fill(value);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async expectUrlContains(fragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }
}
