import { useState } from "react";
import { HiEllipsisHorizontal, HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";

const StyledDropdownContainer = styled.div`
  position: relative;
`;
const StyledActionButtonContainer = styled.div`
  display: flex;
  align-items: center;
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
  border: 1px solid var(--color-grey-200);
  z-index: 1002;
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
    /* text-align: center; */
    cursor: pointer;
    font-size: 1.4rem;
    /* border: 1px solid var(--color-grey-200); */
  }
  & li:hover {
    /* background-color: var(--color-grey-100); */
    background-color: var(--color-blue-200);
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
        {/* <HiEllipsisHorizontal onClick={handleClick} /> */}
        <HiEllipsisVertical onClick={handleClick} />
      </StyledActionButtonContainer>
      {isOpen && (
        <StyledDropdownMenuContainer onMouseLeave={() => setIsOpen(false)}>
          <StyledUl>{props.children}</StyledUl>
        </StyledDropdownMenuContainer>
      )}
    </StyledDropdownContainer>
  );
}
