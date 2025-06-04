import { useState } from "react";
import { LatLng } from "../interfaces";

export default () => {
  const [isGettingLocation, setIsGettingLocation] = useState<boolean | null>(
    null
  );
  const [coords, setCoords] = useState<LatLng | null>(null);

  const onSuccess = (position: GeolocationPosition) => {
    console.log(position);
    const latLng = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    setIsGettingLocation(false);
    setCoords(latLng);
  };

  const onReject = () => {
    setIsGettingLocation(false);
    setCoords(null);
  };

  // return { isGettingLocation, coords };
  const getUserGeo = () => {
    // return new Promise((resolve, reject) => {
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(onSuccess, onReject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
    // });
  };

  return {
    getUserGeo,
    isGettingLocation,
    coords,
    setCoords,
    setIsGettingLocation,
  };
};
