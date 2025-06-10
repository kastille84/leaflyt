import { createContext, PropsWithChildren, useContext, useState } from "react";
import useGetUserGeo from "../hooks/useGetUserGeo";
import { LatLng, NearbySearchPlaceResult } from "../interfaces/Geo";

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
  setIsOpenFlyerDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenFlyerDrawer: boolean;
  drawerAction: "edit" | "create" | null;
  setDrawerAction: React.Dispatch<
    React.SetStateAction<"edit" | "create" | null>
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
  setIsOpenFlyerDrawer: () => {},
  isOpenFlyerDrawer: false,
  drawerAction: null,
  setDrawerAction: () => {},
});

function GlobalContextProvider({ children }: PropsWithChildren) {
  const [selectedPlace, setSelectedPlace] =
    useState<NearbySearchPlaceResult | null>(null);
  const [isOpenFlyerDrawer, setIsOpenFlyerDrawer] = useState<boolean>(false);
  const [drawerAction, setDrawerAction] = useState<"edit" | "create" | null>(
    null
  );

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
        setIsOpenFlyerDrawer,
        isOpenFlyerDrawer,
        drawerAction,
        setDrawerAction,
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
