// Template for adding a new site
export const templateConfig = {
  hostnames: ['example.com'], // Array of hostnames this config applies to
  
  pages: [
    {
      // Define patterns for different page types
      urlPattern: /^https?:\/\/example\.com\/product\/.+/,
      priceSelector: 'price-class', // CSS class to find price elements
      getPriceElement: function(element) {
        // Return the element containing the price text
        return element.querySelector('.actual-price') || element;
      }
    },
    // Add more page types as needed
  ],
  
  parsePrice: function(priceText) {
    // Extract numeric price from text
    if (!priceText) return 0;
    let price = priceText.replace(/[^\d\.]/g, '');
    return parseFloat(price) || 0;
  },
  
  createDisplayElement: function(workTimeText, fontSize) {
    // Create the element to display work time
    var newElement = document.createElement('div');
    newElement.className = 'time-needed';
    newElement.style.fontSize = fontSize || '0.9rem';
    newElement.innerHTML = workTimeText;
    return newElement;
  },
  
  insertElement: function(targetElement, newElement) {
    // Insert the work time element into the DOM
    targetElement.parentNode.insertBefore(newElement, targetElement.nextSibling);
  },
  
  currency: 'USD' // Currency used on this site
};