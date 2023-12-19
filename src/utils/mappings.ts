import { Chain } from "viem";
import {
  Balance,
  BalanceBySlugMapping,
  CoingeckoPrices,
  Network,
  Protocol,
  Strategy,
  Token,
  TokenBySlugMapping,
} from "./interfaces";
import * as wagmiChains from "wagmi/chains";

export const networkBySlug: { [slug: string]: Network } = {};
export const networkByChainId: { [chainId: number]: Network } = {};
export const deFiIdByChainId: { [chainId: number]: number } = {};
export const chainIdByDeFiId: { [deFiId: number]: number } = {};

export const protocolBySlug: { [slug: string]: Protocol } = {};
export const protocolByStrippedSlug: { [slug: string]: Protocol } = {};

export const chainImages: { [id: number]: string } = {};

export const balanceBySlug: BalanceBySlugMapping = {};
export const tokenBySlug: TokenBySlugMapping = {};
export const tokenPriceBycoinGeckoId: CoingeckoPrices = {};
export const tokenBySymbol: { [symbol: string]: Token } = {};
export const tokensByNetworkId: { [networkId: number]: Token[] } = {};
export const tokensByNetworkSlug: { [networkSlug: string]: Token[] } = {};
export const coinGeckoIdBySymbol: { [symbol: string]: string } = {};

export const wagmiChainById: { [id: number]: Chain } = {};
Object.values(wagmiChains).map((chain) => (wagmiChainById[chain.id] = chain));

export const updateTokenMapping = (token: Token) => {
  tokenBySlug[token.slug] = token;
  tokenBySymbol[token.symbol] = token;
  coinGeckoIdBySymbol[token.symbol] = token.coinGeckoId;
  if (!tokensByNetworkId[token.network.id]) {
    tokensByNetworkId[token.network.id] = [];
  }
  if (!tokensByNetworkSlug[token.network.slug]) {
    tokensByNetworkSlug[token.network.slug] = [];
  }

  tokensByNetworkSlug[token.network.slug].push(token);
  tokensByNetworkId[token.network.id].push(token);
};
export const updateBalanceMapping = (balance: Balance) => {
  balanceBySlug[balance.slug] = balance;
};

export const unwraps: { [symbol: string]: string } = {
  weth: "eth",
  wmatic: "matic",
  warb: "arb",
  wop: "op",
  wftm: "ftm",
  wbnb: "bnb",
  wavax: "avax",
  wmovr: "movr",
  wglmr: "glmr",
  wkava: "kava",
  wcanto: "canto",
  wsol: "sol",
  wsui: "sui",
  wapt: "apt",
  wbtc: "btc",
  wbch: "bch",
  wltc: "ltc",
  wcro: "cro",
  wcelo: "celo",
  wrose: "rose",
};

export const SwapRouteStepTypeTraduction = {
  swap: "Swap",
  cross: "Bridge",
  custom: "Deposit",
};
export const SwaptoolTraduction = {
  custom: "radyal",
  "sushiswap-dai": "sushiswap",
};
