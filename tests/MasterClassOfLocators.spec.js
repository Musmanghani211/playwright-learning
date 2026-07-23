import {test, expect} from '@playwright/test';

test(' Product Filtering & Cart Management on SauceDemo', async({page}) =>{
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', {name: 'Login'}).click();
    // await expect(page.getByTitle('Swag Labs')).toBeVisible();

    const Backpackproduct = await page.locator('.inventory_item').filter({
        hasText: 'Backpack'
    });
    const BackpackproductDescription = await Backpackproduct.locator('.inventory_item_description');
    const Backpackproductpricesection = await BackpackproductDescription.locator('.pricebar .inventory_item_price');
    const Backpackproductprice = await Backpackproductpricesection.allTextContents();
    // console.log( Backpackproductprice)

    const BackLightProduct = await page.locator('.inventory_item').filter({
        hasText: /^Sauce Labs Bike Light$/
    });

    const BackLightProductDescription = await BackLightProduct.locator('.inventory_item_description');
    const BackLightProductpricecard = await BackLightProductDescription.locator('.pricebar .inventory_item_price');
    const BackLightProductprice = await BackLightProductpricecard.allTextContents();
    // console.log(BackLightProductprice )

    const Allproducts = await page.locator('.inventory_item').filter({
        hasNotText: 'Remove',
        hasText: 'Add to cart'
    });
    const AllproductsCount =  await Allproducts.count();
    console.log( "the count of all the product is",AllproductsCount);

    for(let i = 0; i < 2; i++){
        const allproductsAddtoCardButton = await Allproducts.getByRole('button', {name: 'Add to cart'}).first();
        await allproductsAddtoCardButton.click();
        
    }
    
    console.log("the products added to cart", await page.locator('.shopping_cart_badge').textContent());
    await expect(await page.locator('.shopping_cart_badge')).toHaveText('2');
    
    const CountwhichDonotHaveRemoveButton = await Allproducts.count();
    console.log("the total products which do not have Remove button:", CountwhichDonotHaveRemoveButton );
    await expect(Allproducts).toHaveCount(4);

    const shirtProduct = await Allproducts.filter({hasText: 'Shirt'}).filter({has: page.getByRole('button', {name: 'Add to cart'})}).filter({hasNotText: 'Remove'}).first();
    const shirtName = await shirtProduct.locator('.inventory_item_name').textContent();
    console.log("this is the first product item: ", shirtName);
    
    //step 8
    //     const shirtProducts = await Allproducts.filter({hasText: 'Shirt'}).filter({has: page.getByRole('button', {name: 'Add to cart'})}).filter({hasNotText: 'Remove'});
    // const shirstName = await shirtProducts.locator('.inventory_item_name').textContent();
    // console.log(shirstName);

    //step 9
    const shirtProductsdetails = await Allproducts.filter({hasText: 'Shirt'}).filter({has: page.getByRole('button', {name: 'Add to cart'})}).filter({hasNotText: 'Remove'}).last();
    const shirstNameproduct = await shirtProductsdetails.locator('.inventory_item_name').textContent();
    console.log("this is the last product item: ", shirstNameproduct);
    const Addingproductocart = await shirtProductsdetails.getByRole('button', {name: 'Add to cart'}).click();
     await expect(await page.locator('.shopping_cart_badge')).toHaveText('3');

     //step 10

     await page.locator('.shopping_cart_link').click();
     const cartItems = await page.locator('.cart_item');
     const cartItemsCount = await cartItems.count();
     console.log("The total products on the cart : ", cartItemsCount);
     await expect(cartItemsCount).toBe(3);
    

//step 11: Assert that the cart contains the product added in step 9 by name.

const cartItemstitle = await cartItems.locator('.inventory_item_name');
 const specificproductonthecart = await cartItemstitle.filter({
    hasText: 'Test.allTheThings() T-Shirt (Red)'
 });
 await expect(specificproductonthecart).toBeVisible();

})


test('parent-child practice', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Start from a child you can identify by text
  const priceText = page.locator('.inventory_item_price').first();
  console.log('Price:', await priceText.textContent());

  // Go UP to its parent card using XPath ".."
  const parentCard = priceText.locator('xpath=..');
  console.log('Parent card class:', await parentCard.getAttribute('class'));

  // Go up TWO levels (grandparent)
  const grandParent = priceText.locator('xpath=../..');
  console.log('Grandparent class:', await grandParent.getAttribute('class'));
});

test('parent-child practice on OrangeHRM table', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByText('PIM').click();
  await page.waitForURL('**/pim/viewEmployeeList**');

  // Wait for table to load
  const rows = page.locator('.oxd-table-body .oxd-table-row');
  await expect(rows.first()).toBeVisible();

    let UserID = '5948847';
    await page.getByRole('textbox').nth(2).fill(UserID);
    await page.getByRole('button', {name: 'Search'}).click();
    await expect(rows).toBeVisible();

  //rows count
  const rowsCount = await rows.count();
  console.log('Total rows found with this search:', rowsCount);

  //rows in first row.
//   const firstRow = rows.first();
  const cellsinrow = await rows.locator('.oxd-table-cell').count();
  console.log('Cells in first row:', cellsinrow);

  const DatainAllCelss = await rows.locator('.oxd-table-cell').allTextContents();
  const OnlyCellsData = await DatainAllCelss.slice(1,-5);
  console.log(OnlyCellsData);
});

test('Check the toast for OrangeHRM website', async ({ page }) => {
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

test('using the path', async ({ page }) => {
  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe('Wrong password.');
    await dialog.accept();
  });

  await page.goto('https://www.demoblaze.com/');
page.getByRole('link', { name: /Log in/}).click();
  await page.locator('#loginusername').fill('usman123');
  await page.locator('#loginpassword').fill('usman123');
  
page.locator('button:has-text("Log in")').click();

  // verify expected page state after login/dialog
  await expect(page.locator('#logout2')).toBeVisible();
  await expect(page.getByRole('link', { name: /Log in/})).not.toBeVisible();
});


test('xpath locator found from selectorCSS', async ({ page }) => {
  await page.goto('https://demoqa.com/');
  await page.locator("//a[@href='/elements']//div[@class='card mt-4 top-card']").click();
  await expect(page).toHaveURL('https://demoqa.com/elements');
 await page.locator ("body > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(7)").click();

 const images = await page.locator('img');
 const count = await images.count();
  for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute('alt');
    console.log(`Image ${i}: alt="${alt}"`);
  }

//  await expect(page.locator("body > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > p:nth-child(2)"))

// await page.getByRole('link', {name: 'Admin'}).click();
//   await page.locator("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']").fill("auto_user_hbYeMW338");
//   await page.getByRole("(//button[normalize-space()='Rechercher'])[1]").click();
//   const table = await page.locator('.oxd-table');
//   const tablebody = await table.locator('.oxd-table-body');
//   const rows = await tablebody.locator('.oxd-table-row');
//   await rows.first().waitFor({ state: 'visible', timeout: 10000 });
//   const targetrow = await rows.filter({hasText: 'auto_user_hbYeMW338'}).first();
//   await expect(targetrow).toContainText('Enable');
//  await targetrow.locator('i.oxd-icon.bi-pencil-fill').click();

//  await page.getByText('Enabled', { exact: true }).click();
//  await page.getByRole('option', {name: 'Disable'}).click();
//  await page.getByRole('button', { name: 'Save' }).click();

//   await page.locator("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']").fill("auto_user_hbYeMW338");
//   await page.getByRole('button', { name: 'Search' }).click();
//   await expect(targetrow).toBeVisible({ timeout: 10000 });
// const cells = await targetrow.locator('.oxd-table-cell').allTextContents();
// console.log(cells) 
// await expect(targetrow).toContainText('Disable');

// await targetrow.locator('//body[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[2]/div[3]/div[1]/div[2]/div[1]/div[1]/div[6]/div[1]/button[1]/i[1]').click();
// await page.getByRole('button', {name: 'Yes, Delete'}).click();
//     await expect(page.locator('.oxd-toast')).toContainText('Successfully Deleted');


})


test('test-data locators', async({page}) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator("[id='user-name']").fill('standard_user');
  await page.locator("[id='password']").fill('secret_sauce');
  await page.locator("[id='login-button']").click();

  await page.locator("//button[@id='react-burger-menu-btn']").click();
  await page.locator("#logout_sidebar_link").click();
  await expect(page).toHaveURL('https://www.saucedemo.com/');
})

test('each image individually must load and have alt text', async ({ page }) => {
  await page.goto('https://practice-automation.com/broken-images/');
 
  const images = page.locator('img');
  const count = await images.count();
  console.log(count);
 
  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    const src = await img.getAttribute('src');
    const alt = await img.getAttribute('alt');

const isbroken = await img.evaluate((el) => !el.complete || el.naturalWidth === 0);
    // const isBroken = await img.evaluate((el) => !el.complete || el.naturalWidth === 0);

    console.log(isbroken, src);
    await expect.soft(isbroken).toBe(false);
 
    // expect.soft(isBroken, `Image ${i} (src: ${src}) is broken`).toBe(false);
    // expect(alt, `Image ${i} (src: ${src}) is missing alt text`).toBeTruthy();
  }
})

//geting all the images of clinVerfiy website

test('ClinVerify images checking', async({page}) => {
  await page.goto('https://cn.skpluss.com/categories/');
  await waitForLoadState('networkidle')
  const images = await page.locator('img');
  const ImagesCount = await images.count();
  console.log('total images count is: ', ImagesCount)

  for(let i = 0; i < ImagesCount; i++){
    const img = await images.nth(i);
    const src = await img.getAttribute('src');
    const alt = await img.getAttribute('alt');
    await img.scrollIntoViewIfNeeded();
    const isbroken = await img.evaluate((el) => !el.complete || el.naturalWidth === 0);
    console.log(isbroken, src);
    await expect.soft(isbroken).toBe(false);
  }
})
