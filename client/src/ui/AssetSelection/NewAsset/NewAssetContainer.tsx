import styled from "styled-components";
import AssetUpload from "../../AssetUpload/AssetUpload";
import useGetUserLimits from "../../../hooks/useGetUserLimits";
import { UploadApiResponse } from "cloudinary";
import { useAssetSelectionContext } from "../../../context/AssetSelectionContext";

const StyledNewAssetContainer = styled.div`
  border: 2px solid var(--color-brand-600);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: 1.6rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  height: 100%;
  /* flex-direction: column; */
  gap: 1.6rem;
  overflow: auto;
`;

export default function NewAssetContainer() {
  const userLimits = useGetUserLimits();
  const { setTimedAssetsList, setAssetsList, timedAssetsList } =
    useAssetSelectionContext();
  function handleAssetAdded(addedAsset: UploadApiResponse) {
    setTimedAssetsList((prev) => [...prev, addedAsset]);
    setAssetsList((prev) => [...prev, addedAsset]);
  }

  return (
    <StyledNewAssetContainer>
      <AssetUpload
        level={userLimits.level}
        onAssetAdded={handleAssetAdded}
        currentTotalAssets={timedAssetsList.length}
      />
    </StyledNewAssetContainer>
  );
}
