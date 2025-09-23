import { useEffect, useState } from "react";
import { NearbySearchPlaceResult } from "../interfaces/Geo";
import { useGlobalContext } from "../context/GlobalContext";
import { getPlaceDetails } from "../services/googleMaps";

export default (placeId: string, enabled: boolean) => {
  const [place, setPlace] = useState<NearbySearchPlaceResult[] | null>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGettingPlace, setIsGettingPlace] = useState(true);
  const { setSelectedPlace } = useGlobalContext();

  useEffect(() => {
    if (!enabled) return;
    getPlaceDetails(placeId)
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

  return { place, error, isGettingPlace };
};
