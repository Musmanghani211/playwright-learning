import {test, expect} from '@playwright/test';



checkImagesForPage('https://cn.skpluss.com/about/');
checkImagesForPage('https://cn.skpluss.com/how-it-works/');
checkImagesForPage('https://cn.skpluss.com/categories/');
checkImagesForPage('https://cn.skpluss.com/resources/');
checkImagesForPage('https://cn.skpluss.com/contact-us/');



function checkImagesForPage(PageLink) {
test(`Images check for page ${PageLink} using function`, async ({ page }) => {
  await page.goto(PageLink);
  await page.waitForLoadState('networkidle');

  // Disable all CSS animations/transitions so elements don't keep shifting
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }`
  });

  const images = page.locator('img');
  const imagesCount = await images.count();
  console.log('Total images count is:', imagesCount);

  for (let i = 0; i < imagesCount; i++) {
    const img = images.nth(i);
    const isVisible = await img.isVisible();
    if (!isVisible) continue;

    await img.evaluate((el) => el.scrollIntoView({ block: 'center' }));

    await img.evaluate((el) => {
      if (el.complete) return;
      return new Promise((resolve) => {
        el.addEventListener('load', resolve, { once: true });
        el.addEventListener('error', resolve, { once: true });
      });
    });

    const src = await img.getAttribute('src');
    const isBroken = await img.evaluate((el) => !el.complete || el.naturalWidth === 0);
    console.log(isBroken, src);
    expect.soft(isBroken, `Image is broken: ${src}`).toBe(false);
  }
});
}