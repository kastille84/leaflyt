import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useCallback, useState } from "react";
import { DB_Flyer_Create } from "../../interfaces/DB_Flyers";
import Heading from "../../ui/Heading";
import styled from "styled-components";

const StyledContainer = styled.div`
  &.infowindow {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    background-color: var(--color-grey-50);
  }
`;

export default function MarkerWithInfoWindow({
  position,
  flyer,
}: {
  position: { lat: number; lng: number };
  flyer: DB_Flyer_Create;
}) {
  // `markerRef` and `marker` are needed to establish the connection between
  // the marker and infowindow (if you're using the Marker component, you
  // can use the `useMarkerRef` hook instead).
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [infoWindowShown, setInfoWindowShown] = useState(false);

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown: boolean) => !isShown),
    []
  );

  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  return (
    <StyledContainer>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={handleMarkerClick}
      />

      {infoWindowShown && (
        <InfoWindow
          anchor={marker}
          onClose={handleClose}
          shouldFocus
          className="infowindow"
        >
          <Heading as={"h3"}>{flyer.title}</Heading>
          <p>Go to Board</p>
        </InfoWindow>
      )}
    </StyledContainer>
  );
}
