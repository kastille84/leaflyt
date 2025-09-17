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
const StyledInput = styled.input`
  width: 40rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-brand-500);
`;

const StyledResults = styled.ul`
  position: absolute;
  top: 5.2rem;
  z-index: 100;
  width: 40rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-brand-500);
`;

export default function MapContainer() {
  const { user } = useGlobalContext();
  const planLimits = useGetUserLimits();
  const userLat = Number(user?.address?.geometry.location.lat) || 0;
  const userLng = Number(user?.address?.geometry.location.lng) || 0;

  const placesLibrary = useMapsLibrary("places");
  const [service, setService] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (placesLibrary) {
      setService(new placesLibrary.AutocompleteService());
    }
    return () => setService(null);
  }, [placesLibrary]);

  const updateResults = (inputValue: string) => {
    if (!service || inputValue.length === 0) {
      setResults([]);
      return;
    }
    const request = {
      input: inputValue,
      bounds: {
        north: userLat + planLimits.distance.limit!,
        south: userLat - planLimits.distance.limit!,
        east: userLng + planLimits.distance.limit!,
        west: userLng - planLimits.distance.limit!,
      },
      radius: planLimits.distance.limit!,
    };

    service.getQueryPredictions(request, (res: any) => {
      setResults(res);
    });
  };

  const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    setInputValue(value);
    updateResults(value);
  };

  const handleSelectedPlace = (place: any) => {
    // setInputValue(place.description);
    // setResults([]);
    console.log("place", place);
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
            <StyledInput
              value={inputValue}
              onChange={onInputChange}
              placeholder="Search"
            />
            {results && results.length > 0 && (
              <StyledResults>
                {results.map((place: any) => (
                  <li
                    key={place.place_id}
                    onClick={() => handleSelectedPlace(place)}
                  >
                    {place.description}
                  </li>
                ))}
              </StyledResults>
            )}
          </div>
        </StyledInputContainer>
      </Map>
    </StyledMapContainer>
  );
}
