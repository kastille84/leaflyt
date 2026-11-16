import styled from "styled-components";

// One step in a vertical timeline. The number sits on the rail; a line
// connects it to the next step.
const StyledStepSection = styled.li`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1.6rem;
  padding-bottom: 2.4rem;

  &:not(:last-child)::before {
    content: "";
    position: absolute;
    top: 4.4rem;
    bottom: 0.4rem;
    left: 2.1rem;
    width: 0.2rem;
    background-color: var(--color-brand-200);
  }

  &:last-child {
    padding-bottom: 0;
  }
`;

const StyledStepNumber = styled.div`
  flex: 0 0 4.4rem;
  width: 4.4rem;
  height: 4.4rem;
  border-radius: 50%;
  font-family: var(--font-display, inherit);
  font-size: 2.2rem;
  font-weight: 700;
  background-color: var(--color-brand-600);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledStepDescription = styled.div`
  flex: 1;
  min-width: 0;
  padding-top: 0.7rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;
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
