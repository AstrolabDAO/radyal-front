import { useMemo } from "react";
import { useGrouppedStrategies } from "~/hooks/store/strategies";
import StrategyCardCTAOne from "./StrategyCardCTAOne";
import StrategyCardCTATwo from "./StrategyCardCTATwo";
import StrategyBanner from "./StrategyBanner";

const StrategyHero = () => {
  const grouppedStrategies = useGrouppedStrategies();
  const [strategyOne, strategyTwo] = useMemo(
    () => {
      if (grouppedStrategies.length === 0) return [null, null];
      const [groupOne, groupTwo] = grouppedStrategies;
      const [strategyOne] = groupOne;
      const [strategyTwo] = groupTwo;
      return [strategyOne, strategyTwo];
    }, [grouppedStrategies]
  );

  if (!grouppedStrategies.length) return;
  return (
    <div
      className="flex flex-col container mx-auto overflow-hidden"
    >
      <StrategyCardCTAOne strategyGroup={ grouppedStrategies[0] } />
      <StrategyBanner
        strategyOne={ strategyOne }
        strategyTwo={ strategyTwo }
      />
      <StrategyCardCTATwo strategyGroup={ grouppedStrategies[1] }/>
    </div>
  );
};

export default StrategyHero;
