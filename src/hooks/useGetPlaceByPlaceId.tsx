import { useEffect, useState } from "react";
import { NearbySearchPlaceResult } from "../interfaces/Geo";
import { useGlobalContext } from "../context/GlobalContext";

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
    // https://developers.google.com/maps/documentation/places/web-service/place-details#introduction
    const url = `https://places.googleapis.com/v1/places/${placeId}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey, // Replace with your API key
          "X-Goog-FieldMask":
            // https://developers.google.com/maps/documentation/places/web-service/nearby-search#required-parameters
            "displayName,formattedAddress,location,id,plus_code,types",
        },
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
