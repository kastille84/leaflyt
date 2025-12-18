import styled from "styled-components";
import Heading from "./Heading";
import MainNav from "./MainNav";
import { useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineBars3,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";

const StyledSidebar = styled.aside`
  background-color: var(--color-blue-100);
  grid-column: 1/2;
  grid-row: 2/-1;
  border-right: 1px solid var(--color-blue-200);
  padding: 2.4rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.4rem;
  transition: left 0.5s ease-in-out;

  & h2 {
    font-size: 2.4rem;
    color: var(--color-brand-800);
    margin-left: 2.4rem;
  }

  &.open {
    left: 0;
  }

  @media (max-width: 59em) {
    position: absolute;
    top: 0;
    left: -250px;
    z-index: 2;
    width: 250px;
    height: 100vh;
  }

  @media (max-width: 34em) {
    width: 165px;
    left: -165px;
  }
`;

const StyledMenuOpenButton = styled.div`
  display: none;
  background-color: var(--color-orange-400);
  padding: 0.8rem 1.2rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;

  @media (max-width: 59em) {
    display: inline-block;
    position: absolute;
    top: 5px;
    right: -3.5rem;
    z-index: 2;
  }
`;

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StyledSidebar className={isOpen ? "open" : ""}>
      <StyledMenuOpenButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <HiOutlineChevronDoubleLeft />
        ) : (
          <HiOutlineChevronDoubleRight />
        )}
      </StyledMenuOpenButton>
      <Heading as="h2">Leaflit</Heading>
      <MainNav />
    </StyledSidebar>
  );
}
