import styled, { css } from "styled-components";

const StyledForm = styled.form`
  position: relative;
  margin-bottom: 4.8rem;

  & h4 {
    color: var(--color-brand-600);
  }
`;
export default function Form({
  children,
  onSubmit,
  marginBottom,
}: {
  children: React.ReactNode;
  onSubmit?: () => void;
  marginBottom?: string;
}) {
  return <StyledForm onSubmit={onSubmit}>{children}</StyledForm>;
}
