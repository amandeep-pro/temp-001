import { test, expect } from '@playwright/test';

test.describe('Authentication Pages', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should display register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your name')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Create a password')).toBeVisible();
    await expect(page.getByPlaceholder('Confirm your password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
  });

  test('should navigate between login and register pages', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Sign up' }).click();
    await page.waitForURL('/register');
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
    
    await page.getByRole('link', { name: 'Login' }).click();
    await page.waitForURL('/login');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('should show validation errors for empty login form', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for validation errors to appear
    await expect(page.getByText('Invalid email address')).toBeVisible();
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto('/login');
    
    // Fill invalid email
    await page.getByPlaceholder('Enter your email').fill('invalid-email');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

  test('should show password mismatch error on register', async ({ page }) => {
    await page.goto('/register');
    
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Create a password').fill('password123');
    await page.getByPlaceholder('Confirm your password').fill('password456');
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    await expect(page.getByText("Passwords don't match")).toBeVisible();
  });

  test('should redirect to login when accessing root path', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('/login');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });
});

