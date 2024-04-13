import { Exposure } from "~/components/Exposure";
import { FolioActionBar } from "~/components/FolioActionBar";
import { ConnectMask } from "~/components/layout/BlurMask";
import NetworkSelect, { NetworkSelectData } from "~/components/NetworkSelect";
import StrategyTable from "~/components/strategy/table/StrategyTable";
import { Input } from "~/components/styled";
import { StrategyTableContextProvider } from "~/context/strategy-table.context";
import { useStrategiesNetworks } from "~/hooks/strategies";
import { dispatch } from "~/store";
import { filterByNetworks, search } from "~/store/strategies";

export const FolioPage = () => {
  return (
    <StrategyTableContextProvider folio={true}>
      <ConnectMask title={"FOLIO"} />
      <div className="container">
        <Exposure />
        <FolioActionBar />
        <StrategyTable />
      </div>
    </StrategyTableContextProvider>
  );
};
