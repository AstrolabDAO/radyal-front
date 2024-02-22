import { Chain } from "viem";
import * as wagmiChains from "wagmi/chains";
import { Strategy } from "./interfaces";

export const chainImages: { [id: number]: string } = {};
export const wagmiChainById: { [id: number]: Chain } = {};
Object.values(wagmiChains).map((chain) => (wagmiChainById[chain.id] = chain));

export const updateStrategyMapping = (strategy: Strategy) => {
  if (!Strategy.byChainId[strategy.network.id]) {
    Strategy.byChainId[strategy.network.id] = [];
  }
  if (!Strategy.byChainId[strategy.network.id].includes(strategy))
    Strategy.byChainId[strategy.network.id].push(strategy);
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
