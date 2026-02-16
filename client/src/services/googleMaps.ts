import { keysBasedOnEnv } from "../utils/GeneralUtils";

const apiKey = keysBasedOnEnv().google.mapsApiKey;

export const getPlaceDetails = async (placeId: string) => {
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
    if (!data) {
      // no place id was found
      throw new Error("The requested location was not found.");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      "Error fetching nearby boards. Please try again. - Reason: " +
        error.message,
    );
    // return "Error fetching nearby place: " + error2.message;
  }
};
