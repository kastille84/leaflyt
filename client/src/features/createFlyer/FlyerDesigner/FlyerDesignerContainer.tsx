import styled from "styled-components";
import Configuration from "./Configuration";
import Display from "./Display";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useFlyerDesignerContext } from "../../../context/FlyerDesignerContext";
import { useEffect } from "react";
import { REGISTERED_FLYER_DESIGN_DEFAULT } from "../../../constants";

const StyledContainer = styled.div`
  width: 80%;
  height: 100%;
  margin: auto;
  /* background: red; */
  display: grid;
  grid-template-columns: 1fr 35%;
  position: relative;
  overflow: hidden;

  @media (max-width: 75em) {
    width: 100%;
  }
  @media (max-width: 59em) {
    width: 100%;
    grid-template-columns: 1fr;
  }
`;

export default function FlyerDesignerContainer() {
  const { currentFormOptions } = useGlobalContext();
  const flyerForDisplay = { ...currentFormOptions.getValues() };
  const { setSelectedFlyer, selectedFlyer } = useFlyerDesignerContext();

  useEffect(() => {
    if (flyerForDisplay) {
      if (!flyerForDisplay.flyerDesign) {
        flyerForDisplay.flyerDesign = REGISTERED_FLYER_DESIGN_DEFAULT;
      }

      setSelectedFlyer(flyerForDisplay);
    }
  }, []);

  return (
    <StyledContainer>
      {selectedFlyer && <Display />}
      {selectedFlyer && <Configuration />}
    </StyledContainer>
  );
}
