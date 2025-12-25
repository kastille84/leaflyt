import styled from "styled-components";
import Heading from "./Heading";
import { HiOutlineExclamationCircle, HiOutlineXMark } from "react-icons/hi2";

const StyledInfoAlertContainer = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
  background-color: var(--color-orange-200);
  padding: 1.2rem 1.6rem;
  margin-bottom: 1.4rem;

  & h4 {
    color: var(--color-orange-600);
    display: flex;
    align-items: center;
    gap: 0.8rem;
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
}: {
  type?: "info" | "warning" | "error";
  text: string;
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
    <StyledInfoAlertContainer>
      <Heading as={"h4"}>
        <span>{determineIcon()}</span>
        <span>{type}</span>
      </Heading>
      <div>
        <p>{text}</p>
      </div>
    </StyledInfoAlertContainer>
  );
}
