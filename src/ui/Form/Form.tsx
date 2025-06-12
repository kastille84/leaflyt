import styled from "styled-components";

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
}: {
  children: React.ReactNode;
  onSubmit?: () => void;
}) {
  return <StyledForm onSubmit={onSubmit}>{children}</StyledForm>;
}
