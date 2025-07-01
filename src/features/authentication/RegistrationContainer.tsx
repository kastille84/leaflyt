import styled from "styled-components";
import WhyRegister from "./WhyRegister";

const StyledRegistrationContainer = styled.div`
  width: 70%;
  margin: auto;
  background: red;
  display: grid;
  grid-template-columns: 35% 1fr;
`;

export default function RegistrationContainer() {
  return (
    <StyledRegistrationContainer>
      <WhyRegister />
      <div>form</div>
    </StyledRegistrationContainer>
  );
}
