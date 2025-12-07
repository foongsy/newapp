import { test, expect } from '@playwright/test';

/**
 * Login Page E2E Tests
 * 
 * This test suite covers all login page scenarios including:
 * - Sign in with correct credentials
 * - Sign in with wrong credentials
 * - Sign up functionality
 * - Forgot password functionality
 * - Remember me functionality
 */

// Base URL for the application
const APP_URL = 'http://localhost:5173';

test.describe('Login Page', () => {
  // Navigate to the login page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    
    // Verify the login page is loaded
    await expect(page).toHaveTitle('frontend');
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  });

  test('should display all login page elements', async ({ page }) => {
    // Verify all main elements are present
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Remember me' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
    
    // Verify card header text
    await expect(page.getByText('Enter your credentials to access your account')).toBeVisible();
    await expect(page.getByText("Don't have an account?")).toBeVisible();
  });

  test('should sign in with correct credentials', async ({ page }) => {
    // Set up dialog handler to capture the alert
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('Login attempted with email: test@example.com');
      await dialog.accept();
    });

    // Fill in the login form
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('correctpassword123');
    
    // Verify the form is filled correctly
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('test@example.com');
    await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue('correctpassword123');
    
    // Click the sign in button
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // The dialog handler above will verify the alert message
  });

  test('should sign in with wrong credentials', async ({ page }) => {
    // Set up dialog handler to capture the alert
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('Login attempted with email: wrong@example.com');
      await dialog.accept();
    });

    // Fill in the login form with wrong credentials
    await page.getByRole('textbox', { name: 'Email' }).fill('wrong@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
    
    // Verify the form is filled correctly
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('wrong@example.com');
    await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue('wrongpassword');
    
    // Click the sign in button
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Note: Current implementation doesn't validate credentials,
    // so this will show the same alert as correct credentials
  });

  test('should navigate to signup when clicking sign up link', async ({ page }) => {
    // Set up dialog handler to capture the alert
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('Sign up functionality not implemented');
      await dialog.accept();
    });

    // Click the sign up link
    await page.getByRole('link', { name: 'Sign up' }).click();
    
    // The dialog handler above will verify the alert message
  });

  test('should handle forgot password functionality', async ({ page }) => {
    // Set up dialog handler to capture the alert
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('Password reset functionality not implemented');
      await dialog.accept();
    });

    // Click the forgot password link
    await page.getByRole('link', { name: 'Forgot password?' }).click();
    
    // The dialog handler above will verify the alert message
  });

  test('should remember user session when remember me is checked', async ({ page }) => {
    // Set up dialog handler to capture the alert
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('Login attempted with email: test@example.com');
      await dialog.accept();
    });

    // Fill in the login form
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('password123');
    
    // Check the remember me checkbox
    await page.getByRole('checkbox', { name: 'Remember me' }).check();
    
    // Verify the checkbox is checked
    await expect(page.getByRole('checkbox', { name: 'Remember me' })).toBeChecked();
    
    // Verify the form is filled correctly
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('test@example.com');
    await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue('password123');
    
    // Click the sign in button
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // The dialog handler above will verify the alert message
    // Note: Current implementation doesn't actually implement session storage,
    // but the checkbox state is captured for when it's implemented
  });

  test('should validate email field format', async ({ page }) => {
    // Try to submit with invalid email format
    const emailInput = page.getByRole('textbox', { name: 'Email' });
    
    // Fill with invalid email
    await emailInput.fill('invalid-email');
    await page.getByRole('textbox', { name: 'Password' }).fill('password123');
    
    // Click sign in button - HTML5 validation should prevent submission
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Check if the email input is invalid (HTML5 validation)
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).not.toBe('');
  });

  test('should require all fields to be filled', async ({ page }) => {
    // Try to submit with empty fields
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Check if the email field shows required validation
    const emailInput = page.getByRole('textbox', { name: 'Email' });
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).not.toBe('');
  });

  test('should toggle remember me checkbox', async ({ page }) => {
    const rememberCheckbox = page.getByRole('checkbox', { name: 'Remember me' });
    
    // Initially unchecked
    await expect(rememberCheckbox).not.toBeChecked();
    
    // Check the checkbox
    await rememberCheckbox.check();
    await expect(rememberCheckbox).toBeChecked();
    
    // Uncheck the checkbox
    await rememberCheckbox.uncheck();
    await expect(rememberCheckbox).not.toBeChecked();
  });

  test('should clear form inputs', async ({ page }) => {
    // Fill the form
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('password123');
    
    // Verify filled
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('test@example.com');
    await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue('password123');
    
    // Clear the inputs
    await page.getByRole('textbox', { name: 'Email' }).clear();
    await page.getByRole('textbox', { name: 'Password' }).clear();
    
    // Verify cleared
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue('');
  });
});
