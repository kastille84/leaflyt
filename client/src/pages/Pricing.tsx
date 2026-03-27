import styled from "styled-components";
import { sortPlansByLevel } from "../utils/GeneralUtils";
import useGetPlans from "../hooks/useGetPlans";
import OverlaySpinner from "../ui/OverlaySpinner";
import PlanItem from "../ui/Plan/PlanItem";
import { Plan } from "../interfaces/Plan";
import LandingNav from "../ui/LandingNav";
import Heading from "../ui/Heading";
import { useGlobalContext } from "../context/GlobalContext";
import Button from "../ui/Button";
import Footer from "../ui/Footer";

const StyledMain = styled.main`
  background-color: #fff;
`;
const StyledMainSection = styled.section`
  padding: 4rem 2.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3.2rem;
  min-height: 500px;
`;

const StyledNavSection = styled.section`
  position: sticky;
  top: 0;
  z-index: 1000;
  color: var(--color-blue-200);
  /* height: 100dvh; */
  /* display: flex; */
  background-color: var(--color-blue-600);
  padding: 2.4rem;
`;

const StyledPlansItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 1.2rem;

  /* @media (max-height: 59em) {
    height: 60dvh;
    min-height: unset;
  } */
`;

export default function Pricing() {
  const { isLoading, plans, error } = useGetPlans();

  function handleRegisterClick() {
    setBottomSlideInType("signup");
    setIsOpenBottomSlideIn(true);
  }

  const { setBottomSlideInType, setIsOpenBottomSlideIn } = useGlobalContext();

  return (
    <StyledMain>
      <StyledNavSection>
        <LandingNav />
      </StyledNavSection>
      <StyledMainSection>
        <Heading as={"h1"}>Plans that fits your needs</Heading>
        <Heading as={"h2"}>
          All designed to help you spread your message while saving you time and
          money.
        </Heading>
        <Button onClick={() => handleRegisterClick()}>Get Started</Button>
        {isLoading && <OverlaySpinner message="Loading Plans..." />}
        {error && <p>Error loading plans: {error.message}</p>}
        {plans && (
          <StyledPlansItemsContainer>
            {sortPlansByLevel(plans.data!).map((plan: Plan) => (
              <PlanItem
                key={plan.id}
                plan={plan}
                selected={false}
                disabled={false}
              />
            ))}
          </StyledPlansItemsContainer>
        )}
      </StyledMainSection>
    </StyledMain>
  );
}
