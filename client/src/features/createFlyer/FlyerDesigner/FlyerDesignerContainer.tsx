import styled from "styled-components";
import Configuration from "./Configuration";
import Display from "./Display";

const StyledContainer = styled.div`
  width: 80%;
  height: 100%;
  margin: auto;
  /* background: red; */
  display: grid;
  grid-template-columns: 1fr 35%;
`;

export default function FlyerDesignerContainer() {
  return (
    <StyledContainer>
      <Display />
      <Configuration />
    </StyledContainer>
  );
}
