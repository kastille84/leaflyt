import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { debounce } from "../../utils/GeneralUtils";

import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useGlobalContext } from "../../context/GlobalContext";
import useGetUserLimits from "../../hooks/useGetUserLimits";

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
  &::after {
    content: "Powered by Google Maps";
    font-size: 1rem;
    font-weight: 600;
    position: absolute;
    bottom: 0.2rem;
    right: 1.2rem;
    color: var(--color-brand-500);
  }
  & li {
    padding: 0.8rem 1.2rem;
    cursor: pointer;
    border-radius: var(--border-radius-sm);
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: var(--color-grey-100);
    }
  }
`;

export default function PlaceSearchInput({
  onPlaceSelect,
}: {
  onPlaceSelect: (place: any) => void;
}) {
  const [service, setService] = useState<any>(null);
  const [searchText, setSearchText] = useState("");
  const [predictions, setPredictions] = useState([]);
  const placesLibrary = useMapsLibrary("places");

  const { user } = useGlobalContext();
  const planLimits = useGetUserLimits();
  const userLat = Number(user?.address?.geometry.location.lat) || 0;
  const userLng = Number(user?.address?.geometry.location.lng) || 0;

  useEffect(() => {
    if (placesLibrary) {
      setService(new placesLibrary.AutocompleteService());
    }
    return () => setService(null);
  }, [placesLibrary]);

  // Debounce the API call
  const debouncedGetPlacePredictions = useCallback(
    debounce((input: string) => {
      if (service && input) {
        service.getPlacePredictions(
          {
            input,
            locationRestriction: {
              north: userLat + planLimits.distance.limit!,
              south: userLat - planLimits.distance.limit!,
              east: userLng + planLimits.distance.limit!,
              west: userLng - planLimits.distance.limit!,
            },
            types: ["establishment"],
          }, // Customize restrictions as needed
          (predictions: any, status: any) => {
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              predictions
            ) {
              setPredictions(predictions);
            } else {
              setPredictions([]);
            }
          }
        );
      } else {
        setPredictions([]);
      }
    }, 800), // 800ms debounce delay
    [service]
  );

  useEffect(() => {
    debouncedGetPlacePredictions(searchText);
  }, [searchText, debouncedGetPlacePredictions]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <div>
      <StyledInput
        type="text"
        value={searchText}
        onChange={handleInputChange}
        placeholder="Search boards in your local area..."
      />

      {predictions.length > 0 && (
        <StyledResults>
          {predictions.map((prediction: any) => (
            <li
              key={prediction.place_id}
              onClick={() => onPlaceSelect(prediction)}
            >
              {prediction.description}
            </li>
          ))}
        </StyledResults>
      )}
    </div>
  );
}
