// import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import styled from "styled-components";

const StyledError = styled.small`
  color: var(--color-orange-600);
  letter-spacing: 0.4px;
  font-weight: 700;
`;
export default function FieldInputError({
  message,
}: {
  message: string;
  // | FieldError
  // | Merge<FieldError, FieldErrorsImpl<any>>
  // | undefined;
}) {
  return <StyledError>{message}</StyledError>;
}
