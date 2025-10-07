import React from "react";
import styled from "styled-components";
import Heading from "../ui/Heading";
import { useGlobalContext } from "../context/GlobalContext";
import useGetUserLimits from "../hooks/useGetUserLimits";
import Button from "../ui/Button";
import TemplateList from "../features/template/myTemplates/TemplateList";

const StyledMyTemplates = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const StyledHeadingContainer = styled.div`
  display: flex;
  align-items: start;
  gap: 2.4rem;
`;

const StyledTemplateTitleContainer = styled.div`
  /* display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center; */
`;

export default function MyTemplates() {
  const { user } = useGlobalContext();
  const userLimits = useGetUserLimits();

  return (
    <StyledMyTemplates>
      <StyledHeadingContainer>
        <StyledTemplateTitleContainer>
          <Heading as="h2">My Templates</Heading>
          <small>
            {user?.templates.length} of {userLimits.templates.limit} templates
            created
          </small>
        </StyledTemplateTitleContainer>
        <Button size="small">Create Template</Button>
      </StyledHeadingContainer>
      <TemplateList />
    </StyledMyTemplates>
  );
}
