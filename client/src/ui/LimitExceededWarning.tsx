import styled from "styled-components";

const StyledLimitExceededWarning = styled.div`
  background-color: var(--color-red-600);
  color: #fff;
  padding: 0.5rem;
  font-size: 1.6rem;
`;
export default function LimitExceededWarning({ text }: { text: string }) {
  return (
    <StyledLimitExceededWarning>
      <p>{text}</p>
    </StyledLimitExceededWarning>
  );
}
