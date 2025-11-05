import styled from "styled-components";
import { UploadApiResponse } from "cloudinary";
import SelectedAssetsListItem from "./SelectedAssetsListItem";
import SelectedAssetsListItemTimed from "./SelectedAssetsListItemTimed";
import Heading from "../../../../ui/Heading";
import { useAssetSelectionContext } from "../../../../context/AssetSelectionContext";
import { deleteFileOverTime } from "../../../../services/cloudinary";
import toast from "react-hot-toast";

const StyledContainer = styled.div``;

const StyledSelectedAssetsList = styled.ul`
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1.6rem;
  overflow: auto;
`;

export default function SelectedAssetsList({
  selectedAssets,
}: {
  selectedAssets: UploadApiResponse[];
}) {
  const { timedAssetsList, assetsList, setAssetsList, setTimedAssetsList } =
    useAssetSelectionContext();

  async function handleDeleteAsset(idx: number) {
    const imgToRemoveFromCloudinary = assetsList.splice(idx, 1);
    try {
      // Delete image from cloudinary
      await deleteFileOverTime(imgToRemoveFromCloudinary[0]);
      // remove asset from assetsList
      setAssetsList((prev) =>
        prev.filter(
          (asset) => asset.public_id !== imgToRemoveFromCloudinary[0].public_id
        )
      );
      // remove assets from timedAssetsList
      setTimedAssetsList((prev) =>
        prev.filter(
          (asset) => asset.public_id !== imgToRemoveFromCloudinary[0].public_id
        )
      );
    } catch (error) {
      toast.error("Error deleting asset. Please try again.");
    }
  }

  return (
    <StyledContainer>
      <Heading as={"h3"}>Selected Assets</Heading>
      {selectedAssets.length === 0 && <p>No assets selected</p>}
      <StyledSelectedAssetsList>
        {selectedAssets.map((asset, idx) => {
          const isTimed = timedAssetsList.some(
            (assetItem) => assetItem.public_id === asset.public_id
          );
          if (isTimed) {
            return (
              <SelectedAssetsListItemTimed
                asset={asset}
                key={asset.public_id}
                idx={idx}
                handleDeleteAsset={handleDeleteAsset}
              ></SelectedAssetsListItemTimed>
            );
          }
          return (
            <SelectedAssetsListItem
              asset={asset}
              key={asset.public_id}
            ></SelectedAssetsListItem>
          );
        })}
      </StyledSelectedAssetsList>
    </StyledContainer>
  );
}
