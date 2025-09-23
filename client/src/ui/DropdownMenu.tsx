import { useState } from "react";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import styled from "styled-components";

const StyledDropdownContainer = styled.div`
  position: relative;
`;
const StyledActionButtonContainer = styled.div`
  cursor: pointer;
`;
const StyledDropdownMenuContainer = styled.div`
  position: absolute;
  top: 30px;
  right: 0px;
  width: 15rem;
  background-color: var(--color-grey-50);
  color: var(--color-grey-900);
  opacity: 1 !important;
  /* border-radius: var(--border-radius-sm); */
  /* padding: 0.8rem 1.2rem; */
`;

const StyledUl = styled.ul`
  list-style: none;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  & li {
    text-align: center;
  }
`;

export default function DropdownMenu(props: any) {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick() {
    setIsOpen((prevVal: boolean) => !prevVal);
  }

  return (
    <StyledDropdownContainer>
      <StyledActionButtonContainer>
        <HiEllipsisHorizontal onClick={handleClick} />
      </StyledActionButtonContainer>
      {isOpen && (
        <StyledDropdownMenuContainer>
          <StyledUl>{props.children}</StyledUl>
        </StyledDropdownMenuContainer>
      )}
    </StyledDropdownContainer>
  );
}
