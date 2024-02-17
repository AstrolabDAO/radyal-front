import { Chain } from "viem";
import * as wagmiChains from "wagmi/chains";
import { Balance, Network, Protocol, Strategy } from "./interfaces";

export const networkBySlug: { [slug: string]: Network } = {};
export const networkByChainId: { [chainId: number]: Network } = {};
export const deFiIdByChainId: { [chainId: number]: number } = {};
export const chainIdByDeFiId: { [deFiId: number]: number } = {};

export const protocolBySlug: { [slug: string]: Protocol } = {};
export const protocolByStrippedSlug: { [slug: string]: Protocol } = {};

export const chainImages: { [id: number]: string } = {};

export const strategiesByChainId: { [networkId: number]: Strategy[] } = {};
export const strategyBalanceBySlug: { [slug: string]: Balance } = {};

export const protocolByThirdPartyId: { [id: string]: Protocol } = {};

export const wagmiChainById: { [id: number]: Chain } = {};
Object.values(wagmiChains).map((chain) => (wagmiChainById[chain.id] = chain));

export const updateStrategyMapping = (strategy: Strategy) => {
  if (!strategiesByChainId[strategy.network.id]) {
    strategiesByChainId[strategy.network.id] = [];
  }
  if (!strategiesByChainId[strategy.network.id].includes(strategy))
    strategiesByChainId[strategy.network.id].push(strategy);
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
  hop: "hop-exchange",
  cbridge: "celer-network",
};
