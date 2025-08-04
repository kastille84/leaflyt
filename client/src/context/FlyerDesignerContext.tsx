import { createContext, PropsWithChildren, useContext, useState } from "react";

type Section = "top" | "title" | "subcategory" | "readMore" | "tags";
export type FlyerDesignerContextType = {
  selectedFlyer: any;
  setSelectedFlyer: React.Dispatch<React.SetStateAction<any>>;
  selectedSection: Section;
  setSelectionSection: React.Dispatch<React.SetStateAction<Section>>;
};

const FlyerDesignerContext = createContext<FlyerDesignerContextType>({
  selectedFlyer: null,
  setSelectedFlyer: () => {},
  selectedSection: "top",
  setSelectionSection: () => {},
});

function FlyerDesignerContextProvider({ children }: PropsWithChildren) {
  const [selectedFlyer, setSelectedFlyer] = useState(null);
  const [selectedSection, setSelectionSection] = useState<Section>("top");

  return (
    <FlyerDesignerContext.Provider
      value={{
        selectedFlyer,
        setSelectedFlyer,
        selectedSection,
        setSelectionSection,
      }}
    >
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
