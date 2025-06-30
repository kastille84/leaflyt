import { useEffect, useState } from "react";
import { LatLng, NearbySearchPlaceResult } from "../interfaces/Geo";
import { excludedTypeList } from "../constants";
import { useGlobalContext } from "../context/GlobalContext";
// import { setKey, fromLatLng, setBounds, setResultType } from "react-geocode";

export default (placeId: string, enabled: boolean) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
  const [place, setPlace] = useState<NearbySearchPlaceResult[] | null>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGettingPlace, setIsGettingPlace] = useState(true);
  const { setSelectedPlace } = useGlobalContext();

  useEffect(() => {
    if (!enabled) return;
    getPlaceDetails()
      .then((place) => {
        setPlace(place);
        setSelectedPlace(place);
      })
      .catch((error2) => {
        setError(error2.message);
      })
      .finally(() => {
        setIsGettingPlace(false);
      });
  }, [enabled]);

  const getPlaceDetails = async () => {
    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    // const requestBody = {
    //   // https://developers.google.com/maps/documentation/places/web-service/place-types#table-a
    //   // includedTypes: ["restaurant"], // Example: search for restaurants
    //   excludedTypes: excludedTypeList,
    //   maxResultCount: 4,
    //   rankPreference: "DISTANCE",
    //   locationRestriction: {
    //     circle: {
    //       center: {
    //         // latitude: coords.latitude,
    //         // longitude: coords.longitude,
    //         latitude: 41.5012819,
    //         longitude: -74.0266355,
    //         // 40.7529969 | -73.9997624 - work
    //         //  40.7568384 | -73.9803136
    //         // 40.7732224 | -73.9147776
    //       },
    //       radius: 125,
    //       // radius: 250,
    //     },
    //   },
    // };
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey, // Replace with your API key
          "X-Goog-FieldMask":
            // https://developers.google.com/maps/documentation/places/web-service/nearby-search#required-parameters
            // "places.displayName,places.formattedAddress,places.location,places.id,places.plus_code,places.types",
            "displayName,formattedAddress,location,id,plus_code,types",
        },
        // body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("place", data);
      if (!data) {
        // no place id was found
        throw new Error("The requested location was not found.");
      }

      return data;
    } catch (error: any) {
      throw new Error(
        "Error fetching nearby boards. Please try again. - Reason: " +
          error.message
      );
      // return "Error fetching nearby place: " + error2.message;
    }
  };

  return { place, error, isGettingPlace };
};
