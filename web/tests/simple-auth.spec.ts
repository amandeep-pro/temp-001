import { test, expect } from '@playwright/test';

test.describe('Simple Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for each test
    test.setTimeout(30000);
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Check if page loads
    await expect(page).toHaveTitle(/Todo/);
    
    // Check for login form elements - use more specific selectors to avoid strict mode violations
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should display register page', async ({ page }) => {
    await page.goto('/register', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Check if page loads
    await expect(page).toHaveTitle(/Todo/);
    
    // Check for register form elements - use specific selector for card title
    await expect(page.locator('[data-slot="card-title"]')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your name')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
  });

  test('should navigate between login and register', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Click register link
    await page.getByRole('link', { name: /sign up/i }).click();
    await page.waitForURL(/register/, { timeout: 10000 });
    await expect(page).toHaveURL(/register/);
    
    // Click login link
    await page.getByRole('link', { name: /login/i }).click();
    await page.waitForURL(/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/login/);
  });

  test('should show form validation on login', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Try to submit empty form
    await page.getByRole('button', { name: /login/i }).click();
    
    // Should show validation errors - use more general text matching
    await expect(page.getByText(/invalid.*email/i)).toBeVisible();
    await expect(page.getByText(/password.*6/i)).toBeVisible();
  });

  test('should show form validation on register', async ({ page }) => {
    await page.goto('/register', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Fill mismatched passwords
    await page.getByPlaceholder('Enter your name').fill('Test User');
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Create a password').fill('password123');
    await page.getByPlaceholder('Confirm your password').fill('differentpassword');
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Should show password mismatch error
    await expect(page.getByText(/password.*match/i)).toBeVisible();
  });
});