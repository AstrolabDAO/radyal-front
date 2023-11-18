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
  address: `0x${string}`;
  decimals: number;
  coingeckoId?: string;
  icon?: string;
  network: Network;
  amount: string;
  symbol?: string;
  slug: string;
}

export interface DeFiMetadata {
  absoluteChainid: number;
  coingeckoPlatformId: string;
  debankPlatformId: string;
}
export interface DeFiNetwork {
  id: string;
  name: string;
  displayName: string;
  abbr: string;
  displayAbbr: string;
  metadata: DeFiMetadata;
}

export interface DeFIToken {
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

export interface DeFiBalance {
  address: `0x${string}`;
  amount: string;
  decimalsAmount: string;
  price: number;
  tokenPriceUSD: number;
  totalPriceUSD: number;
  totalValue: number;
  token: DeFIToken;
}

export interface ChainRpcUrls {
  http: string[];
  webSocket?: string[];
}
