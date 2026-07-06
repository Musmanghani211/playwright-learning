import { test, expect } from '@playwright/test';

test('practice with click actions', async ({ page }) => {
  await page.goto('https://demoqa.com/');

  // Click the "Interactions" card by its visible text
  await page.locator('.card-body').filter({hasText: 'Elements'}).click();

  // Click "Buttons" in the left menu
  await page.locator('.menu-list').filter({hasText: 'Buttons'}).click();

  // Double click the button
  await page.locator('#doubleClickBtn').dblclick();
  await expect(page.locator('#doubleClickMessage')).toContainText('You have done a double click');
  
  //right click
  await page.locator('#rightClickBtn').click({button: 'right'});
  await expect(page.locator('#rightClickMessage')).toContainText('You have done a right click');

  //dynamic click
  await page.getByRole('button', {name: 'Click Me', exact: true}).click();
  await expect(page.locator('#dynamicClickMessage')).toContainText('You have done a dynamic click');
});

test('Fill vs type', async ({page}) =>{
    await page.goto('https://demoqa.com/');
    await page.locator('.card-body').filter({hasText: 'Elements'}).click();
    await page.getByText('Text Box').click();
    await expect(page.getByPlaceholder('Full Name')).toBeVisible();

    await page.getByPlaceholder('Full Name').fill('usman ghani');

    await page.getByPlaceholder('Current Address').type('lorem sdaf adsf dasfhk oldsakjf dasf adsf adsf');
})


//hover action

test('hover action', async ({page}) =>{
    await page.goto('https://demoqa.com/');
    await page.locator('.card-body').filter({hasText: 'Widgets'}).click();
    // await page.getByText('Widgets').click();
    await page.getByRole('link', {name: 'Menu', exact: true}).click();
    await page.getByRole('link', {name: 'Main Item 2'}).hover();
    await expect(page.getByRole('link', {name: 'SUB SUB LIST'})).toBeVisible();
    await page.getByRole('link', {name: 'SUB SUB LIST'}).hover();
    await page.getByRole('link', {name: 'Sub Sub Item 2'}).click();
})

test('select dropdown action', async ({page}) =>{
    await page.goto('https://demoqa.com/');
    await page.locator('.card-body').filter({hasText: 'Forms'}).click();
    await page.getByRole('link', {name: 'Practice Form', exact: true}).click();
    // await expect(page.getByTitle('Practice Form')).toBeVisible();
    await page.locator('#state').click();
    await page.getByText('NCR', {exact: true}).click();


    await page.locator('#city').click();
    await page.getByText('Delhi', {exact: true}).click();

})


//check
test('check the checkbox', async ({page}) =>{
    await page.goto('https://demoqa.com/');
    await page.locator('.card-body').filter({hasText: 'Forms'}).click();
    await page.getByRole('link', {name: 'Practice Form', exact: true}).click();
    await page.getByRole('checkbox', {name: 'Sports'}).check();
    await page.getByRole('checkbox', {name: 'Reading'}).check();
    await page.getByRole('checkbox', {name: 'Music'}).check();
    await page.getByRole('checkbox', {name: 'Reading'}).uncheck();

})

test('check the radiobox by selecting the gender', async ({page}) =>{
    await page.goto('https://demoqa.com/');
    await page.locator('.card-body').filter({hasText: 'Forms'}).click();
    await page.getByRole('link', {name: 'Practice Form', exact: true}).click();
    await page.getByRole('radio', {name: 'Male', exact: true}).check();
    await expect(page.getByRole('radio', {name: 'Male', exact: true})).toBeChecked();
    await page.getByRole('radio', {name: 'Female', exact: true}).check();
    await expect(page.getByRole('radio', {name: 'Female', exact: true})).toBeChecked();
      await expect(page.getByRole('radio', {name: 'Male', exact: true})).not.toBeChecked();
})


test('verify the keyabors actions', async ({page}) =>{
    await page.goto('https://demoqa.com/');
    await page.locator('.card-body').filter({hasText: 'Forms'}).click();
    await page.getByRole('link', {name: 'Practice Form', exact: true}).click();
    await page.getByPlaceholder('First Name').type("Usman");
    await page.keyboard.press('Tab');
    await page.getByPlaceholder('Last Name').type("Ghani");
    await page.keyboard.press('Tab');
    await page.getByPlaceholder('name@example.com').type('usman@testiva.io');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.getByPlaceholder('Mobile Number').fill('0302589647');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.locator('#subjectsContainer').type('Maths');
    await page.keyboard.press('Enter');
    for(var i=0; i<4; i++){
    await page.keyboard.press('Tab');
    }
    await page.locator('#uploadPicture').setInputFiles('./test-data/office-card.pdf');

 const filename = await page.locator('#uploadPicture').evaluate(input => input.files[0].name)
 expect(filename).toBe('office-card.pdf');
    await page.keyboard.press('Tab');
    await expect(page.getByPlaceholder('Current Address')).toBeVisible();
    await page.getByPlaceholder('Current Address').type('house number 179, block A, Sher shah colony, raiwind road lahore');
})

test('scroll to element and click', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/large');
    await page.mouse.wheel(0,150);
    await page.locator('#content').last().click();
    await expect(page.locator('#large-table tr').last()).toBeVisible();
    const scrollY = await page.evaluate(() => window.scrollY);
    console.log(scrollY);   
});

test('scroll to element', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/large');
    await page.locator('#content').last().scrollIntoViewIfNeeded();
 await page.locator('#content').last().click();
 await expect(page.locator('#content')).toBeVisible();
const scrolly = await page.evaluate(() => window.scrollY);
console.log(scrolly);
});

test('scroll To practice', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/large');
    
    // exact pixel pe scroll karo
    await page.evaluate(() => window.scrollTo(0, 1000));
    
    // verify karo
    const scrollY = await page.evaluate(() => window.scrollY);
    console.log('Scroll position:', scrollY);
    // expect(scrollY).toBe(1000);
});


//drag and drop

test('drag and drop', async ({page}) => {
await page.goto('https://the-internet.herokuapp.com/drag_and_drop');
await expect(page.locator('#column-a header')).toHaveText('A');
await expect(page.locator('#column-b header')).toHaveText('B');
await page.locator('#column-a').dragTo(page.locator('#column-b'));
await expect(page.locator('#column-b header')).toHaveText('A');
await expect(page.locator('#column-a header')).toHaveText('B');

})

test('focus and keyboard practice', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.locator('#user-name').focus();
    await page.keyboard.type('standard_user');
    await page.keyboard.press('Tab');
    await page.keyboard.type('secret_sauce');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

//this is the screenshot action for inline method

test('screenshot taking test', async ({page}) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').focus();
    await page.locator('#user-name').type('standard_user');
    await page.keyboard.press('Tab');
    await page.locator('#password').type('secret_sauce');
    await page.keyboard.press('Enter');
    await page.screenshot({path: 'test-data/screenshotTest.png'})

})

//clear action

test('clear action', async ({page}) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').focus();
    await page.locator('#user-name').type('standard_user');
    
    await page.locator('#user-name').clear(); //clear action used here
    await page.locator('#user-name').type('locked_out_user');
    await page.keyboard.press('Tab');
    await page.locator('#password').type('secret_sauce');
    await page.keyboard.press('Enter');
    await expect(page.locator('.error-message-container')).toContainText('Sorry, this user has been locked out.');

})

//scrollintoviewifneeded();
//await page.mouse.wheel(0, 1000); scroll-down
// await page.mouse.wheel(0, -1000); scroll-up
//await page.evaluate(()=> window.scrollTo(0, document.body.scrollHeight)); scroll-down to end page
//await page.evaluate(()=> window.scrollTo(0,0)); scroll-up to top of page

test('select multiple options', async ({ page }) => {
    await page.goto('https://demoqa.com/select-menu');
    await page.locator('.css-19bb58m').first().click();
    await page.getByRole('option', { name: 'Another root option' }).click();
    // console.log(await page.content());
    await expect(page.getByText('Another root option', {exact: true })).toBeVisible();
    await page.locator('.css-19bb58m').first().click();
    await page.getByRole('option', { name: 'Group 2, option 1' }).click();
    await expect(page.getByText('Group 2, option 1', {exact: true })).toBeVisible();

    await page.locator('#selectOne').click();
    await page.getByRole('option', { name: 'Dr.' }).click();
    await expect(page.getByText('Dr.', {exact: true })).toBeVisible();
})

//scroll into div and click

test('scroll into div and click', async ({ page }) => {
    await page.goto('https://mui.com/material-ui/react-autocomplete/');
    await page.locator('#ComboBox').scrollIntoViewIfNeeded();
    // await page.locator('#ComboBox').first().click();    
    await page.locator('#_R_2ql32d9l7aqll6_').click();
    await page.$eval('#_R_2ql32d9l7aqll6_', el => el.value = 'Memento').scrollIntoViewIfNeeded();
    // await page.mouse.wheel(0, 445);
    // await page.locator('#_R_2ql32d9l7aqll6_').type('Memento');
    // await page.locator('#_R_2ql32d9l7aqll6_').press('Enter');
    // await expect(page.locator('#_R_2ql32d9l7aqll6_')).toHaveValue('Memento');

    const scrollY = await page.evaluate(() => window.scrollY);
    console.log(scrollY);
})

//check scroll with orange source web

test('scroll with orange source web', async ({page}) => {
await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
await page.getByPlaceholder('Username').fill('Admin');
await page.getByPlaceholder('Password').fill('admin123');
await page.getByRole('button', {name: ' Login '}).click();
await page.getByText('PIM', {exact: true}).click();
await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList');
// await page.locator('.').last().scrollIntoViewIfNeeded();
// const username = await page.locator('.oxd-table-card').last().locator('.oxd-table-cell').first().textContent();
await page.locator('.oxd-button oxd-button--medium oxd-button--secondary orangehrm-left-space').click();  
await page.getByText('0311').click().waitForIfNeeded('timeout', 5000);
await expect(page.locator('.ooxd-text oxd-text--h6 --strong')).toHaveText('Alice Johnson87104');
})


test('test for search, click and verify usernmae, and delete it', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.locator('div').nth(2).click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('textbox').nth(2).click();
  await page.getByRole('textbox').nth(2).fill('0311');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByRole('cell', { name: '0311' })).toBeVisible();
  await page.getByText('0311').click();
  await expect(page.locator('.orangehrm-edit-employee-name h6')).toHaveText('yqlluQZYFR yaTQBtZgLf');

});

test.only('search and verify employee', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.locator('div').nth(2).click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('textbox').nth(2).click();
  await page.getByRole('textbox').nth(2).fill('25862');
  await page.getByRole('button', { name: 'Search' }).click();
//   await expect(page.getByText('No Records found')).toBeVisible();
const noRecordsText = await page.locator('.oxd-toast');
await expect(noRecordsText).toContainText('InfoNo Records Found×');
//wait for the toast message to disappear
await page.waitForTimeout(5000); // Adjust the timeout as needed
await expect(noRecordsText).not.toBeVisible();
});