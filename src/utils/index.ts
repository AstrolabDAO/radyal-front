import { Protocol, Strategy, Token } from "./interfaces";

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

export const getIconFromStrategy = (
  strategy: Strategy,
  protocols: Protocol[]
) => {
  function getProtocolIcon() {
    const protocolSlug: string = strategy.protocols[0] as string;
    const protocol = protocols.find((p) => {
      return p.slug === protocolSlug;
    });
    if (!protocol) return "";
    return protocol.icon;
  }
  if (!strategy) return "";
  switch (strategy.aggregationLevel) {
    case 0:
      return getProtocolIcon();
    case 1:
      return strategy.network.icon;
    default:
      return strategy.asset.icon;
  }
};
