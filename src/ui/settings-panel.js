import { defaultWages, getSupportedCurrencies, resetWages, saveWages, userConfig } from '../config.js';

/**
 * Create and manage the settings panel UI
 */
export class SettingsPanel {
  constructor() {
    this.isOpen = false;
    this.panel = null;
    this.createPanel();
  }
  
  /**
   * Create the settings panel DOM element
   */
  createPanel() {
    // Create panel container
    this.panel = document.createElement('div');
    this.panel.className = 'work-hour-settings-panel';
    this.panel.style.display = 'none';
    
    // Add styles
    const style = `
      .work-hour-settings-panel {
        position: fixed;
        top: 50px;
        right: 20px;
        width: 320px;
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        border-radius: 8px;
        padding: 16px;
        z-index: 9999;
        font-family: Arial, sans-serif;
      }
      .work-hour-settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid #eee;
      }
      .work-hour-settings-title {
        font-size: 18px;
        font-weight: bold;
        margin: 0;
      }
      .work-hour-settings-close {
        cursor: pointer;
        font-size: 20px;
        color: #666;
      }
      .work-hour-settings-form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .work-hour-settings-label {
        display: flex;
        align-items: center;
      }
      .work-hour-settings-input {
        width: 100%;
        padding: 6px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .work-hour-settings-footer {
        display: flex;
        justify-content: space-between;
        margin-top: 16px;
        padding-top: 8px;
        border-top: 1px solid #eee;
      }
      .work-hour-settings-button {
        padding: 6px 12px;
        cursor: pointer;
        border-radius: 4px;
        border: none;
      }
      .work-hour-settings-save {
        background: #4285f4;
        color: white;
      }
      .work-hour-settings-reset {
        background: #f44336;
        color: white;
      }
      .work-hour-settings-toggle {
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9998;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = style;
    document.head.appendChild(styleElement);
    
    // Build the panel content
    this.panel.innerHTML = `
      <div class="work-hour-settings-header">
        <h3 class="work-hour-settings-title">Work Hour Calculator Settings</h3>
        <span class="work-hour-settings-close">&times;</span>
      </div>
      <div class="work-hour-settings-form">
        ${this.buildCurrencyInputs()}
      </div>
      <div class="work-hour-settings-footer">
        <button class="work-hour-settings-button work-hour-settings-reset">Reset to Default</button>
        <button class="work-hour-settings-button work-hour-settings-save">Save</button>
      </div>
    `;
    
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'work-hour-settings-toggle';
    toggleButton.textContent = '⚙️ Work Hour';
    
    // Add event listeners
    toggleButton.addEventListener('click', () => this.toggle());
    
    // Add to document
    document.body.appendChild(this.panel);
    document.body.appendChild(toggleButton);
    
    // Set up event handlers
    this.panel.querySelector('.work-hour-settings-close').addEventListener('click', () => this.close());
    this.panel.querySelector('.work-hour-settings-save').addEventListener('click', () => this.saveSettings());
    this.panel.querySelector('.work-hour-settings-reset').addEventListener('click', () => this.resetSettings());
  }
  
  /**
   * Build HTML for currency inputs
   */
  buildCurrencyInputs() {
    const currencies = getSupportedCurrencies();
    
    return currencies.map(currency => `
      <label class="work-hour-settings-label">${currency}:</label>
      <input 
        type="number" 
        class="work-hour-settings-input" 
        data-currency="${currency}" 
        value="${userConfig.wages[currency]}" 
        min="0.01" 
        step="0.01"
      >
    `).join('');
  }
  
  /**
   * Toggle settings panel visibility
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  /**
   * Open the settings panel
   */
  open() {
    this.panel.style.display = 'block';
    this.isOpen = true;
    
    // Update input values to current settings
    getSupportedCurrencies().forEach(currency => {
      const input = this.panel.querySelector(`input[data-currency="${currency}"]`);
      if (input) {
        input.value = userConfig.wages[currency];
      }
    });
  }
  
  /**
   * Close the settings panel
   */
  close() {
    this.panel.style.display = 'none';
    this.isOpen = false;
  }
  
  /**
   * Save current settings
   */
  saveSettings() {
    const newWages = {};
    
    // Collect values from inputs
    getSupportedCurrencies().forEach(currency => {
      const input = this.panel.querySelector(`input[data-currency="${currency}"]`);
      if (input) {
        newWages[currency] = parseFloat(input.value);
      }
    });
    
    // Save to storage
    if (saveWages(newWages)) {
      alert('Wage settings saved successfully!');
      this.close();
      
      // Refresh calculations on page
      if (typeof processCurrentSite === 'function') {
        processCurrentSite();
      }
    } else {
      alert('Error saving settings. Please check your input values.');
    }
  }
  
  /**
   * Reset settings to defaults
   */
  resetSettings() {
    if (confirm('Reset all wage settings to default values?')) {
      resetWages();
      
      // Update UI
      getSupportedCurrencies().forEach(currency => {
        const input = this.panel.querySelector(`input[data-currency="${currency}"]`);
        if (input) {
          input.value = defaultWages[currency];
        }
      });
      
      alert('Settings reset to default values.');
      
      // Refresh calculations on page
      if (typeof processCurrentSite === 'function') {
        processCurrentSite();
      }
    }
  }
}