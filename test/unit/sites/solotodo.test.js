import { JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';
import { solotodoConfig } from '../../../src/sites/solotodo.js';

describe('SoloTodo Site Implementation', () => {
  test('site config has the correct structure', () => {
    expect(solotodoConfig.hostnames).toContain('www.solotodo.cl');
    expect(solotodoConfig.pages).toBeInstanceOf(Array);
    expect(solotodoConfig.parsePrice).toBeInstanceOf(Function);
    expect(solotodoConfig.createDisplayElement).toBeInstanceOf(Function);
    expect(solotodoConfig.insertElement).toBeInstanceOf(Function);
    expect(solotodoConfig.currency).toBe('CLP');
  });
  
  test('parsePrice correctly extracts numeric price', () => {
    expect(solotodoConfig.parsePrice('$10.990')).toBe(10990);
    expect(solotodoConfig.parsePrice('$ 1.299.990')).toBe(1299990);
    expect(solotodoConfig.parsePrice('')).toBe(0);
    expect(solotodoConfig.parsePrice(null)).toBe(0);
  });
  
  test('createDisplayElement creates an element with correct properties', () => {
    // Set up jsdom
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document;
    
    const element = solotodoConfig.createDisplayElement('2h 30m Working Time');
    
    expect(element.tagName).toBe('DIV');
    expect(element.innerHTML).toBe('2h 30m Working Time');
    expect(element.style.fontSize).toBe('1rem');
    expect(element.className).toContain('time-needed');
  });
  
  test('url patterns match the correct pages', () => {
    // Homepage
    expect(solotodoConfig.pages[0].urlPattern.test('https://www.solotodo.cl/')).toBe(true);
    
    // Product page
    expect(solotodoConfig.pages[1].urlPattern.test('https://www.solotodo.cl/products/laptop-xyz')).toBe(true);
    
    // Category page
    expect(solotodoConfig.pages[2].urlPattern.test('https://www.solotodo.cl/notebooks')).toBe(true);
  });
});