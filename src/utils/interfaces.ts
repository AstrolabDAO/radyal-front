import { ICommonStep } from "@astrolabs/swapper";
import { BigNumberish } from "ethers";

import { SwapMode } from "./constants";

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

export interface Protocol {
  app: string;
  name: string;
  landing: string;
  slug: string;
  icon: string;
}

export interface Token {
  address?: `0x${string}`;
  name?: string;
  decimals?: number;
  weiPerUnit?: number;
  coinGeckoId?: string;
  icon?: string;
  network: Network;
  symbol?: string;
  slug: string;
}

export interface Balance {
  amount: string;
  slug: string;
}

export interface GetRouteResult {
  route?: any;
  fromToken?: Token;
  toToken: Token;
  toAmount: number;
}

export interface Strategy {
  id: number;
  name: string;
  slug: string;
  address: `0x${string}`;
  rewardsTokens: string[];
  token: Token;
  network: Network;
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
  alt?: string;
  small?: boolean;
  size?: { width: number; height: number };
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

export interface BalanceBySlugMapping {
  [slug: string]: Balance;
}

// requests

export interface LifiRequest {
  fromToken: Token;
  toToken: Token;
  strat: Strategy;
  amount: number;
  address?: `0x${string}`;
  allowance?: string | number | bigint | boolean;
  swapMode?: SwapMode;
}

export interface SwapEstimation {
  estimation: number;
  steps: ICommonStep[];
  request: any;
}

export interface WithdrawRequest {
  amount: BigNumberish;
  strategy: Strategy;
  address?: `0x${string}`;
}
