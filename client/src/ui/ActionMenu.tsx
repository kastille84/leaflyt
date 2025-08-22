import styled from "styled-components";
import { useGlobalContext } from "../context/GlobalContext";
import Button from "./Button";
import { useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { useNavigate } from "react-router-dom";
import OverlaySpinner from "./OverlaySpinner";
import LocationSelection from "../features/location/LocationSelection";
import { supabase } from "../services/supabase";
import CreateFlyerButton from "./Flyer/CreateFlyerButton";

const StyledActionMenu = styled.div`
  grid-column: 1 / -1;
  background-color: var(--color-brand-100);
  border-right: 1px solid var(--color-grey-100);
  padding: 2.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 2.4rem;
`;

const StyledLoginContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 2.4rem;
`;

const StyledAvatar = styled.div`
  background-color: var(--color-grey-50);
  /* opacity: 0.65; */
  color: var(--color-brand-700);
  width: 35px;
  height: 35px;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
`;

export default function ActionMenu() {
  const {
    selectedPlace,
    setSelectedPlace,
    setIsOpenFlyerDrawer,
    setDrawerAction,
    setShowLoginModal,
    setIsOpenBottomSlideIn,
    setBottomSlideInType,
    user,
    setUser,
    getUserGeo,
    isGettingLocation,
    coords,
    setCoords,
    hasFlyerAtLocation,
    isSelectingNewPlace,
    setIsSelectingNewPlace,
  } = useGlobalContext();

  const navigate = useNavigate();

  useEffect(() => {}, [selectedPlace]);

  function handleSignUpClick() {
    setIsOpenBottomSlideIn(true);
    setBottomSlideInType("signup");
  }

  async function handleLogout() {
    // remove from localStorage
    await supabase.auth.signOut().then(() => {
      // clear data from globalcontext
      setUser(null);
      setSelectedPlace(null);
      setCoords(null);
      // redirect to home
      navigate("/");
    });
  }

  function determineAuthActions() {
    if (user) {
      return (
        <StyledLoginContainer>
          <StyledAvatar>
            {user.name
              ? user.name[0]
              : `${user.firstName![0]} ${user.lastName![0]}`}
          </StyledAvatar>
          <Button size="small" onClick={handleLogout}>
            Logout
          </Button>
        </StyledLoginContainer>
      );
    } else {
      return (
        <StyledLoginContainer>
          <Button size="small" onClick={handleSignUpClick}>
            Sign Up
          </Button>
          <Button size="small" onClick={() => setShowLoginModal(true)}>
            Login
          </Button>
        </StyledLoginContainer>
      );
    }
  }

  function determineSelectedPlaceActions() {
    if (selectedPlace?.id && !hasFlyerAtLocation) {
      return (
        <div>
          <CreateFlyerButton size="small" />
        </div>
      );
    }
    // else {
    //   // action to find nearest place
    //   // only here if for some reason you are on the dashboard and don't have a selected place
    //   return (
    //     <div>
    //       <Button
    //         size="small"
    //         onClick={() => {
    //           setIsSelectingNewPlace(true);
    //           getUserGeo();
    //         }}
    //       >
    //         Open Board Near You
    //       </Button>
    //     </div>
    //   );
    // }
  }

  return (
    <>
      <StyledActionMenu>
        <div>
          <p>{selectedPlace?.displayName.text}</p>
          <p>{selectedPlace?.formattedAddress}</p>
        </div>
        <div>
          <Button
            size="small"
            variation="secondary"
            onClick={() => {
              setIsSelectingNewPlace(true);
              getUserGeo();
            }}
          >
            Open Board Near You
          </Button>
        </div>
        {determineSelectedPlaceActions()}
        <StyledActionContainer>
          <p>filter</p>
          <p>search</p>
          <p>grid</p>
        </StyledActionContainer>
        {determineAuthActions()}
      </StyledActionMenu>
      {!selectedPlace && isGettingLocation && (
        <OverlaySpinner message="Getting Your Location based on your device's GPS, mobile or wifi signal" />
      )}
      {(!selectedPlace || isSelectingNewPlace) && coords && (
        <LocationSelection coords={coords} />
      )}
    </>
  );
}
