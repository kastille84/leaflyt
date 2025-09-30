import { UploadApiResponse } from "cloudinary";
import styled from "styled-components";
import SelectedAssetsListItem from "./SelectedAssetsListItem";

export default function SelectedAssetList({
  selectedAssets,
}: {
  selectedAssets: UploadApiResponse[];
}) {
  return (
    <div>
      {selectedAssets.map((asset) => (
        <SelectedAssetsListItem
          asset={asset}
          key={asset.public_id}
        ></SelectedAssetsListItem>
      ))}
    </div>
  );
}
