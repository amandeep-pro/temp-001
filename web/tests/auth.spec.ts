import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should redirect to login page when not authenticated', async ({ page }) => {
    await page.waitForURL('/login');
    await expect(page.getByText('Login')).toBeVisible();
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should display register form', async ({ page }) => {
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

  test('should show validation errors for invalid inputs', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Invalid email address')).toBeVisible();
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    
    // Try with invalid email
    await page.getByPlaceholder('Enter your email').fill('invalid-email');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Invalid email address')).toBeVisible();
    
    // Try with short password
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Enter your password').fill('123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
  });

  test('should show password mismatch error on register', async ({ page }) => {
    await page.goto('/register');
    
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Create a password').fill('password123');
    await page.getByPlaceholder('Confirm your password').fill('password456');
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    await expect(page.getByText("Passwords don't match")).toBeVisible();
  });
});

test.describe('Full Authentication Flow', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'testpass123',
    name: 'Test User'
  };

  test('should register, login, and logout successfully', async ({ page }) => {
    // Register
    await page.goto('/register');
    await page.getByPlaceholder('Enter your name').fill(testUser.name);
    await page.getByPlaceholder('Enter your email').fill(testUser.email);
    await page.getByPlaceholder('Create a password').fill(testUser.password);
    await page.getByPlaceholder('Confirm your password').fill(testUser.password);
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Should redirect to dashboard after registration
    await page.waitForURL('/dashboard');
    await expect(page.getByText(`Welcome, ${testUser.name}`)).toBeVisible();
    
    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    await page.waitForURL('/login');
    
    // Login again
    await page.getByPlaceholder('Enter your email').fill(testUser.email);
    await page.getByPlaceholder('Enter your password').fill(testUser.password);
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Should redirect to dashboard after login
    await page.waitForURL('/dashboard');
    await expect(page.getByText(`Welcome, ${testUser.name}`)).toBeVisible();
  });
});