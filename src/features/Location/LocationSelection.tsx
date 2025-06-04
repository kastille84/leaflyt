import styled from "styled-components";
import { HiOutlineXMark } from "react-icons/hi2";

import { LatLng } from "../../interfaces";
import Heading from "../../ui/Heading";
import useGetPlacesByCoords from "../../hooks/useGetPlacesByCoords";
import Spinner from "../../ui/Spinner";
import BoardListing from "./BoardListing";
import { useGlobalContext } from "../../context/GlobalContext";

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background-color: rgba(233, 250, 233, 0.925);
  display: flex;
  justify-content: center;
  align-items: center;

  & .overlay-content {
    width: 80%;
    margin: auto;
  }

  & .location-coords {
    font-size: 1.2rem;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 1.6rem;
  }
  & .location-coords span {
    color: var(--color-brand-700);
    text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
  }

  & h2 {
    margin-bottom: 1.6rem;
  }

  & .close {
    position: absolute;
    top: 2.4rem;
    right: 2.4rem;
    font-size: 3rem;
    color: var(--color-brand-700);
    font-weight: 700;
    cursor: pointer;
  }
`;

export default function LocationSelection({ coords }: { coords: LatLng }) {
  const { places, error, isGettingPlaces } = useGetPlacesByCoords(coords);
  const { setIsGettingLocation, setCoords } = useGlobalContext();

  if (isGettingPlaces)
    return <Spinner data-testid="location-selection-spinner" />;
  return (
    <StyledOverlay>
      <div className="close">
        <HiOutlineXMark
          onClick={() => {
            setIsGettingLocation(false);
            setCoords(null);
          }}
        />
      </div>
      <div className="overlay-content">
        <Heading as="h1">Select a Community Board</Heading>
        <p className="location-coords">
          Your Location: &nbsp;
          <span>
            {coords.latitude} | {coords.longitude}
          </span>
        </p>
        <Heading as="h2">
          Based on your location, we found the following boards at:
        </Heading>
        {places && <BoardListing places={places} />}
        {/* {!places && <p>There are no places here</p>} */}
        {error && <p>{error}</p>}
      </div>
    </StyledOverlay>
  );
}
