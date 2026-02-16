import styled from "styled-components";
import ImageCarousel from "./SubComponents/ImageCarousel";

const StyledFigure = styled.figure`
  width: 100%;
  height: 800px;
  @media (max-height: 59em) {
    height: 100vh;
  }
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
