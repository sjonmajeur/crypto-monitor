import type { Money } from "./shopify/schemas";

/**
 * "12.5" + "EUR" → "€ 12,50". Hele bedragen zonder decimalen ("€ 24").
 */
export function formatPrice(money: Money, locale = "nl-NL"): string {
  const amount = Number.parseFloat(money.amount);
  const isWhole = Number.isInteger(amount);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
