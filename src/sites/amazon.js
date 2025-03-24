// Amazon implementation (example)

export const amazonConfig = {
  hostnames: ['www.amazon.com', 'amazon.com', 'www.amazon.co.uk', 'amazon.co.uk', 'www.amazon.ca', 'amazon.ca', 'www.amazon.es', 'amazon.es'],
  
  pages: [
    {
      // Homepage
      urlPattern: /^https?:\/\/www\.amazon\.(com|co\.uk|ca|es)\/$/,
      priceSelector: 'a-price',
      getPriceElement: function(element) {
        const priceElements = element.getElementsByClassName('a-offscreen')
        if (priceElements.length === 0) return null;
        console.log(priceElements[0]);
        return priceElements[0];
      }
    },
    {
      // Product page
      urlPattern: /^https?:\/\/(www\.)?amazon\.(com|co\.uk|ca|es)(\/.*)?\/dp\/[A-Z0-9]+/,
      priceSelector: 'aok-offscreen',
      getPriceElement: function(element) {
        console.log('ProductPage or SearchPage');
        console.log(element);
        return element;
      }
    },
    {
      // Search results
      urlPattern: /^https?:\/\/(www\.)?amazon\.(com|co\.uk|ca|es)\/s\?/,
      priceSelector: 'a-price',
      getPriceElement: function(element) {
        const elements = element.getElementsByClassName('a-offscreen');
        if (elements.length === 0) return null;
        return elements[0];
      }
    },
    {
      // Fallback for any other page
      urlPattern: /.*/,
      priceSelector: 'null',
      getPriceElement: function(element) {
        throw new Error('Fallback page not implemented');
        return null;
      }
    }
  ],
  
  parsePrice: function(priceText) {
    if (!priceText) return 0;
    
    // Get the currency format based on domain
    const domain = window.location.hostname;
    const isEuropeanFormat = domain.includes('amazon.es') || domain.includes('amazon.de') 
      || domain.includes('amazon.fr') || domain.includes('amazon.it');
    
    // Remove currency symbols and spaces
    const cleanText = priceText.replace(/[^\d.,]/g, '');
    
    let price;
    if (isEuropeanFormat) {
      // European format: 1.234,56 € (comma as decimal separator)
      // Handle numbers with or without thousand separators
      if (cleanText.includes(',')) {
        // Has decimal separator (comma)
        price = parseFloat(cleanText.replace(/\./g, '').replace(',', '.'));
      } else {
        // No decimal separator
        price = parseInt(cleanText.replace(/\./g, ''));
      }
    } else {
      // US/UK/CA format: $1,234.56 (dot as decimal separator)
      if (cleanText.includes('.')) {
        // Has decimal point
        price = cleanText.replaceAll(',', '');
        price = price.replace(/\./g, '');
        price = parseFloat(price.slice(0, -2) + '.' + price.slice(-2));
      } else if (cleanText.length > 2) {
        // No decimal point, add one before last two digits
        price = parseFloat(cleanText.slice(0, -2) + '.' + cleanText.slice(-2));
      } else {
        // Short number with no decimal
        price = parseInt(cleanText);
      }
    }
    
    return price || 0; // Default to 0 if parsing fails
  },
  
  createDisplayElement: function(workTimeText, fontSize) {
    if (fontSize === undefined) {
      fontSize = '0.9rem';
    }
    var newElement = document.createElement('span');
    newElement.className = 'a-size-base a-color-secondary time-needed';
    newElement.style.fontSize = fontSize;
    newElement.style.display = 'block';
    newElement.style.marginTop = '4px';
    newElement.innerHTML = workTimeText;
    return newElement;
  },
  
  insertElement: function(targetElement, newElement) {
    // For Amazon, insert after the price
    if (targetElement.parentNode) {
      targetElement.parentNode.insertBefore(newElement, targetElement.nextSibling.nextSibling);
    }
  },
  
  // Currency depends on the site
  getCurrency: function() {
    const domain = window.location.hostname;
    if (domain.includes('amazon.co.uk')) return 'GBP';
    if (domain.includes('amazon.ca')) return 'CAD';
    if (domain.includes('amazon.es')) return 'EUR';
    return 'USD'; // Default for amazon.com
  },
  
  get currency() {
    return this.getCurrency();
  }
};