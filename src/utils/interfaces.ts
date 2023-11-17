export interface Network {
  id: number;
  name: string;
  httpRpcs: string[];
  wsRpcs: string[];
  explorers: string[];
  explorerApi: string;
  gasToken: string;
  slug: string;
}

export interface Token {
  symbol: string;
  defiLlamaId: string;
  slug: string;
}

export interface IDeFiMetadata {
  absoluteChainid: number;
  coingeckoPlatformId: string;
  debankPlatformId: string;
}
export interface IDeFiNetwork {
  id: string;
  name: string;
  displayName: string;
  abbr: string;
  displayAbbr: string;
  metadata: IDeFiMetadata;
}

export interface IDeFIToken {
  address: `0x${string}`;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
  icon: `https://${string}`;
  price: number;
  displayName: string;
  coingeckoId: string;
}

export interface IDeFiBalance {
  address: `0x${string}`;
  amount: string;
  decimalsAmount: string;
  price: number;
  tokenPriceUSD: number;
  totalPriceUSD: number;
  totalValue: number;
  token: IDeFIToken;
}

export type ChainRpcUrls = {
  http: readonly string[];
  webSocket?: readonly string[];
};
