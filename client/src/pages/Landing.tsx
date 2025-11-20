import { useEffect } from "react";
import styled from "styled-components";
import Heading from "../ui/Heading";
import Button from "../ui/Button";
import OverlaySpinner from "../ui/OverlaySpinner";
import { useGlobalContext } from "../context/GlobalContext";
import LocationSelection from "../features/location/LocationSelection";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { useNavigate } from "react-router-dom";
import useLoginWithAccessToken from "../features/authentication/useLoginWithAccessToken";
import { supabase } from "../services/supabase";

const StyledHeroSection = styled.section`
  color: var(--color-blue-200);
  height: 100vh;
  display: flex;
  background-image: linear-gradient(
    to right,
    var(--color-blue-600) 5%,
    var(--color-blue-400) 50%
  );

  & h2 {
    color: var(--color-blue-200);
    font-weight: 500;
  }

  & span {
    color: var(--color-brand-500);
    text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
  }
`;

const StyledFigure = styled.figure`
  flex: 1;
  /* background-image: linear-gradient(to right, var(--color-blue-400)); */
  opacity: 0.8;

  & img {
    position: relative;
    display: block;
    z-index: -1;
  }
`;
const StyledHeroArticle = styled.article`
  background-color: var(--color-blue-600);
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  flex: 1;
  row-gap: 3.2rem;
  padding: 4.8rem;
`;

const StyledHeroH1 = styled.h1`
  font-size: 7.8rem;
  font-weight: 600;
  letter-spacing: 0.1rem;
  line-height: 1;
`;

const StyledButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 3.2rem;
  padding-right: 3.2rem;
`;

const StyledAuthButtonsContainer = styled.div`
  display: flex;
  gap: 2.4rem;
`;

export default function Landing() {
  const {
    getUserGeo,
    isGettingLocation,
    coords,
    setUser,
    setShowLoginModal,
    setIsOpenBottomSlideIn,
    setBottomSlideInType,
  } = useGlobalContext();
  const navigate = useNavigate();
  const { autoLogin } = useLoginWithAccessToken();
  // const [token, setToken] = useLocalStorageState(null, "access_token");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        autoLogin(session.access_token, {
          onSuccess: (response) => {
            console.log("response", response);
            // set user in global context
            setUser(response.data);
            navigate("/dashboard/home");
          },
          onError: (error) => {
            console.log("error", error);
          },
        });
      }
    });
  }, []);

  function handleSignUpClick() {
    setIsOpenBottomSlideIn(true);
    setBottomSlideInType("signup");
  }

  return (
    <main>
      <StyledHeroSection>
        <StyledHeroArticle>
          <StyledHeroH1>
            Making Community Boards Fun, Interactive & Useful Again
          </StyledHeroH1>
          <Heading as="h2">
            Spread Your Message. <br />
            See What Others are Discussing & Doing in Your{" "}
            <span>Local Digital Community Board</span>
          </Heading>
          <StyledButtonContainer>
            <StyledAuthButtonsContainer>
              <Button variation="secondary" onClick={handleSignUpClick}>
                Signup
              </Button>
              <Button
                variation="secondary-outlined"
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </Button>
            </StyledAuthButtonsContainer>
            <Button onClick={getUserGeo}>Search For a Board Near You</Button>
          </StyledButtonContainer>
        </StyledHeroArticle>
        <StyledFigure>
          <img
            src={"/images/flyer-hero-2.png"}
            height={"100%"}
            width={"100%"}
            alt=""
          />
        </StyledFigure>
      </StyledHeroSection>
      {isGettingLocation && (
        <OverlaySpinner message="Getting Your Location based on your device's GPS, mobile or wifi signal" />
      )}
      {coords && <LocationSelection coords={coords} />}
    </main>
  );
}
