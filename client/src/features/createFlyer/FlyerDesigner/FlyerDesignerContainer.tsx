import styled from "styled-components";
import Configuration from "./Configuration";
import Display from "./Display";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useFlyerDesignerContext } from "../../../context/FlyerDesignerContext";
import { useEffect } from "react";

const StyledContainer = styled.div`
  width: 80%;
  height: 100%;
  margin: auto;
  /* background: red; */
  display: grid;
  grid-template-columns: 1fr 35%;
`;

export default function FlyerDesignerContainer() {
  const { flyerDesignOptions } = useGlobalContext();
  const flyerForDisplay = { ...flyerDesignOptions.getValues() };
  const { setSelectedFlyer, selectedFlyer } = useFlyerDesignerContext();

  useEffect(() => {
    if (flyerForDisplay) {
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
