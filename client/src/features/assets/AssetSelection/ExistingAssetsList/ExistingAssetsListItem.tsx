import styled from "styled-components";

import { UploadApiResponse } from "cloudinary";
import { useAssetSelectionContext } from "../../../../context/AssetSelectionContext";

const StyledExistingAssetsListItem = styled.figure`
  position: relative;
  width: 150px;
  height: 150px;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-grey-200);

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--border-radius-sm);
  }
`;

const StyledCheckbox = styled.input`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

export default function ExistingAssetsListItem({
  asset,
  preChecked,
}: {
  asset: UploadApiResponse;
  preChecked: boolean;
}) {
  const { setAssetsList } = useAssetSelectionContext();

  function handleAssetSelection(checkedVal: boolean) {
    if (checkedVal) {
      setAssetsList((prevList) => [...prevList, asset]);
    } else {
      setAssetsList((prevList) =>
        prevList.filter((prevAsset) => prevAsset.public_id !== asset.public_id)
      );
    }
  }

  return (
    <StyledExistingAssetsListItem data-testid="existing-asset-list-item">
      <img
        src={asset.resource_type === "video" ? asset.thumbnail_url : asset.url}
        alt={asset.original_filename}
      />
      <StyledCheckbox
        type="checkbox"
        onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
          handleAssetSelection(evt.target.checked)
        }
        checked={preChecked}
      />
      {/* <p>{asset.original_filename}</p> */}
    </StyledExistingAssetsListItem>
  );
}
