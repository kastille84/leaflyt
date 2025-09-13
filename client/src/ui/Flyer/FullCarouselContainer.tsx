import styled from "styled-components";
import ImageCarousel from "./SubComponents/ImageCarousel";

const StyledFigure = styled.figure`
  width: 100%;
  height: 800px;
`;

export default function FullCarouselContainer() {
  return (
    <div>
      <StyledFigure>
        <ImageCarousel />
      </StyledFigure>
    </div>
  );
}
