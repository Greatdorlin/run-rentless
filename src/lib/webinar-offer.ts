export const webinarOffer = {
  USD: {
    1: { amount: 21900, before: 24900 },
    2: { amount: 34900, before: 39900 },
    5: { amount: 69900, before: 79900 },
  },
  NGN: {
    1: { amount: 27000000, before: 30000000 },
    2: { amount: 40000000, before: 45000000 },
    5: { amount: 80000000, before: 90000000 },
  },
} as const;

export type OfferCurrency = keyof typeof webinarOffer;
export type OfferSeats = 1 | 2 | 5;

export function isOfferCurrency(value: unknown): value is OfferCurrency {
  return value === "USD" || value === "NGN";
}

export function isOfferSeats(value: unknown): value is OfferSeats {
  return value === 1 || value === 2 || value === 5;
}

export function offerAmount(currency: OfferCurrency, seats: OfferSeats) {
  return webinarOffer[currency][seats].amount;
}
