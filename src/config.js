// User configuration with Chrome storage integration
const storage = typeof browser !== 'undefined' ? browser.storage : chrome.storage;
const runtime = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;

// Default wage configuration
export const defaultWages = {
  USD: 10,   // Default hourly wage in USD
  CLP: 7179, // Default hourly wage in Chilean Pesos
  EUR: 8.5,  // Default hourly wage in Euros
  GBP: 9.5,  // British Pounds
  JPY: 1500, // Japanese Yen
  CAD: 13,   // Canadian Dollars
};

// Initialize user config with default values
export const userConfig = {
  wages: {...defaultWages}
};

// Load saved settings if in browser context
if (typeof storage !== 'undefined' && storage) {
  storage.sync.get('workHourWages', function(data) {
    if (data.workHourWages) {
      console.log('Loaded work hour wages:', data.workHourWages);
      userConfig.wages = data.workHourWages;
    }
  });
  
  // Listen for storage changes
  storage.onChanged.addListener(function(changes, namespace) {
    console.log()
    if (namespace === 'sync' && changes.workHourWages) {
      console.log('Work hour wages updated:', changes.workHourWages.newValue);
      // Update userConfig with the new values
      userConfig.wages = changes.workHourWages.newValue;
      
      // Trigger recalculation if the function is available
      if (typeof window.processCurrentSite === 'function') {
        window.processCurrentSite();
      }
    }
  });
}

/**
 * Get the hourly wage for a specific currency
 * @param {string} currency - Currency code
 * @returns {number} Hourly wage
 */
export function getWageForCurrency(currency) {
  const normalizedCurrency = currency.toUpperCase();
  if (userConfig.wages[normalizedCurrency]) {
    return userConfig.wages[normalizedCurrency];
  }
  
  // Default to USD if currency not found
  console.warn(`Currency ${currency} not configured, using USD as fallback`);
  return userConfig.wages.USD;
}

/**
 * Save user's wage preferences
 * @param {Object} wageData - Object containing currency:wage pairs
 * @returns {Promise} Promise resolving to true on success, false on failure
 */
export function saveWages(wageData) {
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
      
      // Save to storage if in browser context
      if (typeof storage !== 'undefined' && storage) {
        storage.sync.set({ workHourWages: wageData }, function() {
          if (runtime.lastError) {
            reject(runtime.lastError);
          } else {
            resolve(true);
          }
        });
      } else {
        // Use localStorage as fallback for testing
        localStorage.setItem('workHourWages', JSON.stringify(wageData));
        resolve(true);
      }
    } catch (error) {
      console.error('Error saving wages:', error);
      reject(error);
    }
  });
}

/**
 * Load saved wage preferences
 * @returns {Promise} Promise resolving to saved wage data
 */
export function loadWages() {
  return new Promise((resolve, reject) => {
    if (typeof storage !== 'undefined' && storage) {
      storage.sync.get('workHourWages', function(data) {
        if (runtime.lastError) {
          reject(runtime.lastError);
        } else {
          resolve(data.workHourWages || null);
        }
      });
    } else {
      // Use localStorage as fallback for testing
      try {
        const savedData = localStorage.getItem('workHourWages');
        resolve(savedData ? JSON.parse(savedData) : null);
      } catch (error) {
        console.error('Error loading wages:', error);
        reject(error);
      }
    }
  });
}

/**
 * Reset wages to default values
 * @returns {Promise} Promise resolving when completed
 */
export function resetWages() {
  userConfig.wages = {...defaultWages};
  return saveWages(userConfig.wages);
}

/**
 * Get the list of supported currencies
 * @returns {string[]} Array of currency codes
 */
export function getSupportedCurrencies() {
  return Object.keys(userConfig.wages);
}
