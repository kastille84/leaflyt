import React from "react";
import styled from "styled-components";
import Heading from "../ui/Heading";
import SavedFlyersList from "../features/saved_flyers/SavedFlyersList";

const StyledSavedFlyers = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const StyledHeadingContainer = styled.div`
  display: flex;
  align-items: start;
  gap: 2.4rem;
  /* @media (max-width: 59em) {
    justify-content: center;
  } */
`;

const StyledTemplateTitleContainer = styled.div``;

export default function SavedFlyers() {
  return (
    <StyledSavedFlyers>
      <StyledHeadingContainer>
        <StyledTemplateTitleContainer>
          <Heading as="h2">Saved Flyers</Heading>
          <small>Redeem deals / view your saved flyers</small>
        </StyledTemplateTitleContainer>
      </StyledHeadingContainer>
      <SavedFlyersList />
    </StyledSavedFlyers>
  );
}
