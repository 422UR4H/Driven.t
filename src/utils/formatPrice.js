export function formatPrice(price, precision = 0) {

  if (!price) return 0;
  return ((price ?? 100) / 100).toFixed(precision);
}