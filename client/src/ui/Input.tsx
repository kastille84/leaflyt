import styled from "styled-components";

const StyledInput = styled.input<InputProps>`
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  ${(props) =>
    props.hasError
      ? "border: 1px solid var(--color-orange-600);"
      : "border: 1px solid var(--color-brand-500);"}
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}
export default function Input({ hasError, ...props }: InputProps) {
  return <StyledInput {...{ hasError, ...props }} />;
}
