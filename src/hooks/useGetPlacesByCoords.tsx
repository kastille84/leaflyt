import { useEffect, useState } from "react";
import { LatLng, NearbySearchPlaceResult } from "../interfaces";
import { excludedTypeList } from "../constants";
// import { setKey, fromLatLng, setBounds, setResultType } from "react-geocode";

export default (coords: LatLng) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
  const [places, setPlaces] = useState<NearbySearchPlaceResult[] | null>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGettingPlaces, setIsGettingPlaces] = useState(true);

  useEffect(() => {
    searchNearby()
      .then((places) => {
        setPlaces(places);
      })
      .catch((error2) => {
        setError(error2.message);
      })
      .finally(() => {
        setIsGettingPlaces(false);
      });
  }, []);

  const searchNearby = async () => {
    const url = `https://places.googleapis.com/v1/places:searchNearby`;
    const requestBody = {
      // https://developers.google.com/maps/documentation/places/web-service/place-types#table-a
      // includedTypes: ["restaurant"], // Example: search for restaurants
      excludedTypes: excludedTypeList,
      maxResultCount: 4,
      rankPreference: "DISTANCE",
      locationRestriction: {
        circle: {
          center: {
            // latitude: coords.latitude,
            // longitude: coords.longitude,
            latitude: 41.5012819,
            longitude: -74.0266355,
          },
          radius: 125,
          // radius: 250,
        },
      },
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey, // Replace with your API key
          "X-Goog-FieldMask":
            // https://developers.google.com/maps/documentation/places/web-service/nearby-search#required-parameters
            "places.displayName,places.formattedAddress,places.location,places.id,places.plus_code,places.types",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("places", data.places);
      if (!data.places || data.places.length === 0) {
        // throw new Error("No places found");
        return [];
      }

      return data.places;
    } catch (error: any) {
      throw new Error("Error fetching nearby places: " + error.message);
      // return "Error fetching nearby places: " + error2.message;
    }
  };

  return { places, error, isGettingPlaces };
};

// export default (coords: LatLng) => {
//   const acceptable_types = [
//     "street_address",
//     "premise",
//     "establishment",
//     "point_of_interest",
//     "store",
//   ];
//   // const geocoder = new google.maps.Geocoder();
//   setKey(import.meta.env.VITE_GOOGLE_MAP_API_KEY);

//   // southwest_latitude,southwest_longitude|northeast_latitude,northeast_longitude
//   setBounds(
//     `${Number(coords.latitude) - 10},
//     ${Number(coords.longitude) - 10}|
//     ${Number(coords.latitude) + 10},
//     ${Number(coords.longitude) + 10}`
//     // `${Number(coords.latitude) - 0.0007},
//     // ${Number(coords.longitude) - 0.0007}|
//     // ${Number(coords.latitude) + 0.0007},
//     // ${Number(coords.longitude) + 0.0007}`
//   );

//   setResultType(
//     // "street_address|premise|establishment|point_of_interest|store|plus_code"
//     "street_address|premise|establishment|point_of_interest|plus_code"
//   );

//   return new Promise((resolve, reject) => {
//     try {
//       fromLatLng(Number(coords.latitude), Number(coords.longitude)).then(
//         (response) => {
//           // restrict the results to only
//           // const restrictedResults = response.results.filter((locale: any) => {
//           //   const types: string[] = locale.types;
//           //   return types.some((type) => acceptable_types.includes(type));
//           // });
//           // resolve(restrictedResults);
//           resolve(response);
//         }
//       );
//     } catch (error) {
//       reject(error);
//     }
//     // geocoder.geocode(
//     //   {
//     //     location: {
//     //       lat: Number(coords.latitude),
//     //       lng: Number(coords.longitude),
//     //     },
//     //     bounds: {
//     //       north: Number(coords.latitude) + 0.0007,
//     //       south: Number(coords.latitude) - 0.0007,
//     //       east: Number(coords.longitude) + 0.0007,
//     //       west: Number(coords.longitude) - 0.0007,
//     //     },
//     //   },
//     //   (results, status) => {
//     //     if (status === "OK" && results) {
//     //       // resolve(results);
//     //       console.log(results);
//     //     } else {
//     //       // reject(status);
//     //       console.log(status);
//     //     }
//     //   }
//     // );
//   });
// };
