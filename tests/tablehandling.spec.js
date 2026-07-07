import {test, expect} from '@playwright/test';

test.only('find the total number of rows and columns and chekc the checkboxes', async({page}) => {
await page.goto('https://testautomationpractice.blogspot.com/')
const table = await page.locator('#productTable');

//find the total number of rows and columns
const columns = await table.locator('thead tr th');
await expect(await columns.count()).toBe(4)
const rows = await table.locator('tbody tr');
await expect(await rows.count()).toBe(5)

// select specific row
const matchedrow = await rows.filter({
    has: page.locator('td'),
    hasText: 'Smartwatch'
}
)

 const cellDataoffirstpagerows = await rows.locator('td').allTextContents();
  console.log("data of whole page rows",cellDataoffirstpagerows);

await matchedrow.locator('input').check();
await expect(matchedrow.locator('input')).toBeChecked();

//select multiple items in the tbale by using the function
await selectItem(rows, page,'Wireless Earbuds');
await selectItem(rows, page,'Laptop');


// await page.waitForTimeout(2000)
})


async function selectItem(rows, page, Name){
const matchedrow = await rows.filter({
    has: page.locator('td'),
    hasText: Name
}
)
await matchedrow.locator('input').check();
await expect(matchedrow.locator('input')).toBeChecked();

//print all the detials of the product using loop of one page
  await matchedrow.locator('input').check();
  await expect(matchedrow.locator('input')).toBeChecked();


  // print all details of the matched row only
  const cellDataofmatchedrow = await matchedrow.locator('td').allTextContents();
  console.log("data for the matched rows", cellDataofmatchedrow);
}

test('show all data of the specific row @showspecifcrowdata', async ({page})=>{
await page.goto('https://testautomationpractice.blogspot.com/')
const table = await page.locator('#productTable');
const rows = await table.locator('tbody tr');
const columns = await table.locator('thead tr th');
const selectedItem = rows.filter({hasText: 'Tablet'})
const rowText = await selectedItem.textContent();
// console.log(rowText);
const celltext = await selectedItem.locator('td').allTextContents();
const dataonly = celltext.slice(0, -1);
console.log(dataonly);
})





//get all the data of all the pages
test('get all the data of all the pages @showalldataofallthepages', async({page})=>{
await page.goto('https://testautomationpractice.blogspot.com/')
const table = await page.locator('#productTable');
const rows = await table.locator('tbody tr');
const pages = await page.locator('.pagination li a');
console.log("Number of all the pages:", await pages.count());
const PagesCount = await pages.count();
const rowCount = await rows.count();
for(let p=0; p<PagesCount; p++){
if(p>0){
await pages.nth(p).click();
}
for(let i=0; i< await rows.count(); i++){
    const row = await rows.nth(i);
    const tds = await row.locator('td')
   
    for(let j=0; j<await tds.count() -1; j++){
    // console.log(await tds.nth(j).textContent());
   }

}
// Once per page: log the full row-by-row data as arrays, excluding checkbox column
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const cellTexts = await row.locator('td').allTextContents();
      const dataOnly = cellTexts.slice(0, -1);
      console.log(dataOnly);
    }
}
})

