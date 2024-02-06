import { ICommonStep } from "@astrolabs/swapper";

import { StrategyInteraction } from "./constants";
import { OperationStep } from "~/store/interfaces/operations";

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
  amount: number;
  token: string;
  amountWei: string;
  price?: number;
  logo_url?: string;
}

export interface GetRouteResult {
  route?: any;
  fromToken?: Token;
  toToken: Token;
  toAmount: number;
}

// TODO Strategy is Token
export interface Strategy extends Token {
  rewardsTokens?: string[];
  asset: Token;
  sharePrice: number;
  protocols?: any[];
  aggregationLevel?: number;
}

export interface GrouppedStrategies {
  [slug: string]: Strategy[];
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

export interface LifiRequest {
  fromToken: Token;
  toToken: Token;
  strategy: Strategy;
  amount: bigint;
  address: `0x${string}`;
  interaction: StrategyInteraction;
}

export interface SwapEstimation {
  estimation: number;
  steps: ICommonStep[];
  request: any;
}

export interface DirectStrategyAction {
  value: number;
  address?: `0x${string}`;
}

export interface EstimationRequest {
  from: `0x${string}`;
  to: `0x${string}`;
  approvalAddress: `0x${string}`;
  aggregatorId: string;
  chainId: number;
  data: `0x${string}`;
  estimatedExchangeRate: number;
  estimatedOutput: number;
  estimatedOutputWei: string;
  gasLimit: `0x${string}`;
  gasPrice: `0x${string}`;
  value: `0x${string}`;
  steps: ICommonStep[];
}
export interface Estimation {
  estimation: number;
  id: string;
  request: EstimationRequest;
  // It is an same of request.steps but with Approve step added if needed
  steps: OperationStep[];
  error?: any;
}
