import { useState } from "react";
import { LatLng } from "../interfaces/Geo";
import toast from "react-hot-toast";

export default () => {
  const [watchId, setWatchId] = useState<number | null>(null);
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

    // var timeout = setTimeout(function () {
    navigator.geolocation.clearWatch(watchId!);
    // }, 5000);
  };

  const onReject = (error: GeolocationPositionError) => {
    setIsGettingLocation(false);
    setCoords(null);
    console.log("onReject error", error);
    // set a toast, letting user know that location is not available and to enable location sharing
    switch (error.code) {
      case 1: // PERMISSION_DENIED
        toast.error(
          "We weren't able to get your location. Make sure to select 'Allow' on the pop-up to enable location sharing."
        );
        break;
      case 2: // POSITION_UNAVAILABLE
        toast.error(
          "We weren't able to get your location. It seems to be unavailable. Please check your internet connection or move to another location."
        );
        break;
      case 3: // TIMEOUT
        toast.error(
          "We weren't able to get your location. The request timed out. Please check your internet connection or move to another location."
        );
    }
    navigator.geolocation.clearWatch(watchId!);
  };

  // return { isGettingLocation, coords };
  const getUserGeo = () => {
    // if (watchId) {
    //   navigator.geolocation.clearWatch(watchId);
    // }
    // return new Promise((resolve, reject) => {
    setIsGettingLocation(true);
    setWatchId(
      // https://www.reddit.com/r/AndroidQuestions/comments/1epu2m6/why_do_android_phones_give_incorrect_location/#:~:text=With%20the%20location%20permission%20granted,exactly%20the%20location%20of%20you.
      navigator.geolocation.watchPosition(onSuccess, onReject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      })
    );
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
