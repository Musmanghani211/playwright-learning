import {test, expect} from '@playwright/test';
import { TIMEOUT } from 'node:dns';

test ('verify the user is abel to login with valid crededentails', async({page}) => {

    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole('button', {name:'Login'}).click();
    await expect(page).toHaveTitle ("Swag Labs");
})

test ('verify the user is NOT abel to login with invalid password', async({page}) => {

    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce!");
    await page.getByRole('button', {name:'Login'}).click();
    await expect(page.locator('.error-message-container.error')).toHaveText('Epic sadface: Username and password do not match any user in this service')
})

test('verify the user is able to sort A-Z', async ({page}) => {
        await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole('button', {name:'Login'}).click();

    await page.getByRole('combobox').selectOption('Name (A to Z)');
    const ProductAtoZ = await page.locator('.inventory_item_name ').allTextContents();
    expect(ProductAtoZ).toEqual([...ProductAtoZ].sort());

})

    test('verify the user is able to sort Z-A', async ({page}) => {
        await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole('button', {name:'Login'}).click();

    await page.getByRole('combobox').selectOption('Name (Z to A)');
        const ProductZtoA = await page.locator('.inventory_item_name ').allTextContents();
    expect(ProductZtoA).toEqual([...ProductZtoA].sort().reverse());

    })

    test('verify the user is able to sort low to high price', async ({page}) => {
        await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole('button', {name:'Login'}).click();
    await page.getByRole('combobox').selectOption('Price (low to high)');
    const PriceLowtoHigh = await page.locator('.inventory_item_price').allTextContents();
    const NumericLowToHigh = PriceLowtoHigh.map(p => parseFloat(p.replace('$', "")));
    expect(NumericLowToHigh).toEqual([...NumericLowToHigh].sort((a, b) => a-b));

    })


    test('verify the user is able to sort price high to low', async ({page}) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole('button', {name:'Login'}).click();

    await page.getByRole('combobox').selectOption('Price (high to low)');
    const PriceHightoLow = await page.locator('.inventory_item_price').allTextContents();
    const NumericLowtoHigh = PriceHightoLow.map(p => parseFloat(p.replace("$", "")));
    expect(NumericLowtoHigh).toEqual([...NumericLowtoHigh].sort((a,b) => b-a))
    })

    test('verify the user is able to add a product to cart', async ({page}) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole('button', {name:'Login'}).click();
    await page.getByRole('button', {name:'Login'}).waitFor();
    await page.locator('#item_4_title_link').click();
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
    await page.locator("#add-to-cart").click();
   await expect(page.locator(".shopping_cart_badge")).toHaveCount(1);

   
})

  test('verify the user is able to remove a product from cart', async ({page}) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole('button', {name:'Login'}).click();
    await page.locator('#item_4_title_link').click();
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
    await page.locator("#add-to-cart").click();
   await expect(page.locator(".shopping_cart_badge")).toHaveCount(1);
   await page.locator('#shopping_cart_container').click();
    // await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
   await page.locator('#remove-sauce-labs-backpack').click();
   await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
   
})

 test('verify the user is able to checkout the product', async ({page}) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole('button', {name:'Login'}).click();
    await page.locator('#item_4_title_link').click();
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
    await page.locator("#add-to-cart").click();
   await expect(page.locator(".shopping_cart_badge")).toHaveCount(1);
   await page.locator('#shopping_cart_container').click();
    // await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
   await page.locator('#checkout').click();
   await expect(page.locator(".title")).toHaveText('Checkout: Your Information');
})

 test('verify the user is able to logout', async ({page}) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole('button', {name:'Login'}).click();
    await page.locator('.bm-burger-button').click();
    await page.locator('#logout_sidebar_link').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
})

//hard wait, dynamic waits, ans when they are used, and how they are used.
//asserstions and actions
