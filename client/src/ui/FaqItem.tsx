import { useState } from "react";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi2";
import styled from "styled-components";

const StyledContainer = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  border-radius: var(--border-radius-md);
  padding: 2rem;
  background-color: var(--color-grey-50);
  color: var(--color-blue-500);
  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const StyledQuestionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    color: var(--color-brand-600);
  }
`;
const StyledAnswer = styled.p<{ isOpen: boolean }>`
  color: var(--color-grey-700);
  max-height: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  overflow: hidden;
  transition: max-height 0.5s ease-in;
`;

export default function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <StyledContainer>
      <StyledQuestionContainer onClick={() => setIsOpen(!isOpen)}>
        <h3>{question}</h3>
        <p>{isOpen ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}</p>
      </StyledQuestionContainer>
      <StyledAnswer isOpen={isOpen}>{answer}</StyledAnswer>
    </StyledContainer>
  );
}
