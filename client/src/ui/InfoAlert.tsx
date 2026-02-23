import styled from "styled-components";
import Heading from "./Heading";
import { HiOutlineExclamationCircle, HiOutlineXMark } from "react-icons/hi2";

const StyledInfoAlertContainer = styled.div<{ type: string }>`
  display: flex;
  gap: 2.4rem;
  align-items: center;
  /* background-color: var(--color-orange-200); */
  background-color: ${({ type }) =>
    ["warning", "error"].includes(type)
      ? "var(--color-orange-200)"
      : "var(--color-blue-100)"};
  padding: 1.2rem 1.6rem;
  margin-bottom: 1.4rem;

  & h4 {
    color: ${({ type }) =>
      ["warning", "error"].includes(type)
        ? "var(--color-orange-600)"
        : "var(--color-blue-400)"};
    display: flex;
    align-items: center;
    gap: 0.8rem;

    & span {
      display: flex;
      align-items: center;
    }
  }

  & p {
    font-size: 1.4rem;
    letter-spacing: 0.4px;
  }
  & .learn-more {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  & .learn-more,
  & .learn-more svg {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-orange-600);
  }
`;

export default function InfoAlert({
  type = "info",
  text,
  children,
}: {
  type?: "info" | "warning" | "error";
  text?: string;
  children?: React.ReactNode;
}) {
  const determineIcon = () => {
    switch (type) {
      case "info":
      case "warning":
        return <HiOutlineExclamationCircle />;
      case "error":
        return <HiOutlineXMark />;
      default:
        return <HiOutlineExclamationCircle />;
    }
  };

  return (
    <StyledInfoAlertContainer type={type}>
      <Heading as={"h4"}>
        <span>{determineIcon()}</span>
        <span style={{ textTransform: "capitalize" }}>{type}</span>
      </Heading>
      <div>
        {text && <p>{text}</p>}
        {children && children}
      </div>
    </StyledInfoAlertContainer>
  );
}
