import styled from "styled-components";

import { useAssetSelectionContext } from "../../../context/AssetSelectionContext";
import { useGlobalContext } from "../../../context/GlobalContext";
import ExistingAssetListItem from "./ExistingAssetListItem";

const StyledExistingAssetsListContainer = styled.ul`
  display: flex;
  height: 100%;
  /* flex-direction: column; */
  gap: 1.6rem;
  overflow: auto;
`;

export default function ExistingAssetsList() {
  // const { selectedOption, setSelectedOption } = useAssetSelectionContext();
  const { user } = useGlobalContext();

  return (
    <StyledExistingAssetsListContainer>
      {user?.assets.map((asset) => (
        // <li key={asset.id}>{asset.asset_info.original_filename}</li>
        <ExistingAssetListItem
          key={asset.id}
          asset={asset.asset_info}
        ></ExistingAssetListItem>
      ))}
    </StyledExistingAssetsListContainer>
  );
}
