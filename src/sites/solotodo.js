// SoloTodo implementation

export const solotodoConfig = {
  hostnames: ['www.solotodo.cl'],
  
  pages: [
    {
      // Homepage configuration
      urlPattern: /^https?:\/\/www\.solotodo\.cl\/?$/,
      priceSelector: 'MuiCardContent-root css-1njhssi',
      getPriceElement: function(element) {
        try {
          return element.children[4];
        } catch (e) {
          console.error('Error finding price text in homepage card:', e);
          return null;
        }
      }
    },
    {
      // Product details page
      urlPattern: /^https?:\/\/www\.solotodo\.cl\/products\/[^\/]+\/?$/,
      priceSelector: 'MuiStack-root css-j7qwjs',
      fontSize: '0.7rem',
      getPriceElement: function(element) {
        return element.children[1];
      }
    },
    {
      // Category browse pages
      urlPattern: /^https?:\/\/www\.solotodo\.cl\/([^\/]+)\/?$/,
      priceSelector: 'MuiCardContent-root css-1njhssi',
      getPriceElement: function(element) {
        try {
          return element.children[2];
        }
        catch (e) {
          console.error('Error finding price text in category card:', e);
          return null;
        }
      }
    },
    {
      // Fallback for any other page
      urlPattern: /.*/,
      priceSelector: 'MuiTypography-root',
      getPriceElement: function(element) {
        return null;
      }
    }
  ],
  
  parsePrice: function(priceText) {
    if (!priceText) return 0;
    // Extract numeric value from price text (removes $ and .)
    let price = priceText.replace(/[^\d]/g, '');
    return parseInt(price) || 0;
  },
  
  createDisplayElement: function(workTimeText, fontSize) {
    if (fontSize === undefined) {
      fontSize = '1rem';
    }
    var newElement = document.createElement('div');
    newElement.className = 'MuiTypography-root MuiTypography-h2 css-guehu2 time-needed';
    newElement.style.fontSize = fontSize;
    newElement.style.fontWeight = 'normal';
    newElement.style.position = 'relative';
    newElement.innerHTML = workTimeText;
    return newElement;
  },
  
  insertElement: function(targetElement, newElement) {
    targetElement.parentNode.insertBefore(newElement, targetElement);
  },
  
  currency: 'CLP'
};