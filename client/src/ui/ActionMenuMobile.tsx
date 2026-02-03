import styled from "styled-components";
import { useGlobalContext } from "../context/GlobalContext";
import Button from "./Button";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import OverlaySpinner from "./OverlaySpinner";
import LocationSelection from "../features/location/LocationSelection";
import { supabase } from "../services/supabase";
import CreateFlyerButton from "./Flyer/CreateFlyerButton";
import { useSessionStorageState } from "../hooks/useSessionStorageState";
import { HiOutlineInformationCircle } from "react-icons/hi2";

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
  width: 30px;
  height: 30px;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
`;

const StyledAddressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  & svg {
    color: var(--color-orange-700);
    font-size: 1.6rem;
    cursor: pointer;
  }
`;

const StyledAddress = styled.div`
  font-size: 1.2rem;
  padding: 1rem 2.4rem;
  line-height: 1.3;
  background-color: var(--color-blue-100);
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid var(--color-blue-200);

  & div {
    padding-left: 2.4rem;
    border-left: 1px dashed var(--color-brand-500);
  }
`;

const VerySmall = styled.p`
  font-size: 0.6rem;
  color: var(--color-grey-400);
  font-style: italic;
  font-weight: 400;
`;
export default function ActionMenuMobile() {
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
    setShowMerchantDisclaimerModal,
  } = useGlobalContext();

  const navigate = useNavigate();
  const [likedSessionFlyers, setLikedSessionFlyers] = useSessionStorageState(
    [],
    "likedFlyers",
  );

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
      // clear session
      setLikedSessionFlyers([]);
      // redirect to home
      navigate("/");
    });
  }

  function determineAuthActions() {
    if (user) {
      return (
        <StyledLoginContainer>
          <StyledAvatar>
            {user.name ? user.name[0] : `${user.firstName![0]}`}
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
  }

  return (
    <>
      <div>
        <StyledActionMenu>
          <div>
            <Button
              size="small"
              variation="secondary"
              onClick={() => {
                setIsSelectingNewPlace(true);
                getUserGeo();
              }}
            >
              Find Boards
            </Button>
          </div>
          {determineSelectedPlaceActions()}
          <StyledActionContainer>
            {/* <p>filter</p>
            <p>search</p>
            <p>grid</p> */}
          </StyledActionContainer>
          {determineAuthActions()}
        </StyledActionMenu>
        {selectedPlace && (
          <StyledAddress>
            <div>
              <p>{selectedPlace?.displayName.text}</p>
              <p>{selectedPlace?.formattedAddress}</p>
              <VerySmall>
                Leaflit Virtual Board is not affiliated with this physical
                location.
              </VerySmall>
            </div>
            <HiOutlineInformationCircle
              onClick={() => setShowMerchantDisclaimerModal(true)}
            />
          </StyledAddress>
        )}
      </div>
      {!selectedPlace && isGettingLocation && (
        <OverlaySpinner message="Getting Your Location based on your device's GPS, mobile or wifi signal" />
      )}
      {(!selectedPlace || isSelectingNewPlace) && coords && (
        <LocationSelection coords={coords} />
      )}
    </>
  );
}
