export function toRaw(s: string): string {
  return s
    .replace(/[^0-9A-Za-zÀ-ÖØ-öø-ÿ-_.,:;\s]+/g, "")
    .toLowerCase()
    .trim();
}

export function slugify(s: string, sep: string = "-"): string {
  // : is kept as part of the slug
  return toRaw(s).replace(/[-_.,;\s]+/gi, sep);
}

export const clearFrom = (s: string, regex: string): string =>
  s.substring(0, s.search(new RegExp(regex)));

export const clearNetworkTypeFromSlug = (slug: string): string =>
  clearFrom(slug, "-mainnet|-testnet");
export const amountToEth = (bigInt: bigint, decimals) =>
  Number(bigInt) / 10 ** decimals;

export const lisibleAmount = (amount: string | number) => {
  return Math.round(Number(amount) * 100) / 100;
};
