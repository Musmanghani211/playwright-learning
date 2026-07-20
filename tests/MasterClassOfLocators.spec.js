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
        hasText: 'Sauce Labs Bike Light'
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
    await expect(await page.locator('.shopping_cart_badge').textContent(String(2)))
    
    const CountwhichDonotHaveRemoveButton = await Allproducts.count();
    console.log("the total products which do not have Remove button:", CountwhichDonotHaveRemoveButton );
    await expect(Allproducts).toHaveCount(4);

    const shirtProduct = await Allproducts.filter({hasText: 'Shirt'}).filter({has: page.getByRole('button', {name: 'Add to cart'})}).fill({hasNotText: 'Remove'});
    const shirtName = await shirtProduct.locator('.inventory_item_name').textContent();
    console.log(shirtName);
    



})

