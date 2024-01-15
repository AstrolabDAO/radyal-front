import { ICommonStep } from "@astrolabs/swapper";
import { createContext, useCallback, useState } from "react";

const SwapStepsContext = createContext<SwapStepsContextType>({
  steps: [],
  setSteps: () => {},
});

const SwapStepsProvider = ({ children }) => {
  const [steps, defineSteps] = useState<ICommonStep[]>([]);

  const [currentStep, setCurrentStep] = useState<number>(null);

  const setSteps = useCallback((steps: ICommonStep[]) => {
    defineSteps(steps);
  }, []);
  return (
    <SwapStepsContext.Provider value={{ steps, setSteps }}>
      {children}
    </SwapStepsContext.Provider>
  );
};

interface SwapStepsContextType {
  steps: ICommonStep[];
  setSteps: (steps: ICommonStep[]) => void;
}

export { SwapStepsContext, SwapStepsProvider };
