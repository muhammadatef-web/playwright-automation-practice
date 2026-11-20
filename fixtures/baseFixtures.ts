import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export type TestUser = {
  name: string;
  email: string;
  password: string;
};

type CustomFixtures = {
  loginPage: LoginPage;
  testUser: TestUser;
};

export const test = base.extend<CustomFixtures>({
  // Overrides Playwright's built-in 'page' fixture (no need to add 'page' to CustomFixtures)
  page: async ({ page }, use) => {
    await page.route('**/*{googlesyndication,doubleclick}*', (route) => route.abort());
    await use(page);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  testUser: async ({ request }, use) => {
    const user: TestUser = {
      name: 'Playwright QA',
      email: `qa_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`,
      password: 'Password123!',
    };

    const createRes = await request.post('/api/createAccount', {
      form: {
        name: user.name,
        email: user.email,
        password: user.password,
        title: 'Mr',
        birth_date: '10',
        birth_month: '5',
        birth_year: '1995',
        firstname: 'Playwright',
        lastname: 'QA',
        company: 'QA Lab',
        address1: '123 Test St',
        address2: '',
        country: 'United States',
        zipcode: '10001',
        state: 'NY',
        city: 'New York',
        mobile_number: '1234567890',
      },
    });
    expect(createRes.ok()).toBeTruthy();

    await use(user);

    await request.delete('/api/deleteAccount', {
      form: { email: user.email, password: user.password },
    });
  },
});

export { expect };