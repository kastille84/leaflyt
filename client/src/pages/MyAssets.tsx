import styled from "styled-components";
import Heading from "../ui/Heading";
import { AssetSelectionContextProvider } from "../context/AssetSelectionContext";
import MyAssestsSelectionContainer from "../features/assets/MyAssets/MyAssetsSelectionContainer";

const StyledMyAssets = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const StyledHeadingContainer = styled.div`
  display: flex;
  align-items: start;
  gap: 2.4rem;
`;

const StyledAssetsTitleContainer = styled.div``;

export default function MyAssets() {
  return (
    <StyledMyAssets>
      <StyledHeadingContainer>
        <StyledAssetsTitleContainer>
          <Heading as="h2">My Assets</Heading>
          <small>Manage Your Assets</small>
        </StyledAssetsTitleContainer>
      </StyledHeadingContainer>
      <AssetSelectionContextProvider>
        <MyAssestsSelectionContainer />
      </AssetSelectionContextProvider>
    </StyledMyAssets>
  );
}
