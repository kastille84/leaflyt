import styled from "styled-components";
import Heading from "../../ui/Heading";
import TemplateList from "./TemplateList";
import { DB_Template } from "../../interfaces/DB_Flyers";

const StyledWhichTemplateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding: 2.4rem;
  /* border: 1px solid var(--color-grey-100); */
  background-color: var(--color-brand-100);
`;

const StyledTopHeading = styled(Heading)`
  color: var(--color-brand-600);
`;
const StyledText = styled.p`
  font-size: 1.6rem;
  line-height: 1.4;
`;

const StyledScratchOption = styled.p`
  text-align: center;
  text-transform: capitalize;
  padding: 1.2rem;
  border: 1px solid var(--color-grey-200);
  border-radius: 5px;
  box-shadow: var(--shadow-lg);
  border-top: 2px solid var(--color-orange-700);
  /* border-radius: var(--border-radius-md); */
  background-color: var(--color-grey-50);
  cursor: pointer;

  &:hover,
  & .selected {
    background-color: var(--color-grey-100);
    border: 2px solid var(--color-orange-700);
  }
`;

export default function WhichTemplate({
  setSelectedTemplate,
}: {
  setSelectedTemplate: React.Dispatch<React.SetStateAction<DB_Template | null>>;
}) {
  return (
    <StyledWhichTemplateContainer>
      <div>
        <StyledTopHeading as="h2">
          Select a Template for Quick Posting
        </StyledTopHeading>
        <StyledText>Don't create a flyer from scratch.</StyledText>
        <StyledText>Select one of your templates to post quickly:</StyledText>
      </div>
      <TemplateList setSelectedTemplate={setSelectedTemplate} />
      <div>
        <StyledScratchOption onClick={() => setSelectedTemplate(null)}>
          Or Create From Scratch
        </StyledScratchOption>
      </div>
    </StyledWhichTemplateContainer>
  );
}
