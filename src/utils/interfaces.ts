export interface Network {
  id: number;
  name: string;
  httpRpcs: string[];
  wsRpcs: string[];
  explorers: string[];
  explorerApi: string;
  gasToken: string;
  slug: string;
  icon?: string;
}

export interface Token {
  address?: `0x${string}`;
  name?: string;
  decimals?: number;
  coingeckoId?: string;
  icon?: string;
  network: Network;
  amount?: string;
  symbol?: string;
  slug: string;
}

export interface GetRouteResult {
  route?: any;
  fromToken?: Token;
  toToken: Token;
  toAmountUSD: number;
  toAmount: number;
}

export interface Strategy {
  name: string;
  slug: string;
  underlying: string;
  rewardsTokens: string[];
  token: Token;
  nativeNetwork: Network;
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

export interface Icon {
  url: string;
  alt: string;
  small?: boolean;
  classes?: string;
}

export interface CoingeckoPrices {
  [id: string]: {
    [currency: string]: number;
  };
}

export interface TokenBySlugMapping {
  [slug: string]: Token;
}
