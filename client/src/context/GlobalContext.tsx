import { createContext, PropsWithChildren, useContext, useState } from "react";
import { UploadApiResponse } from "cloudinary";
import useGetUserGeo from "../hooks/useGetUserGeo";
import { LatLng, NearbySearchPlaceResult } from "../interfaces/Geo";
import { Auth_User_Profile_Response } from "../interfaces/Auth_User";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { DB_Flyers_Response, DB_Template } from "../interfaces/DB_Flyers";
import { useSessionStorageState } from "../hooks/useSessionStorageState";

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
  drawerAction: "edit" | "create" | "editTemplate" | "createTemplate" | null;
  setDrawerAction: React.Dispatch<
    React.SetStateAction<
      "edit" | "create" | "editTemplate" | "createTemplate" | null
    >
  >;
  showCloseSlideInModal: boolean;
  setShowCloseSlideInModal: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenBottomSlideIn: boolean;
  setIsOpenBottomSlideIn: React.Dispatch<React.SetStateAction<boolean>>;
  bottomSlideInType:
    | "signup"
    | "upgrade"
    | "flyerDesigner"
    | "carousel"
    | "hasTemplates"
    | "chooseAssets"
    | null;
  setBottomSlideInType: React.Dispatch<
    React.SetStateAction<
      | "signup"
      | "upgrade"
      | "flyerDesigner"
      | "carousel"
      | "hasTemplates"
      | "chooseAssets"
      | null
    >
  >;
  user: Auth_User_Profile_Response | null;
  setUser: React.Dispatch<
    React.SetStateAction<Auth_User_Profile_Response | null>
  >;
  currentFormOptions: any;
  setCurrentFormOptions: React.Dispatch<React.SetStateAction<any>>;
  contextImages: UploadApiResponse[] | null;
  setContextImages: React.Dispatch<
    React.SetStateAction<UploadApiResponse[] | null>
  >;
  hasFlyerAtLocation: boolean;
  setHasFlyerAtLocation: React.Dispatch<React.SetStateAction<boolean>>;
  isSelectingNewPlace: boolean;
  setIsSelectingNewPlace: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFlyer: DB_Flyers_Response | null;
  setSelectedFlyer: React.Dispatch<
    React.SetStateAction<DB_Flyers_Response | null>
  >;
  selectedTemplate: DB_Template | null;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<DB_Template | null>>;
  setShowEditFlyerModal: React.Dispatch<React.SetStateAction<boolean>>;
  showEditFlyerModal: boolean;
  setShowDeleteFlyerTemplateModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  showDeleteFlyerTemplateModal: boolean;
  setShowDeleteImagesModal: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteImagesModal: boolean;
  likedContextSessionFlyers: string[] | null;
  setLikedContextSessionFlyers: React.Dispatch<
    React.SetStateAction<string[] | null>
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
  user: null,
  setUser: () => {},
  currentFormOptions: null,
  setCurrentFormOptions: () => {},
  contextImages: null,
  setContextImages: () => {},
  hasFlyerAtLocation: false,
  setHasFlyerAtLocation: () => {},
  isSelectingNewPlace: false,
  setIsSelectingNewPlace: () => {},
  selectedFlyer: null,
  setSelectedFlyer: () => {},
  selectedTemplate: null,
  setSelectedTemplate: () => {},
  setShowEditFlyerModal: () => {},
  showEditFlyerModal: false,
  setShowDeleteFlyerTemplateModal: () => {},
  showDeleteFlyerTemplateModal: false,
  setShowDeleteImagesModal: () => {},
  showDeleteImagesModal: false,
  likedContextSessionFlyers: null,
  setLikedContextSessionFlyers: () => {},
});

function GlobalContextProvider({ children }: PropsWithChildren) {
  const [selectedPlace, setSelectedPlace] =
    useState<NearbySearchPlaceResult | null>(null);
  const [isOpenFlyerDrawer, setIsOpenFlyerDrawer] = useState<boolean>(false);
  const [drawerAction, setDrawerAction] = useState<
    "edit" | "create" | "editTemplate" | "createTemplate" | null
  >(null);
  const [showCloseSlideInModal, setShowCloseSlideInModal] =
    useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isOpenBottomSlideIn, setIsOpenBottomSlideIn] =
    useState<boolean>(false);
  const [bottomSlideInType, setBottomSlideInType] = useState<
    | "signup"
    | "upgrade"
    | "flyerDesigner"
    | "carousel"
    | "hasTemplates"
    | "chooseAssets"
    | null
  >(null);
  const [user, setUser] = useState<Auth_User_Profile_Response | null>(null);
  const [currentFormOptions, setCurrentFormOptions] = useState<{
    getValues: UseFormGetValues<any>;
    setValue: UseFormSetValue<any>;
  } | null>(null);
  const [contextImages, setContextImages] = useState<
    UploadApiResponse[] | null
  >(null);
  const [hasFlyerAtLocation, setHasFlyerAtLocation] = useState(false);
  const [isSelectingNewPlace, setIsSelectingNewPlace] = useState(false);
  const [selectedFlyer, setSelectedFlyer] = useState<DB_Flyers_Response | null>(
    null
  );
  const [selectedTemplate, setSelectedTemplate] = useState<DB_Template | null>(
    null
  );
  const [showEditFlyerModal, setShowEditFlyerModal] = useState(false);
  const [showDeleteFlyerTemplateModal, setShowDeleteFlyerTemplateModal] =
    useState(false);
  const [showDeleteImagesModal, setShowDeleteImagesModal] = useState(false);

  const {
    getUserGeo,
    isGettingLocation,
    coords,
    setCoords,
    setIsGettingLocation,
  } = useGetUserGeo();

  const [likedContextSessionFlyers, setLikedContextSessionFlyers] = useState<
    string[] | null
  >(null);

  return (
    <GlobalContext.Provider
      value={{
        // Location
        getUserGeo,
        isGettingLocation,
        coords,
        setCoords,
        setIsGettingLocation,
        selectedPlace,
        setSelectedPlace,
        hasFlyerAtLocation,
        setHasFlyerAtLocation,
        isSelectingNewPlace,
        setIsSelectingNewPlace,
        // Drawers
        isOpenFlyerDrawer,
        setIsOpenFlyerDrawer,
        drawerAction,
        setDrawerAction,
        // Modals
        showCloseSlideInModal,
        setShowCloseSlideInModal,
        showLoginModal,
        setShowLoginModal,
        setShowEditFlyerModal,
        showEditFlyerModal,
        setShowDeleteFlyerTemplateModal,
        showDeleteFlyerTemplateModal,
        setShowDeleteImagesModal,
        showDeleteImagesModal,
        // Auth
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        // SlideIns
        isOpenBottomSlideIn,
        setIsOpenBottomSlideIn,
        bottomSlideInType,
        setBottomSlideInType,
        //Flyer
        selectedFlyer,
        setSelectedFlyer,
        selectedTemplate,
        setSelectedTemplate,
        currentFormOptions,
        setCurrentFormOptions,
        contextImages,
        setContextImages,
        likedContextSessionFlyers,
        setLikedContextSessionFlyers,
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
