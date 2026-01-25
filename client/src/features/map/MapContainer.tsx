import React, { useState } from "react";
import styled from "styled-components";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import toast from "react-hot-toast";
import OverlaySpinner from "../../ui/OverlaySpinner";

const myAreaMapId = keysBasedOnEnv().google.mapId;

import { useGlobalContext } from "../../context/GlobalContext";
import MyRectangle from "./MyRectangle";
import useGetUserLimits from "../../hooks/useGetUserLimits";
import PlaceSearchInput from "../../ui/Form/PlaceSearchInput";
import { getPlaceDetails } from "../../services/googleMaps";
import { useNavigate } from "react-router-dom";
import MarkerWithInfoWindow from "./MarkerWithInfoWindow";
import { useResponsiveWidth } from "../../hooks/useResponsiveWidth";
import { keysBasedOnEnv } from "../../utils/GeneralUtils";

const StyledMapContainer = styled.div`
  width: 100%;
  height: 80vh;
  position: relative;
  & .gm-fullscreen-control {
    z-index: 101;
  }

  @media (max-width: 59em) {
    /* full screen */
    & .gm-fullscreen-control {
      width: 25px !important;
      height: 25px !important;
      top: -5px !important;

      & img {
        height: 10px !important;
        width: 10px !important;
      }
    }
    /* zoom controls */
    & .gm-control-active,
    & .gm-svpc {
      width: 30px !important;
      height: 30px !important;

      & img {
        height: 20px !important;
        width: 20px !important;
      }
    }
    /* map / satelite */
    & .gmnoprint.gm-style-mtc-bbw {
      margin-top: 2px !important;
    }

    & .gmnoprint.gm-style-mtc-bbw button {
      font-size: 1.2rem !important;
      height: 20px !important;
    }
  }
`;

const StyledInputContainer = styled.div`
  position: absolute;
  top: 5.5rem;
  z-index: 100;
  width: 100%;
  display: flex;
  justify-content: center;

  @media (max-width: 59em) {
    top: 6.5rem;
  }
`;

export default function MapContainer() {
  const responsiveVal = useResponsiveWidth();
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
        return ["m_tablet", "s_tablet", "l_mobile", "s_mobile"].includes(
          responsiveVal
        )
          ? 11
          : 12;
      case 0.1:
        return ["m_tablet", "s_tablet", "l_mobile", "s_mobile"].includes(
          responsiveVal
        )
          ? 10
          : 11;
      case 0.25:
        return ["m_tablet", "s_tablet", "l_mobile", "s_mobile"].includes(
          responsiveVal
        )
          ? 9
          : 10;
      default:
        return 12;
    }
  };

  const displayMyFlyers = () => {
    const mappedFlyersToMarkers = user?.flyers?.map((flyer) => (
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
    <StyledMapContainer data-testid="map-container">
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
