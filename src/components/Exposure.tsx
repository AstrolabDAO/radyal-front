import { useContext, useMemo } from "react";
import styled from "styled-components";
import { StrategyTableContext } from "~/context/strategy-table.context";
import { useStrategies } from "~/hooks/strategies";
import { useBalances } from "~/hooks/tokens";
import { Strategy } from "~/model/strategy";
import { getPrices } from "~/services/tokens";
import { COLORS } from "~/styles/constants";
import { toDollarsAuto, toPercent } from "~/utils/format";
import Vault from "~/assets/icons/vault.svg?react";
import Insurance from "~/assets/icons/insurance.svg?react";
export const Exposure = () => {
  const balances = useBalances();

  const strategies = useStrategies();

  strategies.map((strategy) => {
    const prices = getPrices();
    const assetPrice = prices[strategy.asset.coinGeckoId];
  });

  const { totalHoldings, weightedAPY } = useContext(StrategyTableContext);

  return (
    <div>
      <div className="p-4 flex">
        <div className="w-1/3">
          <h4 className="uppercase">Exposure</h4>
          <div className="text-primary text-6xl inter font-bold">
            {toDollarsAuto(totalHoldings, false)}
          </div>
          <ExposureDetail>
            <li>
              {toDollarsAuto(totalHoldings)} in Strategies
              <Vault className="fill-darkGrey w-6 inline-block ml-2" />
            </li>
            <li>
              $0.00 in insurence
              <Insurance className="fill-darkGrey w-6 inline-block ml-2" />
            </li>
          </ExposureDetail>
        </div>
        <div className="w-1/3">
          <h4 className="uppercase">APY</h4>
          <div className="text-primary text-6xl inter font-bold">
            {toPercent(weightedAPY)}
          </div>
          <ExposureDetail>
            <li>{toPercent(weightedAPY / 12)} monthly</li>
            <li>{toPercent(weightedAPY / 365)} daily</li>
          </ExposureDetail>
        </div>
        <div className="w-1/3">
          <h4 className="uppercase">ROR</h4>
          <div className="text-primary text-6xl inter font-bold">
            {toPercent(weightedAPY)}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExposureDetail = styled.ul`
  margin-top: 1rem;
  > li {
    margin-top: -0.7rem;
    &::before {
      content: "";
      display: inline-block;
      position: relative;
      width: 1rem;
      height: 1.5rem;
      border: 1px solid transparent;
      border-left-color: ${COLORS.darkGrey};
      border-bottom-color: ${COLORS.darkGrey};
      margin-bottom: 0.3rem;
      margin-right: 0.5rem;
    }
  }
`;
