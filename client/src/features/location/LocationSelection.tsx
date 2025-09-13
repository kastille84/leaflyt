import styled from "styled-components";
import { HiOutlineXMark } from "react-icons/hi2";

import { LatLng } from "../../interfaces/Geo";
import Heading from "../../ui/Heading";
import useGetPlacesByCoords from "../../hooks/useGetPlacesByCoords";
import BoardListing from "./BoardListing";
import { useGlobalContext } from "../../context/GlobalContext";
import OverlaySpinner from "../../ui/OverlaySpinner";

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

  & .error {
    color: var(--color-red-700);
    font-weight: 600;
  }
`;

export default function LocationSelection({ coords }: { coords: LatLng }) {
  const { places, error, isGettingPlaces } = useGetPlacesByCoords(coords);
  const { setIsGettingLocation, setCoords, setIsSelectingNewPlace } =
    useGlobalContext();

  if (isGettingPlaces)
    return (
      <OverlaySpinner
        data-testid="location-selection-spinner"
        message="We have your location. Searching for Nearest Community Board"
      />
    );
  return (
    <StyledOverlay>
      <div className="close">
        <HiOutlineXMark
          data-testid="location-selection-close-icon"
          onClick={() => {
            setIsGettingLocation(false);
            setIsSelectingNewPlace(false);
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
        {places && places?.length > 0 && <BoardListing places={places} />}
        {places && places?.length === 0 && !error && (
          <p data-testid="no-boards-found-message">
            Oops! Sorry, there are no boards showing up near you. Try a
            different location.
          </p>
        )}
        {error && (
          <p className="error" data-testid="error-message">
            {error}
          </p>
        )}
      </div>
    </StyledOverlay>
  );
}
