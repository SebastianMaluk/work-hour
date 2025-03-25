import { expect } from '@playwright/test';

/**
 * Common utilities for E2E tests
 */
export const TEST_TIMEOUT = 30000; // 30 seconds

export async function injectExtension(page) {
  await page.addScriptTag({
    content: `
      // Create mock Chrome API
      window.chrome = {
        storage: {
          sync: {
            get: function(key, callback) {
              callback({});
            },
            set: function(data, callback) {
              if (callback) callback();
            }
          },
          onChanged: {
            addListener: function() {}
          }
        },
        runtime: {
          lastError: null,
          onMessage: {
            addListener: function() {}
          }
        }
      };
      
      // Also support Firefox browser API
      window.browser = window.chrome;
      
      // Create a safer way to mock the hostname
      // This doesn't try to redefine window.location
      window.__getHostname = function() {
        return window.__mockHostname || window.location.hostname;
      };
      
      // This will be used to set mock hostname
      window.__mockHostname = null;
    `
  });
  
  // Then inject your extension
  await page.addScriptTag({ path: './dist/work-hour.js' });
  
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