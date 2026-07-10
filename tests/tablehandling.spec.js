import {test, expect} from '@playwright/test';
import { match } from 'node:assert';

test('find the total number of rows and columns and chekc the checkboxes', async({page}) => {
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
);
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


// Total rows on one page — count verification - Done
//  Rows on all pages — pagination handling - Done
//  Extract details of one specific row - Done
//  Extract details of a row from another/related table page - Done
//  Dynamic data validation (add → verify → update/delete)
// Column count/header verification - Done
// Checkbox/bulk selection


//total rows on one page.

test('check the total rows on one page.', async({page})=>{
await page.goto('https://testautomationpractice.blogspot.com/')
const table = await page.locator('#productTable');
// const header = await table.locator('thead tr');
// const headerData = await header.locator('th');
const tablebody = await table.locator('tbody');
const Tablerows = await tablebody.locator('tr')
const TableRowsData = await Tablerows.locator('td');
console.log("Total rows ont the table: " + await Tablerows.count());

})

//total columns of the table


test('check the total columns on first page.', async({page})=>{
await page.goto('https://testautomationpractice.blogspot.com/');
const table = await page.locator('#productTable');
const header = await table.locator('thead tr');
const headerData = await header.locator('th');
// const tablebody = await table.locator('tbody');
// const Tablerows = await tablebody.locator('tr')
// const TableRowsData = await Tablerows.locator('td');
console.log("Total columns on the table: " + await headerData.count());

})

//check the total rows on all the pages.

test('check all the rows count for all the pages', async ({page}) => {
await page.goto('https://testautomationpractice.blogspot.com/');
const table = await page.locator('#productTable');
const tablebody = await table.locator('tbody');
const Tablerows = await tablebody.locator('tr')
const TableRowsData = await Tablerows.locator('td');
// console.log("Total rows on the table for first page: " + await Tablerows.count());
let TotalCount = 0;
//page count
const pages = await page.locator('.pagination li a');
const pagesCount = await pages.count();

if(pagesCount > 0){
    for(let i =0; i<pagesCount; i++){
    if(i > 0){
        await pages.nth(i).click();
        await expect(tablebody.locator('tr').first()).toBeVisible();
    }
    
    const totalCountOfCurrrentPage = await tablebody.locator('tr').count();
    TotalCount = TotalCount + totalCountOfCurrrentPage;
    console.log("The total current page count is" + totalCountOfCurrrentPage);
    }
    console.log("Total count for all the pages are: " + TotalCount)
}
})


//extract row data based on the specific data

test('extac details of the row bases on the details/name or another details', async ({page}) =>{
await page.goto('https://testautomationpractice.blogspot.com/');
const table = await page.locator('#productTable');
const tablebody = await table.locator('tbody');
const Tablerows = await tablebody.locator('tr')
const specificRowData = await Tablerows.filter(
    {hasText: 'Smartphone'}
);
const CellDataForMatchedRow = await specificRowData.locator('td').allTextContents();
console.log(CellDataForMatchedRow);
})


//find the user whose data is availabel on another page no and also find the page no where the ID is matching

test('find the user from another page.', async({page}) =>{
    await page.goto('https://testautomationpractice.blogspot.com/');
    const table = await page.locator('#productTable');
    const tablebody = table.locator('tbody');
    const pages = page.locator('.pagination li a');
    const pagesCount = await pages.count();
    let UserName = 'Portable Charger';
    let found = false;
    for(let i=0; i<pagesCount; i++){
        if(i > 0){
            await pages.nth(i).click();
            await expect(tablebody.locator('td').first()).toBeVisible();
        }
        
        const rows = await tablebody.locator('tr');
        const rowsCount = await rows.count();

        for(let j=0; j<rowsCount; j++){
            const row = await rows.nth(j);
            const cellID = await row.locator('td').first();
            const cellText = (await cellID.textContent()).trim();
            if(cellText === UserName){
                console.log(`data found on page: ${i+1}`);
                found = true;
                break;
            }
             
        
        } 
        if(found){
                break;
            }
        }   
  if(!found){
                console.log(`Nothing is found on ${pagesCount} pages, your ID is ${UserName}`);

            }
        
})
    

// to check the specifis user by name of first table. If user available on second page then we need to do 

test('select the user which is available on another page', async({page}) =>{
    await page.goto('https://testautomationpractice.blogspot.com/');
   const table = await page.locator('#productTable');
    const tablebody = table.locator('tbody');
    const pages = page.locator('.pagination li a');
    const pagesCount = await pages.count();
    let UserName = 'Portable Charger';
    let found = false;
    for(let i=0; i<pagesCount; i++){
        if(i > 0){
            await pages.nth(i).click();
            // await expect(tablebody.locator('td').first()).toBeVisible();
        }
        
        const rows = await tablebody.locator('tr');
        const rowsCount = await rows.count();

        for(let j=0; j<rowsCount; j++){
            const row = await rows.nth(j);
            const cellID = await row.locator('td').nth(1);
            const cellText = (await cellID.textContent());
            if(cellText === UserName){
                await row.locator('input').check();
                await expect(row.locator('input')).toBeChecked();
                console.log(`${UserName} found and checked on page: ${i+1}`);
                found = true;
                break;
            }
             
        
        } 
        if(found){
                break;
            }
        }   
  if(!found){
                console.log(`Nothing is found on ${pagesCount} pages, your User Name is ${UserName}`);

            };


})

// the above method to check the specifis user by name of first table. If user available on second page then we need to do 



test('bulk selection on one page', async({page}) =>{
    await page.goto('https://testautomationpractice.blogspot.com/');
   const table = await page.locator('#productTable');
    await page.locator('.pagination li a').nth(2).click();
    const tablebody = table.locator('tbody');
    const rows = await tablebody.locator('tr');


    await selectedItems(page, rows, "Smart Home Hub");
    await selectedItems(page, rows, "Portable Charger");
    await selectedItems(page, rows, "Desktop Computer");


})

async function selectedItems(page, rows, Name){
const matchedrow = await rows.filter(
    {
        hasText: Name
    }
)

await matchedrow.locator('input').check();
await expect(matchedrow.locator('input')).toBeChecked();
const cellData = await matchedrow.locator('td').allTextContents();
console.log(cellData);
}



//select on item by using ID from the last page.

test('select one row using ID', async({page}) =>{
    await page.goto('https://testautomationpractice.blogspot.com/');
    const table = await page.locator('#productTable');
    const tableData = await table.locator('tbody');
    const rows = await tableData.locator('tr');
    const pages = await page.locator('#pagination li a');
    await pages.nth(3).click();

    await SelectMethodUsingID(rows, page, "16");
    await SelectMethodUsingID(rows, page, "18");
    await SelectMethodUsingID(rows, page, "20");
})

async function SelectMethodUsingID(rows, page, targetID){
const rowsCount = await rows.count();
for(let i =0; i <rowsCount; i++){
// const selectedRowData = await rows.locator('td').allTextContents();
const row = rows.nth(i);
const idText = (await row.locator('td').first().textContent()).trim();
// let matchedRow = null;
if(idText === targetID){
    await row.locator('input').check();
    await expect(row.locator('input')).toBeChecked();
   let matchedRow = row;
    const CellData = await matchedRow.locator('td').allTextContents();
    const dataonly = await CellData.slice(0,-1);
    console.log(`This is the data of the ID ${targetID}: `,  dataonly);
    
    break;
}
}

}


//search the data into the table.

test.only('search the specific row data into the table', async({page}) => {
    await page.goto('https://www.testmuai.com/selenium-playground/table-sort-search-demo/');
    const table = await page.locator('#example');
    const tablebody = await table.locator('tbody');
    const rows = await tablebody.locator('tr');
    const columns = await table.locator('thead');
//    console.log(await rows.count());

    // select search locator and fill the name
    const searchBox = await page.getByLabel('Search');
    await searchBox.fill('New York');
    const rowsCount = await rows.count();
    console.log("Total rows after search: ", rowsCount);

    // let UserName = "J. Caldwell";
    // const mathcedRow = await rows.filter({hasText: UserName});
    // const matchedRowData = await mathcedRow.locator('td').allTextContents();
    // console.log(matchedRowData);


    const matchedRow = await rows.locator('td');
   console.log()

    // await expect(matchedRow).toContainText('Auditor');
    // const matchedRowData = await matchedRow.allTextContents();
    // console.log(matchedRowData);
})
