import { test, expect } from '@playwright/test';

test('Verify user can login with valid credentials', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://www.saucedemo.com/'); // Replace with actual login URL

    // Fill in valid credentials
    await page.fill('#user-name', 'standard_user'); // Replace with actual selectors and credentials
    await page.fill('#password', 'secret_sauce');

    // Click the login button
    await page.click('#login-button');

    // Assert successful login (e.g., check for dashboard or welcome message)
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html'); // Replace with expected post-login URL
    await expect(page.locator('.inventory_list')).toBeVisible(); // Replace with actual success indicator
});