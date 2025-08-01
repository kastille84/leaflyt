import styled from "styled-components";
import Heading from "../../../ui/Heading";
import BoardFlyerBlock from "../../../ui/Flyer/BoardFlyerBlock";

const Canvas = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--color-grey-50);
`;

export default function Display() {
  return (
    <div>
      <Heading as="h2">Display</Heading>
      <Canvas>{/* <BoardFlyerBlock /> */}</Canvas>
    </div>
  );
}
