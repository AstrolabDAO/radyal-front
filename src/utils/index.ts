import { Strategy, Token } from "./interfaces";

export const tokensIsEqual = (
  tokenA: Token | Strategy,
  tokenB: Token | Strategy
) => {
  const A = "asset" in tokenA ? tokenA.asset : tokenA;
  const B = "asset" in tokenB ? tokenB.asset : tokenB;
  return (
    A?.address.toLocaleLowerCase() === B?.address.toLocaleLowerCase() &&
    A?.network.id === B?.network.id
  );
};

export const getIconFromStrategy = (strategy: Strategy) => {
  if (!strategy) return "";
  switch (strategy.aggregationLevel) {
    case 0: return strategy?.protocols[0]?.icon;
    case 1: return strategy?.network?.icon;
    default: return strategy?.asset?.icon;
  }
};
