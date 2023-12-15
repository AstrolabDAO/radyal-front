import { Token } from "./interfaces";

export const tokensIsEqual = (tokenA: Token, tokenB: Token) => {
  return (
    tokenA?.address === tokenB?.address &&
    tokenA?.network.id === tokenB?.network.id
  );
};
