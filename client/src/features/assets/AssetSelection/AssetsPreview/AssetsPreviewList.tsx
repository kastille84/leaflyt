import styled from "styled-components";
import { UploadApiResponse } from "cloudinary";
import AssetsPreviewListItem from "./AssetsPreviewListItem";
import Heading from "../../../../ui/Heading";
import { deleteFileOverTime } from "../../../../services/cloudinary";
import toast from "react-hot-toast";

const StyledContainer = styled.div``;

const StyledAssetsPreviewList = styled.ul`
  margin-top: 1.2rem;
  height: 250px;
  display: flex;
  flex-wrap: wrap;
  gap: 1.6rem;
  overflow: auto;
  align-content: flex-start;
`;

export default function AssetsPreviewList({
  fileUrlArr,
}: {
  fileUrlArr: UploadApiResponse[];
}) {
  // async function handleDeleteAsset(idx: number) {
  //   const imgToRemoveFromCloudinary = assetsList.splice(idx, 1);
  //   try {
  //     // Delete image from cloudinary
  //     await deleteFileOverTime(imgToRemoveFromCloudinary[0]);
  //     // remove asset from assetsList
  //     setAssetsList((prev) =>
  //       prev.filter(
  //         (asset) => asset.public_id !== imgToRemoveFromCloudinary[0].public_id
  //       )
  //     );
  //     // remove assets from timedAssetsList
  //     setTimedAssetsList((prev) =>
  //       prev.filter(
  //         (asset) => asset.public_id !== imgToRemoveFromCloudinary[0].public_id
  //       )
  //     );
  //   } catch (error) {
  //     toast.error("Error deleting asset. Please try again.");
  //   }
  // }

  return (
    <StyledContainer data-testid="container-assets-preview-list">
      <Heading as={"h4"}>Selected Assets</Heading>
      {fileUrlArr.length === 0 && <p>No assets selected</p>}
      <StyledAssetsPreviewList>
        {fileUrlArr.map((asset, idx) => {
          return (
            <AssetsPreviewListItem
              asset={asset}
              key={asset.public_id}
            ></AssetsPreviewListItem>
          );
        })}
      </StyledAssetsPreviewList>
    </StyledContainer>
  );
}
