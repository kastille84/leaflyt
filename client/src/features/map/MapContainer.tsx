import React from "react";
import styled from "styled-components";
import {
  Map,
  Marker,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { useGlobalContext } from "../../context/GlobalContext";
import MyRectangle from "./MyRectangle";
import useGetUserLimits from "../../hooks/useGetUserLimits";

const StyledMapContainer = styled.div`
  width: 100%;
  height: 80vh;
`;

export default function MapContainer() {
  const { user } = useGlobalContext();
  const planLimits = useGetUserLimits();
  const userLat = Number(user?.address?.geometry.location.lat) || 0;
  const userLng = Number(user?.address?.geometry.location.lng) || 0;
  const determizeDefaultZoom = () => {
    switch (planLimits.distance.limit!) {
      case 0.05:
        return 13;
      case 0.1:
        return 12;
      case 0.25:
        return 11;
      default:
        return 12;
    }
  };

  return (
    <StyledMapContainer>
      <Map
        defaultCenter={{ lat: userLat, lng: userLng }}
        defaultZoom={determizeDefaultZoom()}
        zoomControl

        // defaultBounds={{
        //   north: userLat + 0.0007,
        //   south: userLat - 0.0007,
        //   east: userLng + 0.0007,
        //   west: userLng - 0.0007,
        // }}
      >
        {/* <MapControl position={ControlPosition.TOP_LEFT}>
          <h3>Map</h3>
        </MapControl> */}
        <Marker position={{ lat: userLat, lng: userLng }} />
        <MyRectangle
          bounds={{
            north: userLat + planLimits.distance.limit!,
            south: userLat - planLimits.distance.limit!,
            east: userLng + planLimits.distance.limit!,
            west: userLng - planLimits.distance.limit!,
          }}
        />
      </Map>
    </StyledMapContainer>
  );
}
