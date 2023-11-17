import { createContext } from "react";

export const WalletContext = createContext({});

export const WalletProvider = ({ children }) => {
  const Provider = WalletContext.Provider;
  return <Provider value={{}}>{children}</Provider>;
};
