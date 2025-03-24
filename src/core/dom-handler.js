// DOM manipulation utilities
import { getWageForCurrency } from '../config.js';
import { calculateWorkTime } from './calculator.js';
import { formatWorkTime } from './formatter.js';

// Keep track of processed elements
export const processedElements = new Set();

/**
 * Clear all existing work time elements
 * This allows recalculation when settings change
 */
export function clearWorkTimeElements() {
  // Remove all existing time-needed elements
  const existingElements = document.querySelectorAll('.time-needed');
  existingElements.forEach(el => {
    el.remove();
  });
  
  // Clear the processed elements set
  console.log('Cleared processed elements');
  processedElements.clear();
}

/**
 * Process price elements for a specific site configuration
 * @param {Object} siteConfig - Site-specific configuration
 * @param {Object} pageConfig - Page-specific configuration
 */
export function processPriceElements(siteConfig, pageConfig) {
  // Clear existing elements first
  clearWorkTimeElements();
  
  // Get appropriate wage based on site's currency
  const wagePerHour = getWageForCurrency(siteConfig.currency);
  
  // Find all price elements with specified selector
  const priceElements = document.getElementsByClassName(pageConfig.priceSelector);
  console.log('priceElements:', priceElements);
  
  // Process each price element
  Array.from(priceElements).forEach(element => {
    // Skip if already processed
    if (processedElements.has(element)) {
      return;
    }
    
    // Skip if there's already a time element
    const nextElement = element.nextElementSibling;
    if (nextElement && nextElement.classList.contains('time-needed')) {
      processedElements.add(element);
      return;
    }
    
    try {
      // Extract price using page-specific method
      const priceElement = pageConfig.getPriceElement(element);
      console.log('priceElement:', priceElement);
      if (!priceElement) return;
      
      const priceText = priceElement.innerText;
      if (!priceText) return;
      
      // Parse price
      const price = siteConfig.parsePrice(priceText);
      if (!price) return;
      
      // Calculate work time
      const timeObj = calculateWorkTime(price, wagePerHour);
      const workTimeText = formatWorkTime(timeObj, navigator.language);
      
      // Create display element
      const fontSize = pageConfig.fontSize || '1rem';
      const newElement = siteConfig.createDisplayElement(workTimeText, fontSize);
      
      // Insert element
      siteConfig.insertElement(priceElement, newElement);
      
      // Mark as processed
      processedElements.add(element);
    } catch (e) {
      console.error('Error processing price element:', e);
    }
  });
}
