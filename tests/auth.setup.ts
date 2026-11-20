import { test as setup, expect } from '../fixtures/baseFixtures';

const authFile = '.auth/user.json';

setup('authenticate and save browser storage state', async ({ page, request, loginPage }) => {
  const user = {
    name: 'Playwright Session User',
    email: `session_${Date.now()}@example.com`,
    password: 'Password123!',
  };

  // 1. Create account via API
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
      lastname: 'Session',
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

  // 2. Log in once via UI to capture browser session cookies
  await loginPage.goto();
  await loginPage.login(user.email, user.password);
  await loginPage.expectLoggedInAs(user.name);

  // 3. Persist cookies + localStorage to disk
  await page.context().storageState({ path: authFile });
});