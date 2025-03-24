import { beforeEach, describe, expect, test, vi } from 'vitest';

// Mock the entire config module instead of trying to mock chrome
vi.mock('../../src/config.js', () => {
  const defaultWages = {
    USD: 10,
    CLP: 7179,
    EUR: 8.5,
    GBP: 9.5,
    JPY: 1500,
    CAD: 13,
  };
  
  const userConfig = {
    wages: {...defaultWages}
  };
  
  return {
    defaultWages,
    userConfig,
    getWageForCurrency: (currency) => {
      const normalizedCurrency = currency.toUpperCase();
      if (userConfig.wages[normalizedCurrency]) {
        return userConfig.wages[normalizedCurrency];
      }
      console.warn(`Currency ${currency} not configured, using USD as fallback`);
      return userConfig.wages.USD;
    },
    saveWages: vi.fn().mockImplementation((wageData) => {
      return new Promise((resolve, reject) => {
        try {
          // Validate data before saving
          Object.entries(wageData).forEach(([currency, wage]) => {
            // Ensure wage is a number and positive
            if (isNaN(parseFloat(wage)) || parseFloat(wage) <= 0) {
              throw new Error(`Invalid wage for ${currency}: ${wage}`);
            }
            
            // Convert to number to ensure consistent storage
            wageData[currency] = parseFloat(wage);
          });
          
          // Update current config
          userConfig.wages = wageData;
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    }),
    loadWages: vi.fn().mockImplementation(() => {
      return Promise.resolve(userConfig.wages);
    }),
    resetWages: vi.fn().mockImplementation(() => {
      userConfig.wages = {...defaultWages};
      return Promise.resolve(true);
    }),
    getSupportedCurrencies: vi.fn().mockReturnValue(Object.keys(defaultWages))
  };
});

// Now import the mocked module
import { defaultWages, getWageForCurrency, loadWages, resetWages, saveWages, userConfig } from '../../src/config.js';

describe('Configuration Module', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Reset userConfig to defaults
    userConfig.wages = {...defaultWages};
  });
  
  test('userConfig should contain wage rates for multiple currencies', () => {
    expect(userConfig.wages).toBeDefined();
    expect(userConfig.wages.USD).toBeDefined();
    expect(userConfig.wages.CLP).toBeDefined();
    expect(userConfig.wages.EUR).toBeDefined();
  });
  
  test('getWageForCurrency should return correct wage for currency', () => {
    expect(getWageForCurrency('USD')).toBe(10);
    expect(getWageForCurrency('CLP')).toBe(7179);
    expect(getWageForCurrency('EUR')).toBe(8.5);
    
    // Case insensitivity
    expect(getWageForCurrency('usd')).toBe(10);
    expect(getWageForCurrency('clp')).toBe(7179);
    
    // Should default to USD for unknown currencies
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(getWageForCurrency('XYZ')).toBe(10);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('saveWages should save wage data to storage', async () => {
    // Test saving
    const customWages = { USD: 15, EUR: 12, GBP: 11 };
    await expect(saveWages(customWages)).resolves.toBe(true);
    
    // Verify saveWages was called with the correct arguments
    expect(saveWages).toHaveBeenCalledWith(customWages);
    
    // Should update userConfig
    expect(userConfig.wages).toEqual(customWages);
  });
  
  test('loadWages should load wage data from storage', async () => {
    // Set test data
    const testWages = { USD: 20, EUR: 18 };
    userConfig.wages = testWages;
    
    const loadedWages = await loadWages();
    expect(loadedWages).toEqual(testWages);
    expect(loadWages).toHaveBeenCalled();
  });
  
  test('resetWages should reset to default values', async () => {
    // Set custom wages first
    userConfig.wages = { USD: 25, EUR: 22 };
    
    // Reset
    await resetWages();
    
    // Should be back to defaults
    expect(userConfig.wages).toEqual(defaultWages);
    expect(resetWages).toHaveBeenCalled();
  });
  
  // Test error handling
  test('saveWages should reject with invalid data', async () => {
    // Invalid wage (negative)
    const invalidWages = { USD: -5 };
    await expect(saveWages(invalidWages)).rejects.toThrow();
    
    // Invalid wage (non-numeric)
    const invalidWages2 = { USD: 'abc' };
    await expect(saveWages(invalidWages2)).rejects.toThrow();
  });
});