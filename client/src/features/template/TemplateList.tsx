import styled from "styled-components";
import { useGlobalContext } from "../../context/GlobalContext";
import { DB_Template } from "../../interfaces/DB_Flyers";

const StyledTemplateListContainer = styled.ul`
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  gap: 2.4rem;
`;

const StyledListItem = styled.li`
  text-align: center;
  text-transform: capitalize;
  padding: 1.2rem;
  border: 1px solid var(--color-grey-200);
  border-radius: 5px;
  box-shadow: var(--shadow-lg);
  border-top: 3px solid var(--color-blue-600);
  /* border-radius: var(--border-radius-md); */
  background-color: var(--color-grey-50);
  cursor: pointer;

  &:hover,
  &.selected {
    background-color: var(--color-grey-100);
    border: 3px solid var(--color-brand-600);
  }
`;

export default function TemplateList({
  setSelectedTemplate,
  selectedTemplate,
}: {
  setSelectedTemplate: React.Dispatch<React.SetStateAction<DB_Template | null>>;
  selectedTemplate: DB_Template | null;
}) {
  const { user } = useGlobalContext();
  const { templates } = user!;

  return (
    <StyledTemplateListContainer data-testid="template-list-container">
      {templates.map((template: DB_Template) => (
        <StyledListItem
          key={template.id}
          onClick={() => {
            setSelectedTemplate((prev) => template);
          }}
          className={template.id === selectedTemplate?.id ? "selected" : ""}
        >
          {template.templateName}
        </StyledListItem>
      ))}
    </StyledTemplateListContainer>
  );
}
