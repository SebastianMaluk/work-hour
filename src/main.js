import { loadWages, userConfig } from './config.js';
import { processPriceElements } from './core/dom-handler.js';
import { findPageConfig } from './core/utils.js';
import { getSiteConfig } from './sites/index.js';
import { SettingsPanel } from './ui/settings-panel.js';

console.log('Work Hour Extension loaded');

const runtime = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;

/**
 * Process elements for the current site
 */
function processCurrentSite() {
  // Get current hostname
  const currentSiteHostname = window.location.hostname;
  
  // Find matching site configuration
  const currentSiteConfig = getSiteConfig(currentSiteHostname);
  
  // Exit if no configuration exists for the current site
  if (!currentSiteConfig) {
    console.warn(`No configuration found for ${currentSiteHostname}`);
    return;
  }
  
  // Get page-specific configuration
  const pageConfig = findPageConfig(currentSiteConfig);
  
  // Process price elements
  processPriceElements(currentSiteConfig, pageConfig);
}

/**
 * Initialize extension
 */
function init() {
  // Initialize the settings panel
  const settingsPanel = new SettingsPanel();
  
  // Make processCurrentSite available globally for the settings panel
  window.processCurrentSite = processCurrentSite;
  
  // Process the page initially
  processCurrentSite();
  
  // Set up mutation observer with debouncing
  let processingTimeout = null;
  let isProcessing = false;
  
  const observer = new MutationObserver((mutations) => {
    // Skip if already processing
    if (isProcessing) return;
    
    // Skip if mutations don't include added nodes
    const hasAddedNodes = mutations.some(mutation => 
      mutation.addedNodes && mutation.addedNodes.length > 0
    );
    
    if (!hasAddedNodes) return;
    
    isProcessing = true;
    
    // Clear any existing timeout
    if (processingTimeout) {
      clearTimeout(processingTimeout);
    }
    
    // Set a new timeout
    processingTimeout = setTimeout(() => {
      processCurrentSite();
      isProcessing = false;
    }, 1000);
  });
  
  // Start observing the document
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Add a function to reload settings
async function reloadSettings() {
  try {
    const savedWages = await loadWages();
    if (savedWages) {
      // Update the config with saved values
      userConfig.wages = savedWages;
      
      // Reprocess the page
      processCurrentSite();
    }
  } catch (error) {
    console.error("Error reloading settings:", error);
  }
}

// Listen for the refresh message
runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "refreshCalculations") {
    reloadSettings();
  }
  return true; // Indicates async response
});

// Initialize the extension
init();