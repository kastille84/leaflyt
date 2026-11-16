import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { HiOutlineQrCode } from "react-icons/hi2";
import {
  GiCalculator,
  GiFlowerPot,
  GiGuitar,
  GiMeditation,
  GiPaintBrush,
} from "react-icons/gi";
import { LuPlus } from "react-icons/lu";
import type { IconType } from "react-icons";
import Button from "../ui/Button";
import { useGlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import useLoginWithAccessToken from "../features/authentication/useLoginWithAccessToken";
import { supabase } from "../services/supabase";
import LandingItem from "../ui/LandingItem";
import InfoAlert from "../ui/InfoAlert";
import StepSection from "../ui/StepSection";

type ExplainerType = "viewing" | "posting";
type PostingType = "onLocation" | "remote";
type FlyerTone = "mint" | "sun" | "sky" | "slot";

// Problems and fixes are paired by index: each row reads "wall board -> Leaflit".
const EXPLAINERS: Record<
  ExplainerType,
  { problem: [string, string][]; fix: [string, string][] }
> = {
  viewing: {
    problem: [
      [
        "Messy Boards",
        "Flyers are on top of each other fighting for limited space making it hard to read them.",
      ],
      [
        "Rushed Viewing",
        "Because Boards are placed near the entrance, you feel rushed and in the way.",
      ],
      [
        "Outdated Flyers",
        "You get excited about something only to find out that it's outdated.",
      ],
    ],
    fix: [
      [
        "Organized Boards",
        "Neat and legible flyers with ample space makes it easy to read.",
      ],
      [
        "All On Your Device",
        "Post, View, Like, Share, and Save Flyers from your device on your own time.",
      ],
      [
        "Auto-Delete Old Flyers",
        "Flyers have a lifespan and will be deleted automatically.",
      ],
    ],
  },
  posting: {
    problem: [
      [
        "Limited Space",
        "Flyers are on top of each other. You have to put yours on top of the others.",
      ],
      [
        "Boards are Scarce",
        "Limited places where you can place your flyers. Low Exposure.",
      ],
      [
        "No Insights",
        "You have no idea if your flyers are getting attention. Or where is the best place to post them.",
      ],
    ],
    fix: [
      [
        "Ample Space",
        "Your Flyer will be placed neatly. No flyers covering yours. No one taking yours down.",
      ],
      [
        "Boards are Plenty",
        "Don't See a Board? Create One! You are in control of where the boards are placed. High Exposure.",
      ],
      [
        "Valuable Insights",
        "Leaflit give you insights about your flyers so that you can strategically place them.",
      ],
    ],
  },
};

const HERO_FLYERS: {
  tone: FlyerTone;
  title: string;
  detail: string;
  tilt: number;
  Icon: IconType;
}[] = [
  {
    tone: "mint",
    title: "Yoga in the park",
    detail: "Sat 9am, Riverside Park",
    tilt: -2.5,
    Icon: GiMeditation,
  },
  {
    tone: "sun",
    title: "Live music",
    detail: "Fri 7pm, The Local Brew",
    tilt: 2,
    Icon: GiGuitar,
  },
  {
    tone: "sky",
    title: "20% off plants",
    detail: "All weekend",
    tilt: 1.5,
    Icon: GiFlowerPot,
  },
  {
    tone: "mint",
    title: "Art show",
    detail: "June 1, Town Hall Gallery",
    tilt: -1.5,
    Icon: GiPaintBrush,
  },
  {
    tone: "slot",
    title: "Your flyer can be here",
    detail: "",
    tilt: 1,
    Icon: LuPlus,
  },
  {
    tone: "sun",
    title: "Free tax help",
    detail: "Tuesdays, Main St. Library",
    tilt: -2,
    Icon: GiCalculator,
  },
];

const HUB_PERKS = [
  "Neighbors see what's happening nearby while they wait or walk by.",
  "Your deals and specials sit on your board, always up to date.",
  "Flyers expire on their own, so nothing on your board goes stale.",
];

/* ---------- layout primitives ---------- */

const StyledMain = styled.main`
  --font-display: "Bricolage Grotesque", "DM Sans", sans-serif;
  background-color: #fff;
  overflow-x: hidden;

  & h1,
  & h2 {
    font-family: var(--font-display);
    letter-spacing: -0.02em;
  }
`;

const StyledSection = styled.section`
  padding: 9.6rem 4.8rem;

  @media (max-width: 59em) {
    padding: 6.4rem 3.2rem;
  }
  @media (max-width: 34em) {
    padding: 4.8rem 2rem;
  }
`;

const StyledInner = styled.div<{ $narrow?: boolean }>`
  width: 100%;
  max-width: ${({ $narrow }) => ($narrow ? "76rem" : "120rem")};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4.8rem;

  @media (max-width: 34em) {
    gap: 3.2rem;
  }
`;

const StyledSectionTitle = styled.h2`
  font-size: clamp(3.2rem, 4vw, 4.8rem);
  font-weight: 700;
  line-height: 1.1;
  max-width: 24ch;
  color: var(--color-blue-800);
`;

const StyledLead = styled.p`
  font-size: 1.9rem;
  line-height: 1.6;
  max-width: 60ch;
`;

const StyledSplit = styled.div<{ $reverse?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4.8rem;
  align-items: center;

  @media (max-width: 59em) {
    grid-template-columns: 1fr;
    gap: 3.2rem;
    & > :first-child {
      order: ${({ $reverse }) => ($reverse ? 2 : 0)};
    }
  }
`;

const StyledTextStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
  min-width: 0;
`;

const StyledVideo = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  background-color: var(--color-blue-800);

  & iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const StyledToggleGroup = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.4rem;
  border-radius: 99rem;
  background-color: var(--color-grey-75);
`;

const StyledToggle = styled.button<{ $active: boolean }>`
  min-height: 4.4rem;
  padding: 0 2.4rem;
  border: none;
  border-radius: 99rem;
  font-size: 1.6rem;
  font-weight: 600;
  transition: background-color 0.2s, color 0.2s;
  ${({ $active }) =>
    $active
      ? css`
          background-color: var(--color-brand-600);
          color: #fff;
        `
      : css`
          background-color: transparent;
          color: var(--color-grey-700);
          &:hover {
            background-color: var(--color-grey-100);
          }
        `}

  &:focus-visible {
    outline: 0.3rem solid var(--color-blue-500);
    outline-offset: 0.2rem;
  }

  @media (max-width: 34em) {
    flex: 1 1 auto;
    padding: 0 1.6rem;
  }
`;

/* ---------- hero ---------- */

const settle = keyframes`
  from {
    opacity: 0;
    transform: translateY(-2.4rem) rotate(calc(var(--tilt) * 3));
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(var(--tilt));
  }
`;

const StyledHero = styled.section`
  background-color: var(--color-blue-700);
  color: var(--color-blue-100);
  padding: 6.4rem 4.8rem 8rem;

  @media (max-width: 59em) {
    padding: 4.8rem 3.2rem 6.4rem;
  }
  @media (max-width: 34em) {
    padding: 3.2rem 2rem 4.8rem;
  }
`;

const StyledHeroGrid = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 4.8rem;
  align-items: center;

  @media (max-width: 59em) {
    grid-template-columns: 1fr;
    gap: 4.8rem;
  }
`;

const StyledHeroText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.4rem;
  min-width: 0;
`;

const StyledWordmark = styled.p`
  font-family: "DM Sans", sans-serif;
  font-size: clamp(6.4rem, 9vw, 12rem);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: 0.06em;
  color: var(--color-brand-100);
`;

const StyledHeroH1 = styled.h1`
  font-size: clamp(3.4rem, 4vw, 5.6rem);
  font-weight: 700;
  line-height: 1.05;
  color: #fff;
`;

const StyledHeroLead = styled.p`
  font-size: 2rem;
  line-height: 1.55;
  max-width: 44ch;
  color: var(--color-blue-200);
`;

const StyledHeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.6rem;
  margin-top: 0.8rem;

  @media (max-width: 34em) {
    width: 100%;
    flex-direction: column;
    & button {
      width: 100%;
    }
  }
`;

const StyledHeroButton = styled(Button)`
  min-height: 4.8rem;
  padding: 1.2rem 2.4rem;
  font-size: 1.7rem;
  font-weight: 600;

  &:focus-visible {
    outline: 0.3rem solid #fff;
    outline-offset: 0.3rem;
  }
`;

const StyledHeroGhostButton = styled(StyledHeroButton)`
  background-color: transparent;
  color: var(--color-blue-100);
  border: 1px solid var(--color-blue-400);
  box-shadow: none;

  &:hover {
    background-color: var(--color-blue-600);
    color: #fff;
  }
`;

const StyledBoard = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem 1.6rem;
  padding: 0.8rem;
  min-width: 0;

  & > :nth-child(even) {
    margin-top: 2.4rem;
  }

  @media (max-width: 34em) {
    gap: 1.6rem 1.2rem;
  }
`;

const flyerTones: Record<FlyerTone, ReturnType<typeof css>> = {
  mint: css`
    background-color: var(--color-brand-50);
    color: var(--color-brand-800);
  `,
  sun: css`
    background-color: var(--color-orange-200);
    color: var(--color-orange-800);
  `,
  sky: css`
    background-color: var(--color-blue-200);
    color: var(--color-blue-800);
  `,
  slot: css`
    background-color: transparent;
    color: var(--color-blue-200);
    border: 0.2rem dashed var(--color-blue-400);
    box-shadow: none;
    &::before {
      display: none;
    }
  `,
};

const StyledHeroFlyer = styled.div<{
  $tone: FlyerTone;
  $tilt: number;
  $index: number;
}>`
  --tilt: ${({ $tilt }) => $tilt}deg;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.2rem;
  aspect-ratio: 1 / 1;
  min-width: 0;
  padding: 2rem 1.6rem 1.6rem;
  border-radius: var(--border-radius-tiny);
  box-shadow: var(--shadow-lg);
  transform: rotate(var(--tilt));
  animation: ${settle} 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  animation-delay: ${({ $index }) => $index * 110}ms;
  ${({ $tone }) => flyerTones[$tone]}

  &::before {
    content: "";
    position: absolute;
    top: -0.8rem;
    left: 50%;
    width: 5.2rem;
    height: 1.6rem;
    transform: translateX(-50%) rotate(-3deg);
    background-color: rgba(255, 255, 255, 0.45);
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
  @media (max-width: 34em) {
    padding: 1.6rem 1.2rem 1.2rem;
  }
`;

const StyledFlyerArt = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 0;

  & svg {
    width: clamp(4rem, 5.5vw, 7.2rem);
    height: auto;
    max-height: 100%;
    opacity: 0.85;
  }
`;

const StyledFlyerTitle = styled.p`
  font-family: var(--font-display);
  font-size: clamp(2rem, 2.4vw, 3rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.01em;
`;

const StyledFlyerDetail = styled.p`
  font-size: 1.4rem;
  line-height: 1.3;
`;

/* ---------- community hub ---------- */

const StyledHubSection = styled(StyledSection)`
  background-color: var(--color-blue-800);
  color: var(--color-blue-200);

  & h2 {
    color: #fff;
  }
`;

const StyledHubList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 56ch;

  & li {
    position: relative;
    padding-left: 2.8rem;
    line-height: 1.5;
  }
  & li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.7rem;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    background-color: var(--color-brand-500);
  }
`;

const StyledHubButton = styled(StyledHeroButton)`
  margin-top: 0.8rem;
  @media (max-width: 34em) {
    width: 100%;
  }
`;

const StyledStorefront = styled.div`
  position: relative;
  width: 100%;
  max-width: 52rem;
  margin: 0 auto;
`;

const StyledAwning = styled.div`
  height: 6.4rem;
  border-radius: var(--border-radius-md) var(--border-radius-md) 0 0;
  background-image: repeating-linear-gradient(
    90deg,
    var(--color-brand-600) 0 4rem,
    #fff 4rem 8rem
  );
  box-shadow: 0 0.8rem 1.6rem rgba(0, 0, 0, 0.25);
`;

const StyledShopFront = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 3.2rem 2.4rem 2.4rem;
  background-color: var(--color-blue-700);
  border: 0.2rem solid var(--color-blue-600);
  border-top: none;
  align-items: start;

  @media (max-width: 34em) {
    gap: 1.2rem;
    padding: 2.4rem 1.6rem 1.6rem;
  }
`;

const StyledScanTile = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 1.6rem;
  border-radius: var(--border-radius-md);
  background-color: #fff;
  color: var(--color-grey-800);

  & svg {
    flex: 0 0 auto;
    width: 6.4rem;
    height: 6.4rem;
    color: var(--color-brand-700);
  }
  & p {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.15;
  }
`;

const StyledHubFlyer = styled(StyledHeroFlyer)`
  aspect-ratio: auto;
  min-height: 12rem;
  animation: none;
`;

/* ---------- misc sections ---------- */

const StyledProblemSection = styled(StyledSection)`
  background-color: #fff;
`;

const StyledPairs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const StyledPair = styled.div`
  display: flex;
  align-items: stretch;
  gap: 3.2rem;

  @media (max-width: 44em) {
    flex-direction: column;
    gap: 2.4rem;
    padding-bottom: 1.6rem;
  }
`;

const StyledPostSection = styled(StyledSection)`
  background-color: var(--color-brand-0);
`;

const StyledPostImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
`;

const StyledPostFigure = styled.figure`
  margin: 0;
`;

const StyledShots = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.4rem;

  @media (max-width: 44em) {
    grid-template-columns: 1fr;
  }
`;

const StyledShot = styled.figure`
  margin: 0;

  & img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-md);
  }
`;

const StyledHowToSection = styled(StyledSection)`
  background-color: var(--color-grey-50);
`;

const StyledSteps = styled.ol`
  list-style: none;
  width: 100%;
`;

/* ---------- page ---------- */

export default function Landing() {
  const [explainerType, setExplainerType] =
    useState<ExplainerType>("viewing");
  const [postingType, setPostingType] = useState<PostingType>("onLocation");

  const {
    getUserGeo,
    setUser,
    setShowLoginModal,
    setIsOpenBottomSlideIn,
    setBottomSlideInType,
    setShowMerchantDisclaimerModal,
  } = useGlobalContext();
  const navigate = useNavigate();
  const { autoLogin } = useLoginWithAccessToken();

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

    // look for url query parameter to get user's geo and if it exists, call getUserGeo
    const searchParams = new URLSearchParams(location.search);
    const userGeoParam = searchParams.get("getUserGeo");
    if (userGeoParam) {
      getUserGeo();
    }
  }, []);

  function handleSignUpClick() {
    setIsOpenBottomSlideIn(true);
    setBottomSlideInType("signup");
  }

  const { problem, fix } = EXPLAINERS[explainerType];

  return (
    <StyledMain>
      <StyledHero>
        <StyledHeroGrid>
          <StyledHeroText>
            <StyledWordmark>Leaflit</StyledWordmark>
            <StyledHeroH1>What's happening around you.</StyledHeroH1>
            <StyledHeroLead>
              Leaflit is the neighborhood bulletin board on your phone. Find
              local events, deals, and news posted by people nearby.
            </StyledHeroLead>
            <StyledHeroActions>
              <StyledHeroButton
                data-testid="get-geo-button-section"
                onClick={() => getUserGeo()}
              >
                Find boards near you
              </StyledHeroButton>
              <StyledHeroGhostButton onClick={handleSignUpClick}>
                Sign up free
              </StyledHeroGhostButton>
            </StyledHeroActions>
          </StyledHeroText>
          <StyledBoard aria-hidden="true">
            {HERO_FLYERS.map((flyer, index) => (
              <StyledHeroFlyer
                key={flyer.title}
                $tone={flyer.tone}
                $tilt={flyer.tilt}
                $index={index}
              >
                <StyledFlyerTitle>{flyer.title}</StyledFlyerTitle>
                <StyledFlyerArt>
                  <flyer.Icon />
                </StyledFlyerArt>
                {flyer.detail && (
                  <StyledFlyerDetail>{flyer.detail}</StyledFlyerDetail>
                )}
              </StyledHeroFlyer>
            ))}
          </StyledBoard>
        </StyledHeroGrid>
      </StyledHero>

      <StyledSection>
        <StyledInner>
          <StyledSplit>
            <StyledTextStack>
              <StyledSectionTitle>What is Leaflit?</StyledSectionTitle>
              <StyledLead>
                Leaflit turns neighborhood bulletin boards into a clean, local
                digital space. Create eye-catching flyers in seconds, reach
                people nearby, and see what's happening, all without
                cluttering physical walls.
              </StyledLead>
              <StyledLead>
                Promote events, specials, or community news and make an impact
                where it matters most: right next door.
              </StyledLead>
            </StyledTextStack>
            <StyledVideo>
              <iframe
                src="https://www.youtube.com/embed/xxXMfYuF6y4?si=Pke8P79gYmTfhfS7"
                title="What is Leaflit video"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </StyledVideo>
          </StyledSplit>
          <StyledShots>
            <StyledShot>
              <img src={"/images/Board.png"} alt="A Leaflit community board" />
            </StyledShot>
            <StyledShot>
              <img
                src={"/images/Map_Virtual.png"}
                alt="A map of nearby Leaflit boards"
              />
            </StyledShot>
          </StyledShots>
        </StyledInner>
      </StyledSection>

      <StyledProblemSection>
        <StyledInner>
          <StyledTextStack>
            <StyledSectionTitle>
              Wall boards get crowded. Leaflit keeps them clear.
            </StyledSectionTitle>
            <StyledLead>
              Choose how you use boards to see what changes.
            </StyledLead>
            <StyledToggleGroup role="group" aria-label="How you use boards">
              <StyledToggle
                type="button"
                $active={explainerType === "viewing"}
                aria-pressed={explainerType === "viewing"}
                onClick={() => setExplainerType("viewing")}
              >
                Viewing Flyers
              </StyledToggle>
              <StyledToggle
                type="button"
                $active={explainerType === "posting"}
                aria-pressed={explainerType === "posting"}
                onClick={() => setExplainerType("posting")}
              >
                Posting Flyers
              </StyledToggle>
            </StyledToggleGroup>
          </StyledTextStack>
          <StyledPairs>
            {problem.map(([problemTitle, problemText], index) => (
              <StyledPair key={problemTitle}>
                <LandingItem
                  type="warning"
                  title={problemTitle}
                  description={problemText}
                />
                <LandingItem
                  type="success"
                  title={fix[index][0]}
                  description={fix[index][1]}
                />
              </StyledPair>
            ))}
          </StyledPairs>
        </StyledInner>
      </StyledProblemSection>

      <StyledHubSection>
        <StyledInner>
          <StyledSplit>
            <StyledTextStack>
              <StyledSectionTitle>
                Turn your storefront into a community hub
              </StyledSectionTitle>
              <StyledLead>
                Give people a reason to look up when they pass your door. With a
                Leaflit board at your location, visitors, patrons, and
                passersby can find out what's happening in the neighborhood,
                and see your deals and specials too.
              </StyledLead>
              <StyledHubList>
                {HUB_PERKS.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </StyledHubList>
              <StyledHubButton onClick={handleSignUpClick}>
                Create your storefront board
              </StyledHubButton>
            </StyledTextStack>
            <StyledStorefront aria-hidden="true">
              <StyledAwning />
              <StyledShopFront>
                <StyledScanTile>
                  <HiOutlineQrCode />
                  <p>Scan to see what's happening nearby</p>
                </StyledScanTile>
                <StyledHubFlyer $tone="mint" $tilt={-2} $index={0}>
                  <StyledFlyerTitle>Block party</StyledFlyerTitle>
                  <StyledFlyerDetail>Sat 4pm, Elm Street</StyledFlyerDetail>
                </StyledHubFlyer>
                <StyledHubFlyer $tone="sun" $tilt={2} $index={0}>
                  <StyledFlyerTitle>Today's special</StyledFlyerTitle>
                  <StyledFlyerDetail>2-for-1 coffee until noon</StyledFlyerDetail>
                </StyledHubFlyer>
              </StyledShopFront>
            </StyledStorefront>
          </StyledSplit>
        </StyledInner>
      </StyledHubSection>

      <StyledPostSection>
        <StyledInner>
          <StyledSplit $reverse>
            <StyledPostFigure>
              <StyledPostImage
                src={"/images/Leaflit_Flyer_img.png"}
                alt="A flyer made with Leaflit"
              />
            </StyledPostFigure>
            <StyledTextStack>
              <StyledSectionTitle>
                Anyone can post flyers, including you
              </StyledSectionTitle>
              <StyledLead>
                No design skills needed. Pick a board, make a flyer, and share
                it with the people who live and shop nearby.
              </StyledLead>
              <Button size="large" onClick={handleSignUpClick}>
                Post your first flyer
              </Button>
            </StyledTextStack>
          </StyledSplit>
        </StyledInner>
      </StyledPostSection>

      <StyledHowToSection>
        <StyledInner $narrow>
          <StyledTextStack>
            <StyledSectionTitle>How to use Leaflit</StyledSectionTitle>
            <InfoAlert type="info" hideIcon>
              <p>
                Physical establishments do not have a legal or commercial
                association with the virtual community boards on Leaflit.
              </p>
              <p>Leaflit is an independent platform. </p>
              <div style={{ textAlign: "center" }}>
                <Button
                  size="small"
                  variation="secondary"
                  onClick={() => setShowMerchantDisclaimerModal(true)}
                >
                  Learn More
                </Button>
              </div>
            </InfoAlert>
          </StyledTextStack>
          <StyledVideo>
            <iframe
              src="https://www.youtube.com/embed/vihocHvjwTI?si=03kKYhKDQjkCI5tS"
              title="How to use Leaflit video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </StyledVideo>
          <StyledTextStack>
            <StyledLead>
              Leaflit has 2 modes to interact with boards and flyers:
              On-Location &amp; Remote
            </StyledLead>
            <StyledToggleGroup role="group" aria-label="Leaflit mode">
              <StyledToggle
                type="button"
                $active={postingType === "onLocation"}
                aria-pressed={postingType === "onLocation"}
                onClick={() => setPostingType("onLocation")}
              >
                On-Location
              </StyledToggle>
              <StyledToggle
                type="button"
                $active={postingType === "remote"}
                aria-pressed={postingType === "remote"}
                onClick={() => setPostingType("remote")}
              >
                Remote
              </StyledToggle>
            </StyledToggleGroup>
          </StyledTextStack>
          {postingType === "onLocation" && (
            <StyledSteps>
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
            </StyledSteps>
          )}
          {postingType === "remote" && (
            <StyledSteps>
              <StepSection number="1">
                <p>
                  This feature is only available to Registered Leaflit users.
                </p>
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
              />
              <StepSection
                number="4"
                description="Search a location to load their board and flyers."
              />
              <StepSection
                number="5"
                description="View, Like, Share, and Save Flyers at that location."
              />
              <StepSection
                number="6"
                description="Remotely, Post a Flyer to that location while being at home or office"
              />
            </StyledSteps>
          )}
        </StyledInner>
      </StyledHowToSection>
    </StyledMain>
  );
}
