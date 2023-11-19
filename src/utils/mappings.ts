import {
  CoingeckoPrices,
  Network,
  Token,
  TokenBySlugMapping,
} from "./interfaces";

export const networkBySlug: { [slug: string]: Network } = {};
export const networkByChainId: { [chainId: number]: Network } = {};
export const deFiIdByChainId: { [chainId: number]: number } = {};
export const chainIdByDeFiId: { [deFiId: number]: number } = {};

export const chainImages: { [id: number]: string } = {};

export const tokenBySlug: TokenBySlugMapping = {};
export const tokenPriceByCoingeckoId: CoingeckoPrices = {};
export const tokenBySymbol: { [symbol: string]: Token } = {};

export const coingeckoIdBySymbol: { [symbol: string]: string } = {};
