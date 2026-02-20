import styled from "styled-components";
import FlyerBlockConfigurable from "../../../ui/Flyer/FlyerBlockConfigurable";
import { useFlyerDesignerContext } from "../../../context/FlyerDesignerContext";
import Heading from "../../../ui/Heading";
import {
  HiOutlineChevronDoubleDown,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronDoubleUp,
} from "react-icons/hi2";
import { useState } from "react";

const StyledDisplayContainer = styled.div`
  position: relative;

  padding: 1.2rem;

  @media (max-width: 59em) {
    border: 1px solid var(--color-grey-200);
    background-color: #fff;
    box-shadow: var(--shadow-sm);
    position: absolute;
    top: 0;
    right: -85vw;
    z-index: 1000;
    width: 85vw;
    height: 100%;
    transition: right 0.5s ease-in-out;

    &.open {
      right: 0;
    }
  }
`;

const SlideOpener = styled.div`
  position: absolute;
  top: 85px;
  left: -70px;
  /* font-size: 1.2rem; */
  /* opacity: 0.8; */
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--color-grey-700);
  background-color: var(--color-orange-400);
  padding: 0.8rem 1.6rem;
  cursor: pointer;
  display: none;

  @media (max-width: 59em) {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    border-radius: var(--border-radius-sm);
    left: -70px;
    transform: rotate(90deg);
  }

  @media (max-width: 34em) {
    left: -50px;
  }
`;

const StyledHeadingContainer = styled.div`
  margin-bottom: 2.4rem;
  @media (max-width: 59em) {
    text-align: center;
  }
`;
const Canvas = styled.div`
  width: 100%;
  height: 80dvh;
  /* background-color: var(--color-grey-50); */
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  gap: 2.4rem;
  overflow-y: auto;
`;

export default function Display() {
  const [isOpen, setIsOpen] = useState(true);
  const { selectedFlyer } = useFlyerDesignerContext();

  return (
    <StyledDisplayContainer className={isOpen ? "open" : ""}>
      <SlideOpener onClick={() => setIsOpen(!isOpen)}>
        Preview{" "}
        {isOpen ? <HiOutlineChevronDoubleUp /> : <HiOutlineChevronDoubleDown />}
      </SlideOpener>
      <StyledHeadingContainer>
        <Heading as="h2">Customize Flyer</Heading>
        <p>Click on the section of the flyer to configure it</p>
      </StyledHeadingContainer>
      <Canvas onClick={() => setIsOpen(false)}>
        {selectedFlyer && <FlyerBlockConfigurable flyer={selectedFlyer} />}
      </Canvas>
    </StyledDisplayContainer>
  );
}
