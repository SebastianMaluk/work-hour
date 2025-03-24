import { expect } from '@playwright/test';

/**
 * Common utilities for E2E tests
 */
export const TEST_TIMEOUT = 30000; // 30 seconds

export async function injectExtension(page) {
  await page.addScriptTag({ path: './work-hour.js' });
  
  // Wait for the extension to initialize
  await page.waitForTimeout(1000);
}

export async function verifyWorkingTimeElements(page, minCount = 1) {
  // Wait for time elements to appear
  await page.waitForSelector('.time-needed', { timeout: TEST_TIMEOUT });
  
  // Count time elements
  const timeElements = await page.locator('.time-needed').count();
  expect(timeElements).toBeGreaterThan(minCount - 1);
  
  // Check content of first element
  const firstElement = await page.locator('.time-needed').first();
  const text = await firstElement.textContent();
  expect(text).toMatch(/\d+h \d+m (Working Time|Tiempo de Trabajo)/);
  
  return timeElements;
}