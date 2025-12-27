import { useState } from "react";
import styled from "styled-components";
import Heading from "../ui/Heading";
import AccountInfo from "../features/account/AccountInfo";

const StyledMyAccountPage = styled.div`
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const StyledHeadingContainer = styled.div`
  display: flex;
  align-items: start;
  gap: 2.4rem;

  @media (max-width: 59em) {
    justify-content: center;
  }
`;

const StyledActionPillsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
`;

const Pill = styled.div<{ active?: boolean }>`
  padding: 0.4rem 0.8rem;
  border-radius: 1.2rem;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--color-brand-600);
  border: 1px solid var(--color-brand-600);

  ${(props) =>
    props.active &&
    `
    background-color: var(--color-brand-600);
    color: var(--color-grey-50);
  `}
`;

const StyledTitleContainer = styled.div``;

export default function MyAccount() {
  const [activeTab, setActiveTab] = useState<"account" | "plan" | "billing">(
    "account"
  );

  return (
    <StyledMyAccountPage>
      <StyledHeadingContainer>
        <StyledTitleContainer>
          <Heading as="h2">Account</Heading>
        </StyledTitleContainer>
        <StyledActionPillsContainer>
          <Pill
            active={activeTab === "account"}
            onClick={() => setActiveTab("account")}
          >
            Account
          </Pill>
          <Pill
            active={activeTab === "plan"}
            onClick={() => setActiveTab("plan")}
          >
            Plan
          </Pill>
          <Pill
            active={activeTab === "billing"}
            onClick={() => setActiveTab("billing")}
          >
            Billing
          </Pill>
        </StyledActionPillsContainer>
      </StyledHeadingContainer>
      <div>
        {activeTab === "account" && <AccountInfo />}
        {activeTab === "plan" && (
          <p style={{ textAlign: "center" }}>Plan Coming Soon.</p>
        )}
        {activeTab === "billing" && (
          <p style={{ textAlign: "center" }}>Billing Coming Soon.</p>
        )}
      </div>
    </StyledMyAccountPage>
  );
}
