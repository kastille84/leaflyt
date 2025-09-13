import styled from "styled-components";
import Button from "../../ui/Button";
import { HiOutlinePaperAirplane } from "react-icons/hi2";

import { useGlobalContext } from "../../context/GlobalContext";
import CreateFlyer from "../createFlyer/CreateFlyer";
import CreateFlyerButton from "../../ui/Flyer/CreateFlyerButton";

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;

  & svg {
    color: var(--color-brand-600);
  }
`;
const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  text-align: center;
`;
export default function NoFlyers() {
  return (
    <>
      <StyledContainer data-testid="no-flyers-container">
        <div>
          <h1>
            <HiOutlinePaperAirplane />
          </h1>
          <p>There are no flyers at this location.</p>
          <p> Be the first to create one!</p>
          <StyledButtonContainer>
            <CreateFlyerButton size="large" />
          </StyledButtonContainer>
        </div>
      </StyledContainer>
    </>
  );
}
