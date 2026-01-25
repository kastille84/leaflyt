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

const StyledMainSection = styled.section`
  color: var(--color-blue-200);
  height: 100vh;
  /* display: flex; */
  background-image: linear-gradient(
    to right,
    var(--color-blue-600) 5%,
    var(--color-blue-400) 50%
  );
  @media (max-width: 59em) {
    /* flex-direction: column-reverse; */
  }

  & h2 {
    color: var(--color-blue-200);
    font-weight: 500;
  }

  & span {
    color: var(--color-brand-500);
    text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
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

const StyledHeroSection = styled.section`
  display: flex;
  @media (max-width: 44em) {
    flex-direction: column-reverse;
  }

  & button {
    margin-top: 2.4rem;
  }
`;

const StyledHeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 75em) {
    flex: 2;
  }
  @media (max-width: 44em) {
    margin-top: 2.4rem;

    & h2 {
      font-size: 1.5rem;
    }
  }
`;

const StyledFigure = styled.figure`
  /* background-image: linear-gradient(to right, var(--color-blue-400)); */
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;

  /* @media (max-width: 59em) {
  } */
  @media (max-width: 75em) {
    flex: 1;
  }
  & img {
    position: relative;
    display: block;
    z-index: -1;
    width: 80%;
    height: 80%;
    margin: auto;
    margin-top: 0;

    @media (max-width: 44em) {
      width: 30%;
      height: 30%;
      object-fit: cover;
      margin: auto;
    }
    @media (max-width: 34em) {
      width: 50%;
      height: 50%;
      object-fit: cover;
      margin: auto;
    }
  }
`;

const StyledHeroH1 = styled.h1`
  font-size: 6.4rem;
  font-weight: 600;
  letter-spacing: 0.1rem;
  line-height: 1;

  @media (max-width: 84em) {
    font-size: 5rem;
  }
  @media (max-width: 59em) {
    font-size: 4rem;
  }
  @media (max-width: 44em) {
    font-size: 3rem;
  }
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
            // a purposefully thrown error (i.e. user hasn't paid)
            if (response.error) {
              throw new Error((response.error as any).message);
            }
            navigate("/dashboard/home");
          },
          onError: (error) => {
            console.log("error", error);
            if (error.message === "unpaid") {
              setShowLoginModal(false);
              setIsOpenBottomSlideIn(true);
              setBottomSlideInType("unpaid");
            }
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
      <StyledMainSection>
        <StyledHeroArticle>
          <StyledButtonContainer>
            <Button onClick={getUserGeo}>Boards Near You</Button>
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
          </StyledButtonContainer>
          <StyledHeroSection>
            <StyledHeroContent>
              <div>
                <StyledHeroH1>
                  Let's Make Community Boards Fun, Interactive & Useful Again
                </StyledHeroH1>
                <Heading as="h2">
                  Spread Your Message. <br />
                  See What Others are Posting in Your{" "}
                  <span>Local Digital Community Board</span>
                </Heading>
              </div>
              <Button onClick={getUserGeo}>Find a Board Near You</Button>
            </StyledHeroContent>
            <StyledFigure>
              <img
                src={"/images/flyer-hero-2.png"}
                height={"100%"}
                width={"100%"}
                alt=""
              />
            </StyledFigure>
          </StyledHeroSection>
        </StyledHeroArticle>
      </StyledMainSection>
      {isGettingLocation && (
        <OverlaySpinner message="Getting Your Location based on your device's GPS, mobile or wifi signal" />
      )}
      {coords && <LocationSelection coords={coords} />}
    </main>
  );
}
