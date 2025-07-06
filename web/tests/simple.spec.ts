import { test, expect } from '@playwright/test';

test.describe('Simple Tests', () => {
  test('should visit example.com and verify title', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example Domain/);
  });

  test('should check that basic page operations work', async ({ page }) => {
    await page.goto('https://httpbin.org/html');
    await expect(page.getByRole('heading', { name: 'Herman Melville - Moby Dick' })).toBeVisible();
  });
});