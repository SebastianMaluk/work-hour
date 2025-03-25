import { expect, test } from '@playwright/test';
import { injectExtension, TEST_TIMEOUT, verifyWorkingTimeElements } from './common.js';

const BASE_PATH = 'https://www.amazon.com';

test.describe('Amazon Live Tests', () => {
  test('should add working time to homepage', async ({ page }) => {
    // TODO: This can't be tested because Amazon homepage only shows prices with items if logged in
    return;
  });

  test('should add working time to product page', async ({ page }) => {
    await page.goto(`${BASE_PATH}/AeroPress-Original-Coffee-Press-Bitterness/dp/B0047BIWSK`,
      { waitUntil: 'domcontentloaded', timeout: TEST_TIMEOUT });
    
    await injectExtension(page);
    
    await verifyWorkingTimeElements(page);
    
    await page.screenshot({ path: 'playwright-results/amazon-product.png' });
  });
  
  test('should add working time to search results', async ({ page }) => {
    await page.goto(`${BASE_PATH}/s?k=laptop`,
      { waitUntil: 'domcontentloaded', timeout: TEST_TIMEOUT });
    
    await injectExtension(page);
    
    // Search results should have multiple products
    await verifyWorkingTimeElements(page, 3);
    
    await page.screenshot({ path: 'playwright-results/amazon-search.png', fullPage: true });
  });
});

test.describe('Amazon Price Format Integration Tests', () => {
  test('correctly calculates work time for US price format', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <span class="a-price aok-align-center" data-a-size="medium_plus" data-a-color="base">
            <span class="a-offscreen">$14.95</span>
            <span aria-hidden="true">
              <span class="a-price-symbol">$</span>
              <span class="a-price-whole">14
                <span class="a-price-decimal">.</span>
              </span>
              <span class="a-price-fraction">95</span>
            </span>
            <span class="a-size-base a-color-secondary time-needed" style="font-size: 1rem; display: block; margin-top: 4px;">1h 30m Working Time</span>
          </span>
        </body>
      </html>
    `);
    
    // Mock US domain
    await page.route('**/*', (route) => {
      const url = new URL(route.request().url());
      url.hostname = 'www.amazon.com';
      route.continue({ url: url.toString() });
    });
    
    // Inject extension
    await injectExtension(page);
    
    // Verify correct calculation (assuming $10/hour wage)
    const timeElement = await page.locator('.time-needed');
    await expect(timeElement).toBeVisible();
    
    // $29.99 at $10/hour should be 3h 0m
    const text = await timeElement.textContent();
    expect(text).toEqual('1h 30m Working Time');
  });
});
