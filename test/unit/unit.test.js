import { describe, expect, test, vi } from 'vitest';

// Import or recreate the pure functions for testing
function calculateWorkTime(price, wagePerHour) {
  const totalHours = price / wagePerHour;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  return { hours, minutes };
}

function formatWorkTime(timeObj, language) {
  const { hours, minutes } = timeObj;
  return `${hours}h ${minutes}m${language.startsWith('es') ? " Tiempo de Trabajo" : " Working Time"}`;
}

const userConfig = {
  wages: {
    USD: 10,
    CLP: 7179,
    EUR: 8.5
  }
};

function hourlyWage(currency) {
  const normalizedCurrency = currency.toUpperCase();
  if (userConfig.wages[normalizedCurrency]) {
    return userConfig.wages[normalizedCurrency];
  }
  
  console.warn(`Currency ${currency} not configured, using USD as fallback`);
  return userConfig.wages.USD;
}

describe('Work Hour Extension - Unit Tests', () => {
  // Core functionality tests
  describe('Core Functions', () => {
    test('calculateWorkTime should correctly convert price to work hours', () => {
      const result = calculateWorkTime(10000, 5000);
      expect(result.hours).toBe(2);
      expect(result.minutes).toBe(0);
      
      const result2 = calculateWorkTime(7500, 5000);
      expect(result2.hours).toBe(1);
      expect(result2.minutes).toBe(30);
    });
    
    test('formatWorkTime should format time correctly based on language', () => {
      const timeObj = { hours: 2, minutes: 30 };
      
      // English format
      const englishResult = formatWorkTime(timeObj, 'en-US');
      expect(englishResult).toBe('2h 30m Working Time');
      
      // Spanish format
      const spanishResult = formatWorkTime(timeObj, 'es-ES');
      expect(spanishResult).toBe('2h 30m Tiempo de Trabajo');
    });
    
    test('hourlyWage should return correct wage for different currencies', () => {
      expect(hourlyWage('USD')).toBe(10);
      expect(hourlyWage('CLP')).toBe(7179);
      expect(hourlyWage('EUR')).toBe(8.5);
      
      // Should default to USD for unknown currencies
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      expect(hourlyWage('XYZ')).toBe(10);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});