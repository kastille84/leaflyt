import { createContext, PropsWithChildren, useContext, useState } from "react";

type Section =
  | "top_backgroundColor"
  | "top_color"
  | "title_color"
  | "subcategory_color"
  | "readMore_color"
  | "tags_color";
export type FlyerDesignerContextType = {
  selectedFlyer: any;
  setSelectedFlyer: React.Dispatch<React.SetStateAction<any>>;
  selectedSection: Section;
  setSelectionSection: React.Dispatch<React.SetStateAction<Section>>;
};

const FlyerDesignerContext = createContext<FlyerDesignerContextType>({
  selectedFlyer: null,
  setSelectedFlyer: () => {},
  selectedSection: "top_backgroundColor",
  setSelectionSection: () => {},
});

function FlyerDesignerContextProvider({ children }: PropsWithChildren) {
  const [selectedFlyer, setSelectedFlyer] = useState(null);
  const [selectedSection, setSelectionSection] = useState<Section>(
    "top_backgroundColor"
  );

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
