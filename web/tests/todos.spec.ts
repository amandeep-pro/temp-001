import { test, expect } from '@playwright/test';

test.describe('Todos', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'testpass123',
    name: 'Test User'
  };

  test.beforeEach(async ({ page }) => {
    // Register and login before each test
    await page.goto('/register');
    await page.getByPlaceholder('Enter your name').fill(testUser.name);
    await page.getByPlaceholder('Enter your email').fill(testUser.email);
    await page.getByPlaceholder('Create a password').fill(testUser.password);
    await page.getByPlaceholder('Confirm your password').fill(testUser.password);
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Wait for dashboard to load
    await page.waitForURL('/dashboard');
  });

  test('should display empty state when no todos', async ({ page }) => {
    await expect(page.getByText('Welcome, Test User')).toBeVisible();
    await expect(page.getByText('No todos yet. Create your first todo!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Todo' })).toBeVisible();
  });

  test('should create a new todo', async ({ page }) => {
    const todoTitle = 'Test Todo';
    const todoDescription = 'This is a test todo';

    await page.getByRole('button', { name: 'Add Todo' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Create New Todo')).toBeVisible();

    await page.getByPlaceholder('Enter todo title').fill(todoTitle);
    await page.getByPlaceholder('Enter todo description (optional)').fill(todoDescription);
    await page.getByRole('button', { name: 'Create Todo' }).click();

    // Check if the todo appears in the list
    await expect(page.getByText(todoTitle)).toBeVisible();
    await expect(page.getByText(todoDescription)).toBeVisible();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should not create todo with empty title', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Todo' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Button should be disabled when title is empty
    await expect(page.getByRole('button', { name: 'Create Todo' })).toBeDisabled();
  });

  test('should create todo with title only', async ({ page }) => {
    const todoTitle = 'Simple Todo';

    await page.getByRole('button', { name: 'Add Todo' }).click();
    await page.getByPlaceholder('Enter todo title').fill(todoTitle);
    await page.getByRole('button', { name: 'Create Todo' }).click();

    await expect(page.getByText(todoTitle)).toBeVisible();
  });

  test('should toggle todo completion', async ({ page }) => {
    const todoTitle = 'Toggle Test Todo';

    // Create a todo
    await page.getByRole('button', { name: 'Add Todo' }).click();
    await page.getByPlaceholder('Enter todo title').fill(todoTitle);
    await page.getByRole('button', { name: 'Create Todo' }).click();

    // Find the todo and toggle its completion
    const todoItem = page.locator('.card').filter({ hasText: todoTitle });
    await expect(todoItem).toBeVisible();
    
    // Initially should not be completed
    await expect(todoItem.getByText(todoTitle)).not.toHaveClass(/line-through/);
    
    // Click the checkbox to complete it
    await todoItem.getByRole('button').first().click();
    
    // Should now be completed (with strikethrough)
    await expect(todoItem.getByText(todoTitle)).toHaveClass(/line-through/);
    
    // Click again to uncomplete
    await todoItem.getByRole('button').first().click();
    
    // Should not be completed anymore
    await expect(todoItem.getByText(todoTitle)).not.toHaveClass(/line-through/);
  });

  test('should edit todo', async ({ page }) => {
    const originalTitle = 'Original Todo';
    const originalDescription = 'Original description';
    const editedTitle = 'Edited Todo';
    const editedDescription = 'Edited description';

    // Create a todo
    await page.getByRole('button', { name: 'Add Todo' }).click();
    await page.getByPlaceholder('Enter todo title').fill(originalTitle);
    await page.getByPlaceholder('Enter todo description (optional)').fill(originalDescription);
    await page.getByRole('button', { name: 'Create Todo' }).click();

    // Edit the todo
    const todoItem = page.locator('.card').filter({ hasText: originalTitle });
    await todoItem.getByRole('button', { name: 'Edit' }).click();
    
    // Edit dialog should be visible
    await expect(page.getByText('Edit Todo')).toBeVisible();
    
    // Clear and fill new values
    await page.locator('input[value="' + originalTitle + '"]').clear();
    await page.locator('input[value=""]').first().fill(editedTitle);
    await page.locator('input[value="' + originalDescription + '"]').clear();
    await page.locator('input[value=""]').last().fill(editedDescription);
    
    await page.getByRole('button', { name: 'Update Todo' }).click();

    // Check if the todo is updated
    await expect(page.getByText(editedTitle)).toBeVisible();
    await expect(page.getByText(editedDescription)).toBeVisible();
    await expect(page.getByText(originalTitle)).not.toBeVisible();
    await expect(page.getByText(originalDescription)).not.toBeVisible();
  });

  test('should delete todo', async ({ page }) => {
    const todoTitle = 'Todo to Delete';

    // Create a todo
    await page.getByRole('button', { name: 'Add Todo' }).click();
    await page.getByPlaceholder('Enter todo title').fill(todoTitle);
    await page.getByRole('button', { name: 'Create Todo' }).click();

    // Verify todo exists
    await expect(page.getByText(todoTitle)).toBeVisible();

    // Delete the todo
    const todoItem = page.locator('.card').filter({ hasText: todoTitle });
    
    // Handle the confirmation dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Are you sure you want to delete this todo?');
      await dialog.accept();
    });
    
    await todoItem.getByRole('button').last().click();

    // Verify todo is deleted
    await expect(page.getByText(todoTitle)).not.toBeVisible();
    await expect(page.getByText('No todos yet. Create your first todo!')).toBeVisible();
  });

  test('should handle multiple todos', async ({ page }) => {
    const todos = [
      { title: 'First Todo', description: 'First description' },
      { title: 'Second Todo', description: 'Second description' },
      { title: 'Third Todo', description: 'Third description' }
    ];

    // Create multiple todos
    for (const todo of todos) {
      await page.getByRole('button', { name: 'Add Todo' }).click();
      await page.getByPlaceholder('Enter todo title').fill(todo.title);
      await page.getByPlaceholder('Enter todo description (optional)').fill(todo.description);
      await page.getByRole('button', { name: 'Create Todo' }).click();
    }

    // Verify all todos are visible
    for (const todo of todos) {
      await expect(page.getByText(todo.title)).toBeVisible();
      await expect(page.getByText(todo.description)).toBeVisible();
    }

    // Complete first todo
    const firstTodo = page.locator('.card').filter({ hasText: todos[0].title });
    await firstTodo.getByRole('button').first().click();
    await expect(firstTodo.getByText(todos[0].title)).toHaveClass(/line-through/);

    // Other todos should not be completed
    const secondTodo = page.locator('.card').filter({ hasText: todos[1].title });
    const thirdTodo = page.locator('.card').filter({ hasText: todos[2].title });
    await expect(secondTodo.getByText(todos[1].title)).not.toHaveClass(/line-through/);
    await expect(thirdTodo.getByText(todos[2].title)).not.toHaveClass(/line-through/);
  });

  test('should persist todos after logout and login', async ({ page }) => {
    const todoTitle = 'Persistent Todo';

    // Create a todo
    await page.getByRole('button', { name: 'Add Todo' }).click();
    await page.getByPlaceholder('Enter todo title').fill(todoTitle);
    await page.getByRole('button', { name: 'Create Todo' }).click();

    // Verify todo exists
    await expect(page.getByText(todoTitle)).toBeVisible();

    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    await page.waitForURL('/login');

    // Login again
    await page.getByPlaceholder('Enter your email').fill(testUser.email);
    await page.getByPlaceholder('Enter your password').fill(testUser.password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Todo should still exist
    await page.waitForURL('/dashboard');
    await expect(page.getByText(todoTitle)).toBeVisible();
  });
});