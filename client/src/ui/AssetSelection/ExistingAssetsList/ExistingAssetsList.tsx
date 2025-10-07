import styled from "styled-components";

import { useAssetSelectionContext } from "../../../context/AssetSelectionContext";
import { useGlobalContext } from "../../../context/GlobalContext";
import ExistingAssetListItem from "./ExistingAssetListItem";

const StyledExistingAssetsListContainer = styled.ul`
  border: 2px solid var(--color-brand-600);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: 1.6rem;
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  /* flex-direction: column; */
  gap: 1.6rem;
  overflow: auto;
`;

export default function ExistingAssetsList() {
  // const { selectedOption, setSelectedOption } = useAssetSelectionContext();
  const { user } = useGlobalContext();
  const { assetsList } = useAssetSelectionContext();

  return (
    <StyledExistingAssetsListContainer>
      {user?.assets.map((asset) => (
        // <li key={asset.id}>{asset.asset_info.original_filename}</li>
        <ExistingAssetListItem
          key={asset.id}
          asset={asset.asset_info}
          preChecked={assetsList.some(
            (assetItem) => assetItem.public_id === asset.asset_info.public_id
          )}
        ></ExistingAssetListItem>
      ))}
    </StyledExistingAssetsListContainer>
  );
}
