import { test, expect } from '../fixtures/baseFixtures';

test.describe('Network Interception & Mocking', { tag: '@regression' }, () => {
  test('abort product image requests to speed up page load', async ({ page }) => {
    let blockedCount = 0;

    // /products always requests /get_product_picture/* for product thumbnails
    await page.route('**/get_product_picture/**', async (route) => {
      blockedCount++;
      await route.abort();
    });

    await page.goto('/products');
    await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();
    expect(blockedCount).toBeGreaterThan(0);

    // Confirm the browser never rendered the aborted image (naturalWidth === 0)
    const firstImageWidth = await page
      .locator('.productinfo img')
      .first()
      .evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(firstImageWidth).toBe(0);
  });

  test('mock an API JSON payload without hitting the real backend', async ({ page }) => {
    await page.route('**/api/productsList', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          responseCode: 200,
          products: [
            { id: 999, name: 'Mocked Playwright Jacket', price: 'Rs. 1500' },
          ],
        }),
      });
    });

    await page.goto('/');

    // Trigger a browser-level fetch so page.route intercepts it
    const payload = await page.evaluate(async () => {
      const res = await fetch('/api/productsList');
      return res.json();
    });

    expect(payload.products).toHaveLength(1);
    expect(payload.products[0].name).toBe('Mocked Playwright Jacket');
  });

  test('simulate a 500 server error during product search', async ({ page }) => {
    await page.route('**/products?search=*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'text/html',
        body: '<h1>500 Internal Server Error</h1>',
      });
    });

    await page.goto('/products');
    await page.locator('#search_product').fill('Dress');
    await page.locator('#submit_search').click();

    await expect(page.getByRole('heading', { name: '500 Internal Server Error' })).toBeVisible();
  });
});