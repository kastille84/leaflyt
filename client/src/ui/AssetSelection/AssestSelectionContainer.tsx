import styled from "styled-components";
import Button from "../Button";
import { useAssetSelectionContext } from "../../context/AssetSelectionContext";
import ExistingAssetsList from "./ExistingAssetsList/ExistingAssetsList";
import SelectedAssetList from "./SelectedAssetsList/SelectedAssetsList";
import NewAssetContainer from "./NewAsset/NewAssetContainer";
import useGetUserLimits from "../../hooks/useGetUserLimits";
import { useGlobalContext } from "../../context/GlobalContext";
import toast from "react-hot-toast";
import useAssetMutations from "../../features/assets/useAssetMutations";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import { useEffect } from "react";
import { set } from "react-hook-form";
import { deleteFileOverTime } from "../../services/cloudinary";

const StyledAssestSelectionContainer = styled.div`
  width: 70%;
  height: 100%;
  margin: auto;
  /* background: red; */
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

export default function AssestSelectionContainer() {
  const { currentFormOptions, setBottomSlideInType, setIsOpenBottomSlideIn } =
    useGlobalContext();
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
    // #TODO: Add logic to save to timed to assets library table
    try {
      if (timedAssetsList.length > 0) {
        await Promise.all(timedAssetsList.map((asset) => addAssetFn(asset)));
      }
    } catch (error) {
      return;
    }
    currentFormOptions.setValue("fileUrlArr", assetsList);
    setBottomSlideInType(null);
    setIsOpenBottomSlideIn(false);
    toast.success("Assets added!");
  }

  async function handleCancel() {
    if (timedAssetsList.length > 0) {
      await deleteAllTimedAssets();
    }
    setBottomSlideInType(null);
    setIsOpenBottomSlideIn(false);
  }

  return (
    <StyledAssestSelectionContainer>
      <StyledTopButtonContainer>
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

      <SelectedAssetList selectedAssets={assetsList} />
      <small>{userLimits.media.limit - assetsList.length} remaining</small>
      <StyledButtonContainer>
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
