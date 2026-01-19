import styled from "styled-components";
import Heading from "../ui/Heading";
import { AssetSelectionContextProvider } from "../context/AssetSelectionContext";
import MyAssestsSelectionContainer from "../features/assets/MyAssets/MyAssetsSelectionContainer";
import useGetUserLimits from "../hooks/useGetUserLimits";
import UpgradeText from "../ui/UpgradeText";
import { useGlobalContext } from "../context/GlobalContext";
import LimitExceededWarning from "../ui/LimitExceededWarning";

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

  @media (max-width: 59em) {
    justify-content: center;
  }
`;

const StyledAssetsTitleContainer = styled.div``;

export default function MyAssets() {
  const { canUpgrade, maxAssets } = useGetUserLimits();
  const { user } = useGlobalContext();
  return (
    <StyledMyAssets>
      {maxAssets <= (user?.assets?.length || 0) && (
        <LimitExceededWarning text="You have exceeded your assets limit. Please remove some assets or upgrade your plan." />
      )}
      <StyledHeadingContainer>
        <StyledAssetsTitleContainer>
          <Heading as="h2">Assets</Heading>
          <small>Manage Your Assets</small>
          <small>
            {canUpgrade && (
              <UpgradeText
                text="Need more assets?"
                type="upgrade"
                btnText="Upgrade"
              ></UpgradeText>
            )}
          </small>
        </StyledAssetsTitleContainer>
      </StyledHeadingContainer>
      <AssetSelectionContextProvider>
        <MyAssestsSelectionContainer />
      </AssetSelectionContextProvider>
    </StyledMyAssets>
  );
}
