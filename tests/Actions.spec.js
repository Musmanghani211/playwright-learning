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
const scrolly = await page.evaluate(() => window.scrollY);
console.log(scrolly);
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
    expect(scrollY).toBe(1000);
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
const scrolly = await page.evaluate(() => window.scrollY);
console.log(scrolly);
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
    expect(scrollY).toBe(1000);
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

