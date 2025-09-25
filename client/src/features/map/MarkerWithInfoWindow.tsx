import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useCallback, useState } from "react";
import { DB_Flyer_Create } from "../../interfaces/DB_Flyers";
import Heading from "../../ui/Heading";
import styled from "styled-components";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";
import { DB_Board } from "../../interfaces/DB_Board";

const StyledContainer = styled.div``;

const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

export default function MarkerWithInfoWindow({
  position,
  flyer,
}: {
  position: { lat: number; lng: number };
  flyer: DB_Flyer_Create;
}) {
  const navigtate = useNavigate();
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
    <StyledContainer onBlur={handleClose}>
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
          className="my-infowindow"
        >
          <StyledContentContainer>
            <Heading as={"h4"}>{(flyer.place as DB_Board)?.name}</Heading>
            <p>{flyer.title}</p>
            <Button
              variation="primary"
              size="small"
              onClick={() =>
                navigtate(
                  `/dashboard/board/${(flyer.place as DB_Board)?.placeId}?&pt=r`
                )
              }
            >
              Go to Board
            </Button>
          </StyledContentContainer>
        </InfoWindow>
      )}
    </StyledContainer>
  );
}
