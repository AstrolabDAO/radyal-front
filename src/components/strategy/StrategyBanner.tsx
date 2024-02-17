import { useMemo } from "react";
import { Strategy } from "~/utils/interfaces";

import IconCard from "../IconCard";
import clsx from "clsx";
import styled from "styled-components";
import { getStrategyColors, getStrategyIcon } from "~/utils";

type StrategyBannerProps = {
  strategyOne: Strategy;
  strategyTwo: Strategy;
};

const StrategyBanner = ({ strategyOne, strategyTwo }: StrategyBannerProps) => {
  const size = { width: 55, height: 55 };

  const [title1, title2, icon1, icon2, color1, color2] = useMemo(() => {
    if (!strategyOne || !strategyTwo) return [null, null];
    const { name: nameOne } = strategyOne;
    const [title1] = nameOne.replace("Astrolab ", "").split(" ");
    const { name: nameTwo } = strategyTwo;
    const [title2] = nameTwo.replace("Astrolab ", "").split(" ");
    const [color1, color2] = [getStrategyColors(strategyOne)[0] ?? "#fff", getStrategyColors(strategyTwo)[0] ?? "#c048e8"];
    console.log("colors", color1, color2);
    return [
      title1.toUpperCase(),
      title2.toUpperCase(),
      getStrategyIcon(strategyOne),
      getStrategyIcon(strategyTwo),
      color1,
      color2,
    ];
  }, [strategyOne, strategyTwo]);

  return (
    <StrategyBannerMask
      className={clsx(
        "flex flex-col text-7xl gilroy italic font-black h-full overflow-visible -mx-12 w-100vw z-10"
      )}
    >
      <div className="strategy-banner-wrapper h-full flex flex-col justify-center -mx-24">
        <div className="flex h-14">
          <div className="scrolling-text-rtl">
            <span>
              FARM
              <span className="mx-5" style={{color: color1}}>
                ALL OF {title1}
              </span>
              <span className="mr-5">
                {icon1 && (
                  <IconCard
                    icon={{
                      url: icon1,
                      alt: strategyOne?.network.name,
                      size,
                    }}
                  />
                )}
              </span>
              STABLE POOLS - IN
              <span className="text-primary"> ONE VAULT </span>-
            </span>
          </div>
          <div className="scrolling-text-rtl scrolling-text-shadow">
          <span>
              FARM
              <span className="mx-5" style={{color: color1}}>
                ALL OF {title1}
              </span>
              <span className="mr-5">
                {icon1 && (
                  <IconCard
                    icon={{
                      url: icon1,
                      alt: strategyOne?.network.name,
                      size,
                    }}
                  />
                )}
              </span>
              STABLE POOLS - IN
              <span className="text-primary"> ONE VAULT </span>-
            </span>
          </div>
        </div>
        <div className="text-base-content flex h-14">
        <div className="scrolling-text-ltr">
            <span>
              - PROVIDE LIQUIDITY TO THE
              <span className="mx-5" style={{color: color2}}>BEST {title2} POOLS</span>
              <span className="mr-5">
                {icon2 && (
                  <IconCard
                    icon={{
                      url: icon2,
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
              - PROVIDE LIQUIDITY TO THE
              <span className="mx-5" style={{color: color2}}>BEST {title2} POOLS</span>
              <span className="mr-5">
                {icon2 && (
                  <IconCard
                    icon={{
                      url: icon2,
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
