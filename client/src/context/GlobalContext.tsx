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
  showCloseSlideInModal: boolean;
  setShowCloseSlideInModal: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenBottomSlideIn: boolean;
  setIsOpenBottomSlideIn: React.Dispatch<React.SetStateAction<boolean>>;
  bottomSlideInType: "signup" | "upsell" | null;
  setBottomSlideInType: React.Dispatch<
    React.SetStateAction<"signup" | "upsell" | null>
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
  showCloseSlideInModal: false,
  setShowCloseSlideInModal: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  showLoginModal: false,
  setShowLoginModal: () => {},
  isOpenBottomSlideIn: false,
  setIsOpenBottomSlideIn: () => {},
  bottomSlideInType: null,
  setBottomSlideInType: () => {},
});

function GlobalContextProvider({ children }: PropsWithChildren) {
  const [selectedPlace, setSelectedPlace] =
    useState<NearbySearchPlaceResult | null>(null);
  const [isOpenFlyerDrawer, setIsOpenFlyerDrawer] = useState<boolean>(false);
  const [drawerAction, setDrawerAction] = useState<"edit" | "create" | null>(
    null
  );
  const [showCloseSlideInModal, setShowCloseSlideInModal] =
    useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isOpenBottomSlideIn, setIsOpenBottomSlideIn] =
    useState<boolean>(false);
  const [bottomSlideInType, setBottomSlideInType] = useState<
    "signup" | "upsell" | null
  >(null);

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
        isOpenFlyerDrawer,
        setIsOpenFlyerDrawer,
        drawerAction,
        setDrawerAction,
        showCloseSlideInModal,
        setShowCloseSlideInModal,
        isLoggedIn,
        setIsLoggedIn,
        showLoginModal,
        setShowLoginModal,
        isOpenBottomSlideIn,
        setIsOpenBottomSlideIn,
        bottomSlideInType,
        setBottomSlideInType,
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
