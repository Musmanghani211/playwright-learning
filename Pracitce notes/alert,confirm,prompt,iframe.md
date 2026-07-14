# Playwright Learning Notes

Topics covered: Native Dialogs (alert/confirm/prompt), iframes, Nested Frames (frameset), and common gotchas/fixes discovered while writing tests against OrangeHRM and the-internet.herokuapp.com.

---

## 1. Native Browser Dialogs (`alert`, `confirm`, `prompt`)

### What they are
Browser-level popups rendered by the browser itself — **not** part of the page's HTML/DOM. You cannot inspect them in DevTools, and `page.locator()` cannot see them.

| Type | Purpose | Buttons |
|---|---|---|
| `alert(msg)` | Show information | OK only |
| `confirm(msg)` | Ask yes/no | OK / Cancel |
| `prompt(msg, default)` | Ask for text input | OK (with value) / Cancel |

### How to handle in Playwright
Register a `page.on('dialog', ...)` listener **before** the action that triggers the dialog:

```javascript
page.on('dialog', async dialog => {
  console.log(dialog.type());     // 'alert' | 'confirm' | 'prompt'
  console.log(dialog.message());  // the popup's text
  await dialog.accept();          // clicks OK
  // OR
  await dialog.dismiss();         // clicks Cancel
});

await page.getByRole('button', { name: 'Trigger Dialog' }).click();
```

For `prompt()`, pass the text you want typed into `accept()`:
```javascript
await dialog.accept('Usman Ghani');
```

### ⚠️ Critical rule
The listener **must be registered before** the click that opens the dialog. If not, Playwright auto-dismisses the dialog by default and your test can hang or fail — especially for `prompt()`, since there's no other way to interact with it (it's not a DOM element).

### Practice site
`https://the-internet.herokuapp.com/javascript_alerts`

### Working examples

```javascript
// Alert
test('alert handle', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  page.on('dialog', async dialog => await dialog.accept());
  await page.getByRole('button', { name: 'Click For JS Alert' }).click();
  await expect(page.locator('#result')).toContainText('You successfully clicked an alert');
});

// Confirm - Accept
test('confirm - OK', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  page.on('dialog', async dialog => await dialog.accept());
  await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
  await expect(page.locator('#result')).toContainText('You clicked: Ok');
});

// Confirm - Dismiss
test('confirm - Cancel', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  page.on('dialog', async dialog => await dialog.dismiss());
  await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
  await expect(page.locator('#result')).toContainText('You clicked: Cancel');
});

// Prompt - with input value
test('prompt with value', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  page.on('dialog', async dialog => await dialog.accept('Usman Ghani'));
  await page.getByRole('button', { name: 'Click for JS Prompt' }).click();
  await expect(page.locator('#result')).toContainText('You entered: Usman Ghani');
});
```

### Mistakes made & fixed
- Writing two dialog assertions inside one `test()` block (e.g. alert + confirm together) — split into separate, single-purpose tests so failures are easy to trace.
- Trailing space in assertion string (`'You entered: Usman Ghani '`) — harmless because `toContainText` normalizes whitespace, but cleaned up anyway for clarity.

---

## 2. iframes

### What they are
An `<iframe>` embeds a **completely separate HTML document** inside the page (payment forms, embedded editors like TinyMCE, video embeds, chat widgets).

### ⚠️ Key concept
`page.locator(...)` only searches the **main page's document**. It **cannot** see inside an iframe — even if you chain locators off an iframe element, Playwright still searches the same (outer) document.

```javascript
// ❌ WRONG — chains .locator() off an iframe element, but still searches outer doc
page.locator('#my-iframe').locator('#inner-element')

// ✅ CORRECT — switches document context into the iframe
page.frameLocator('#my-iframe').locator('#inner-element')
```

### Rule of thumb
| Method | When to use |
|---|---|
| `.frameLocator()` | Next step is going **into** a frame/iframe |
| `.locator()` | Next step is a **normal element** (button, div, body, input) — even inside a frame |

### Practice site
`https://the-internet.herokuapp.com/iframe` (TinyMCE rich text editor embedded in an iframe)

### Working example

```javascript
test('iFrame containing', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/iframe');

  // Dismiss notification — this lives OUTSIDE the iframe, in the main page
  const toxNotification = page.locator('.tox-notifications-container .tox-notification');
  await toxNotification.locator('.tox-notification__dismiss').click();
  await expect(page.locator('.tox-notifications-container')).not.toBeVisible();

  // Editor content — this lives INSIDE the iframe
  const iframe = page.frameLocator('iframe[title="Rich Text Area"]');
  const editorBody = iframe.locator('#tinymce');
  await expect(editorBody).toContainText('Your content goes here.');
});
```

### Mistakes made & fixed
- Used `page.locator('#mce_0_ifr')` (selecting the iframe tag as a normal element) instead of `page.frameLocator(...)` — fixed by switching to the correct method.
- Used `.frameLocator('body')` when trying to read text — wrong, because `body` is not a frame. Fixed to `.locator('body')`.
- Learned to prefer a stable attribute like `title="Rich Text Area"` over an auto-generated `id` (e.g. `#mce_0_ifr`), since TinyMCE's generated ids can change between versions/instances.
- Debugging tip used: list all iframes and their attributes when a selector isn't matching:
  ```javascript
  const iframes = await page.locator('iframe').all();
  for (const f of iframes) {
    console.log(await f.getAttribute('id'), await f.getAttribute('title'));
  }
  ```

---

## 3. Nested Frames / Frameset

### What a frameset is
A **legacy HTML approach** (pre-CSS-layout era) where a page's `<body>` is replaced by a `<frameset>`, and the page is divided into independent regions, each loading its own separate HTML file via `<frame>` tags (not `<iframe>`).

```html
<frameset rows="50,*">
  <frame src="top.html" name="frame-top">
  <frame src="bottom.html" name="frame-bottom">
</frameset>
```

### Nested frames
A frame's `src` document can itself be another `<frameset>`, containing more `<frame>` tags — frame inside a frame, similar to folders inside folders.

### Actual structure of `the-internet.herokuapp.com/nested_frames`
```
frame-top   (this frame's own page is itself a frameset containing 3 frames)
    ├── frame-left
    ├── frame-middle
    └── frame-right
frame-bottom
```
`frame-top` and `frame-bottom` are both direct children of the top-level frameset. `frame-left`, `frame-middle`, `frame-right` are direct children of `frame-top`'s own frameset — no extra wrapper layer.

### Playwright handling
Chain `.frameLocator()` calls to go deeper into nested frames — same method used repeatedly, one level at a time:

```javascript
const topFrame = page.frameLocator('frame[name="frame-top"]');
const leftFrame = topFrame.frameLocator('frame[name="frame-left"]');
const middleFrame = topFrame.frameLocator('frame[name="frame-middle"]');
const rightFrame = topFrame.frameLocator('frame[name="frame-right"]');
const bottomFrame = page.frameLocator('frame[name="frame-bottom"]'); // top-level, no chaining needed
```

### Working example

```javascript
test('nested framing', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/nested_frames');

  const topFrame = page.frameLocator('frame[name="frame-top"]');
  const leftFrame = topFrame.frameLocator('frame[name="frame-left"]');
  const middleFrame = topFrame.frameLocator('frame[name="frame-middle"]');
  const rightFrame = topFrame.frameLocator('frame[name="frame-right"]');
  const bottomFrame = page.frameLocator('frame[name="frame-bottom"]');

  const leftText = (await leftFrame.locator('body').allTextContents())[0].trim();
  const middleText = (await middleFrame.locator('body').allTextContents())[0].trim();
  const rightText = (await rightFrame.locator('body').allTextContents())[0].trim();
  const bottomText = (await bottomFrame.locator('body').allTextContents())[0].trim();

  console.log(leftText, middleText, rightText, bottomText);
  // Output: LEFT MIDDLE RIGHT BOTTOM
});
```

### Mistakes made & fixed
- Used tag name `ifram`/`iframe` instead of `frame` — this site uses old-school `<frame>` tags, not `<iframe>`.
- Used invalid CSS attribute selector syntax `[title: "x"]` instead of `[title="x"]` (colon vs. equals).
- Assumed an extra middle wrapper frame existed ("frameset-middle") — clarified that `frame-top`'s own document *is* the frameset containing left/middle/right; no separate named frame for it.
- Copy-paste bug: two variables pointed at the same selector (`"frame-middle"` used for both middle and right) — always double-check each variable maps to a unique selector.
- `allTextContents()` returns raw text including `\n` and whitespace from the HTML — used `.trim()` on `[0]` to clean it up.

---

## 4. General Gotchas Learned Along the Way

- **`isVisible()` does not wait/retry** — it checks the DOM once, instantly. For checking "did this eventually appear," use `.waitFor({ state: 'visible', timeout })` wrapped in try/catch, or `expect(locator).toBeVisible()` (which does auto-retry).
- **`expect(locator).someMethod()` only works with real Playwright matchers** (`toContainText`, `toBeVisible`, etc.) — methods like `allTextContents()` belong directly on the **locator**, not inside `expect()`.
- **Strict mode violations**: if a locator matches more than one element, `.click()` etc. will throw an error. Use `.first()`, `.last()`, `.nth(n)`, or a more specific selector to disambiguate.
- **`await` is only needed on actual async actions** (`.click()`, `.fill()`, `.allTextContents()`, `.isVisible()`) — not on `page.locator(...)` or `page.frameLocator(...)`, which return locator objects synchronously.
- **Browser locale can cause flaky tests** (e.g. auto-translate popups changing page language). Fix by explicitly setting locale in `playwright.config.js`:
  ```javascript
  export default defineConfig({
    use: { locale: 'en-US' },
    projects: [{
      name: 'chromium',
      use: { launchOptions: { args: ['--disable-features=Translate'] } },
    }],
  });
  ```
- **Copyright/naming conventions**: JS variables should be camelCase (`textInTheBox`, not `Textintothebox`) — doesn't break functionality but improves readability.

---

## Practice Sites Reference

| Feature | URL |
|---|---|
| Native alerts/confirm/prompt | `https://the-internet.herokuapp.com/javascript_alerts` |
| Single iframe | `https://the-internet.herokuapp.com/iframe` |
| Nested frames (frameset) | `https://the-internet.herokuapp.com/nested_frames` |
| iframe with forms (extra practice) | `https://letcode.in/frames` |
