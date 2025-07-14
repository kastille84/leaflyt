import styled from "styled-components";
import { useGlobalContext } from "../context/GlobalContext";
import Button from "./Button";
import { useEffect } from "react";

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
    setIsOpenFlyerDrawer,
    setDrawerAction,
    setShowLoginModal,
    setIsOpenBottomSlideIn,
    setBottomSlideInType,
    user,
  } = useGlobalContext();

  useEffect(() => {}, [selectedPlace]);

  function handleSignUpClick() {
    setIsOpenBottomSlideIn(true);
    setBottomSlideInType("signup");
  }

  return (
    <StyledActionMenu>
      <div>
        <p>{selectedPlace?.displayName.text}</p>
        <p>{selectedPlace?.formattedAddress}</p>
      </div>
      {selectedPlace?.id && (
        <div>
          <Button
            size="small"
            onClick={() => {
              setDrawerAction("create");
              setIsOpenFlyerDrawer(true);
            }}
          >
            Create Flyer
          </Button>
        </div>
      )}
      <StyledActionContainer>
        <p>filter</p>
        <p>search</p>
        <p>grid</p>
      </StyledActionContainer>
      {user ? (
        <StyledLoginContainer>
          <StyledAvatar>
            {user.name
              ? user.name[0]
              : `${user.firstName![0]} ${user.lastName![0]}`}
          </StyledAvatar>
          <Button size="small" onClick={() => setShowLoginModal(true)}>
            Logout
          </Button>
        </StyledLoginContainer>
      ) : (
        <StyledLoginContainer>
          <Button size="small" onClick={handleSignUpClick}>
            Sign Up
          </Button>
          <Button size="small" onClick={() => setShowLoginModal(true)}>
            Login
          </Button>
        </StyledLoginContainer>
      )}
    </StyledActionMenu>
  );
}
