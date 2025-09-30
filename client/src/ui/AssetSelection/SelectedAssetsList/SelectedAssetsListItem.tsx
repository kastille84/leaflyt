import styled from "styled-components";

import { UploadApiResponse } from "cloudinary";
import { useAssetSelectionContext } from "../../../context/AssetSelectionContext";
import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";

const StyledSelectedAssetsListItem = styled.figure`
  position: relative;
  width: 100px;
  height: 100px;
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

const StyledIconContainer = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 25px;
  height: 25px;
  background: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  & svg {
    color: var(--color-brand-600);
  }
`;

export default function SelectedAssetsListItem({
  asset,
}: {
  asset: UploadApiResponse;
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
    <StyledSelectedAssetsListItem>
      <img
        src={asset.resource_type === "video" ? asset.thumbnail_url : asset.url}
        alt={asset.original_filename}
      />
      {/* <StyledCheckbox
        type="checkbox"
        onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
          handleAssetSelection(evt.target.checked)
        }
      /> */}
      <StyledIconContainer>
        <HiOutlineArrowTopRightOnSquare />
      </StyledIconContainer>
    </StyledSelectedAssetsListItem>
  );
}
