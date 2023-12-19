import { unwraps, wagmiChainById } from "./mappings";
import { ChainRpcUrls, Network } from "./interfaces";

import md5 from "md5";
import { zeroAddress } from "viem";
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

export const amountToEth = (bigInt: bigint | string, decimals) =>
  Number(bigInt) / 10 ** decimals;

export const lisibleAmount = (amount: string | number, decimals = 2) => {
  return Math.round(Number(amount) * 10 ** decimals) / 10 ** decimals;
};

export const unwrapSymbol = (symbol: string): string => {
  return unwraps?.[symbol.toLowerCase()] ?? symbol.toLowerCase();
};

/**
 * Converts a hexadecimal color value to an RGBA string.
 *
 * @param {`#${string}`} hex - The hexadecimal color value. Should start with '#'.
 * @param {number} opacity - The opacity level for the color. Must be a number between 0 and 1.
 * @returns {string} The RGBA color string.
 *
 * @example
 * // returns 'rgba(255, 255, 255, 0.5)'
 * hexToRgba('#FFFFFF', 0.5);
 *
 * @throws Will throw an error if the opacity is not between 0 and 1.
 */
export const hexToRgba = (hex: string, opacity: number) => {
  // Remove the '#' if it's present
  const _hex = hex.replace("#", "");

  // Convert the hexadecimal values to decimal RGB values
  const r = parseInt(_hex.substring(0, 2), 16);
  const g = parseInt(_hex.substring(2, 4), 16);
  const b = parseInt(_hex.substring(4, 6), 16);

  // Return the formatted RGBA string
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const stripName = (name: string): string => {
  return name.replace(/\s?(Finance|Protocol|Network|Capital|Exchange)\b/g, "");
};
export const stripSlug = (slug: string): string => {
  const base = slug.split("-")[0];
  return base.replace(
    /\s?(finance|protocol|network|capital|exchange|-)\b/g,
    ""
  );
};

export const cacheHash = (...params: any[]) => {
  return md5(JSON.stringify(params));
};

export const networkToWagmiChain = (network: Network) => {
  if (!network) return;

  const wagmiNetwork = wagmiChainById[network.id];

  if (wagmiNetwork) return wagmiNetwork;

  wagmiNetwork.rpcUrls.default = {
    http: network.httpRpcs,
  } as ChainRpcUrls;
};

export const overrideZeroAddress = (address: string) => {
  return zeroAddress === address
    ? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    : address;
};
