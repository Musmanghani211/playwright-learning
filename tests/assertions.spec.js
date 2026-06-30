import{test, expect} from '@playwright/test';
import { type } from 'node:os';

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
test('toHaveValues assertions for multi select using drop down', async ({page}) => {
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

//state

test('check the enebale and disable asssertions', async({page}) => {
await page.goto('https://www.qa-practice.com/elements/button/disabled');
await page.locator('#id_select_state').selectOption('Disabled');
await expect(page.locator('#submit-id-submit')).toBeDisabled();
await page.locator('#id_select_state').selectOption('Enabled');
await expect(page.locator('#submit-id-submit')).toBeEnabled();

})

//check and not checked

test('verify the checks and not checks', async ({page}) => {
await page.goto('https://the-internet.herokuapp.com/?utm_source=chatgpt.com');
await page.getByRole('link', {name: 'Checkboxes'}).click();
await expect(page).toHaveURL('https://the-internet.herokuapp.com/checkboxes');
const checkbox1 = await page.locator('input[type="checkbox"]').nth(0);
const checkbox2 = await page.locator('input[type="checkbox"]').nth(1);
await expect(checkbox1).not.toBeChecked();
await expect(checkbox2).toBeChecked();
await checkbox1.check();
await expect(checkbox1).toBeChecked();
await checkbox2.uncheck();
await expect(checkbox2).not.toBeChecked();
})

test('verify the noteditable/editable and tobeEmpty/noteditable', async({page}) => {
await page.goto('https://the-internet.herokuapp.com/dynamic_controls');
await expect(page.locator('input[type="text"]')).not.toBeEditable();
await page.getByRole('button', {name: 'Enable'}).click();
await expect(page.locator('input[type="text"]')).toBeEditable();
await expect(page.locator('input[type="text"]')).toBeEmpty();
await page.locator('input[type="text"]').fill('This field is edit able')
await expect(page.locator('input[type="text"]')).not.toBeEmpty();
})

