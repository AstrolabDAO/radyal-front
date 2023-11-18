import { Network, Token } from "./interfaces";

export const networkBySlug: { [slug: string]: Network } = {};
export const deFiIdByChainId: { [chainId: number]: number } = {};
export const chainIdByDeFiId: { [deFiId: number]: number } = {};
export const chainImages: { [id: number]: string } = {};
export const tokenBySlug: { [slug: string]: Token } = {};
export const tokenPriceByCoingeckoId: {
  [id: string]: { [curency: string]: number };
} = {};
export const coingeckoIdBySymbol: { [symbol: string]: string } = {};
