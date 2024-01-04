import { createContext, useCallback, useState } from "react";

import LocalStorageService from "~/services/localStorage";

export const DisclaimerContext = createContext<DisclaimerContext>({
  accepted: false,
  accept: () => {},
});

export const DisclaimerProvider = ({ children }) => {
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  const [accepted, setAccepted] = useState(
    LocalStorageService.getItem("saveDisclaimer") ?? false
  );

  const accept = useCallback(
    (save: boolean = false) => {
      setAccepted(true);
      if (save) LocalStorageService.setItem("saveDisclaimer", true, thirtyDays);
    },
    [thirtyDays]
  );
  return (
    <DisclaimerContext.Provider value={{ accepted, accept }}>
      {children}
    </DisclaimerContext.Provider>
  );
};

interface DisclaimerContext {
  accepted: boolean;
  accept: (save?: boolean) => void;
}
