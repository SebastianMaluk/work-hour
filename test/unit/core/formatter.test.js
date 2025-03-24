import { describe, expect, test } from 'vitest';
import { formatWorkTime } from '../../../src/core/formatter.js';

describe('Formatter Module', () => {
  test('formatWorkTime should format time correctly based on language', () => {
    const timeObj = { hours: 2, minutes: 30 };
    
    // English format
    const englishResult = formatWorkTime(timeObj, 'en-US');
    expect(englishResult).toBe('2h 30m Working Time');
    
    // Spanish format
    const spanishResult = formatWorkTime(timeObj, 'es-ES');
    expect(spanishResult).toBe('2h 30m Tiempo de Trabajo');
    
    // Edge cases
    const zeroTime = { hours: 0, minutes: 0 };
    expect(formatWorkTime(zeroTime, 'en-US')).toBe('0h 0m Working Time');
    
    const largeTime = { hours: 1000, minutes: 59 };
    expect(formatWorkTime(largeTime, 'en-US')).toBe('1000h 59m Working Time');
  });
});