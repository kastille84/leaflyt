import styled from "styled-components";
import { UploadApiResponse } from "cloudinary";
import SelectedAssetsListItem from "./SelectedAssetsListItem";
import Heading from "../../Heading";

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
  return (
    <StyledContainer>
      <Heading as={"h3"}>Selected Assets</Heading>
      {selectedAssets.length === 0 && <p>No assets selected</p>}
      <StyledSelectedAssetsList>
        {selectedAssets.map((asset) => (
          <SelectedAssetsListItem
            asset={asset}
            key={asset.public_id}
          ></SelectedAssetsListItem>
        ))}
      </StyledSelectedAssetsList>
    </StyledContainer>
  );
}
