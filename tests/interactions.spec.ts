import { test, expect } from '../fixtures/baseFixtures';

const searchCases = [
  { query: 'Blue Top', expectedProduct: 'Blue Top' },
  { query: 'Men Tshirt', expectedProduct: 'Men Tshirt' },
  { query: 'Stylish Dress', expectedProduct: 'Stylish Dress' },
];

test.describe('Data-Driven & Browser API Scenarios', { tag: '@regression' }, () => {
  // 1. Dynamically generates 3 independent parallel tests from one data array
  for (const { query, expectedProduct } of searchCases) {
    test(`search product catalog for "${query}"`, async ({ page }) => {
      await page.goto('/products');
      await page.locator('#search_product').fill(query);
      await page.locator('#submit_search').click();

      await expect(page.locator('.productinfo p').first()).toContainText(expectedProduct);
    });
  }

  // 2. Handles a browser confirm() dialog during Contact Us submission
  test('submit Contact Us form and accept JS confirmation dialog', async ({ page }) => {
    await page.goto('/contact_us');

    await page.locator('[data-qa="name"]').fill('Playwright QA');
    await page.locator('[data-qa="email"]').fill('qa@example.com');
    await page.locator('[data-qa="subject"]').fill('Automation Inquiry');
    await page.locator('[data-qa="message"]').fill('Testing JS dialog handling in Playwright.');

    // Register the dialog listener BEFORE triggering the click that opens the alert
    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    await page.locator('[data-qa="submit-button"]').click();

    await expect(page.locator('.status.alert-success')).toHaveText(
      'Success! Your details have been submitted successfully.'
    );
  });
});