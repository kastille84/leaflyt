import { useState } from "react";
import styled from "styled-components";
import Button from "../../ui/Button";
import { HiOutlinePaperAirplane } from "react-icons/hi2";

import { useGlobalContext } from "../../context/GlobalContext";

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
  const { setIsOpenFlyerDrawer, setDrawerAction } = useGlobalContext();

  function handleCreateFlyer() {
    setIsOpenFlyerDrawer(true);
    setDrawerAction("create");
  }
  return (
    <>
      <StyledContainer>
        <div>
          <h1>
            <HiOutlinePaperAirplane />
          </h1>
          <p>There are no flyers at this location.</p>
          <p> Be the first to create one!</p>
          <StyledButtonContainer>
            <Button onClick={handleCreateFlyer} size="large">
              Create Flyer
            </Button>
          </StyledButtonContainer>
        </div>
      </StyledContainer>
    </>
  );
}
