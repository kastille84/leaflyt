import { useEffect } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useGlobalContext } from "../context/GlobalContext";
import Heading from "../ui/Heading";
import useSignup from "../features/authentication/useSignup";

const StyledHome = styled.div``;

const StyledAnnouncementSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.4rem;
  margin: 0 3.6rem 3.6rem 3.6rem;
`;
const StyledHeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-brand-600);
  color: var(--color-grey-50);
  /* border: 1px solid var(--color-brand-600); */
  border-radius: var(--border-radius-lg);
  padding: 3.6rem;
`;

const StyledGreetingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  align-items: center;
  margin-bottom: 3.6rem;
`;

const StyledStepsContainer = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  & small {
    color: var(--color-brand-700);
    font-weight: 600;
  }
`;

export default function Home() {
  const { user } = useGlobalContext();
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
    if (user?.name) {
      return `, ${user?.name}`;
    } else if (user?.firstName) {
      return `, ${user?.firstName}`;
    }
    return "";
  }

  useEffect(() => {
    if (verified === "true" && email && typeOfUser) {
      sendWelcomeEmailFn({ email, typeOfUser, name, firstName, lastName });
    }
    if (sessionId && customerId && plan) {
      toast.success(
        "Payment successful! \nImportant: \nVerify Your Email, If it's your first time here. \nThen Login or Re-Login for new plan to take affect.",
        {
          duration: 10000,
        }
      );
    }
  }, []);

  return (
    <StyledHome>
      <StyledAnnouncementSection>
        <StyledHeadingContainer>
          <Heading as="h1">
            Welcome to Leaflit
            {showName()}
          </Heading>
          <p>We're a Flyer Distribution Platform for Your Community</p>
        </StyledHeadingContainer>
      </StyledAnnouncementSection>
      <StyledGreetingsContainer>
        <Heading as="h3">
          Whether you are a business, organization or individual, <br />
          We make it easy for you to view and distribute flyers in your
          community. <br />
          We are beta testing and looking for early adopters.
          <br />
          There's more features to come, but for right now...
        </Heading>
      </StyledGreetingsContainer>
      <StyledStepsContainer>
        <div>
          <li>
            Explore Your Neighborhood. -{" "}
            <small>(In-person or virtual via "My Area")</small>
          </li>
          <li>
            Find Community Boards. - <small>(Be In the Know)</small>
          </li>
          <li>
            View Flyers. - <small>(Find Something Interesting)</small>
          </li>
          <li>
            Save Flyers For Later. -{" "}
            <small> (Some Have Coupons or Deals)</small>
          </li>
          <li>
            Best Part... Distribute Your Own Flyers. -{" "}
            <small>(Spread Your Message)</small>
          </li>
        </div>
      </StyledStepsContainer>
    </StyledHome>
  );
}
