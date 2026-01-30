import { useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import styled from "styled-components";

const StyledLimitExceededWarning = styled.div`
  background-color: var(--color-red-500);
  color: var(--color-grey-700);
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
export default function LimitExceededWarning({
  text = "",
  isClosable = true,
  children,
}: {
  text?: string;
  isClosable?: boolean;
  children?: React.ReactNode;
}) {
  const [showContent, setShowContent] = useState(true);

  function handleClick() {
    setShowContent(!showContent);
  }

  if (!showContent) return null;
  return (
    <StyledLimitExceededWarning>
      {children ? children : <p>{text}</p>}{" "}
      {isClosable && <HiOutlineXMark onClick={handleClick} />}
    </StyledLimitExceededWarning>
  );
}
