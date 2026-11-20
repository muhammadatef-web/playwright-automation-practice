import { expect, Locator, Page } from '@playwright/test';

export class ProductsPage {
  readonly viewCartLink: Locator;
  readonly cartTable: Locator;

  constructor(private readonly page: Page) {
    this.viewCartLink = this.page.getByRole('link', { name: 'View Cart' });
    this.cartTable = this.page.locator('#cart_info_table');
  }

  async goto() {
    await this.page.goto('/products');
  }

  async addProductToCartById(productId: number) {
    await this.page.locator(`.productinfo a[data-product-id="${productId}"]`).click();
    await this.viewCartLink.click();
  }

  async expectProductInCart(productName: string) {
    await expect(this.cartTable).toContainText(productName);
  }
}