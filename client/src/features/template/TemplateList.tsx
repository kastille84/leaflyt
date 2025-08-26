import styled from "styled-components";
import { useGlobalContext } from "../../context/GlobalContext";
import { DB_Template } from "../../interfaces/DB_Flyers";

const StyledTemplateListContainer = styled.ul`
  display: flex;
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
  border-top: 2px solid var(--color-brand-600);
  /* border-radius: var(--border-radius-md); */
  background-color: var(--color-grey-50);
  cursor: pointer;

  &:hover,
  & .selected {
    background-color: var(--color-grey-100);
    border: 2px solid var(--color-brand-600);
  }
`;

export default function TemplateList({
  setSelectedTemplate,
}: {
  setSelectedTemplate: React.Dispatch<React.SetStateAction<DB_Template | null>>;
}) {
  const { user } = useGlobalContext();
  const { templates } = user!;

  return (
    <StyledTemplateListContainer>
      {templates.map((template: DB_Template) => (
        <StyledListItem
          key={template.id}
          onClick={() => setSelectedTemplate(template)}
        >
          {template.templateName}
        </StyledListItem>
      ))}
    </StyledTemplateListContainer>
  );
}
