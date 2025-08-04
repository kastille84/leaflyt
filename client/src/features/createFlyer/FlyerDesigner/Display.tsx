import styled from "styled-components";
import ConfigurableFlyerBlock from "../../../ui/Flyer/ConfigurableFlyerBlock";
import { useFlyerDesignerContext } from "../../../context/FlyerDesignerContext";

const Canvas = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Display() {
  const { selectedFlyer } = useFlyerDesignerContext();

  return (
    <div>
      <Canvas>
        {selectedFlyer && <ConfigurableFlyerBlock flyer={selectedFlyer} />}
      </Canvas>
    </div>
  );
}
