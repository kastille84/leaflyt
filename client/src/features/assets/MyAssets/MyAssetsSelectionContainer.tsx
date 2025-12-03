import styled from "styled-components";
import { useAssetSelectionContext } from "../../../context/AssetSelectionContext";
import useAssetMutations from "../useAssetMutations";
import ExistingAssetsList from "../AssetSelection/ExistingAssetsList/ExistingAssetsList";
import NewAssetContainer from "../AssetSelection/NewAsset/NewAssetContainer";
import Button from "../../../ui/Button";
import useGetUserLimits from "../../../hooks/useGetUserLimits";
import SelectedAssetsList from "../AssetSelection/SelectedAssetsList/SelectedAssetsList";

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
  const { addAssetFn } = useAssetMutations();
  const userLimits = useGetUserLimits();

  function determineSelectionTypeToDisplay() {
    if (selectedOption === "existing") {
      return <ExistingAssetsList enablePreview />;
    } else if (selectedOption === "new") {
      return <NewAssetContainer saveOnUpload />;
    }
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
            assetsList.length >= userLimits.media.limit
              ? "disabled"
              : selectedOption === "new"
              ? "primary"
              : "secondary"
          }
          onClick={() => setSelectedOption("new")}
          disabled={assetsList.length >= userLimits.media.limit}
        >
          + Add New Asset
        </Button>
      </StyledTopButtonContainer>
      {determineSelectionTypeToDisplay()}
      {timedAssetsList.length > 0 && (
        <SelectedAssetsList selectedAssets={timedAssetsList} />
      )}
    </StyledMyAssestsSelectionContainer>
  );
}
