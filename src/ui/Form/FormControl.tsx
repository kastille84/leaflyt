import styled from "styled-components";

const StyledFormControl = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.4rem;
  flex: 1;

  & small {
    color: var(--color-orange-600);
    letter-spacing: 0.4px;
  }
  & .attestation {
    display: flex;
    align-items: center;
    gap: 2.4rem;
  }
  & input[type="checkbox"] {
    width: 1.8rem;
    height: 1.8rem;
    accent-color: var(--color-brand-500);
  }
`;

export default function FormControl({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <StyledFormControl className={className}>{children}</StyledFormControl>
  );
}
