// Registry of all site handlers
import { solotodoConfig } from './solotodo.js';
import { amazonConfig } from './amazon.js';

// Register all site configurations here
export const siteRegistry = [
  solotodoConfig,
  amazonConfig,
  // Add new sites here
];

/**
 * Get site configuration based on hostname
 * @param {string} hostname - Current hostname
 * @returns {Object|null} Site configuration or null if not found
 */
export function getSiteConfig(hostname) {
  for (const config of siteRegistry) {
    if (config.hostnames.includes(hostname)) {
      return config;
    }
  }
  return null;
}