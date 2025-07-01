import styled from "styled-components";

const StyledFormControlRow = styled.div`
  display: flex;
  gap: 2.4rem;

  /* & label {
    font-weight: 600;
    color: var(--color-brand-600);
  } */

  & .quill:not(.error) .ql-toolbar,
  & .quill:not(.error) .ql-container {
    border: 1px solid var(--color-brand-500);
  }
  & .quill.error .ql-container,
  & .quill.error .ql-toolbar {
    border: 1px solid var(--color-orange-600);
  }
  & .ql-container {
    min-height: 150px;
    height: auto;
    border-bottom-left-radius: var(--border-radius-sm);
    border-bottom-right-radius: var(--border-radius-sm);
  }
  & .ql-editor {
    font-size: 1.6rem;
    color: var(--color-grey-600);
  }

  & .ql-toolbar {
    border-top-left-radius: var(--border-radius-sm);
    border-top-right-radius: var(--border-radius-sm);
  }
`;

export default function FormControlRow({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StyledFormControlRow>{children}</StyledFormControlRow>;
}
