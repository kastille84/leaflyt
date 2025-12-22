import styled from "styled-components";
import Button from "../../../ui/Button";
import ExistingAssetsList from "./ExistingAssetsList/ExistingAssetsList";
import SelectedAssetList from "./SelectedAssetsList/SelectedAssetsList";
import NewAssetContainer from "./NewAsset/NewAssetContainer";
import { useAssetSelectionContext } from "../../../context/AssetSelectionContext";
import useGetUserLimits from "../../../hooks/useGetUserLimits";
import { useGlobalContext } from "../../../context/GlobalContext";
import useAssetMutations from "../useAssetMutations";
import useGetUserProfileById from "../../../hooks/useGetUserProfileById";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { deleteFileOverTime } from "../../../services/cloudinary";

const StyledAssestSelectionContainer = styled.div`
  width: 70%;
  height: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 8% 1fr 20% 5%;
  grid-gap: 2.4rem;

  @media (max-width: 59em) {
    width: 100%;
    padding: 0 2.4rem;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    align-items: space-between;
  }
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

export default function AssestSelectionContainer() {
  const {
    currentFormOptions,
    setBottomSlideInType,
    setIsOpenBottomSlideIn,
    user,
  } = useGlobalContext();
  const {
    selectedOption,
    setSelectedOption,
    assetsList,
    setAssetsList,
    timedAssetsList,
  } = useAssetSelectionContext();
  const { addAssetFn } = useAssetMutations();

  const userLimits = useGetUserLimits();

  // will get userProfile and set to user after asset is added
  useGetUserProfileById(true);

  useEffect(() => {
    const assetsFromForm = currentFormOptions.getValues("fileUrlArr");
    if (assetsFromForm) {
      setAssetsList(assetsFromForm);
    }
  }, []);

  async function deleteAllTimedAssets() {
    await Promise.all(
      timedAssetsList.map((asset) => deleteFileOverTime(asset))
    );
  }

  function determineSelectionTypeToDisplay() {
    if (selectedOption === "existing") {
      return <ExistingAssetsList />;
    } else if (selectedOption === "new") {
      return <NewAssetContainer />;
    }
  }

  async function handleDone() {
    try {
      if (timedAssetsList.length > 0) {
        await Promise.all(timedAssetsList.map((asset) => addAssetFn(asset)));
      }
    } catch (error) {
      toast.error("Error adding assets. Please try again.");
      return;
    }
    currentFormOptions.setValue("fileUrlArr", assetsList);
    setBottomSlideInType(null);
    setIsOpenBottomSlideIn(false);
    if (timedAssetsList.length > 0) {
      toast.success("Assets added!");
    }
  }

  async function handleCancel() {
    if (timedAssetsList.length > 0) {
      await deleteAllTimedAssets();
    }
    setBottomSlideInType(null);
    setIsOpenBottomSlideIn(false);
  }

  return (
    <StyledAssestSelectionContainer data-testid="assets-selection-container">
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
          Select From Existing
        </Button>
        |
        <Button
          size="small"
          type="button"
          variation={
            assetsList.length >= userLimits.media.limit ||
            timedAssetsList.length + (user?.assets?.length || 0) >=
              userLimits.maxAssets
              ? "disabled"
              : selectedOption === "new"
              ? "primary"
              : "secondary"
          }
          onClick={() => setSelectedOption("new")}
          disabled={
            assetsList.length >= userLimits.media.limit ||
            timedAssetsList.length + (user?.assets?.length || 0) >=
              userLimits.maxAssets
          }
        >
          + Add New Asset
        </Button>
      </StyledTopButtonContainer>

      {determineSelectionTypeToDisplay()}

      <SelectedAssetList selectedAssets={assetsList} />
      <small>
        {userLimits.media.limit - assetsList.length} remaining per flyer
      </small>

      <StyledButtonContainer data-testid="assets-buttons-container">
        <Button size="small" type="button" onClick={handleDone}>
          Done
        </Button>
        <Button
          size="small"
          type="button"
          variation="secondary"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </StyledButtonContainer>
    </StyledAssestSelectionContainer>
  );
}
