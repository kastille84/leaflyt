import styled from "styled-components";
import WhichTemplate from "./WhichTemplate";
import { useState } from "react";
import { DB_Template } from "../../interfaces/DB_Flyers";
import TemplateDisplay from "./TemplateDisplay";

const StyledTemplateContainer = styled.div`
  width: 70%;
  height: 100%;
  margin: auto;
  /* background: red; */
  display: grid;
  grid-template-columns: 35% 1fr;
`;

export default function TemplateSelectionContainer() {
  const [selectedTemplate, setSelectedTemplate] = useState<DB_Template | null>(
    null
  );

  return (
    <StyledTemplateContainer>
      <WhichTemplate
        setSelectedTemplate={setSelectedTemplate}
        selectedTemplate={selectedTemplate}
      />
      <TemplateDisplay selectedTemplate={selectedTemplate} />
    </StyledTemplateContainer>
  );
}
