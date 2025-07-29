import React from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import styled from "styled-components";
import Heading from "../Heading";
import { useGlobalContext } from "../../context/GlobalContext";

const StyledFlyerFormContainer = styled.div`
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  position: relative;

  & h2 span {
    text-transform: capitalize;
  }

  & svg {
    color: var(--color-brand-600);
    font-size: 2.4rem;
    cursor: pointer;
  }
  & svg:hover {
    color: var(--color-red-600);
  }
`;

const StyledTopSection = styled.div`
  background-color: var(--color-blue-200);
  /* background-color: var(--color-grey-50); */
  color: var(--color-grey-600);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem 2.4rem;
`;

const StyledChildrenSection = styled.div`
  background-color: var(--color-grey-50);
  flex-grow: 1;
`;

export default function FlyerFormContainer({
  name,
  action,
  children,
}: {
  name: string;
  action: string;
  children: React.ReactNode;
}) {
  const { setShowCloseSlideInModal } = useGlobalContext();
  function handleClose() {
    setShowCloseSlideInModal(true);
  }

  return (
    <StyledFlyerFormContainer>
      <StyledTopSection>
        <Heading as="h2">
          <span>{action}</span> Flyer @ {name}
        </Heading>
        <HiOutlineXMark onClick={handleClose} />
      </StyledTopSection>
      <StyledChildrenSection>{children}</StyledChildrenSection>
    </StyledFlyerFormContainer>
  );
}
