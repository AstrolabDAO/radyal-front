import strategies from "~/data/strategies.json";
import { networkBySlug, tokenBySlug } from "~/utils/mappings";
import StrategyBox from "./StrategyBox";
import tokenAddresses from "~/data/token-addresses.json";
import { useContext } from "react";
import { TokensContext } from "~/context/tokens-context";
import { Strategy, Token } from "~/utils/interfaces";
const Strategies = () => {
  const { updateTokenBySlug } = useContext(TokensContext);
  return (
    <div className="strategies bg-gray-200 w-full">
      <ul className="flex items-center justify-center min-h-screen w-full flex-wrap">
        {strategies
          .filter((s) => {
            const { underlying } = s;
            const [networkSlug, symbol] = underlying.split(":");

            const network = networkBySlug[networkSlug];
            const tokenData =
              tokenAddresses[network.id]?.tokens?.[symbol.toUpperCase()];
            return tokenData ? true : false;
          })
          .map((s: any) => {
            const { underlying } = s;
            const [networkSlug, symbol] = underlying.split(":");
            const network = networkBySlug[networkSlug];

            if (!tokenBySlug[underlying]) {
              const tokenData =
                tokenAddresses[network.id].tokens[symbol.toUpperCase()];

              updateTokenBySlug(underlying, {
                address: tokenData.address,
                coingeckoId: tokenData.coingeckoId,
                symbol,
                icon: `/tokens/${symbol}.svg`,
                slug: underlying,
              } as Token);
            }
            const token = tokenBySlug[underlying];

            return {
              ...s,
              nativeNetwork: network,
              token,
            } as Strategy;
          })
          .map((strategy) => {
            return <StrategyBox strategy={strategy} key={strategy.slug} />;
          })}
      </ul>
    </div>
  );
};
export default Strategies;
