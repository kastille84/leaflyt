import React, { useState } from "react";
import styled from "styled-components";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import toast from "react-hot-toast";
import OverlaySpinner from "../../ui/OverlaySpinner";

const myAreaMapId = import.meta.env.VITE_GOOGLE_MAP_MY_AREA_MAP_ID;

import { useGlobalContext } from "../../context/GlobalContext";
import MyRectangle from "./MyRectangle";
import useGetUserLimits from "../../hooks/useGetUserLimits";
import PlaceSearchInput from "../../ui/Form/PlaceSearchInput";
import { getPlaceDetails } from "../../services/googleMaps";
import { useNavigate } from "react-router-dom";
import MarkerWithInfoWindow from "./MarkerWithInfoWindow";

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
  const navigate = useNavigate();
  const { user, setSelectedPlace } = useGlobalContext();
  const planLimits = useGetUserLimits();
  const userLat = Number(user?.address?.geometry.location.lat) || 0;
  const userLng = Number(user?.address?.geometry.location.lng) || 0;

  const [showSpinner, setShowSpinner] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  const handleSelectedPlace = async (place: any) => {
    try {
      setShowSpinner(true);
      const placeDetails = await getPlaceDetails(place.place_id);
      console.log("placeDetails", placeDetails);
      setSelectedPlace(placeDetails);
      setShowSpinner(false);
      navigate(`/dashboard/board/${placeDetails.id}?&pt=r`);
    } catch (error: any) {
      toast.error(error.message);
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
    const mappedFlyersToMarkers = user?.flyers.map((flyer) => (
      <MarkerWithInfoWindow
        key={flyer.id}
        position={{
          lat: Number(flyer.place?.latlng.latitude) || 0,
          lng: Number(flyer.place?.latlng.longitude) || 0,
        }}
        flyer={flyer}
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
        mapId={myAreaMapId}
      >
        {/* <MapControl position={ControlPosition.TOP_LEFT}>fd
          <h3>Map</h3>
        </MapControl> */}
        {/* HOME */}
        <AdvancedMarker position={{ lat: userLat, lng: userLng }}>
          <Pin
            background={"#0f9d58"}
            borderColor={"#006425"}
            glyphColor={"#60d98f"}
          />
        </AdvancedMarker>

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
      {showSpinner && (
        <OverlaySpinner message={"Getting the Selected Community Board..."} />
      )}
    </StyledMapContainer>
  );
}
