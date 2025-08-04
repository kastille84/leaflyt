import styled from "styled-components";
import ConfigurableFlyerBlock from "../../../ui/Flyer/ConfigurableFlyerBlock";
import { useFlyerDesignerContext } from "../../../context/FlyerDesignerContext";
import Heading from "../../../ui/Heading";

const StyledHeadingContainer = styled.div`
  margin-bottom: 2.4rem;
`;
const Canvas = styled.div`
  width: 100%;
  height: 80vh;
  /* background-color: var(--color-grey-50); */
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  gap: 2.4rem;
  overflow-y: auto;
`;

export default function Display() {
  const { selectedFlyer } = useFlyerDesignerContext();

  return (
    <div>
      <StyledHeadingContainer>
        <Heading as="h2">Customize Flyer</Heading>
        <p>Click on the section of the flyer to configure it</p>
      </StyledHeadingContainer>
      <Canvas>
        {selectedFlyer && <ConfigurableFlyerBlock flyer={selectedFlyer} />}
      </Canvas>
    </div>
  );
}
