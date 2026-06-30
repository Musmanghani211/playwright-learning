# Playwright Assertions — Notes

## 1. Page Level Assertions

### toHaveTitle
```javascript
await expect(page).toHaveTitle('Swag Labs');
```
**Kab:** Page navigate hone ke baad title verify karna.
**Kyun:** Confirm karna ke sahi page load hua hai — title galat ho to pata chal jata hai page change ho gaya ya error aaya.

### toHaveURL
```javascript
await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
```
**Kab:** Login, navigation, ya redirect ke baad URL check karna.
**Kyun:** Confirm karna ke action ke baad sahi page pe pahunche — jaise login successful hone pe inventory page pe redirect hua.

---

## 2. Visibility Assertions

### toBeVisible
```javascript
await expect(page.locator('.element')).toBeVisible();
```
**Kab:** Element user ko screen pe dikh raha hai check karna.
**Kyun:** Element DOM mein ho sakta hai but CSS se hidden ho — `toBeVisible` actual visibility check karta hai, sirf existence nahi.

### toBeHidden
```javascript
await expect(page.locator('.element')).toBeHidden();
```
**Kab:** Verify karna ke element chupa hua hai — jaise menu close hone ke baad.
**Kyun:** Confirm karna ke UI state sahi hai, element accidentally visible nahi reh gaya.

### toBeAttached
```javascript
await expect(page.locator('.element')).toBeAttached();
```
**Kab:** Element DOM mein exist karta hai check karna (visible ho ya na ho).
**Kyun:** Kabhi sirf yeh confirm karna hota hai ke element page mein load hua hai, dikhna zaroori nahi.

---

## 3. Text Assertions

### toHaveText (exact match)
```javascript
await expect(page.locator('.element')).toHaveText('exact text');
```
**Kab:** Jab text bilkul fixed ho — error messages, static labels, button names.
**Kyun:** Strict check chahiye — ek character bhi different hua to fail hoga. Confidence milta hai ke exact wahi message aaya jo expect kiya.

### toContainText (partial match)
```javascript
await expect(page.locator('.element')).toContainText('partial');
```
**Kab:** Jab text mein dynamic part ho — "Welcome, Usman" jaisa, naam change ho sakta hai.
**Kyun:** Pura text match karna mushkil hota hai agar kuch part dynamic ho. Partial match flexible aur practical hai real-world data ke liye.

---

## 4. Value Assertions

### toHaveValue
```javascript
await expect(page.locator('#input')).toHaveValue('standard_user');
```
**Kab:** Input field mein kya type hua verify karna.
**Kyun:** Confirm karna ke `fill()` ya `type()` sahi se kaam kiya aur field mein correct value gayi.

---

## 5. State Assertions

### toBeEnabled
```javascript
await expect(page.locator('#button')).toBeEnabled();
```
**Kab:** Button clickable hai check karna.
**Kyun:** Confirm karna ke user action lene ke liye ready hai — form complete fill hone ke baad submit button enable hona chahiye.

### toBeDisabled
```javascript
await expect(page.locator('#button')).toBeDisabled();
```
**Kab:** Button disabled state mein hai check karna — jaise empty form pe submit button.
**Kyun:** Business logic verify karna — required field empty ho to button disabled rehna chahiye, warna invalid submission ho sakti hai.

### toBeChecked
```javascript
await expect(page.locator('#checkbox')).toBeChecked();
```
**Kab:** Checkbox/radio select hua ya nahi verify karna.
**Kyun:** User action ka result confirm karna — check karne ke baad state sahi hai ya nahi.

### toBeEditable
```javascript
await expect(page.locator('#input')).toBeEditable();
```
**Kab:** Input field mein type kiya ja sakta hai check karna.
**Kyun:** Confirm karna field readonly ya disabled nahi hai, user edit kar sakta hai.

### toBeEmpty
```javascript
await expect(page.locator('#input')).toBeEmpty();
```
**Kab:** Field khali hai verify karna — jaise reset hone ke baad.
**Kyun:** Confirm karna ke clear/reset action sahi se kaam kiya.

---

## 6. Count Assertion

### toHaveCount
```javascript
await expect(page.locator('.item')).toHaveCount(6);
```
**Kab:** List mein kitne items hain check karna — products, search results, table rows.
**Kyun:** Filter ya search ke baad verify karna ke sahi number of results aaye, data missing ya extra nahi hai.

---

## 7. Attribute/Class Assertions

### toHaveAttribute
```javascript
await expect(page.locator('#input')).toHaveAttribute('type', 'password');
```
**Kab:** HTML attribute check karna.
**Kyun:** Security ya functionality verify karna — jaise password field actually `type="password"` hai, plain text nahi.

### toHaveClass
```javascript
await expect(page.locator('.button')).toHaveClass('active');
```
**Kab:** Element pe specific CSS class lagi hai check karna.
**Kyun:** UI state verify karna — jaise selected tab pe "active" class lagi honi chahiye.

---

## 8. CSS Assertion

### toHaveCSS
```javascript
await expect(page.locator('.button')).toHaveCSS('color', 'rgb(255, 0, 0)');
```
**Kab:** Element ka specific style property check karna.
**Kyun:** Visual/design verify karna — jaise error text red color mein hona chahiye.

---

## 9. Negative Assertions

```javascript
await expect(page.locator('.element')).not.toBeVisible();
await expect(page.locator('.button')).not.toBeChecked();
```
**Kab:** Jab confirm karna ho ke kuch NAHI hua — element nahi dikhna chahiye, checkbox unchecked rehna chahiye.
**Kyun:** Negative scenarios test karna equally important hai — jaise logout ke baad user-specific content nahi dikhna chahiye.

---

## 10. Soft Assertions

```javascript
await expect.soft(page.locator('.element')).toHaveText('something');
await expect.soft(page.locator('.button')).toBeVisible();
// agle steps run honge chahe upar wale fail ho jayen
```
**Kab:** Jab ek test mein multiple independent checks karni hon.
**Kyun:** Normal assertion fail hote hi test stop ho jata hai — sirf pehla failure dikhta hai. Soft assertion sab checks chalata hai aur end mein sare failures ek sath dikhata hai, jisse debugging mein time bachta hai aur ek run mein zyada information milti hai.

---

## Quick Decision Table

| Scenario | Assertion |
|---|---|
| Navigation verify karni hai | `toHaveTitle`, `toHaveURL` |
| Element dikh raha hai ya nahi | `toBeVisible`, `toBeHidden` |
| Fixed text check karna hai | `toHaveText` |
| Dynamic/partial text check karna hai | `toContainText` |
| Input field ki value check karni hai | `toHaveValue` |
| Button click ke liye ready hai | `toBeEnabled` / `toBeDisabled` |
| Checkbox/radio state | `toBeChecked` |
| List ki length check karni hai | `toHaveCount` |
| HTML attribute verify karna hai | `toHaveAttribute` |
| CSS class check karni hai | `toHaveClass` |
| Style/color verify karna hai | `toHaveCSS` |
| Kuch nahi hona chahiye | `.not.` prefix |
| Multiple checks, fail pe bhi continue chahiye | `expect.soft` |
