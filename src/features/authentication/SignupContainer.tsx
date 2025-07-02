import styled from "styled-components";
import WhyRegister from "./WhyRegister";
import SignupForm from "./SignupForm";

const StyledRegistrationContainer = styled.div`
  width: 70%;
  margin: auto;
  /* background: red; */
  display: grid;
  grid-template-columns: 35% 1fr;
`;

export default function SignupContainer() {
  return (
    <StyledRegistrationContainer>
      <WhyRegister />
      <SignupForm />
    </StyledRegistrationContainer>
  );
}
