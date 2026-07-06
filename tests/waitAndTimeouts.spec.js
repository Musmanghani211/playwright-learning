import { test, expect } from '@playwright/test';

test('verify the hard wait', async ({ page }) => {
  await page.goto('https://demoqa.com/');
  await page.locator('.top-card').filter({ hasText: 'Elements' }).click();
  await page
    .getByRole('link', { name: 'Dynamic Properties', exact: true })
    .click();
  await page.waitForTimeout(20000);
  await expect(
    page.getByRole('button', { name: 'Will enable 5 seconds' })
  ).toBeVisible();
});

test('verify the dynamic wait', async ({ page }) => {
  await page.goto('https://demoqa.com/');
  await page.locator('.top-card').filter({ hasText: 'Elements' }).click();
  await page
    .getByRole('link', { name: 'Dynamic Properties', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Will enable 5 seconds' })
  ).toBeEnabled({ timeout: 100000 }); //this is the dynamic wait, it will wait for the button to be enabled for 100 seconds, if it is not enabled in 100 seconds then it will fail the test
});

//dynamic wait for visible

test('verify the dynamic wait for visible', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.locator('#finish')).toBeVisible({ timeout: 10000 }); //this is the dynamic wait, it will wait for the element to be visible for 100 seconds, if it is not visible in 100 seconds then it will fail the test
  await expect(page.locator('#finish')).toContainText('Hello World!'); //this is the dynamic wait, it will wait for the element to contain the text for 100 seconds, if it does not contain the text in 100 seconds then it will fail the test
});

//dynamic wait for hidden

test('verify the dynamic wait for hidden', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.locator('#finish')).toBeHidden({ timeout: 10000 }); //this is the dynamic wait, it will wait for the element to be hidden for 100 seconds, if it is not hidden in 100 seconds then it will fail the test
});

//dynamic wait for enabled

test('verify the dynamic wait for enabled', async ({ page }) => {
  await page.goto('https://demoqa.com/dynamic-properties');
  await expect(
    page.getByRole('button', { name: 'Will enable 5 seconds' })
  ).toBeEnabled({ timeout: 10000 }); //this is the dynamic wait, it will wait for the button to be enabled for 100 seconds, if it is not enabled in 100 seconds then it will fail the test
});

//dynamic wait for disabled

test('verify the dynamic wait for disabled', async ({ page }) => {
  await page.goto('https://demoqa.com/dynamic-properties');
  await expect(
    page.getByRole('button', { name: 'Will enable 5 seconds' })
  ).toBeDisabled({ timeout: 10000 }); //this is the dynamic wait, it will wait for the button to be disabled for 100 seconds, if it is not disabled in 100 seconds then it will fail the test
});

//dynamic wait for attached

test('verify the dynamic wait for attached', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.locator('#finish')).toBeAttached({ timeout: 10000 }); //this is the dynamic wait, it will wait for the element to be attached to the DOM for 100 seconds, if it is not attached in 100 seconds then it will fail the test
  await expect(page.locator('#finish')).toContainText('Hello World!'); //this is the dynamic wait, it will wait for the element to contain the text for 100 seconds, if it does not contain the text in 100 seconds then it will fail the test
});

////dynamic wait for detached

test('verify detached', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_controls');

  const checkbox = page.locator('#checkbox');

  await expect(checkbox).toBeAttached();

  await page.getByRole('button', { name: 'Remove' }).click();

  await expect(page.getByText("It's gone!")).toBeVisible();

  await expect(checkbox).not.toBeVisible();
});
test('verify the dynamic wait for attached using table after adding data', async ({
  page,
}) => {
  await page.goto('https://demoqa.com/webtables');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByPlaceholder('First Name').fill('usman');
  await page.getByPlaceholder('Last Name').fill('ghani');
  await page
    .getByPlaceholder('name@example.com')
    .fill('usman.ghani@example.com');
  await page.getByPlaceholder('Age').fill('30');
  await page.getByPlaceholder('Salary').fill('50000');
  await page.getByPlaceholder('Department').fill('IT');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('usman.ghani@example.com')).toBeAttached({
    timeout: 10000,
  });
});

//tobedetached

test('verify the dynamic wait for detached using table after adding data', async ({
  page,
}) => {
  await page.goto('https://demoqa.com/webtables');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByPlaceholder('First Name').fill('usman');
  await page.getByPlaceholder('Last Name').fill('ghani');
  await page.getByPlaceholder('name@example.com').fill('usman.ghani@example.com');
  await page.getByPlaceholder('Age').fill('30');
  await page.getByPlaceholder('Salary').fill('50000');
  await page.getByPlaceholder('Department').fill('IT');
  await page.getByRole('button', { name: 'Submit' }).click();
  // await expect(page.locator('tbody')).toContainText('usman.ghani@example.com');
  await expect(page.locator('tbody')).toBeAttached({ timeout: 10000 });

  await page.locator('#delete-record-4 > svg > path').click();
  await page
    .getByText('usman.ghani@example.com')
    .waitFor({ state: 'detached', timeout: 10000 }); //this is the dynamic wait, it will wait for the element to be detached from the DOM for 100 seconds, if it is not detached in 100 seconds then it will fail the test
});
