import { useMemo } from "react";
import { useStrategies } from "~/hooks/strategies";
import { useBalances } from "~/hooks/tokens";
import { Strategy } from "~/model/strategy";
import { getPrices } from "~/services/tokens";
import { toDollarsAuto, toPercent } from "~/utils/format";

export const Exposure = () => {
  const balances = useBalances();

  const strategies = useStrategies();

  strategies.map((strategy) => {
    const prices = getPrices();
    const assetPrice = prices[strategy.asset.coinGeckoId];
  });
  const [balancesTotal, apyMoy] = useMemo(() => {
    let total = 0;
    let apyTotal = 0;

    const strategySlugs = Object.keys(Strategy.bySlug);
    const balanceSlugs = balances
      .filter((b) => strategySlugs.includes(b.token))
      .map((b) => b.token);

    const filteredStrategies = strategies.filter((s) =>
      balanceSlugs.includes(s.slug)
    );

    balances
      .filter((b) => balanceSlugs.includes(b.token))
      .forEach((balance) => {
        total += balance?.amount * balance?.price;
      });

    filteredStrategies.forEach(({ apy }) => {
      apyTotal += apy;
    });

    const apyMoy =
      filteredStrategies.length === 0
        ? 0
        : apyTotal / filteredStrategies.length;
    return [total, apyMoy];
  }, [strategies, balances]);

  return (
    <div>
      <div className="p-4 flex">
        <div className="w-1/3">
          <h4 className="uppercase">Exposure</h4>
          <div className="text-primary text-6xl inter">
            {toDollarsAuto(balancesTotal, false)}
          </div>
          <ul>
            <li>{toDollarsAuto(balancesTotal)} in Strategies </li>
            <li>$0.00 in insurence</li>
          </ul>
        </div>
        <div className="w-1/3">
          <h4 className="uppercase">APY</h4>
          <div className="text-primary text-6xl inter">{toPercent(apyMoy)}</div>
          <ul>
            <li>{toPercent(apyMoy / 12)} monthly</li>
            <li>{toPercent(apyMoy / 365)} daily</li>
          </ul>
        </div>
        <div className="w-1/3">
          <h4 className="uppercase">ROR</h4>
          <div className="text-primary text-6xl inter">{toPercent(apyMoy)}</div>
        </div>
      </div>
    </div>
  );
};
