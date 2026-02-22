import { useEffect, useState } from "react";
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
import LandingItem from "../ui/LandingItem";
import InfoAlert from "../ui/InfoAlert";
import StepSection from "../ui/StepSection";

const StyledMain = styled.main`
  background-color: #fff;
`;

const StyledTopSection = styled.section`
  display: flex;
  gap: 3.2rem;
  width: 100%;
`;

const StyledLogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const StyledLogo = styled.img`
  width: 4rem;
  height: auto;
  @media (max-width: 59em) {
    width: 2rem;
  }
  @media (max-width: 44em) {
    width: 2rem;
  }
`;
const StyledMainSection = styled.section`
  color: var(--color-blue-200);
  /* height: 100dvh; */
  /* display: flex; */
  background-image: linear-gradient(
    to right,
    var(--color-blue-600) 5%,
    var(--color-blue-400) 50%
  );
  @media (max-width: 59em) {
    /* flex-direction: column-reverse; */
    height: auto;
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

const StyledExplainerSection = styled.section`
  background-color: #fff;
  padding: 4.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3.2rem;

  & h1,
  & h2 {
    text-align: center;
    font-weight: 500;
  }

  @media (max-width: 59em) {
    /* flex-direction: column-reverse; */
  }
`;
const StyledHowToSection = styled.section`
  background-color: #fff;
  padding: 4.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3.2rem;

  & h1,
  & h2 {
    text-align: center;
    font-weight: 500;
  }

  @media (max-width: 59em) {
    /* flex-direction: column-reverse; */
  }
`;

const StyledExplainerSectionIntro = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
`;

const StyledExplainerButtonsContainer = styled.div`
  display: flex;
  gap: 2.4rem;
`;

const StyledExplainerLandingItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3.2rem;

  @media (max-width: 59em) {
    justify-content: center;
  }
`;

const StepSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
  width: 40%;

  @media (max-width: 84em) {
    width: 100%;
  }
`;
export default function Landing() {
  const [explainerType, setExplainerType] = useState<"viewing" | "posting">(
    "viewing",
  );
  const [postingType, setPostingType] = useState<"onLocation" | "remote">(
    "onLocation",
  );
  const {
    getUserGeo,
    isGettingLocation,
    coords,
    setUser,
    setShowLoginModal,
    setIsOpenBottomSlideIn,
    setBottomSlideInType,
    setShowMerchantDisclaimerModal,
  } = useGlobalContext();
  const navigate = useNavigate();
  const { autoLogin } = useLoginWithAccessToken();
  // const [token, setToken] = useLocalStorageState(null, "access_token");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        autoLogin(session.access_token, {
          onSuccess: (response) => {
            // set user in global context
            setUser(response.data);
            // a purposefully thrown error (i.e. user hasn't paid)
            if (response.error) {
              throw new Error((response.error as any).message);
            }
            // check if url contains "flyer"
            if (!location.pathname.includes("fullFlyer")) {
              navigate("/dashboard/home");
            }
          },
          onError: (error) => {
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
    <StyledMain>
      <StyledMainSection>
        <StyledHeroArticle>
          <StyledTopSection>
            <StyledLogoContainer>
              <StyledLogo
                src="/images\logo\logo_chatgpt_leaf-removebg-preview.png"
                alt="Leaflit Logo"
              />
            </StyledLogoContainer>
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
          </StyledTopSection>
          <StyledHeroSection>
            <StyledHeroContent>
              <div>
                <StyledHeroH1>
                  Leaflit - Local Digital Community Boards
                </StyledHeroH1>
                <Heading as="h2">
                  See What Others Are Posting In Your <span>Community</span>
                  <br />
                  Spread Your Message.
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
      <StyledExplainerSection>
        <StyledExplainerSectionIntro>
          <StyledHeroH1>What Is Leaflit?</StyledHeroH1>
          <Heading as="h2">
            A Digital Flyer Distribution Platform For Your Local Community
          </Heading>
          <p>
            It creates a virtual community board near your location and allows
            you to post virtual flyers.{" "}
          </p>
          <figure>
            <img
              src={"/images/Board.png"}
              height={"100%"}
              width={"100%"}
              alt=""
            />
          </figure>
          <figure>
            <img
              src={"/images/Map_Virtual.png"}
              height={"100%"}
              width={"100%"}
              alt=""
            />
          </figure>
        </StyledExplainerSectionIntro>
        <Heading as="h1">Some (of many) Current Pain Points When: </Heading>
        <StyledExplainerButtonsContainer>
          <Button
            variation={explainerType === "viewing" ? "primary" : "secondary"}
            onClick={() => {
              setExplainerType("viewing");
            }}
            size="small"
          >
            Viewing Flyers
          </Button>
          <Button
            variation={explainerType === "posting" ? "primary" : "secondary"}
            onClick={() => {
              setExplainerType("posting");
            }}
            size="small"
          >
            Posting Flyers
          </Button>
        </StyledExplainerButtonsContainer>
        {explainerType === "viewing" && (
          <StyledExplainerLandingItemsContainer>
            <LandingItem
              type="warning"
              title="Messy Boards"
              description="Flyers are on top of each other fighting for limited space making it hard to read them."
            />
            <LandingItem
              type="warning"
              title="Rushed Viewing"
              description="Because Boards are placed near the entrance, you feel rushed and in the way."
            />
            <LandingItem
              type="warning"
              title="Outdated Flyers"
              description="You get excited about something only to find out that it's outdated."
            />
          </StyledExplainerLandingItemsContainer>
        )}
        {explainerType === "posting" && (
          <StyledExplainerLandingItemsContainer>
            <LandingItem
              type="warning"
              title="Limited Space"
              description="Flyers are on top of each other. You have to put yours on top of the others."
            />
            <LandingItem
              type="warning"
              title="Boards are Scarce"
              description="Limited places where you can place your flyers."
            />
            <LandingItem
              type="warning"
              title="Huge Effort"
              description="You have to take time, money, and energy to post flyers across town."
            />
          </StyledExplainerLandingItemsContainer>
        )}
        <Heading as="h1">Leaflit Solves These Problems and more... </Heading>
        {explainerType === "viewing" && (
          <StyledExplainerLandingItemsContainer>
            <LandingItem
              type="success"
              title="Organized Boards"
              description="Neat and legible flyers with ample space makes it easy to read."
            />
            <LandingItem
              type="success"
              title="All On Your Device"
              description="Post, View, Like, Share, and Save Flyers from your device on your own time."
            />
            <LandingItem
              type="success"
              title="Auto-Delete Old Flyers"
              description="Flyers have a lifespan and will be deleted automatically."
            />
          </StyledExplainerLandingItemsContainer>
        )}
        {explainerType === "posting" && (
          <StyledExplainerLandingItemsContainer>
            <LandingItem
              type="success"
              title="Ample Space"
              description="Your Flyer will be placed neatly. No flyers covering yours."
            />
            <LandingItem
              type="success"
              title="Boards are Plenty"
              description="Don't See a Board? Create One!"
            />
            <LandingItem
              type="success"
              title="Little Effort"
              description="Leaflit modernizes flyer distribution to save you time, money, and energy."
            />
          </StyledExplainerLandingItemsContainer>
        )}
      </StyledExplainerSection>
      <StyledHowToSection>
        <StyledExplainerSectionIntro>
          <StyledHeroH1>How To Use Leaflit?</StyledHeroH1>
          <InfoAlert type="info">
            <p>
              Physical establishments do not have a legal or commercial
              association with the virtual community boards on Leaflit.
            </p>
            <p>Leaflit is an independent platform. </p>
            <Button
              size="small"
              variation="secondary"
              onClick={() => setShowMerchantDisclaimerModal(true)}
            >
              Learn More
            </Button>
          </InfoAlert>
          <Heading as="h2">
            Leaflit has 2 modes to interact with boards and flyers: On-Location
            & Remote
          </Heading>
        </StyledExplainerSectionIntro>
        <StyledExplainerButtonsContainer>
          <Button
            variation={postingType === "onLocation" ? "primary" : "secondary"}
            onClick={() => {
              setPostingType("onLocation");
            }}
            size="small"
          >
            On-Location
          </Button>
          <Button
            variation={postingType === "remote" ? "primary" : "secondary"}
            onClick={() => {
              setPostingType("remote");
            }}
            size="small"
          >
            Remote
          </Button>
        </StyledExplainerButtonsContainer>
        {postingType === "onLocation" && (
          <StepSectionContainer>
            <StepSection
              number="1"
              description="Go to a physical establishment."
            />
            <StepSection
              number="2"
              description="Go To Leaflit on Your Device."
            />
            <StepSection number="3">
              <p>
                Tap on{" "}
                <Button size="small" onClick={getUserGeo}>
                  Find a Board Near You
                </Button>{" "}
                to get a list of boards.
              </p>
            </StepSection>
            <StepSection
              number="4"
              description="Pick the board that closely matches your location."
            />
            <StepSection
              number="5"
              description="View, Like, Share, and Save Flyers at that location."
            />
            <StepSection number="6">
              <p>Optionally, Post a Flyer</p>
              <p>
                You can post without signing up, but when you{" "}
                <Button size="small" onClick={() => handleSignUpClick()}>
                  create an account for free
                </Button>{" "}
                you get more features.
              </p>
            </StepSection>
          </StepSectionContainer>
        )}
        {postingType === "remote" && (
          <StepSectionContainer>
            <StepSection number="1">
              <p>This feature is only available to Regsitered Leaflit users.</p>
              <p>
                If you have an account, please sign in, otherwise create an
                account.
              </p>
              <Button size="small" onClick={() => handleSignUpClick()}>
                create an account for free
              </Button>
            </StepSection>
            <StepSection
              number="2"
              description="From the comfort of your home or office, Go to Leaflit on Your Device."
            />
            <StepSection
              number="3"
              description={
                'Select "My Area" from the side menu to see a map of your area which has a search bar.'
              }
            ></StepSection>
            <StepSection
              number="4"
              description="Search a location that you wish to view flyers."
            />
            <StepSection
              number="5"
              description="View, Like, Share, and Save Flyers at that location."
            />
            <StepSection number="6">
              <p>Remotely, Post a Flyer to that location</p>
            </StepSection>
          </StepSectionContainer>
        )}
      </StyledHowToSection>
      {isGettingLocation && (
        <OverlaySpinner message="Getting Your Location based on your device's GPS, mobile or wifi signal" />
      )}
      {coords && <LocationSelection coords={coords} />}
    </StyledMain>
  );
}
