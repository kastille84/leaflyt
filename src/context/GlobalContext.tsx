import { createContext, PropsWithChildren, useContext, useState } from "react";
import useGetUserGeo from "../hooks/useGetUserGeo";
import { LatLng, NearbySearchPlaceResult } from "../interfaces";

export type ContextType = {
  getUserGeo: () => void;
  isGettingLocation: boolean | null;
  coords: LatLng | null;
  setCoords: React.Dispatch<React.SetStateAction<LatLng | null>>;
  setIsGettingLocation: React.Dispatch<React.SetStateAction<boolean | null>>;
  selectedPlace: NearbySearchPlaceResult | null;
  setSelectedPlace: React.Dispatch<
    React.SetStateAction<NearbySearchPlaceResult | null>
  >;
};

const GlobalContext = createContext<ContextType>({
  getUserGeo: () => {},
  isGettingLocation: false,
  coords: null,
  setCoords: () => {},
  setIsGettingLocation: () => {},
  selectedPlace: null,
  setSelectedPlace: () => {},
});

function GlobalContextProvider({ children }: PropsWithChildren) {
  const [selectedPlace, setSelectedPlace] =
    useState<NearbySearchPlaceResult | null>(null);

  const {
    getUserGeo,
    isGettingLocation,
    coords,
    setCoords,
    setIsGettingLocation,
  } = useGetUserGeo();

  return (
    <GlobalContext.Provider
      value={{
        getUserGeo,
        isGettingLocation,
        coords,
        setCoords,
        setIsGettingLocation,
        selectedPlace,
        setSelectedPlace,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};

export { GlobalContextProvider, useGlobalContext };
