import { test, expect } from '../fixtures/baseFixtures';
// Use the storage state generated in auth.setup.ts to run tests without UI login
test.describe('Authentication Flow', { tag: '@smoke' }, () => {
  test('valid user can log in via UI', async ({ loginPage, testUser }) => {
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await loginPage.expectLoggedInAs(testUser.name);
  });

  test('invalid credentials display an error message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('nonexistent_qa_user@example.com', 'WrongPass123!');
    await expect(loginPage.errorMessage).toBeVisible();
  });
});