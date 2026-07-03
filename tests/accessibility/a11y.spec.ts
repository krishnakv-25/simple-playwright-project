import { test, expect } from '@fixtures/test-fixtures';
import AxeBuilder from '@axe-core/playwright';
import { config } from '@config/environments';

test.describe('Accessibility (WCAG 2.1 AA)', () => {
  test('@a11y login page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    expect(critical, formatViolations(critical)).toEqual([]);
  });

  test('@a11y inventory page has no critical accessibility violations', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(config.defaultUser.username, config.defaultUser.password);
    await page.waitForURL(/inventory/);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('.inventory_item_img') // decorative product imagery, tracked separately
      .analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    expect(critical, formatViolations(critical)).toEqual([]);
  });
});

function formatViolations(violations: Array<{ id: string; help: string; nodes: unknown[] }>): string {
  if (violations.length === 0) return '';
  return violations.map((v) => `\n• [${v.id}] ${v.help} (${v.nodes.length} node(s))`).join('');
}
