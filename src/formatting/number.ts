/*
 * Formats a number as a percentage string.
 * @param value - The value to format (e.g., 0.1234 for 12.34% or 12.34 for 12.34%).
 * @param options - Options for formatting (decimals, locale, multiply).
 *   - decimals: number of decimal places (default: 2)
 *   - locale: locale string (default: "en-US")
 *   - multiply: if true, multiplies value by 100 (default: true)
 * @returns The formatted percentage string.
 */
export function formatPercentage(
  value: number,
  options: { decimals?: number; locale?: string; multiply?: boolean } = {}
) {
  const {
    decimals = 2,
    locale = "en-US",
    multiply = true,
  } = options;
  const percentValue = multiply ? value * 100 : value;
  return `${percentValue.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}

/*
 * Formats a number as a currency string.
 * @param amount - The amount to format.
 * @param options - Intl.NumberFormat options (e.g., { style: "currency", currency: "EUR", locale: "de-DE" }).
 * @returns The formatted currency string.
 */
export function formatCurrency(
  amount: number,
  options: { currency?: string; locale?: string; minimumFractionDigits?: number; maximumFractionDigits?: number } = {}
) {
  const {
    currency = "USD",
    locale = "en-US",
    minimumFractionDigits,
    maximumFractionDigits,
  } = options;
  return amount.toLocaleString(locale, {
    style: "currency",
    currency,
    ...(minimumFractionDigits !== undefined ? { minimumFractionDigits } : {}),
    ...(maximumFractionDigits !== undefined ? { maximumFractionDigits } : {}),
  });
}