/**
 * Format work time as a string with appropriate language text
 * @param {Object} timeObj - Object with hours and minutes
 * @param {string} language - Browser language code
 * @returns {string} Formatted work time string
 */
export function formatWorkTime(timeObj, language) {
  const { hours, minutes } = timeObj;
  return `${hours}h ${minutes}m${language.startsWith('es') ? " Tiempo de Trabajo" : " Working Time"}`;
}