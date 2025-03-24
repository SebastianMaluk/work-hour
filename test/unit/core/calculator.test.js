import { describe, expect, test } from 'vitest';
import { calculateWorkTime } from '../../../src/core/calculator.js';

describe('Calculator Module', () => {
  test('calculateWorkTime should correctly convert price to work hours', () => {
    const result = calculateWorkTime(10000, 5000);
    expect(result.hours).toBe(2);
    expect(result.minutes).toBe(0);
    
    const result2 = calculateWorkTime(7500, 5000);
    expect(result2.hours).toBe(1);
    expect(result2.minutes).toBe(30);
    
    // Edge cases
    const zeroPrice = calculateWorkTime(0, 5000);
    expect(zeroPrice.hours).toBe(0);
    expect(zeroPrice.minutes).toBe(0);
    
    const highPrice = calculateWorkTime(1000000, 1000);
    expect(highPrice.hours).toBe(1000);
    expect(highPrice.minutes).toBe(0);
  });
});