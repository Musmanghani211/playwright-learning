import {test, expect} from '@playwright/test';

test('verify the user is unale to login with invalid credentials', async ({page}) => {
    // Navigate to the login page
    await page.goto('https://www.saucedemo.com/'); // Replace with actual login URL
    page.fill('#user-name', 'invalid_user'); // Replace with actual selectors and credentials
    page.fill('#password', 'invalid_password'); // Replace with actual selectors and credentials
    page.click('#login-button'); // Replace with actual selector for the login button
    // Assert error message is displayed
    await expect(page.locator('.error-message')).toBeVisible(); // Replace with actual selector for the error message

});