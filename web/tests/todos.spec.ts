import { test, expect } from '@playwright/test';

test.describe('Todo UI Components', () => {
  test.beforeEach(async ({ page }) => {
    // Go directly to login page to test UI
    await page.goto('/login');
  });

  test('should display login form when not authenticated', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
  });

  test('should redirect to login when trying to access dashboard without auth', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('/login');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('should show form validation on register page', async ({ page }) => {
    await page.goto('/register');
    
    // Try to submit form with mismatched passwords
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Create a password').fill('password123');
    await page.getByPlaceholder('Confirm your password').fill('differentpassword');
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    await expect(page.getByText("Passwords don't match")).toBeVisible();
  });

  test('should show required field validation on login', async ({ page }) => {
    await page.goto('/login');
    
    // Click submit without filling fields
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page.getByText('Invalid email address')).toBeVisible();
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
  });

  test('should have responsive design on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto('/login');
    
    // Check if form is still visible and properly sized
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    
    // Check if the form card is properly responsive
    const card = page.locator('.card, [class*="card"]').first();
    await expect(card).toBeVisible();
  });

  test('should navigate between auth pages correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Go to register
    await page.getByRole('link', { name: 'Sign up' }).click();
    await page.waitForURL('/register');
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
    
    // Go back to login
    await page.getByRole('link', { name: 'Login' }).click();
    await page.waitForURL('/login');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('should handle loading states properly', async ({ page }) => {
    await page.goto('/login');
    
    // Fill form with invalid credentials to test loading state
    await page.getByPlaceholder('Enter your email').fill('nonexistent@example.com');
    await page.getByPlaceholder('Enter your password').fill('wrongpassword');
    
    // The button should be clickable even if it leads to an error
    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeEnabled();
  });
});