import { test } from '@playwright/test';
import { injectExtension, TEST_TIMEOUT, verifyWorkingTimeElements } from './common.js';

const BASE_PATH = 'https://www.solotodo.cl';

test.describe('Solotodo Live Tests', () => {
  test('should add working time to solotodo.cl homepage', async ({ page }) => {
    await page.goto(BASE_PATH, { waitUntil: 'networkidle', timeout: TEST_TIMEOUT });
    
    await injectExtension(page);
    
    await verifyWorkingTimeElements(page);
    
    await page.screenshot({ path: 'playwright-results/solotodo-homepage.png' });
  });
  
  test('should add working time to a product page', async ({ page }) => {
    await page.goto(`${BASE_PATH}/products/114973-intel-core-i3-10105-bx8070110105`, 
      { waitUntil: 'networkidle', timeout: TEST_TIMEOUT });
    
    await injectExtension(page);
    
    await verifyWorkingTimeElements(page);
  
    await page.screenshot({ path: 'playwright-results/solotodo-product.png' });
  });
  
  test('should add working time to a category page', async ({ page }) => {
    await page.goto(`${BASE_PATH}/notebooks`, 
      { waitUntil: 'networkidle', timeout: TEST_TIMEOUT });
    
    await injectExtension(page);
    
    // Category pages should have multiple product cards
    await verifyWorkingTimeElements(page, 2);
    
    await page.screenshot({ path: 'playwright-results/solotodo-category.png', fullPage: true });
  });
});