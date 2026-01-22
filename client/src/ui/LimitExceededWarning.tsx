import { useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import styled from "styled-components";

const StyledLimitExceededWarning = styled.div`
  background-color: var(--color-red-500);
  color: #fff;
  padding: 0.5rem;
  font-size: 1.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & svg {
    cursor: pointer;
    font-size: 1.8rem;
    margin-right: 1.4rem;
  }
`;
export default function LimitExceededWarning({ text }: { text: string }) {
  const [showContent, setShowContent] = useState(true);

  function handleClick() {
    setShowContent(!showContent);
  }

  if (!showContent) return null;
  return (
    <StyledLimitExceededWarning>
      <p>{text}</p> <HiOutlineXMark onClick={handleClick} />
    </StyledLimitExceededWarning>
  );
}
