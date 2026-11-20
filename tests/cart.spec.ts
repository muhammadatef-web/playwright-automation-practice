import { test, expect } from '../fixtures/baseFixtures';
import { ProductsPage } from '../pages/ProductsPage';

test.use({ storageState: '.auth/user.json' });

test.describe('Shopping Cart Flow', { tag: '@regression' }, () => {
  test('authenticated user can add a product to cart without UI login', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.goto();

    // Verify the user is already logged in from storageState
    await expect(page.getByText('Logged in as Playwright Session User')).toBeVisible();

    await productsPage.addProductToCartById(1);
    await productsPage.expectProductInCart('Blue Top');
  });
});