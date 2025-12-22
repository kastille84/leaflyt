import styled from "styled-components";

import { useAssetSelectionContext } from "../../../../context/AssetSelectionContext";
import { useGlobalContext } from "../../../../context/GlobalContext";
import ExistingAssetListItem from "./ExistingAssetsListItem";

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
  align-content: flex-start;

  @media (max-width: 59em) {
    height: 500px;
  }
`;

export default function ExistingAssetsList({
  enablePreview,
  onlySafeToDelete = false,
}: {
  enablePreview?: boolean;
  onlySafeToDelete?: boolean;
}) {
  // const { selectedOption, setSelectedOption } = useAssetSelectionContext();
  const { user } = useGlobalContext();
  const { assetsList } = useAssetSelectionContext();

  return (
    <StyledExistingAssetsListContainer>
      {user?.assets.map((asset) => {
        const onlySafeToDeleteProps = onlySafeToDelete
          ? {
              showCheckboxOnSafeDelete: true,
              isBeingUsed:
                asset.used_by_flyers.length > 0 ||
                asset.used_by_templates.length > 0,
            }
          : {};
        return (
          <ExistingAssetListItem
            key={asset.id}
            enablePreview={enablePreview}
            asset={asset.asset_info}
            preChecked={assetsList.some(
              (assetItem) => assetItem.public_id === asset.asset_info.public_id
            )}
            {...onlySafeToDeleteProps}
          ></ExistingAssetListItem>
        );
      })}
    </StyledExistingAssetsListContainer>
  );
}
