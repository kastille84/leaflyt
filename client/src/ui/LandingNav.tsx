import styled from "styled-components";
import Button from "./Button";
import { useGlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";

const StyledNavSection = styled.section`
  position: sticky;
  top: 0;
  z-index: 1000;
  color: var(--color-blue-200);
  background-color: var(--color-blue-600);
  padding: 2.4rem;
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
  cursor: pointer;
  width: 4rem;
  height: auto;
  @media (max-width: 59em) {
    width: 2rem;
  }
  @media (max-width: 44em) {
    width: 2rem;
  }
`;

const StyledButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 3.2rem;
  @media (max-width: 44em) {
    gap: 2.4rem;
  }
  /* padding-right: 3.2rem; */
`;

const StyledAuthButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2.4rem;
  @media (max-width: 44em) {
    gap: 1.4rem;
  }
`;

const StyledPricingText = styled.p`
  color: var(--color-blue-200);
  font-weight: 500;
  font-size: 1.6rem;
  cursor: pointer;
  @media (max-width: 44em) {
    font-size: 1.4rem;
  }
`;

export default function LandingNav() {
  const {
    getUserGeo,
    setShowLoginModal,
    setIsOpenBottomSlideIn,
    setBottomSlideInType,
  } = useGlobalContext();
  const navigate = useNavigate();

  function handleSignUpClick() {
    setIsOpenBottomSlideIn(true);
    setBottomSlideInType("signup");
  }

  return (
    <StyledNavSection>
      <StyledTopSection>
        <StyledLogoContainer>
          <StyledLogo
            src="/images\logo\logo_chatgpt_leaf-removebg-preview.png"
            alt="Leaflit Logo"
            onClick={() => navigate("/")}
          />
        </StyledLogoContainer>
        <StyledButtonContainer>
          <Button onClick={getUserGeo}>Find Boards</Button>
          <StyledAuthButtonsContainer>
            <StyledPricingText
              onClick={() => {
                navigate("/pricing");
              }}
            >
              Price
            </StyledPricingText>
            {/* <StyledPricingText
              onClick={() => {
                navigate("/faq");
              }}
            >
              FAQ
            </StyledPricingText> */}
            <Button variation="secondary" onClick={handleSignUpClick}>
              Sign Up
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
    </StyledNavSection>
  );
}
