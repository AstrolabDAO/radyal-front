import { stripName } from "./format";
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

export const getStrategyIcon = (strategy: Strategy) => {
  if (!strategy) return "";
  switch (strategy.aggregationLevel) {
    case 0:
      return strategy?.protocols[0]?.icon;
    case 1:
      return strategy?.network?.icon;
    default:
      return strategy?.asset?.icon;
  }
};

export const getStrategyColors = (strategy: Strategy) => {
  if (!strategy) return "";
  switch (strategy.aggregationLevel) {
    case 0:
      return [strategy?.protocols[0]?.color1, strategy?.protocols[0]?.color2];
    case 1:
      return [strategy?.network?.color1, strategy?.network?.color2];
    default:
      return [strategy?.asset?.color1, strategy?.asset?.color2];
  }
};

export const getStrategyHook = (strategy: Strategy) => {
  if (!strategy) return { color1: "#ffffff", message: "???" };
  switch (strategy.aggregationLevel) {
    case 0: {
      const color1 = strategy?.protocols[0]?.color1;
      return {
        color1,
        message: `Automatically provide liquidity to <span style="color: ${color1};">${stripName(strategy.protocols[0].name)}</span>'s best pools in <span style="color: var(--primary);">one vault</span>`,
      };
    }
    case 1: {
      const color1 = strategy?.network?.color1;
      const token = strategy?.asset.slug.includes("us")
        ? "stable"
        : strategy?.asset.symbol;
      return {
        color1,
        message: `Farm <span style="color: ${color1};">all of ${stripName(strategy.network.name)}</span>'s ${token} DeFi in <span style="color: var(--primary);">one vault</span>`,
      };
    }
    case 2:
    default: {
      const color1 = strategy?.asset?.color1;
      const token = strategy?.asset.slug.includes("us")
        ? "stable"
        : strategy?.asset.symbol;
      return {
        color1,
        message: `Farm <span style="color: ${color1};">the best ${token} opportunities</span> cross-chain in <span style="color: var(--primary);">one vault</span>`,
      };
    }
  }
};
