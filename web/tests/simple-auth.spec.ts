import { test, expect } from '@playwright/test';

test.describe('Simple Authentication Tests', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    
    // Check if page loads
    await expect(page).toHaveTitle(/Todo/);
    
    // Check for login form elements
    await expect(page.getByText('Login')).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });

  test('should display register page', async ({ page }) => {
    await page.goto('/register');
    
    // Check if page loads
    await expect(page).toHaveTitle(/Todo/);
    
    // Check for register form elements
    await expect(page.getByText('Sign Up')).toBeVisible();
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
  });

  test('should navigate between login and register', async ({ page }) => {
    await page.goto('/login');
    
    // Click register link
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL(/register/);
    
    // Click login link
    await page.getByRole('link', { name: /login/i }).click();
    await expect(page).toHaveURL(/login/);
  });
});