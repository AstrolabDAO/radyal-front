import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect } from "react";

import { useEstimationHash, useEstimationIsEnabled } from "~/hooks/swapper";
import { estimate, updateEstimation } from "~/services/estimation";
import { setInteractionEstimation } from "~/services/swapper";

const EstimationContext = createContext({});

const EstimationProvider = ({ children }) => {
  const hash = useEstimationHash();

  const isEnabled = useEstimationIsEnabled();

  const { data: estimationData } = useQuery({
    queryKey: [`estimation-${hash}`],
    queryFn: estimate,
    staleTime: 0,
    refetchInterval: 5000,
    enabled: isEnabled,
  });

  useEffect(() => {
    setInteractionEstimation(null);
  }, [hash]);
  useEffect(() => {
    updateEstimation(estimationData);
  }, [estimationData]);

  return (
    <EstimationContext.Provider value={{ estimationData }}>
      {children}
    </EstimationContext.Provider>
  );
};

export { EstimationContext, EstimationProvider };
