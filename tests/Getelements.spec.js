import {test, expect} from '@playwright/test';

test ('select all the elements', async ({page}) => {

     await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole('button', {name:'Login'}).click();
const items = await page.locator('.inventory_item_name').all();
for(const item of items){
    await item.click();
    await page.goBack();
}
})

test ('select third element', async ({page}) => {

     await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole('button', {name:'Login'}).click();
    await page.locator('.inventory_item_name').nth(2).click();
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Bolt T-Shirt');
})

test('find BackPack element', async ({page}) => {

     await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole('button', {name:'Login'}).click();
    await page.locator('.inventory_item_name:has-text("Backpack")').click();
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack ');
})


test('find any element through attribute', async ({page}) => {

     await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole('button', {name:'Login'}).click();
    await page.locator('[data-test="inventory-item-name"]').nth(0).click();
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
})