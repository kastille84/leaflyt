import { UploadApiResponse } from "cloudinary";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

export type AssetSelectionContextType = {
  selectedAsset: string;
  setSelectedAsset: (asset: string) => void;
  selectedOption: "existing" | "new";
  setSelectedOption: React.Dispatch<React.SetStateAction<"existing" | "new">>;
  assetsList: UploadApiResponse[] | [];
  setAssetsList: React.Dispatch<React.SetStateAction<UploadApiResponse[] | []>>;
};

const AssetSelectionContext = createContext<AssetSelectionContextType>({
  selectedAsset: "",
  setSelectedAsset: () => {},
  selectedOption: "existing",
  setSelectedOption: () => {},
  assetsList: [],
  setAssetsList: () => {},
});

function AssetSelectionContextProvider({ children }: PropsWithChildren) {
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedOption, setSelectedOption] = useState<"existing" | "new">(
    "existing"
  );
  const [assetsList, setAssetsList] = useState<UploadApiResponse[] | []>([]);

  return (
    <AssetSelectionContext.Provider
      value={{
        selectedAsset,
        setSelectedAsset,
        selectedOption,
        setSelectedOption,
        assetsList,
        setAssetsList,
      }}
    >
      {children}
    </AssetSelectionContext.Provider>
  );
}

const useAssetSelectionContext = () => {
  const context = useContext(AssetSelectionContext);
  if (context === undefined) {
    throw new Error(
      "AssetSelectionContext must be used within a AssetSelectionContextProvider"
    );
  }
  return context;
};

export { AssetSelectionContextProvider, useAssetSelectionContext };
