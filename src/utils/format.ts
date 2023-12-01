import { unwraps } from "./mappings";

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

export function shortenAddress(
  address: string,
  start = 4,
  end = 4,
  sep = "."
): string {
  const len = address.length;
  return address.slice(0, 2 + start) + sep + address.slice(len - end, len);
}

export const clearFrom = (s: string, regex: string): string =>
  s.substring(0, s.search(new RegExp(regex)));

export const clearNetworkTypeFromSlug = (slug: string): string =>
  clearFrom(slug, "-mainnet|-testnet");
export const amountToEth = (bigInt: bigint, decimals) =>
  Number(bigInt) / 10 ** decimals;

export const lisibleAmount = (amount: string | number, decimals = 2) => {
  return Math.round(Number(amount) * 10 ** decimals) / 10 ** decimals;
};

export const unwrapSymbol = (symbol: string): string => {
  return unwraps?.[symbol.toLowerCase()] ?? symbol.toLowerCase();
};
