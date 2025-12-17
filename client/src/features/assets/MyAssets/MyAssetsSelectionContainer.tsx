import styled from "styled-components";
import { useAssetSelectionContext } from "../../../context/AssetSelectionContext";
import useAssetMutations from "../useAssetMutations";
import ExistingAssetsList from "../AssetSelection/ExistingAssetsList/ExistingAssetsList";
import NewAssetContainer from "../AssetSelection/NewAsset/NewAssetContainer";
import Button from "../../../ui/Button";
import useGetUserLimits from "../../../hooks/useGetUserLimits";
import SelectedAssetsList from "../AssetSelection/SelectedAssetsList/SelectedAssetsList";
import { HiOutlineTrash } from "react-icons/hi2";
import { useGlobalContext } from "../../../context/GlobalContext";

const StyledMyAssestsSelectionContainer = styled.div`
  width: 70%;
  height: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 8% 1fr 20% 5%;
  grid-gap: 2.4rem;
`;

const StyledTopButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.6rem;
`;
const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`;

export default function MyAssetsSelectionContainer() {
  const {
    selectedOption,
    setSelectedOption,
    assetsList,
    setAssetsList,
    timedAssetsList,
  } = useAssetSelectionContext();

  const userLimits = useGetUserLimits();
  const { setContextImages, setShowDeleteImagesModal, user } =
    useGlobalContext();

  function determineSelectionTypeToDisplay() {
    if (selectedOption === "existing") {
      return <ExistingAssetsList enablePreview />;
    } else if (selectedOption === "new") {
      return <NewAssetContainer saveOnUpload />;
    }
  }

  function handleDeleteAssets() {
    setContextImages(assetsList);
    setShowDeleteImagesModal(true);
  }

  return (
    <StyledMyAssestsSelectionContainer data-testid="assets-selection-container">
      <StyledTopButtonContainer data-testid="assets-top-buttons-container">
        <Button
          size="small"
          type="button"
          variation={
            assetsList.length >= userLimits.media.limit
              ? "disabled"
              : selectedOption === "existing"
              ? "primary"
              : "secondary"
          }
          onClick={() => setSelectedOption("existing")}
          disabled={assetsList.length >= userLimits.media.limit}
        >
          View Existing
        </Button>
        |
        <Button
          size="small"
          type="button"
          variation={
            (user?.assets?.length || 0) >= userLimits.maxAssets
              ? "disabled"
              : selectedOption === "new"
              ? "primary"
              : "secondary"
          }
          onClick={() => setSelectedOption("new")}
          disabled={(user?.assets?.length || 0) >= userLimits.maxAssets}
        >
          + Add New Asset
        </Button>
        {assetsList.length > 0 && "|"}
        {assetsList.length > 0 && (
          <Button
            size="small"
            type="button"
            variation="danger"
            onClick={handleDeleteAssets}
          >
            <HiOutlineTrash /> Delete
          </Button>
        )}
      </StyledTopButtonContainer>
      {determineSelectionTypeToDisplay()}
      {timedAssetsList.length > 0 && (
        <SelectedAssetsList selectedAssets={timedAssetsList} />
      )}
      <small>
        {user?.assets?.length || 0} / {userLimits.maxAssets - assetsList.length}{" "}
        assets usage in your account
      </small>
    </StyledMyAssestsSelectionContainer>
  );
}
