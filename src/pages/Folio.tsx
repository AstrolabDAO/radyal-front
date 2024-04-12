import { Exposure } from "~/components/Exposure";
import { ConnectMask } from "~/components/layout/BlurMask";
import StrategyTable from "~/components/strategy/table/StrategyTable";
import { StrategyTableContextProvider } from "~/context/strategy-table.context";

export const FolioPage = () => {
  return (
    <StrategyTableContextProvider folio={true}>
      <ConnectMask title={"FOLIO"} />
      <div className="container">
        <Exposure />
        <StrategyTable />
      </div>
    </StrategyTableContextProvider>
  );
};
