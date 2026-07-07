# Playwright Actions — Notes

## 1. Click Actions

```javascript
await page.locator('#button').click();                    // normal click
await page.locator('#button').dblclick();                 // double click
await page.locator('#button').click({ button: 'right' }); // right click
```

**Kab use karo:** Button, link, checkbox, ya kisi bhi clickable element pe action lene ke liye.
**Kyun:** Sabse common action hai — login, navigation, form submit sab click se hota hai.

---

## 2. Fill vs Type vs Clear

```javascript
await page.locator('#input').fill('hello');   // seedha text daalo — fast, no keystrokes
await page.locator('#input').type('hello');   // ek ek character type — real user jaisa
await page.locator('#input').clear();         // field khali karo
```

**Kab use karo:**
- `fill()` — normal form filling, fast hai
- `type()` — jab autocomplete/suggestions trigger karni ho (har keystroke pe event fire hota hai)
- `clear()` — field reset karne ke liye

---

## 3. Hover

```javascript
await page.locator('.menu').hover();
```

**Kab use karo:** Dropdown menus, tooltips, ya jo element hover pe show hote hain.
**Kyun:** Real user mouse le jata hai element pe — same simulate karta hai.

---

## 4. Select Dropdown

```javascript
await page.locator('select').selectOption('value');
await page.locator('select').selectOption({ label: 'Name (A to Z)' });
await page.locator('select').selectOption({ index: 0 });
```

**Kab use karo:** Native HTML `<select>` dropdowns ke liye.
**Note:** Custom dropdowns (div-based) ke liye `click()` + option select karna padta hai.

---

## 5. Checkbox / Radio

```javascript
await page.locator('#checkbox').check();
await page.locator('#checkbox').uncheck();
await page.locator('#radio').check();
await expect(page.locator('#radio')).toBeChecked();
```

**Kab use karo:** Forms mein checkboxes/radio buttons select karne ke liye.

---

## 6. Keyboard

```javascript
await page.keyboard.press('Enter');
await page.keyboard.press('Tab');
await page.keyboard.press('Escape');
await page.keyboard.type('Hello World');
```

**Kab use karo:**
- Tab navigation test karna
- Form submit Enter se
- Keyboard shortcuts test karna

---

## 7. Upload File

```javascript
await page.locator('#file-input').setInputFiles('path/to/file.pdf');

// verify file uploaded
const filename = await page.locator('#file-input').evaluate(input => input.files[0].name);
expect(filename).toBe('file.pdf');
```

**Kab use karo:** File upload fields test karne ke liye.

---

## 8. Scroll (3 Types)

```javascript
// 1. Page scroll
await page.mouse.wheel(0, 500);

// 2. Element tak scroll
await page.locator('.element').scrollIntoViewIfNeeded();

// 3. Exact pixel pe scroll
await page.evaluate(() => window.scrollTo(0, 1000));
```

**Kab use karo:**
- `mouse.wheel` — general page scroll, infinite scroll pages
- `scrollIntoViewIfNeeded()` — element viewport se bahar ho aur click karna ho (Playwright auto-scroll bhi karta hai mostly)
- `window.scrollTo()` — exact pixel position chahiye ho

**Important:** Playwright khud auto-scroll kar leta hai action lene se pehle — manual scroll sirf tab lagao jab test fail ho "element not visible" error se.

---

## 9. Drag & Drop

```javascript
await page.locator('#source').dragTo(page.locator('#target'));
```

**Kab use karo:** Sliders, list reordering, kanban boards.

---

## 10. Focus

```javascript
await page.locator('#input').focus();
```

**Kab use karo:** Tab navigation testing, accessibility testing. Real automation mein rarely use hota hai — `click()` ya `fill()` se kaam chal jata hai.

---

## 11. Screenshot

```javascript
// poora page
await page.screenshot({ path: 'screenshot.png' });

// specific element
await page.locator('.element').screenshot({ path: 'element.png' });

// full page (scroll ke sath)
await page.screenshot({ path: 'fullpage.png', fullPage: true });
```

**Config mein automatic (sirf fail pe):**
```javascript
use: {
    screenshot: 'only-on-failure',
}
```

**Kab use karo:**
- Config — automatic fail-pe-screenshot, debugging ke liye
- Inline — kisi specific step ka proof chahiye ho (pass ho ya fail), documentation/bug reports ke liye

---

## 12. Evaluate (Run JS in Browser)

```javascript
await page.evaluate(() => window.scrollY);
await page.evaluate(() => localStorage.getItem('token'));
await page.evaluate(() => window.scrollTo(0, 1000));
```

**Kab use karo:** Jab Playwright ka built-in method kaam na kare — directly browser JavaScript chalana ho.

---

## Locators Quick Reference

| Locator | Kab Use Karo |
|---|---|
| `getByRole` | Buttons, links, checkboxes, headings |
| `getByText` | Visible text wale elements |
| `getByPlaceholder` | Input fields with placeholder |
| `getByLabel` | Form labels se linked inputs |
| `getByTestId` | Jab `data-testid` attribute available ho — sabse stable |
| `locator(CSS)` | ID/class available ho, ya attribute selector |
| `.nth()` | List mein specific position wala element |
| `.first()` / `.last()` | Pehla/aakhri element |
| `:has-text()` | Specific text wala element find karna |
| XPath | Last resort — complex/dynamic elements |

---

## Waits

```javascript
// Hard wait — AVOID karo
await page.waitForTimeout(3000);

// Dynamic wait — ye use karo
await page.locator('.element').waitFor();
await page.waitForURL('**/inventory.html');
await page.locator('#el').waitFor({ state: 'visible' });
```

**Rule:** Playwright auto-wait karta hai 90% cases mein. Manual wait sirf tab jab test "element not found" se fail ho.