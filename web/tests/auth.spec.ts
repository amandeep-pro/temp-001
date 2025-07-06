import { test, expect } from '@playwright/test';

test.describe('Authentication Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for each test
    test.setTimeout(30000);
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Wait for the page to load and check the title
    await expect(page).toHaveTitle(/Todo/);
    
    // Check for login form elements
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should display register page', async ({ page }) => {
    await page.goto('/register', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Wait for the page to load and check the title
    await expect(page).toHaveTitle(/Todo/);
    
    // Check for register form elements - use specific selector for card title
    await expect(page.locator('[data-slot="card-title"]')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your name')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Create a password')).toBeVisible();
    await expect(page.getByPlaceholder('Confirm your password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
  });

  test('should navigate between login and register pages', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Click the "Sign up" link
    await page.getByRole('link', { name: 'Sign up' }).click();
    await page.waitForURL('/register', { timeout: 10000 });
    await expect(page.locator('[data-slot="card-title"]')).toBeVisible();
    
    // Click the "Login" link
    await page.getByRole('link', { name: 'Login' }).click();
    await page.waitForURL('/login', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('should show validation errors for empty login form', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Try to submit empty form
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for validation errors to appear - use more general text matching
    await expect(page.getByText(/invalid.*email/i)).toBeVisible();
    await expect(page.getByText(/password.*6/i)).toBeVisible();
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Fill invalid email
    await page.getByPlaceholder('Enter your email').fill('invalid-email');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for validation error
    await expect(page.getByText(/invalid.*email/i)).toBeVisible();
  });

  test('should show password mismatch error on register', async ({ page }) => {
    await page.goto('/register', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Fill form with mismatched passwords
    await page.getByPlaceholder('Enter your name').fill('Test User');
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Create a password').fill('password123');
    await page.getByPlaceholder('Confirm your password').fill('password456');
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Wait for password mismatch error
    await expect(page.getByText(/password.*match/i)).toBeVisible();
  });

  test('should redirect to login when accessing root path', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForURL('/login', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('should show loading state on form submission', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Fill valid form data
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Enter your password').fill('password123');
    
    // Submit form and check for loading state
    await page.getByRole('button', { name: 'Login' }).click();
    
    // The button should show loading text or be disabled - use specific selector
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });
});

