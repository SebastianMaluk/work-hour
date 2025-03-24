// Options page script to handle user settings
const browserStorage = typeof browser !== 'undefined' ? browser.storage : chrome.storage;
const browserTabs = typeof browser !== 'undefined' ? browser.tabs : chrome.tabs;

// Default wage configuration (should match config.js)
const defaultWages = {
  USD: 10,   // Default hourly wage in USD
  CLP: 7179, // Default hourly wage in Chilean Pesos
  EUR: 8.5,  // Default hourly wage in Euros
  GBP: 9.5,  // British Pounds
  JPY: 1500, // Japanese Yen
  CAD: 13,   // Canadian Dollars
};

// Initialize options UI
document.addEventListener('DOMContentLoaded', function() {
  console.log('Options page loaded');
  // Load saved settings
  loadSettings();
  
  // Set up event listeners
  document.getElementById('save').addEventListener('click', saveSettings);
  document.getElementById('reset').addEventListener('click', resetSettings);
});

/**
 * Build the wage form with inputs for each currency
 * @param {Object} wages - Current wage values
 */
function buildWageForm(wages) {
  const form = document.getElementById('wage-form');
  form.innerHTML = '';
  
  // Create inputs for each currency
  Object.keys(wages).forEach(currency => {
    // Create label
    const label = document.createElement('label');
    label.textContent = currency + ':';
    
    // Create input
    const input = document.createElement('input');
    input.type = 'number';
    input.id = `wage-${currency}`;
    input.value = wages[currency];
    input.min = '0.01';
    input.step = '0.01';
    
    // Add to form
    form.appendChild(label);
    form.appendChild(input);
  });
}

/**
 * Load saved settings from browserStorage
 */
function loadSettings() {
  browserStorage.sync.get('workHourWages', function(data) {
    console.log("wtf2")
    let wages = defaultWages;
    
    // Use saved data if available
    if (data.workHourWages) {
      wages = data.workHourWages;
    }
    
    // Build the form with current values
    buildWageForm(wages);
  });
}

/**
 * Save settings to browserStorage
 */
function saveSettings() {
  const statusElement = document.getElementById('status');
  const newWages = {};
  
  // Collect values from all inputs
  Object.keys(defaultWages).forEach(currency => {
    const input = document.getElementById(`wage-${currency}`);
    if (input) {
      newWages[currency] = parseFloat(input.value);
    }
  });
  
  // Validate values
  for (const [currency, wage] of Object.entries(newWages)) {
    if (isNaN(wage) || wage <= 0) {
      statusElement.textContent = `Invalid value for ${currency}`;
      statusElement.style.color = 'red';
      return;
    }
  }
  
  // Save to storage
  browserStorage.sync.set({ workHourWages: newWages }, function() {
    // Show success message
    statusElement.textContent = 'Settings saved!';
    statusElement.style.color = '#4CAF50';
    
    browserStorage.sync.get('workHourWages', function(data) {
      console.log("Save data:")
      console.log(data)
    });

    // Clear message after a delay
    setTimeout(() => {
      statusElement.textContent = '';
    }, 2000);
    
    // IMPORTANT: Notify ALL active tabs to refresh calculations
    browserTabs.query({}, function(tabs) {
      tabs.forEach(tab => {
        // Only send to urls that match our content script patterns
        if (tab.url && (
            tab.url.includes('amazon.com') || 
            tab.url.includes('amazon.co.uk') ||
            tab.url.includes('amazon.ca') ||
            tab.url.includes('amazon.es') ||
            tab.url.includes('solotodo.cl'))) {
          browserTabs.sendMessage(tab.id, {action: "refreshCalculations"})
            .catch(error => {
              if (error.message !== "Could not establish connection. Receiving end does not exist.") {
                console.error(`Error updating tab ${tab.id}:`, error);
              }
            });
        }
      });
    });
  });
}

/**
 * Reset settings to default values
 */
function resetSettings() {
  if (confirm('Reset all wage settings to default values?')) {
    // Reset form to defaults
    buildWageForm(defaultWages);
    
    // Save default values
    browserStorage.sync.set({ workHourWages: defaultWages }, function() {
      // Show success message
      const statusElement = document.getElementById('status');
      statusElement.textContent = 'Settings reset to defaults!';
      statusElement.style.color = '#4CAF50';

      browserStorage.sync.get('workHourWages', function(data) {
        console.log("Reset data:")
        console.log(data)
      });
      
      // Clear message after a delay
      setTimeout(() => {
        statusElement.textContent = '';
      }, 2000);
      
      // IMPORTANT: Notify ALL active tabs to refresh calculations
      browserTabs.query({}, function(tabs) {
        tabs.forEach(tab => {
          // Only send to urls that match our content script patterns
          if (tab.url && (
              tab.url.includes('amazon.com') || 
              tab.url.includes('amazon.co.uk') ||
              tab.url.includes('amazon.ca') ||
              tab.url.includes('amazon.es') ||
              tab.url.includes('solotodo.cl'))) {
            browserTabs.sendMessage(tab.id, {action: "refreshCalculations"})
              .catch(error => {
                if (error.message !== "Could not establish connection. Receiving end does not exist.") {
                  console.error(`Error updating tab ${tab.id}:`, error);
                }
              });
          }
        });
      });
    });
  }
}