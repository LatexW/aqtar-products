/**
 * Format price correctly handling both string and number types
 * @param price - Price value that could be string or number
 * @returns Formatted price string with two decimal places
 */
export function formatPrice(price: string | number): string {
  // Handle null/undefined values
  if (price === null || price === undefined) {
    return '0.00';
  }
  
  // Convert to number first if it's a string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if it's a valid number before using toFixed
  return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
} 