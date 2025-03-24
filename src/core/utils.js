/**
 * Find the correct page configuration based on current URL
 * @param {Object} siteConfig - The site configuration
 * @returns {Object} The page configuration
 */
export function findPageConfig(siteConfig) {
  const currentUrl = window.location.href;
  console.log('currentUrl:', currentUrl);
  for (const pageConfig of siteConfig.pages) {
    if (pageConfig.urlPattern.test(currentUrl)) {
      console.log(`Matched URL pattern for ${pageConfig.urlPattern}`);
      return pageConfig;
    }
  }
  
  // Return fallback config if no match
  return siteConfig.pages[siteConfig.pages.length - 1];
}