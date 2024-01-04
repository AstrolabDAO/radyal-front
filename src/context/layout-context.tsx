import { createContext, useState, FC, ReactNode } from "react";

type LayoutContextType = {
  showHeader: boolean;
  setShowHeader: (show: boolean) => void;
  showFooter: boolean;
  setShowFooter: (show: boolean) => void;
};

export const LayoutContext = createContext<LayoutContextType>({
  showHeader: true,
  setShowHeader: () => {},
  showFooter: true,
  setShowFooter: () => {},
});


type LayoutProviderProps = {
  children: ReactNode;
};

export const LayoutProvider: FC<LayoutProviderProps> = ({ children }) => {
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  return (
    <LayoutContext.Provider
      value={{
        showHeader,
        setShowHeader,
        showFooter,
        setShowFooter
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
