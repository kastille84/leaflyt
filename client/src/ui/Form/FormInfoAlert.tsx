import styled from "styled-components";
import Heading from "../Heading";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import UpgradeText from "../UpgradeText";

const StyledInfoAlertContainer = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
  background-color: var(--color-orange-200);
  padding: 1.6rem 2.4rem;

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

export default function FormInfoAlert({
  planName,
  text,
  supportText,
}: {
  planName?: string;
  text: string;
  supportText: string;
}) {
  return (
    <StyledInfoAlertContainer>
      <Heading as={"h4"}>
        <span>
          <HiOutlineExclamationCircle />
        </span>
        <span>{planName ? `${planName} plan` : "Limited features"}</span>
      </Heading>
      <div>
        <p>{text}</p>
        <UpgradeText
          text={supportText}
          type={planName ? "upgrade" : "signup"}
        />
      </div>
    </StyledInfoAlertContainer>
  );
}
