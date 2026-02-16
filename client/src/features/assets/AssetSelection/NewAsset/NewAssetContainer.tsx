import styled from "styled-components";
import AssetUpload from "../../AssetUpload/AssetUpload";
import useGetUserLimits from "../../../../hooks/useGetUserLimits";
import { UploadApiResponse } from "cloudinary";
import { useAssetSelectionContext } from "../../../../context/AssetSelectionContext";
import useAssetMutations from "../../useAssetMutations";
import toast from "react-hot-toast";
import { useState } from "react";
import useGetUserProfileById from "../../../../hooks/useGetUserProfileById";

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

  @media (max-width: 59em) {
    height: 500px;
  }
`;

export default function NewAssetContainer({
  saveOnUpload,
}: {
  saveOnUpload?: boolean;
}) {
  const [isAddedToAssets, setIsAddedToAssets] = useState<boolean>(false);
  // will get userProfile and set to user after asset is added
  useGetUserProfileById(isAddedToAssets);

  const userLimits = useGetUserLimits();
  const { setTimedAssetsList, setAssetsList, timedAssetsList } =
    useAssetSelectionContext();
  const { addAssetFn } = useAssetMutations();

  function handleAssetAdded(addedAsset: UploadApiResponse) {
    if (saveOnUpload) {
      addAssetFn(addedAsset, {
        onSuccess: () => {
          toast.success("Asset added to assets library!");
          // this flag, triggers useGetProfileById to get updated user
          setIsAddedToAssets((prev) => !prev);
        },
        onError: () => {
          toast.error(
            "Could not add asset to assets library. Re-trying again..",
          );
        },
      });
    } else {
      setTimedAssetsList((prev) => [...prev, addedAsset]);
      setAssetsList((prev) => [...prev, addedAsset]);
    }
  }

  return (
    <StyledNewAssetContainer data-testid="new-asset-container">
      <AssetUpload
        level={userLimits.level}
        onAssetAdded={handleAssetAdded}
        currentTotalAssets={timedAssetsList.length}
      />
    </StyledNewAssetContainer>
  );
}
