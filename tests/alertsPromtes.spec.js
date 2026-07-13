import {test, expect} from '@playwright/test';
test('Check the toast for OrangeHRM website', async ({page}) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.getByPlaceholder('username').fill('Admin');
    await page.keyboard.press('Tab');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', {name: 'Login'}).click();
    await page.getByText('PIM').click();
    let UserID = '5948847';
    await page.getByRole('textbox').nth(2).fill(UserID);
    await page.getByRole('button', {name: 'Search'}).click();

    const notfoundtext = await page.locator('.oxd-toast');
const isvisible = await notfoundtext
  .waitFor({ state: 'visible', timeout: 5000 })
  .then(() => true)
  .catch(() => false);   
    if(isvisible){
   await expect(notfoundtext).toContainText('No Records Found');
   await page.getByRole('button', {name: ' Add'}).click();
   await page.getByPlaceholder('First Name').fill('Usman');
   await page.getByPlaceholder('Middle Name').fill('Ghani');
   await page.getByPlaceholder('Last Name').fill('Kamboh');
   const emplyeeIdInput = await page.locator('.oxd-input-group', {hasText: 'Employee Id'}).locator('input');
   await emplyeeIdInput.clear();
   await emplyeeIdInput.fill(UserID);
   await page.getByRole('button', {name: 'Save'}).click();
   const userAddedText = await page.locator('.oxd-toast');
   await expect(userAddedText).toContainText('Successfully Saved');

   await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList');
   await page.getByRole('textbox').nth(2).fill(UserID);
    await page.getByRole('button', {name: 'Search'}).click();
    const table = await page.locator('.oxd-table .orangehrm-employee-list').getByRole('table');
    const tableData = await page.locator('.oxd-table-body').getByRole('rowgroup');
    const rows = await page.locator('.oxd-table-row');
    await expect(rows.first()).toBeVisible();
    const rowsData = await rows.locator('.oxd-table-cell').allTextContents();
    const OnlyData = await rowsData.slice(1, -5)
    console.log(OnlyData);
    }
    else {
        console.log('User already exists, now deleted it..!');
            // const table = await page.locator('.oxd-table .orangehrm-employee-list').getByRole('table');
            // const tableData = await table.locator('.oxd-table-body').getByRole('rowgroup');
            const rows = await page.locator('.oxd-table-row');
            await expect(rows.first()).toBeVisible();
            const selectedRow = await rows.locator('.oxd-table-cell');
            const selectedRowButtons = await selectedRow.locator('.oxd-table-cell-actions');
            const deletebuttonForSelectedRow = await selectedRowButtons.locator('.oxd-icon-button').last();
            await deletebuttonForSelectedRow.click();
            const dialogbox = await page.locator('.oxd-dialog-container-default');
            const DeleteButton = await dialogbox.getByRole('button', {name: 'Yes, Delete'});
            await DeleteButton.click();
        

    }
})







