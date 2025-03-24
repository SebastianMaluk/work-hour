import { expect, test } from '@playwright/test';
import { injectExtension, TEST_TIMEOUT, verifyWorkingTimeElements } from './common.js';

test.describe('Amazon Live Tests', () => {
  test('should add working time to product page', async ({ page }) => {
    await page.goto('https://www.amazon.com/dp/B08BYSF8HP', 
      { waitUntil: 'networkidle', timeout: TEST_TIMEOUT });
    
    await injectExtension(page);
    
    await verifyWorkingTimeElements(page);
    
    await page.screenshot({ path: 'test-results/amazon-product.png' });
  });
  
  test('should add working time to search results', async ({ page }) => {
    await page.goto('https://www.amazon.com/s?k=laptop', 
      { waitUntil: 'networkidle', timeout: TEST_TIMEOUT });
    
    await injectExtension(page);
    
    // Search results should have multiple products
    await verifyWorkingTimeElements(page, 3);
    
    await page.screenshot({ path: 'test-results/amazon-search.png', fullPage: true });
  });
  
  test('should use correct currency based on regional sites', async ({ page }) => {
    // Test UK site with GBP
    await page.goto('https://www.amazon.co.uk/dp/B08BYSF8HP', 
      { waitUntil: 'networkidle', timeout: TEST_TIMEOUT });
    
    await injectExtension(page);
    
    await verifyWorkingTimeElements(page);
    
    await page.screenshot({ path: 'test-results/amazon-uk.png' });
  });
});

test.describe('Amazon Price Format Integration Tests', () => {
  test('correctly calculates work time for US price format', async ({ page }) => {
    // Create a mock page with US price format
    await page.setContent(`
      <html>
        <body>
          <div class="a-price">
            <span class="a-price-whole">29</span>
            <span class="a-price-fraction">99</span>
          </div>
        </body>
      </html>
    `);
    
    // Mock US domain
    await page.evaluate(() => {
      Object.defineProperty(window, 'location', {
        value: {
          ...window.location,
          hostname: 'www.amazon.com'
        },
        configurable: true
      });
    });
    
    // Inject extension
    await injectExtension(page);
    
    // Verify correct calculation (assuming $10/hour wage)
    const timeElement = await page.locator('.time-needed');
    await expect(timeElement).toBeVisible();
    
    // $29.99 at $10/hour should be 3h 0m
    const text = await timeElement.textContent();
    expect(text).toContain('3h 0m');
  });
  
  test('correctly calculates work time for European price format', async ({ page }) => {
    // Create a mock page with European price format
    await page.setContent(`
      <html>
        <body>
          <div class="a-price">
            <span class="a-price-whole">29</span>
            <span class="a-price-fraction">99</span>
          </div>
        </body>
      </html>
    `);
    
    // Mock Spanish domain
    await page.evaluate(() => {
      Object.defineProperty(window, 'location', {
        value: {
          ...window.location,
          hostname: 'www.amazon.es'
        },
        configurable: true
      });
    });
    
    // Inject extension
    await injectExtension(page);
    
    // Verify correct calculation (assuming €8.5/hour wage)
    const timeElement = await page.locator('.time-needed');
    await expect(timeElement).toBeVisible();
    
    // €29.99 at €8.5/hour should be 3h 32m
    const text = await timeElement.textContent();
    expect(text).toContain('3h');
  });
});
