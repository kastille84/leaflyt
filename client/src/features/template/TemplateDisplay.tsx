import styled from "styled-components";
import { DB_Template } from "../../interfaces/DB_Flyers";
import FlyerBlockStatic from "../../ui/Flyer/FlyerBlockStatic";
import { useEffect } from "react";

const StyledDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--color-brand-100);
  padding: 2.4rem 0 2.4rem 2.4rem;
  height: 100%;
  overflow-y: auto;
`;

export default function TemplateDisplay({
  selectedTemplate,
}: {
  selectedTemplate: DB_Template | null;
}) {
  useEffect(() => {
    console.log("selectedTemplate: ", selectedTemplate?.flyerDesign);
  }, [selectedTemplate]);

  return (
    <StyledDisplayContainer>
      {!selectedTemplate && <p>Select a template to display.</p>}
      {selectedTemplate && <FlyerBlockStatic flyer={selectedTemplate} />}
    </StyledDisplayContainer>
  );
}
