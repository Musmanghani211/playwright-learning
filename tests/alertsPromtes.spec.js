import { test, expect } from '@playwright/test';

test.only('Check the toast for OrangeHRM website', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByText('PIM').click();
  await page.waitForURL('**/pim/viewEmployeeList**');

  const UserID = '5948847';
  await page.getByRole('textbox').nth(2).fill(UserID);
  await page.getByRole('button', { name: 'Search' }).click();

  const notfoundtext = page.locator('.oxd-toast');
  const isvisible = await notfoundtext
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (isvisible) {
    await expect(notfoundtext).toContainText('No Records Found');

    // ---------- Add new employee ----------
    await page.getByRole('button', { name: ' Add' }).click();
    await page.getByPlaceholder('First Name').fill('Usman');
    await page.getByPlaceholder('Middle Name').fill('Ghani');
    await page.getByPlaceholder('Last Name').fill('Kamboh');

    const employeeIdInput = page.locator('.oxd-input-group', { hasText: 'Employee Id' }).locator('input');
    await employeeIdInput.clear();
    await employeeIdInput.fill(UserID);

    await page.getByRole('button', { name: 'Save' }).click();
    const userAddedText = page.locator('.oxd-toast');
    await userAddedText.waitFor({ state: 'visible', timeout: 10000 });
    await expect(userAddedText).toContainText('Successfully Saved');

    // After save, OrangeHRM redirects to the Personal Details page
    await page.waitForURL('**/pim/viewPersonalDetails/**');
    await page.waitForLoadState('networkidle');

    // ---------- Fill phone number (scoped via label, not brittle nth-child CSS) ----------
    const drivinglicenseGroup = page.locator('.oxd-input-group', { hasText: "Driver's License Number" });
    const drivinglicenseInput = drivinglicenseGroup.locator('input').first();
    await drivinglicenseInput.waitFor({ state: 'visible', timeout: 10000 });
    await expect(drivinglicenseInput).toBeEnabled();
    await drivinglicenseInput.fill('6546464613');

    // ---------- Nationality dropdown ----------
    const nationalityGroup = page.locator('.oxd-input-group', { hasText: 'Nationality' });
    await nationalityGroup.locator('.oxd-select-text').click();
    await page.getByRole('option', { name: 'Pakistani' }).click();

    // ---------- Marital Status dropdown ----------
    const MaritalStatusGroup = page.locator('.oxd-input-group', { hasText: 'Marital Status' });
    await MaritalStatusGroup.locator('.oxd-select-text').click();
    await page.getByRole('option', { name: 'Single' }).click();

    // select Gender

await page.getByText('Male', { exact: true }).click();
    const PersonalDetailsSaveButton = page.getByRole('button', {name: 'Save'}).first();
    await PersonalDetailsSaveButton.click();


    // ---------- Blood Type dropdown (custom field, if present) ----------
    const bloodTypeGroup = page.locator('.oxd-input-group', { hasText: 'Blood Type' });
      await bloodTypeGroup.locator('.oxd-select-text').click();
      await page.getByRole('option', { name: 'AB+' }).click();
    

    // ---------- Save personal details section ----------
    // Scope the Save button to the specific form section instead of guessing with .nth(2)
    const CustomFieldsSaveButton = page.getByRole('button', {name: 'Save'}).last();
    await CustomFieldsSaveButton.click();

    // ---------- Verify via Employee List search ----------
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList');
    await page.getByRole('textbox').nth(2).fill(UserID);
    await page.getByRole('button', { name: 'Search' }).click();

    const rows = page.locator('.oxd-table-body .oxd-table-row');
    await expect(rows.first()).toBeVisible();
    const rowsData = await rows.first().locator('.oxd-table-cell').allTextContents();
    console.log(rowsData);

  } else {
    console.log('User already exists, now deleting it..!');

    const rows = page.locator('.oxd-table-body .oxd-table-row');
    await expect(rows.first()).toBeVisible();

    const targetRow = rows.first();
    const deleteButton = targetRow.locator('.oxd-table-cell-actions .oxd-icon-button').last();
    await deleteButton.click();

    const dialogBox = page.locator('.oxd-dialog-container-default');
    await dialogBox.getByRole('button', { name: 'Yes, Delete' }).click();
    await expect(page.locator('.oxd-toast')).toContainText('Successfully Deleted');
  }
});

// ============================================
// Native dialog handling
// ============================================

test('alert handling', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  page.on('dialog', async dialog => await dialog.accept());

  await page.getByRole('button', { name: 'Click For JS Alert' }).click();
  await expect(page.locator('#result')).toContainText('You successfully clicked an alert');
});

test('Handle confirm - with OK', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  page.on('dialog', async dialog => await dialog.accept());

  await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
  await expect(page.locator('#result')).toContainText('You clicked: Ok');
});

test('Handle confirm - with dismiss', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  page.on('dialog', async dialog => await dialog.dismiss());

  await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
  await expect(page.locator('#result')).toContainText('You clicked: Cancel');
});

test('Handle prompt box with adding values and accept', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  page.on('dialog', async dialog => await dialog.accept('Usman Ghani'));

  await page.getByRole('button', { name: 'Click for JS Prompt' }).click();
  await expect(page.locator('#result')).toContainText('You entered: Usman Ghani');
});

test('handle prompt box dismissing without adding values', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  page.on('dialog', async dialog => await dialog.dismiss());

  await page.getByRole('button', { name: 'Click for JS Prompt' }).click();
  await expect(page.locator('#result')).toContainText('You entered: null');
});

// ============================================
// iframe handling
// ============================================

test('iFrame containing', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/iframe');

  const toxNotificationContainer = page.locator('.tox-notifications-container');
  const toxNotification = toxNotificationContainer.locator('.tox-notification');
  await toxNotification.locator('.tox-notification__dismiss').click();
  await expect(toxNotificationContainer).not.toBeVisible();

  const iframe = page.frameLocator('iframe[title="Rich Text Area"]');
  const editorBody = iframe.locator('#tinymce');
  await expect(editorBody).toContainText('Your content goes here.');
});

// ============================================
// Nested frames
// ============================================

test('nested framing', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/nested_frames');

  const topFrame = page.frameLocator('frame[name="frame-top"]');
  const leftFrame = topFrame.frameLocator('frame[name="frame-left"]');
  const middleFrame = topFrame.frameLocator('frame[name="frame-middle"]');
  const rightFrame = topFrame.frameLocator('frame[name="frame-right"]');
  const bottomFrame = page.frameLocator('frame[name="frame-bottom"]');

  const leftText = (await leftFrame.locator('body').allTextContents())[0].trim();
  const middleText = (await middleFrame.locator('body').allTextContents())[0].trim();
  const rightText = (await rightFrame.locator('body').allTextContents())[0].trim();
  const bottomText = (await bottomFrame.locator('body').allTextContents())[0].trim();

  console.log('Left:', leftText);
  console.log('Middle:', middleText);
  console.log('Right:', rightText);
  console.log('Bottom:', bottomText);
});