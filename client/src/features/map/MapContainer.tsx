import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Map,
  Marker,
  AdvancedMarker,
  MapControl,
  ControlPosition,
  Pin,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

import { useGlobalContext } from "../../context/GlobalContext";
import MyRectangle from "./MyRectangle";
import useGetUserLimits from "../../hooks/useGetUserLimits";
import PlaceSearchInput from "../../ui/Form/PlaceSearchInput";
import useGetPlaceByPlaceId from "../../hooks/useGetPlaceByPlaceId";
import { should } from "chai";
import { getPlaceDetails } from "../../services/googleMaps";
const StyledMapContainer = styled.div`
  width: 100%;
  height: 80vh;
  position: relative;
`;

const StyledInputContainer = styled.div`
  position: absolute;
  top: 2rem;
  z-index: 100;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export default function MapContainer() {
  const { user, setSelectedPlace } = useGlobalContext();
  const planLimits = useGetUserLimits();
  const userLat = Number(user?.address?.geometry.location.lat) || 0;
  const userLng = Number(user?.address?.geometry.location.lng) || 0;

  const handleSelectedPlace = async (place: any) => {
    try {
      const placeDetails = await getPlaceDetails(place.place_id);
      console.log("placeDetails", placeDetails);
      setSelectedPlace(placeDetails);
      // #TODO: OPEN BOARD
    } catch (error) {
      console.log(error);
    }
  };

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

  const displayMyFlyers = () => {
    // const mappedFlyersToMarkers = user?.flyers.map((flyer) =>({
    //   position: {
    //     lat: Number(flyer.address?.geometry.location.lat) || 0,
    //     lng: Number(flyer.address?.geometry.location.lng) || 0,
    //   },
    //   placeName: flyer.address?.name,
    //   key: flyer.id
    // }))
    const mappedFlyersToMarkers = user?.flyers.map((flyer) => (
      <Marker
        position={{
          lat: Number(flyer.place?.latlng.latitude) || 0,
          lng: Number(flyer.place?.latlng.longitude) || 0,
        }}
        data-key={flyer.id}
        data-placeName={flyer.address?.name}
      />
    ));

    return mappedFlyersToMarkers || [];
  };

  return (
    <StyledMapContainer>
      <Map
        defaultCenter={{ lat: userLat, lng: userLng }}
        defaultZoom={determizeDefaultZoom()}
        zoomControl
      >
        {/* <MapControl position={ControlPosition.TOP_LEFT}>
          <h3>Map</h3>
        </MapControl> */}
        {/* HOME */}
        <Marker position={{ lat: userLat, lng: userLng }} />

        {/* <AdvancedMarker position={{ lat: userLat, lng: userLng }}>
          <Pin
            background={"#0f9d58"}
            borderColor={"#006425"}
            glyphColor={"#60d98f"}
          />
        </AdvancedMarker> */}
        {/* My Flyers */}
        {displayMyFlyers()}
        <MyRectangle
          bounds={{
            north: userLat + planLimits.distance.limit!,
            south: userLat - planLimits.distance.limit!,
            east: userLng + planLimits.distance.limit!,
            west: userLng - planLimits.distance.limit!,
          }}
        />
        <StyledInputContainer>
          <div>
            <PlaceSearchInput onPlaceSelect={handleSelectedPlace} />
          </div>
        </StyledInputContainer>
      </Map>
    </StyledMapContainer>
  );
}
