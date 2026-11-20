import { test, expect } from '../fixtures/baseFixtures';

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