import { Balance, Token } from "~/utils/interfaces";
import { Network } from "./network";
import { Serializable } from "./serializable";

export interface IStrategy extends Token {
  rewardsTokens?: string[];
  asset: Token;
  sharePrice: number;
  sharePriceUsd?: number;
  protocols?: any[];
  aggregationLevel?: number;
  apy?: number;
  tvl?: number;
  tvlUsd?: number;
  valuable: any;
  color1?: string;
}

export class Strategy extends Serializable implements IStrategy {
  address: `0x${string}`;
  name: string;
  decimals: number;
  weiPerUnit: number;
  coinGeckoId: string;
  icon: string;
  network: Network;
  symbol: string;
  slug: string;
  color1: string;
  color2: string;
  rewardsTokens?: string[];
  asset: Token;
  sharePrice: number;
  sharePriceUsd?: number;
  protocols?: any[];
  aggregationLevel?: number;
  apy?: number;
  tvl?: number;
  tvlUsd?: number;
  valuable: any;

  static byChainId: { [chainId: number]: Strategy[] } = {};
  static bySlug: { [slug: string]: Strategy } = {};
  static indexBySlug: { [id: string]: number } = {};
  static byThirdPartyId: { [id: string]: Strategy } = {};
  static balanceBySlug: { [slug: string]: Balance } = {};

  constructor(strategy: IStrategy) {
    super();
    this.address = strategy.address;
    this.name = strategy.name;
    this.decimals = strategy.decimals;
    this.weiPerUnit = strategy.weiPerUnit;
    this.coinGeckoId = strategy.coinGeckoId;
    this.icon = strategy.icon;
    this.network = strategy.network;
    this.symbol = strategy.symbol;
    this.slug = strategy.slug;
    this.color1 = strategy.color1;
    this.color2 = strategy.color2;
    this.rewardsTokens = strategy.rewardsTokens;
    this.asset = strategy.asset;
    this.sharePrice = strategy.sharePrice;
    this.protocols = strategy.protocols;
    this.aggregationLevel = strategy.aggregationLevel;
    this.apy = strategy.apy;
    this.tvl = strategy.tvl;
    this.valuable = strategy.valuable;
    if (!Strategy.byChainId[this.network.id])
      Strategy.byChainId[this.network.id] = [];
    Strategy.byChainId[this.network.id].push(this);
    Strategy.bySlug[this.slug] = this;
  }
}
