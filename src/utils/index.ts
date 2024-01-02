import { Strategy, Token } from "./interfaces";

export const tokensIsEqual = (
  tokenA: Token | Strategy,
  tokenB: Token | Strategy
) => {
  const a = tokenA as Strategy;
  const b = tokenB as Strategy;
  const A = a?.asset ? a.asset : tokenA;
  const B = b.asset ? b.asset : tokenB;
  return A?.address === B?.address && A?.network.id === B?.network.id;
};
