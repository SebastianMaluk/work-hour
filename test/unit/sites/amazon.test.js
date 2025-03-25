import { beforeEach, describe, expect, test } from 'vitest';
import { amazonConfig } from '../../../src/sites/amazon.js';

describe('Amazon Site Implementation', () => {
  test('site config has the correct structure', () => {
    expect(amazonConfig.hostnames).toContain('www.amazon.com');
    expect(amazonConfig.pages).toBeInstanceOf(Array);
    expect(amazonConfig.parsePrice).toBeInstanceOf(Function);
    expect(amazonConfig.createDisplayElement).toBeInstanceOf(Function);
    expect(amazonConfig.insertElement).toBeInstanceOf(Function);
  });

  describe('parsePrice function', () => {
    // Mock window.location for testing different domains
    const mockLocation = (domain) => {
      Object.defineProperty(window, 'location', {
        value: { hostname: domain },
        configurable: true
      });
    };

    beforeEach(() => {
      // Reset console.log mock between tests
      vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    test('US format prices (dot as decimal separator)', () => {
      mockLocation('www.amazon.com');
      
      // Standard price with decimal
      expect(amazonConfig.parsePrice('$29.99')).toBe(29.99);
      
      // Price with thousands separator
      expect(amazonConfig.parsePrice('$1,234.56')).toBe(1234.56);
      
      // Price without decimal but with currency
      expect(amazonConfig.parsePrice('$45')).toBe(45);
      
      // Odd price with cents
      expect(amazonConfig.parsePrice('$0.99')).toBe(0.99);
      
      // Large price
      expect(amazonConfig.parsePrice('$2,999.00')).toBe(2999);
    });
    
    test('Handles special cases and edge values', () => {
      mockLocation('www.amazon.com');
      
      // Empty or null inputs
      expect(amazonConfig.parsePrice('')).toBe(0);
      expect(amazonConfig.parsePrice(null)).toBe(0);
      
      // Just digits without currency symbol
      expect(amazonConfig.parsePrice('1999')).toBe(19.99);
      
      // Price with various non-numeric characters
      expect(amazonConfig.parsePrice('Price: $49.99 (Sale)')).toBe(49.99);
    });
  });

  test('getCurrency returns correct currency based on hostname', () => {
    // Mock the window.location for testing
    Object.defineProperty(window, 'location', {
      value: { hostname: 'www.amazon.com' },
      configurable: true
    });
    expect(amazonConfig.getCurrency()).toBe('USD');
    
    Object.defineProperty(window, 'location', {
      value: { hostname: 'www.amazon.co.uk' },
      configurable: true
    });
    expect(amazonConfig.getCurrency()).toBe('GBP');
    
    Object.defineProperty(window, 'location', {
      value: { hostname: 'www.amazon.es' },
      configurable: true
    });
    expect(amazonConfig.getCurrency()).toBe('EUR');
  });
  
  test('url patterns match the correct pages', () => {
    // Homepage
    expect(amazonConfig.pages[0].urlPattern.test('https://www.amazon.com/')).toBe(true);

    // Product pages
    expect(amazonConfig.pages[1].urlPattern.test('https://www.amazon.com/dp/B08BYSF8HP')).toBe(true);
    expect(amazonConfig.pages[1].urlPattern.test('https://www.amazon.com/product-name/dp/B08BYSF8HP')).toBe(true);
    
    // Search results
    expect(amazonConfig.pages[2].urlPattern.test('https://www.amazon.com/s?k=laptop')).toBe(true);
    expect(amazonConfig.pages[2].urlPattern.test('https://www.amazon.com/s?k=ordenador')).toBe(true);

    // Fallback page
    expect(amazonConfig.pages[3].urlPattern.test('https://www.amazon.com/other-page')).toBe(true);
  });
});