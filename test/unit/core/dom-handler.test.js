import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { processPriceElements } from '../../../src/core/dom-handler.js';

// Mock dependencies
vi.mock('../../../src/core/calculator.js', () => ({
  calculateWorkTime: vi.fn().mockReturnValue({ hours: 10, minutes: 30 })
}));

vi.mock('../../../src/core/formatter.js', () => ({
  formatWorkTime: vi.fn().mockReturnValue('10h 30m Working Time')
}));

vi.mock('../../../src/config.js', () => ({
  getWageForCurrency: vi.fn().mockReturnValue(10)
}));

describe('DOM Handler Module', () => {
  let document;
  let window;
  
  beforeEach(() => {
    // Set up a clean DOM for each test
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="test-container"></div>
        </body>
      </html>
    `);
    
    window = dom.window;
    document = window.document;
    
    // Mock global document and navigator
    global.document = document;
    global.navigator = { language: 'en-US' };
  });

  test('processPriceElements should process price elements', () => {
    // Create test container with mock price elements
    const container = document.getElementById('test-container');
    const priceElement = document.createElement('div');
    priceElement.setAttribute('class', 'price-element');
    const price = document.createElement('span');
    price.setAttribute('class', 'price');
    price.innerText = '$100.00';
    priceElement.appendChild(price);
    container.appendChild(priceElement);
    
    // Mock site and page config
    const mockSiteConfig = {
      currency: 'USD',
      parsePrice: vi.fn().mockReturnValue(100),
      createDisplayElement: vi.fn().mockReturnValue(document.createElement('div')),
      insertElement: vi.fn()
    };
    
    const mockPageConfig = {
      priceSelector: 'price-element',
      getPriceElement: vi.fn().mockReturnValue(document.querySelector('.price'))
    };
    
    // Process elements
    processPriceElements(mockSiteConfig, mockPageConfig);
    
    // Verify functions were called correctly
    expect(mockPageConfig.getPriceElement).toHaveBeenCalled();
    expect(mockSiteConfig.parsePrice).toHaveBeenCalled();
    expect(mockSiteConfig.createDisplayElement).toHaveBeenCalled();
    expect(mockSiteConfig.insertElement).toHaveBeenCalled();
  });
});