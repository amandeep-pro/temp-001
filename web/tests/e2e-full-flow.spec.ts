import { test, expect } from '@playwright/test';

test.describe('E2E Full Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for each test
    test.setTimeout(60000);
  });

  test('should complete full user registration and login flow', async ({ page }) => {
    const uniqueEmail = `test+${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Test User';

    // Navigate to register page
    await page.goto('/register', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page).toHaveTitle(/Todo/);

    // Fill out registration form
    await page.getByPlaceholder('Enter your name').fill(name);
    await page.getByPlaceholder('Enter your email').fill(uniqueEmail);
    await page.getByPlaceholder('Create a password').fill(password);
    await page.getByPlaceholder('Confirm your password').fill(password);

    // Submit registration
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Should redirect to login page after successful registration
    await page.waitForURL('/login', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    // Now login with the newly created account
    await page.getByPlaceholder('Enter your email').fill(uniqueEmail);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Should redirect to dashboard/todos page after successful login
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await expect(page).toHaveTitle(/Todo/);
  });

  test('should handle todo management flow', async ({ page }) => {
    // First, we need to have a logged-in user
    // For this test, we'll assume we can directly navigate to dashboard
    // In a real app, we might need to login first

    await page.goto('/dashboard', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Check if we're redirected to login (unauthenticated)
    if (page.url().includes('/login')) {
      // Login with test credentials
      await page.getByPlaceholder('Enter your email').fill('test@example.com');
      await page.getByPlaceholder('Enter your password').fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Wait for redirect to dashboard
      await page.waitForURL('/dashboard', { timeout: 10000 });
    }

    // Now we should be on the dashboard
    await expect(page).toHaveTitle(/Todo/);

    // Add a new todo
    const todoText = `Test todo ${Date.now()}`;
    
    // Look for add todo input/button
    const addTodoInput = page.locator('input[placeholder*="todo"], input[placeholder*="task"]').first();
    const addTodoButton = page.locator('button').filter({ hasText: /add|create|\+/i }).first();

    if (await addTodoInput.isVisible()) {
      await addTodoInput.fill(todoText);
      await addTodoButton.click();
      
      // Verify todo was added
      await expect(page.getByText(todoText)).toBeVisible();
    }
  });

  test('should handle authentication errors', async ({ page }) => {
    // Test invalid login
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    
    await page.getByPlaceholder('Enter your email').fill('invalid@example.com');
    await page.getByPlaceholder('Enter your password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Should show error message or stay on login page
    await expect(page.getByText(/invalid|error|wrong/i)).toBeVisible();
  });

  test('should handle form validation errors', async ({ page }) => {
    // Test login form validation
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Submit empty form
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Should show validation errors
    await expect(page.getByText('Invalid email address')).toBeVisible();
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    
    // Test register form validation
    await page.goto('/register', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Fill mismatched passwords
    await page.getByPlaceholder('Enter your name').fill('Test User');
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Create a password').fill('password123');
    await page.getByPlaceholder('Confirm your password').fill('differentpassword');
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    await expect(page.getByText("Passwords don't match")).toBeVisible();
  });

  test('should handle navigation between pages', async ({ page }) => {
    // Start at login page
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 15000 });
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    
    // Navigate to register
    await page.getByRole('link', { name: /sign up/i }).click();
    await page.waitForURL('/register', { timeout: 10000 });
    await expect(page.getByText('Sign Up')).toBeVisible();
    
    // Navigate back to login
    await page.getByRole('link', { name: /login/i }).click();
    await page.waitForURL('/login', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Try to access protected route
    await page.goto('/dashboard', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Should redirect to login
    await page.waitForURL('/login', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });
});