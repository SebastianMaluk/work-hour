/**
 * Calculate work time based on price and hourly wage
 * @param {number} price - The price in any currency
 * @param {number} wagePerHour - The hourly wage in the same currency
 * @returns {Object} Object containing hours and minutes
 */
export function calculateWorkTime(price, wagePerHour) {
  const totalHours = price / wagePerHour;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  return { hours, minutes };
}