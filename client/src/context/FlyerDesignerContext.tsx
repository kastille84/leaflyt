import { createContext, PropsWithChildren, useContext, useState } from "react";
export type FlyerDesignerContextType = {};

const FlyerDesignerContext = createContext<FlyerDesignerContextType>({});

function FlyerDesignerContextProvider({ children }: PropsWithChildren) {
  const [selectedFlyer, setSelectedFlyer] = useState();
  return (
    <FlyerDesignerContext.Provider value={{}}>
      {children}
    </FlyerDesignerContext.Provider>
  );
}

const useFlyerDesignerContext = () => {
  const context = useContext(FlyerDesignerContext);
  if (context === undefined) {
    throw new Error(
      "FlyerDesignerContext must be used within a FlyerDesignerContextProvider"
    );
  }
  return context;
};

export { FlyerDesignerContextProvider, useFlyerDesignerContext };
