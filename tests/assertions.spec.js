import{test, expect} from '@playwright/test';

test('check assertions', async ({page}) => {
    // Navigate to the login page
    await page.goto('https://www.saucedemo.com/'); // Replace with actual login URL

    // Fill in valid credentials
    await page.fill('#user-name', 'standard_user'); // Replace with actual selectors and credentials
    await page.fill('#password', 'secret_sauce');

    // Click the login button
    await page.click('#login-button');

    // page level Assertion

    await expect(page).toHaveTitle('Swag Labs');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    //visiblity level assertions
    await expect(page.locator('.inventory_item').first()).toBeVisible();
    await expect(page.locator('#login-button')).toBeHidden();

})

//toHaveText and ToContainText assertions

test('toHave and toContain assertions', async ({page}) => {
    // Navigate to the login page
    await page.goto('https://automationexercise.com/login');
    await page.locator('[data-qa="login-email"]').fill('abc@test.com');
    await page.keyboard.press('Tab');
    await page.locator('[data-qa="login-password"]').fill('abc');
    await page.keyboard.press('Enter');
    await expect(page.locator('.login-form p')).toHaveText('Your email or password is incorrect!');
    await expect(page.locator('.login-form p')).toContainText('Your email or password is incorrect');
})

//tohavevalue assertion

test('toHaveValue assertions', async ({page}) => {
    // Navigate to the login page
    await page.goto('https://automationexercise.com/login');
    await page.locator('[data-qa="login-email"]').fill('abc@test.com');
    // await page.locator('[data-qa="login-email"]').clear();
    //to have values assertion
    await expect(page.locator('[data-qa="login-email"]')).toHaveValue('abc@test.com');

    await page.keyboard.press('Tab');
    await page.locator('[data-qa="login-password"]').fill('abc');
    await expect(page.locator('[data-qa="login-password"]')).toHaveValue('abc');
})

test('toHaveValues assertions for standard multi select', async ({page}) => {
await page.goto('https://demoqa.com/select-menu');
await page.locator('#cars').selectOption(['Volvo', 'Saab', 'Opel']);
await expect(page.locator('#cars')).toHaveValues(['volvo', 'saab', 'opel']);
})
test.only('toHaveValues assertions for multi select using drop down', async ({page}) => {
  await page.goto('https://demoqa.com/select-menu');

  const multiSelectContainer = page.locator('.css-b62m3t-container').filter({has: page.locator('#react-select-4-input')});
  await multiSelectContainer.click();
  await multiSelectContainer.getByRole('option', { name: 'Blue' }).click();
  await multiSelectContainer.getByRole('option', { name: 'Black' }).click();
  await multiSelectContainer.getByRole('option', { name: 'Red' }).click();
  await multiSelectContainer.getByRole('option', { name: 'Green' }).click();
  await expect(multiSelectContainer).toContainText('Blue');
  await expect(multiSelectContainer).toContainText('Black');
  await expect(multiSelectContainer).toContainText('Red');
  await expect(multiSelectContainer).toContainText('Green');

})