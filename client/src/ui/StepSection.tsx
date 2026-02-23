import styled from "styled-components";

const StyledStepSection = styled.div`
  display: flex;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  /* gap: 2.4rem; */
  margin-bottom: 0;
`;

const StyledStepNumber = styled.div`
  font-size: 3.2rem;
  font-weight: 500;
  background-color: var(--color-brand-600);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const StyledStepDescription = styled.div`
  flex: 8;
  padding: 2.4rem;
`;

export default function StepSection({
  number,
  description,
  children,
}: {
  number: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <StyledStepSection>
      <StyledStepNumber>{number}</StyledStepNumber>
      {description && (
        <StyledStepDescription>{description}</StyledStepDescription>
      )}
      {children && <StyledStepDescription>{children}</StyledStepDescription>}
    </StyledStepSection>
  );
}
