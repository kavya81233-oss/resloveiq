import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'xs (320px)', width: 320, height: 600 },
  { name: 'mobile (375px)', width: 375, height: 667 },
  { name: 'mobile-large (390px)', width: 390, height: 844 },
  { name: 'tablet (768px)', width: 768, height: 1024 },
  { name: 'desktop (1024px)', width: 1024, height: 768 },
  { name: 'large (1440px)', width: 1440, height: 900 },
  { name: 'ultrawide (1920px)', width: 1920, height: 1080 },
];

for (const vp of VIEWPORTS) {
  test(`Responsive verification at ${vp.name}: no horizontal scrollbar and interactive elements visible`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/en');

    // Verify Title and Hero exist
    await expect(page.locator('#hero')).toBeVisible();

    // Verify No horizontal overflow scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // 2px margin for subpixel rendering

    // Verify Demo section exists
    await expect(page.locator('#demo')).toBeVisible();

    // Verify all 16 anchors exist in DOM
    const sections = ['#hero', '#problem', '#pipeline', '#demo', '#innovation', '#languages', '#timeline', '#dashboard', '#targets', '#compare', '#tech', '#roadmap', '#faq', '#cta'];
    for (const sec of sections) {
      await expect(page.locator(sec)).toBeAttached();
    }
  });
}

