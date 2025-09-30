import styled from "styled-components";
import Button from "../Button";
import { useAssetSelectionContext } from "../../context/AssetSelectionContext";
import ExistingAssetsList from "./ExistingAssetsList/ExistingAssetsList";
import SelectedAssetList from "./SelectedAssetsList/SelectedAssetList";

const StyledAssestSelectionContainer = styled.div`
  width: 70%;
  height: 100%;
  margin: auto;
  /* background: red; */
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 8% 1fr 20% 5%;
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
  const { selectedOption, setSelectedOption, assetsList } =
    useAssetSelectionContext();

  function determineSelectionTypeToDisplay() {
    if (selectedOption === "existing") {
      return <ExistingAssetsList />;
    } else if (selectedOption === "new") {
      return <p>"Add New Asset"</p>;
    }
  }

  return (
    <StyledAssestSelectionContainer>
      <StyledTopButtonContainer>
        <Button
          size="small"
          type="button"
          variation={selectedOption === "existing" ? "primary" : "secondary"}
          onClick={() => setSelectedOption("existing")}
        >
          Select From Existing
        </Button>
        |
        <Button
          size="small"
          type="button"
          variation={selectedOption === "new" ? "primary" : "secondary"}
          onClick={() => setSelectedOption("new")}
        >
          Add New Asset
        </Button>
      </StyledTopButtonContainer>
      <div>{determineSelectionTypeToDisplay()}</div>

      <SelectedAssetList selectedAssets={assetsList} />

      <StyledButtonContainer>
        <Button size="small" type="button">
          Done
        </Button>
        <Button size="small" type="button" variation="secondary">
          Cancel
        </Button>
      </StyledButtonContainer>
    </StyledAssestSelectionContainer>
  );
}
