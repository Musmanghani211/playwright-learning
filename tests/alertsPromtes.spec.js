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
    
            await expect(rows).toHaveCount(2);
            const selectedRow = await rows.locator('.oxd-table-cell');
            const selectedRowButtons = await selectedRow.locator('.oxd-table-cell-actions');
            const deletebuttonForSelectedRow = await selectedRowButtons.locator('.oxd-icon-button').last();
            await deletebuttonForSelectedRow.click();
            const dialogbox = await page.locator('.oxd-dialog-container-default');
            const DeleteButton = await dialogbox.getByRole('button', {name: 'Yes, Delete'});
            await DeleteButton.click();
        

    }
})

//promt of the web page elemenets handling
test('alert handling', async({page}) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    
    page.on('dialog', async dialog => {
        // console.log('dialog type', dialog.type());
        // console.log('dialog text', dialog.message());
        await dialog.accept();
    })

    await page.getByRole('button', {name: 'Click For JS Alert'}).click();
    await expect(page.locator('#result')).toContainText('You successfully clicked an alert');

    // await page.getByRole('button', {name: 'Click for JS Confirm'}).click();
    // await expect(page.locator('#result')).toContainText('You clicked: Ok');
})

test.only('Handle confirm - with OK', async({page}) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    
    page.on('dialog', async dialog => {
        // console.log('dialog type', dialog.type());
        // console.log('dialog text', dialog.message());
        await dialog.accept();
    })

    await page.getByRole('button', {name: 'Click for JS Confirm'}).click();
    await expect(page.locator('#result')).toContainText('You clicked: Ok');
})


test('Handle confirm - with dismiss', async({page}) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    
    page.on('dialog', async dialog => {
        // console.log('dialog type', dialog.type());
        // console.log('dialog text', dialog.message());
        await dialog.dismiss();
    })

    await page.getByRole('button', {name: 'Click for JS Confirm'}).click();
    await expect(page.locator('#result')).toContainText('You clicked: Cancel');
})

test('Handle promt box with adding values and accept', async({page}) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    
    page.on('dialog', async dialog => {
        // console.log('dialog type', dialog.type());
        // console.log('dialog text', dialog.message());
        // let Username = ''
        await dialog.accept('Usman Ghani');
    })

    await page.getByRole('button', {name: 'Click for JS Prompt'}).click();
    await expect(page.locator('#result')).toContainText(`You entered: Usman Ghani `);
})

test('handle prompt box dismissing without adding values', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

    page.once('dialog', async dialog => {
    // console.log(`Dialog message: ${dialog.message()}`);
    await dialog.dismiss();
    });

    await page.getByRole('button', { name: 'Click for JS Prompt' }).click();
    await expect(page.locator('#result')).toContainText('You entered: null');
});

//not completet yet, not resolving this issue
test('handle prompt box dismissing after adding values', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

    page.once('dialog', async dialog => {
    // console.log(`Dialog message: ${dialog.message()}`);

    });

    await page.getByRole('button', { name: 'Click for JS Prompt' }).click();
    await expect(page.locator('#result')).toContainText('You entered: null');
});

test('iFrame containing', async ({page}) => {
    await page.goto('https://the-internet.herokuapp.com/iframe');
    const tinymceContainer = page.locator('.tox-editor-container');
    const iframe = page.frameLocator('iframe[title="Rich Text Area"]');
    const Textintothebox = await iframe.locator('#tinymce');
    const toxNotificationContainer = page.locator('.tox-notifications-container');
    const toxNotification = toxNotificationContainer.locator('.tox-notification');

    const toxNotificationdismiss = toxNotification.locator('.tox-notification__dismiss');
    await toxNotificationdismiss.click();
    await expect(toxNotificationContainer).not.toBeVisible();
    // console.log(await Textintothebox.allTextContents());
    await expect(Textintothebox).toContainText('Your content goes here.');

})

//nested framing

test('nested framing', async({page}) => {
    await page.goto('https://the-internet.herokuapp.com/nested_frames');
    const topFrame = page.frameLocator('frame[name="frame-top"]');
    // const middleFrame = await topFrame.frameLocator('iframe[title= "frameset-middle"]');
    const leftFrameOftopframe =  topFrame.frameLocator('frame[name="frame-left"]');
    const middleFrameOftopframe =  topFrame.frameLocator('frame[name="frame-middle"]');
    const rightFrameOftopframe =  topFrame.frameLocator('frame[name="frame-right"]');
    const bottomFram = page.frameLocator('frame[name="frame-bottom"]');

    const TextofleftFrameOftopframe = (await leftFrameOftopframe.locator('body').allTextContents())[0].trim();
    console.log("Left frame text is: ", TextofleftFrameOftopframe)
    const TextofmiddleFrameOftopframe = (await middleFrameOftopframe.locator('body').allTextContents())[0].trim();
    console.log("Middle frame text is: ",TextofmiddleFrameOftopframe);
    const textofrightFrameOftopframe = (await rightFrameOftopframe.locator('body').allTextContents())[0].trim();
    console.log("Right frame text is: ",textofrightFrameOftopframe);
    const textofbottomframe = (await bottomFram.locator('body').allTextContents())[0].trim();
    console.log("Bottom frame text is: ",textofbottomframe)

})
