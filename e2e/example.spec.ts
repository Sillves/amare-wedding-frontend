import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Amare/);
});

test('login page is accessible', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
});

test.describe('visual regression', () => {
  test('landing page screenshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('landing-page.png');
  });

  test('login page screenshot', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveScreenshot('login-page.png');
  });
});
