import { useMemo } from "react";
import { useGrouppedStrategies } from "~/hooks/store/strategies";
import StrategyCardCTAOne from "./StrategyCardCTAOne";
import StrategyCardCTATwo from "./StrategyCardCTATwo";
import StrategyBanner from "./StrategyBanner";

const StrategyHero = () => {
  const grouppedStrategies = useGrouppedStrategies();
  const [strategyOne, strategyTwo, groupOne, groupTwo] = useMemo(
    () => {
      if (grouppedStrategies.length === 0) return [null, null, null, null];
      const [groupOne, groupTwo] = grouppedStrategies;
      const [strategyOne] = groupOne;
      const [strategyTwo] = groupTwo;
      return [strategyOne, strategyTwo, groupOne, groupTwo];
    }, [grouppedStrategies]
  );

  return (
    <div
      className="relative flex flex-col container px-2 overflow-hidden h-[35rem]"
    >
      <StrategyCardCTAOne strategyGroup={ groupOne } />
      <StrategyBanner
        strategyOne={ strategyOne }
        strategyTwo={ strategyTwo }
      />
      <StrategyCardCTATwo strategyGroup={ groupTwo }/>
    </div>
  );
};

export default StrategyHero;
