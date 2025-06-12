import styled from "styled-components";

const StyledFormControlRow = styled.div`
  display: flex;
  gap: 2.4rem;

  & label {
    font-weight: 600;
    color: var(--color-brand-600);
  }

  & .ql-toolbar,
  & .ql-container {
    border: 1px solid var(--color-brand-500);
  }
  & .ql-container {
    min-height: 150px;
    height: auto;
  }
  & .ql-editor {
    font-size: 1.6rem;
    color: var(--color-grey-600);
  }
`;

export default function FormControlRow({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StyledFormControlRow>{children}</StyledFormControlRow>;
}
