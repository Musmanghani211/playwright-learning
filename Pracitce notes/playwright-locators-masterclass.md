# Playwright Locators Masterclass — Notes

---

## 1. Core Concept: What a Locator Actually Is

A locator is **not** an element reference — it's a **lazy query**. When you write:
```javascript
const btn = page.locator('button');
```
No search happens yet. The search (and retry) only happens when you call an action:
```javascript
await btn.click(); // NOW Playwright queries the DOM, retrying until found/actionable
```
This is why locators never go "stale" the way old `page.$()` ElementHandles used to — every action re-queries the live DOM.

### Actionability Checks (what happens before every action)
Before `.click()`, `.fill()`, etc. actually run, Playwright automatically waits for the element to be:
1. **Attached** to the DOM
2. **Visible** (not `display:none`/`visibility:hidden`)
3. **Stable** (not mid-animation)
4. **Enabled** (not disabled)
5. **Receiving events** (nothing else overlapping it, e.g. a loading spinner)

This is why manual `waitForTimeout()`/sleep is rarely needed — it's built in.

---

## 2. Locator Strategy Priority (Best → Last Resort)

| Priority | Method | Example | Why |
|---|---|---|---|
| 1 | `getByRole` | `page.getByRole('button', {name: 'Submit'})` | Matches accessibility tree — closest to how real users/screen readers interact |
| 2 | `getByLabel` | `page.getByLabel('Password')` | Great for form fields, tied to `<label>` |
| 3 | `getByText` | `page.getByText('Welcome')` | Good for non-interactive visible text |
| 4 | `getByPlaceholder` | `page.getByPlaceholder('Email')` | Works but less stable — placeholder text changes often |
| 5 | `getByTestId` | `page.getByTestId('submit-btn')` | Most stable IF developers add `data-testid` attributes |
| 6 | `getByAltText` / `getByTitle` | `page.getByAltText('Logo')` | For images/tooltips |
| 7 | CSS / XPath | `page.locator('.oxd-table-row')` | Last resort — breaks easily when styling/structure changes |

---

## 3. Chaining & Scoping

Chaining `.locator()` calls **narrows the search scope** to inside the parent:
```javascript
const form = page.locator('#employee-form');
const nameInput = form.locator('input[name="firstName"]');
```
This avoids ambiguity — even if `input[name="firstName"]` exists elsewhere on the page, this only searches inside `#employee-form`.

---

## 4. `filter()` — Full Breakdown

`filter()` narrows a locator down using a condition, **without** needing position (`nth`). This is the single most useful advanced tool for tables/lists.

### a) `hasText` — substring or regex match

**Substring match** (default) — checks if the text is *contained* anywhere inside the element:
```javascript
page.locator('.oxd-table-row').filter({ hasText: 'Usman' })
// matches "Usman Kamboh", "Usman Ghani Kamboh", etc. — anything containing "Usman"
```

**Regex match** — use when you need an *exact* match or a specific pattern, since substring matching can accidentally match more than intended:
```javascript
page.locator('.oxd-table-row').filter({ hasText: /^Usman Kamboh$/ })
// only matches rows whose text is EXACTLY "Usman Kamboh" (start ^ to end $)
```
**When to use regex over plain string:** if two rows could contain overlapping text (e.g. "Usman" and "Usman Khan" both contain "Usman"), a plain string filter would match both. Regex with `^...$` anchors pins down the exact value.

### b) `has` — filter by a child locator existing inside

Instead of matching text, you match rows/elements that **contain a specific child element**:
```javascript
page.locator('.oxd-table-row').filter({
  has: page.locator('.status-active')
})
// only rows that have a child element matching '.status-active'
```
Useful when the distinguishing feature isn't plain text but a nested element — like an icon, a badge, or a specific button existing in that row.

You can even combine it with role-based child locators:
```javascript
page.locator('.oxd-table-row').filter({
  has: page.getByRole('button', { name: 'Edit' })
})
// rows that specifically have an "Edit" button inside them
```

### c) `hasNot` / `hasNotText` — negative filtering

**When to use this:** when it's easier to describe what you *don't* want than what you *do* want. Common real-world cases:

- **Excluding a known unwanted row/item** from a list before acting on the rest:
  ```javascript
  // Get all rows EXCEPT the header/summary row
  page.locator('.oxd-table-row').filter({ hasNotText: 'Total' })
  ```
- **Filtering out inactive/disabled items** when you only want to act on valid ones:
  ```javascript
  page.locator('.oxd-table-row').filter({ hasNotText: 'Inactive' })
  ```
- **Excluding elements that contain a specific child** (e.g. skip rows that already have a "Completed" badge):
  ```javascript
  page.locator('.task-row').filter({
    hasNot: page.locator('.badge-completed')
  })
  ```
- **General rule of thumb:** use `hasText`/`has` when you know the exact positive identifier (like a unique employee ID). Use `hasNotText`/`hasNot` when the "wanted" items are everything *except* a known pattern (e.g. "process every row that isn't a total/summary/header row").

### d) Chaining multiple filters — how and why

You can chain `.filter()` calls, and each additional filter acts as an **AND** condition:
```javascript
page.locator('.oxd-table-row')
    .filter({ hasText: 'Usman' })
    .filter({ has: page.locator('.status-active') })
```
This reads as: *"give me rows that contain the text 'Usman' AND have an active-status child element."*

**Why chain instead of writing one complex filter?**
1. **Readability** — each `.filter()` line documents one condition clearly, instead of one dense expression.
2. **Reusability** — you can build up a base locator and apply different filters to it depending on context:
   ```javascript
   const allRows = page.locator('.oxd-table-row');
   const activeUsman = allRows.filter({ hasText: 'Usman' }).filter({ hasNotText: 'Inactive' });
   ```
3. **Debuggability** — you can test each filter step individually by calling `.count()` after each one, to see where a locator "loses" the elements you expect.

**Important:** filters currently only combine as AND when chained. If you need OR logic (match condition A or condition B), use `.or()` — see next section.

---

## 5. Combining Locators — `and()` / `or()`

These combine two **separate locators**, not filter conditions on one locator.

### `and()` — both conditions must be true on the *same* element
```javascript
const deleteBtn = page.getByRole('button').and(page.getByTitle('Delete'));
```
This finds an element that is simultaneously matched by both locators — i.e., it's a `button` role AND has `title="Delete"`. Useful when a single attribute isn't unique enough on its own but the combination is.

### `or()` — either locator's match is accepted
```javascript
const alertMessage = page.getByText('Error').or(page.getByText('Warning'));
```
This resolves to whichever one is present — handy for handling two different possible UI states (e.g., an app that sometimes shows "Error" and sometimes "Warning" depending on context), so you don't need `if/else` branching just to check for a message.

**Difference from chained `.filter()`:**
- Chained `.filter()` → narrows down **within one locator's matches**, always AND logic.
- `.and()` / `.or()` → combines **two independently defined locators**, and you explicitly choose AND or OR.

---

## 6. Strict Mode — How to Handle It

By default, Playwright runs in **strict mode**: if a locator resolves to more than one element and you call an action (`.click()`, `.fill()`, etc.), it throws:
```
Error: strict mode violation: locator resolved to 3 elements
```
This is intentional — it prevents Playwright from guessing which of several matches you meant, which could silently click the wrong thing.

### Ways to handle it:

**a) Narrow it down properly (preferred)** — use `filter()`, a more specific selector, or scope via chaining, so the locator naturally resolves to exactly one element.

**b) Use `.first()` / `.last()` / `.nth()`** — only when position is genuinely what you mean:
```javascript
page.locator('.oxd-table-row').first()
```

**c) Use `.count()` when you expect multiple matches on purpose:**
```javascript
const count = await page.locator('.oxd-table-row').count();
expect(count).toBe(5);
```
`count()` is exempt from strict mode — it's designed for multi-element scenarios.

**d) Use `.all()` to loop through every match:**
```javascript
const rows = await page.locator('.oxd-table-row').all();
for (const row of rows) {
  console.log(await row.textContent());
}
```
`.all()` is also exempt from strict mode, since iterating is explicitly multi-element by design.

**e) Use assertions designed for multiple elements:**
```javascript
await expect(page.locator('.oxd-table-row')).toHaveCount(5);
```

**Rule of thumb:** strict mode violations are a *signal*, not just an obstacle — they usually mean your selector isn't specific enough. Treat the error as a prompt to add a `filter()` rather than reflexively reaching for `.first()`.

---

## 7. Advanced CSS Selectors

```javascript
// Attribute selectors
page.locator('[data-status="active"]')
page.locator('[href^="https://"]')      // starts with
page.locator('[href$=".pdf"]')          // ends with
page.locator('[class*="table-row"]')    // contains substring

// Combinators
page.locator('div > button')      // direct child only
page.locator('div button')        // any descendant, any depth
page.locator('label + input')     // immediately following sibling
page.locator('h1 ~ p')            // any following sibling

// Playwright-specific pseudo-classes
page.locator('button:visible')          // only visible matches
page.locator(':text("Submit")')         // substring text match
page.locator(':text-is("Submit")')      // exact text match
```

---

## 8. XPath Axes (last resort, when CSS can't express the relationship)

```javascript
page.locator('//button[text()="Delete"]/..')                          // parent
page.locator('//label[text()="Email"]/following-sibling::input')      // sibling after
page.locator('//span[text()="Error"]/ancestor::div[@class="alert"]')  // ancestor
```
Rarely needed — CSS + `filter()` covers most real cases. Use XPath only when you need to navigate *upward* (parent/ancestor) or to a *sibling*, which plain CSS can't do as cleanly.

---

## 9. Custom Test ID Attribute

If the app uses a custom attribute instead of `data-testid` (e.g. `data-qa`):
```javascript
// playwright.config.js
use: { testIdAttribute: 'data-qa' }
```
Then `getByTestId('submit')` automatically targets `[data-qa="submit"]`.

---

## 10. Locator Assertions vs Manual Checks

**Prefer locator assertions — they auto-retry until timeout:**
```javascript
await expect(locator).toBeVisible();
await expect(locator).toHaveText('Hello');
await expect(locator).toHaveCount(3);
await expect(locator).toHaveAttribute('disabled', '');
await expect(locator).toBeEnabled();
await expect(locator).toBeChecked();
```

**Avoid relying on manual checks for "waiting" — they check once, instantly:**
```javascript
const visible = await locator.isVisible(); // single snapshot, no retry
```
Use manual checks only for immediate branching logic (like `if/else`) where you deliberately want a single point-in-time read, not a wait.

---

## 11. Dynamic / Lazy-Loaded Content

```javascript
// Wait for a loading spinner to disappear before continuing
await page.locator('.spinner').waitFor({ state: 'hidden' });
await expect(page.locator('.data-table')).toBeVisible();

// Scroll an element into view (useful for infinite scroll / lazy load)
await page.locator('.item').last().scrollIntoViewIfNeeded();
```

---

## 12. Codegen — Auto-Generate Locators

```bash
npx playwright codegen https://opensource-demo.orangehrmlive.com
```
Opens a browser; as you click/type manually, Playwright generates the locator code for you, automatically preferring role-based locators. Extremely useful when unsure which selector strategy fits best.

---

## 13. Best Practices Summary

✅ Prefer `getByRole` / `getByLabel` — accessible and stable
✅ Prefer `filter()` over `nth()` when possible — content-based, not position-based
✅ Use `expect(locator).toXxx()` for anything that needs waiting — avoid manual `isVisible()` for wait logic
✅ Chain locators to scope searches — don't search the whole page when you can scope to a container
✅ Treat strict-mode errors as a signal to add a `filter()`, not just an excuse to reach for `.first()`

❌ Don't over-rely on CSS class names — they change with styling updates
❌ XPath only as a last resort — harder to read and maintain

---

## Practice Exercises (try these on OrangeHRM Employee List)

1. Run `npx playwright codegen https://opensource-demo.orangehrmlive.com` and observe what locator Playwright generates when you click a row/button — compare it to what you would have written manually.
2. Use `filter({ hasText: <employeeID> })` to find a specific employee row instead of `.nth()`.
3. Use `.count()` to assert the total number of rows returned by a search.
4. Add two employees with similar names (e.g. "Usman Khan" and "Usman Khan Malik") and practice using a regex `hasText` filter to select the exact one.
5. Deliberately write a locator that matches multiple rows, trigger a strict mode violation on purpose, then fix it using `filter()`.
