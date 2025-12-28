import styled from "styled-components";
import Heading from "../../ui/Heading";

const StyledForgotPassword = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const StyledHeadingContainer = styled.div`
  display: flex;
  align-items: start;
  gap: 2.4rem;

  @media (max-width: 59em) {
    justify-content: center;
  }
`;

export default function ForgotPassword() {
  return (
    <StyledForgotPassword>
      <StyledHeadingContainer>
        <Heading as="h2">Forgot Password</Heading>
      </StyledHeadingContainer>
    </StyledForgotPassword>
  );
}
