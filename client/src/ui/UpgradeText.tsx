import React from "react";
import styled from "styled-components";
import { useGlobalContext } from "../context/GlobalContext";

const StyledUpgradeTextContainer = styled.div``;
const StyledLearnMore = styled.small`
  /* color: var(--color-brand-600) !important; */
  color: var(--color-blue-400) !important;
  font-weight: 600;
  cursor: pointer;
  text-transform: capitalize;
  text-decoration: underline;
`;
export default function UpgradeText({
  text,
  type = "upgrade",
}: {
  text?: string;
  type?: "upgrade" | "signup";
}) {
  const displayText = text || "Upgrade to get more features";

  const { setBottomSlideInType, setIsOpenBottomSlideIn } = useGlobalContext();
  const handleLearnMore = () => {
    setBottomSlideInType(type);
    setIsOpenBottomSlideIn(true);
  };

  return (
    <StyledUpgradeTextContainer>
      <p>
        {displayText}{" "}
        <StyledLearnMore onClick={handleLearnMore}>
          Learn more &gt;
        </StyledLearnMore>
      </p>
    </StyledUpgradeTextContainer>
  );
}
