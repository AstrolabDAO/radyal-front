import { useMemo } from "react";
import { Strategy } from "~/utils/interfaces";

import IconCard from "../IconCard";
import clsx from "clsx";
import styled from "styled-components";

type StrategyBannerProps = {
  strategyOne: Strategy;
  strategyTwo: Strategy;
};

const StrategyBanner = ({ strategyOne, strategyTwo }: StrategyBannerProps) => {
  const size = { width: 55, height: 55 };
  const [titleOne, titleTwo] = useMemo(() => {
    if (!strategyOne || !strategyTwo) return [null, null];
    const { name: nameOne } = strategyOne;
    const [titleOne] = nameOne.replace("Astrolab ", "").split(" ");
    const { name: nameTwo } = strategyTwo;
    const [titleTwo] = nameTwo.replace("Astrolab ", "").split(" ");
    return [titleOne.toUpperCase(), titleTwo.toUpperCase()];
  }, [strategyOne, strategyTwo]);
  return (
    <StrategyBannerMask
      className={clsx(
        "flex flex-col text-7xl gilroy italic font-black h-full overflow-visible -mx-12 w-100vw"
      )}
    >
      <div className="strategy-banner-wrapper  h-full flex flex-col justify-center -mx-24">
        <div className="flex h-14">
          <div className="scrolling-text-rtl">
            <span>
              FARM
              <span className="text-sky-600">
                {" "}
                ALL OF {titleOne}&nbsp;
                {strategyOne?.network.icon && (
                  <IconCard
                    icon={{
                      url: strategyOne?.network.icon,
                      alt: strategyOne?.network.name,
                      size,
                    }}
                  />
                )}
              </span>
              &nbsp;STABLE DEFI - IN
              <span className="text-primary"> ONE VAULT </span>-&nbsp;
            </span>
          </div>
          <div className="scrolling-text-rtl scrolling-text-shadow">
            <span>
              FARM
              <span className="text-sky-600">
                {" "}
                ALL OF {titleOne}&nbsp;
                {strategyOne?.network.icon && (
                  <IconCard
                    icon={{
                      url: strategyOne?.network.icon,
                      alt: strategyOne?.network.name,
                      size,
                    }}
                  />
                )}
              </span>
              &nbsp;STABLE DEFI - IN
              <span className="text-primary"> ONE VAULT </span>-&nbsp;
            </span>
          </div>
        </div>
        <div className="text-base-content flex h-14">
          <div className="scrolling-text-ltr">
            <span>
              &nbsp;- PROVIDE LIQUIDITY TO THE BEST
              <span className="text-white">
                {" "}
                {titleTwo} POOLS&nbsp;
                {strategyTwo?.network.icon && (
                  <IconCard
                    icon={{
                      url: strategyTwo?.network.icon,
                      alt: strategyTwo?.network.name,
                      size,
                    }}
                  />
                )}
              </span>
            </span>
          </div>
          <div className="scrolling-text-ltr scrolling-text-shadow">
            <span>
              &nbsp;- PROVIDE LIQUIDITY TO THE BEST
              <span className="text-white">
                {" "}
                {titleTwo} POOLS&nbsp;
                {strategyTwo?.network.icon && (
                  <IconCard
                    icon={{
                      url: strategyTwo?.network.icon,
                      alt: strategyTwo?.network.name,
                      size,
                    }}
                  />
                )}
              </span>
            </span>
          </div>
        </div>
      </div>
    </StrategyBannerMask>
  );
};

const StrategyBannerMask = styled.div`
  mask-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 10%,
    rgba(0, 0, 0, 1) 90%,
    rgba(0, 0, 0, 0) 100%
  );
`;

export default StrategyBanner;
