// Amazon implementation (example)

export const amazonConfig = {
  hostnames: ['www.amazon.com', 'amazon.com'],
  
  pages: [
    {
      // Homepage
      urlPattern: /^https?:\/\/www\.amazon\.com\/$/,
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
      urlPattern: /^https?:\/\/(www\.)?amazon\.com.*\/(dp|gp\/product)\/[A-Za-z0-9]+/,
      priceSelector: 'a-offscreen',
      getPriceElement: function(element) {
        return element;
      }
    },
    {
      // Search results
      urlPattern: /^https?:\/\/(www\.)?amazon\.com\/s\?/,
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
      }
    }
  ],
  
  parsePrice: function(priceText) {
    if (!priceText) return 0;
    
    const cleanText = priceText.replace(/[^\d.,]/g, '');
    
    let price;
    if (cleanText.includes('.')) {
      price = cleanText.replaceAll(',', '');
      price = price.replace(/\./g, '');
      price = parseFloat(price.slice(0, -2) + '.' + price.slice(-2));
    } else if (cleanText.length > 2) {
      price = parseFloat(cleanText.slice(0, -2) + '.' + cleanText.slice(-2));
    } else {
      price = parseInt(cleanText);
    }
    
    return price || 0;
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
    if (targetElement.parentNode) {
      targetElement.parentNode.insertBefore(newElement, targetElement.nextSibling.nextSibling);
    }
  },
  
  getCurrency: function() {
    const domain = window.location.hostname;
    if (domain.includes('amazon.co.uk')) return 'GBP';
    if (domain.includes('amazon.ca')) return 'CAD';
    if (domain.includes('amazon.es')) return 'EUR';
    return 'USD';
  },
  
  get currency() {
    return this.getCurrency();
  }
};