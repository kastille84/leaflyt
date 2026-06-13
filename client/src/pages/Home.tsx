import { useEffect } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useGlobalContext } from "../context/GlobalContext";
import Heading from "../ui/Heading";
import useSignup from "../features/authentication/useSignup";
import Button from "../ui/Button";
import CreateFlyerButton from "../ui/Flyer/CreateFlyerButton";

const StyledHome = styled.div`
  background: var(--color-grey-0);
  min-height: 100vh;
`;

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.4rem 2rem;
`;

const Hero = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.4rem;
  padding: 2.4rem;
  background: linear-gradient(90deg, #ffffff 0%, #f8fbff 100%);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);

  @media (max-width: 75rem) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  color: var(--color-brand-700);
  @media (max-width: 75rem) {
    order: 2;
  }
`;

const HeroSubtitle = styled.p`
  margin-top: 0.8rem;
  color: var(--color-grey-700);
  font-size: 1.6rem;
`;

const CTAContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.6rem;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    & button {
      width: 100%;
    }
  }
`;

const HeroVisual = styled.div`
  flex: 0 0 360px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 75rem) {
    /* width: 100%; */
    flex: none;
    margin-top: 1rem;
    order: 1;

    & img {
      width: 70%;
    }
  }
`;

const FeaturesGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.6rem;
  margin-top: 2.4rem;
`;

const FeatureCard = styled.article`
  background: #fff;
  padding: 2.4rem;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  & h3 {
    color: var(--color-brand-600);
  }
`;

const HowItWorks = styled.section`
  margin-top: 2.8rem;
  background: transparent;
  padding: 1.6rem 0;

  & h2,
  strong {
    color: var(--color-orange-700);
  }
  & strong {
    font-size: 1.8rem;
    display: inline-block;
  }
`;

const StepsList = styled.ul`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const StepItem = styled.li`
  background: #fff;
  padding: 1rem;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-md);
  min-width: 220px;
  flex: 1 1 220px;
  padding: 2.4rem;
`;

export default function Home() {
  const {
    user,
    getUserGeo,
    setIsOpenBottomSlideIn,
    setBottomSlideInType,
    selectedPlace,
  } = useGlobalContext();
  const [searchParams] = useSearchParams();
  const { sendWelcomeEmailFn } = useSignup();

  const verified = searchParams.get("verified");
  const email = searchParams.get("email");
  const typeOfUser = searchParams.get("typeOfUser");
  const name = searchParams.get("name") || "";
  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";

  // stripe
  const sessionId = searchParams.get("session_id");
  const customerId = searchParams.get("customer_id");
  const plan = searchParams.get("plan");

  function showName() {
    if (user?.name) return `, ${user?.name}`;
    if (user?.firstName) return `, ${user?.firstName}`;
    return "";
  }

  useEffect(() => {
    if (verified === "true" && email && typeOfUser) {
      sendWelcomeEmailFn({ email, typeOfUser, name, firstName, lastName });
    }
    if (sessionId && customerId && plan) {
      toast.success(
        "Payment successful! Verify your email and re-login to activate your plan.",
        { duration: 8000 },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSignupSlide() {
    setBottomSlideInType("signup");
    setIsOpenBottomSlideIn(true);
  }

  return (
    <StyledHome>
      <StyledContainer>
        <Hero>
          <HeroContent>
            <Heading as="h1">Welcome{showName()}</Heading>
            <HeroSubtitle>
              Leaflit helps you discover local community boards, view and save
              flyers, and easily create and distribute your own — whether you
              post as a guest or set up a free account for richer options.
            </HeroSubtitle>

            <CTAContainer>
              {selectedPlace && <CreateFlyerButton size="large" />}
              <Button onClick={getUserGeo} variation="secondary">
                Find Boards Nearby
              </Button>
              {!user && (
                <Button variation="primary" onClick={handleSignupSlide}>
                  Create a Free Account
                </Button>
              )}
            </CTAContainer>
          </HeroContent>

          <HeroVisual>
            <img
              src="/images/logo/logo_chatgpt_resized-removebg-preview.png"
              alt="Leaflit — community flyers"
              style={{ maxWidth: "260px", width: "100%" }}
            />
          </HeroVisual>
        </Hero>

        <FeaturesGrid>
          <FeatureCard>
            <Heading as="h3">Discover Boards</Heading>
            <p>
              Find public and virtual community boards near you to stay in the
              loop.
            </p>
          </FeatureCard>

          <FeatureCard>
            <Heading as="h3">View & Save</Heading>
            <p>
              Browse flyers, save favorites, and keep coupons or event info for
              later.
            </p>
          </FeatureCard>

          <FeatureCard>
            <Heading as="h3">Create Quickly</Heading>
            <p>
              Post a basic flyer instantly as a guest or use enhanced templates
              with a free account.
            </p>
          </FeatureCard>

          <FeatureCard>
            <Heading as="h3">Promote & Track</Heading>
            <p>
              Upgrade to access analytics, custom layouts, and broader
              distribution.
            </p>
          </FeatureCard>
        </FeaturesGrid>

        <HowItWorks>
          <Heading as="h2">Get Started in 3 Simple Steps</Heading>
          <StepsList>
            <StepItem>
              <strong>1.</strong>
              <p>Explore boards near you and find what matters.</p>
            </StepItem>
            <StepItem>
              <strong>2.</strong>
              <p>Save flyers you like and keep them handy.</p>
            </StepItem>
            <StepItem>
              <strong>3.</strong>
              <p>Create and share your flyer to reach neighbors.</p>
            </StepItem>
          </StepsList>
        </HowItWorks>

        <div style={{ marginTop: "2.4rem" }}>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/se7Zg0KZ62o?si=WkQabSgzoBVRLCcM"
            title="Leaflit overview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            style={{ width: "100%", maxWidth: 960 }}
          />
        </div>
      </StyledContainer>
    </StyledHome>
  );
}
