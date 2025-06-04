import styled from "styled-components";
import Heading from "../ui/Heading";
import Button from "../ui/Button";
import OverlaySpinner from "../ui/OverlaySpinner";
import { useGlobalContext } from "../context/GlobalContext";
import LocationSelection from "../features/Location/LocationSelection";

const StyledHeroSection = styled.section`
  color: var(--color-blue-200);
  height: 100vh;
  display: flex;
  background-image: linear-gradient(
    to right,
    var(--color-blue-600) 5%,
    var(--color-blue-400) 50%
  );

  & h2 {
    color: var(--color-blue-200);
    font-weight: 500;
  }

  & span {
    color: var(--color-brand-500);
    text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
  }
`;

const StyledFigure = styled.figure`
  flex: 1;
  /* background-image: linear-gradient(to right, var(--color-blue-400)); */
  opacity: 0.8;

  & img {
    position: relative;
    display: block;
    z-index: -1;
  }
`;
const StyledHeroArticle = styled.article`
  background-color: var(--color-blue-600);
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  flex: 1;
  row-gap: 3.2rem;
  padding: 4.8rem;
`;

const StyledHeroH1 = styled.h1`
  font-size: 7.8rem;
  font-weight: 600;
  letter-spacing: 0.1rem;
  line-height: 1;
`;

export default function Landing() {
  const { getUserGeo, isGettingLocation, coords } = useGlobalContext();

  return (
    <main>
      <StyledHeroSection>
        <StyledHeroArticle>
          <StyledHeroH1>
            Making Community Boards Fun, Interactive & Useful Again
          </StyledHeroH1>
          <Heading as="h2">
            Spread your Message. <br />
            See what others are Discussing & Doing in your{" "}
            <span>Local Digital Community Board</span>
          </Heading>
          <Button onClick={getUserGeo}>Open This Community Board</Button>
        </StyledHeroArticle>
        <StyledFigure>
          <img
            src={"/images/flyer-hero-2.png"}
            height={"100%"}
            width={"100%"}
            alt=""
          />
        </StyledFigure>
      </StyledHeroSection>
      {isGettingLocation && (
        <OverlaySpinner message="Getting Your Location and Searching for Nearest Community Board" />
      )}
      {coords && <LocationSelection coords={coords} />}
    </main>
  );
}
