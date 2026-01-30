import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { HiOutlinePaperAirplane } from "react-icons/hi2";

import { useGlobalContext } from "../../context/GlobalContext";
import CreateFlyerButton from "../../ui/Flyer/CreateFlyerButton";
import useGetUserLimits from "../../hooks/useGetUserLimits";
import LimitExceededWarning from "../../ui/LimitExceededWarning";
import UpgradeText from "../../ui/UpgradeText";
import { useEffect } from "react";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;

  & svg {
    color: var(--color-brand-600);
  }
`;

const StyledWarningContainer = styled.div`
  /* display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; */

  width: 100%;
  text-align: left;
`;
const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  text-align: center;
`;
export default function NoFlyers() {
  const { setSelectedPlace } = useGlobalContext();
  // // get url query parameters
  const planLimits = useGetUserLimits();
  const [searchParams] = useSearchParams();
  const ptVal = searchParams.get("pt");

  function determineIfCanPost() {
    // if they're trying to do remotePosting, check if allowed
    if (ptVal === "r") {
      return planLimits.remotePosting.isAllowed;
    } else {
      return planLimits.onLocationPosting.isAllowed;
    }
  }

  useEffect(() => {
    return () => {
      if (!determineIfCanPost()) {
        setSelectedPlace(null);
      }
    };
  }, []);
  return (
    <>
      <StyledContainer data-testid="no-flyers-container">
        {!determineIfCanPost() && (
          <StyledWarningContainer>
            <LimitExceededWarning
              // text={`You've reached your limit for posting flyers remotely. You can still post flyers on location.`}
              isClosable={false}
            >
              <p>
                You've reached your limit for posting flyers remotely (from My
                Area). <br />
                You can still post flyers on location. <br />
                Click on "Find Boards Near You"
              </p>
            </LimitExceededWarning>
            <UpgradeText
              text="Want to post more flyers remotely?"
              type="upgrade"
              btnText="Upgrade"
            ></UpgradeText>
          </StyledWarningContainer>
        )}
        <div>
          <h1>
            <HiOutlinePaperAirplane />
          </h1>
          <p>There are no flyers at this location.</p>
          <p> Be the first to create one!</p>
          <StyledButtonContainer>
            <CreateFlyerButton size="large" disabled={!determineIfCanPost()} />
          </StyledButtonContainer>
        </div>
      </StyledContainer>
    </>
  );
}
