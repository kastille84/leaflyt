import styled from "styled-components";

import Heading from "../../ui/Heading";
import { useGlobalContext } from "../../context/GlobalContext";
import UpgradeText from "../../ui/UpgradeText";
import useGetUserLimits from "../../hooks/useGetUserLimits";

const MyPlanContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;

  & h3 {
    color: var(--color-brand-600);
  }
  @media (max-width: 75em) {
    /* flex-direction: column;
  align-items: center; */
    /* flex-wrap: wrap; */
  }
  @media (max-width: 34em) {
    justify-content: center;
    align-items: center;
  }
`;

const StyledPlanDatumContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border: 1px solid var(--color-brand-500);
  border-radius: var(--border-radius-md);
  /* padding: 2.4rem; */
  width: 80%;
  max-width: 900px;

  @media (max-width: 44em) {
    width: 90%;
  }
`;

const PlanDatum = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  /* margin-bottom: 1.2rem; */
  border-bottom: 1px solid var(--color-grey-50);
  padding: 1rem 1.2rem;
  line-height: 1.4;

  &:nth-child(even) {
    background-color: var(--color-grey-100);
  }
  &:last-child {
    border-bottom: none;
  }
  & span:first-child {
    display: inline-block;
    font-weight: 600;
    width: 200px;
    min-width: 200px;
    border-right: 1px solid var(--color-brand-500);
    @media (max-width: 44em) {
      width: 150px;
      min-width: 150px;
    }
    @media (max-width: 34em) {
      width: 100px;
      min-width: 100px;
    }
  }
  & span:last-child {
    display: inline-block;
    font-weight: 400;
    margin-left: 1.2rem;
  }

  & small {
    font-size: 1.2rem;
  }
`;

export default function MyPlan() {
  const { user } = useGlobalContext();
  const { canUpgrade } = useGetUserLimits();
  console.log("plan", user?.plan);
  return (
    <MyPlanContainer>
      {canUpgrade && (
        <small>
          <UpgradeText
            text="Want more capabilities?"
            type="upgrade"
            btnText="Upgrade"
          ></UpgradeText>
        </small>
      )}
      <Heading as={"h3"}>{user?.plan.name} Plan</Heading>
      <p>{user?.plan.subtitle}</p>
      <StyledPlanDatumContainer>
        <PlanDatum>
          <span>Price</span>
          <span>
            ${user?.plan.price} /month <br />{" "}
            <small>{user?.plan.priceDescription}</small>
          </span>
        </PlanDatum>
        <PlanDatum>
          <span>On-location Posting</span>{" "}
          <span>
            {user?.plan.onLocationPostingLimit} flyers <br />
            <small>
              Going in person and posting flyers in your neighborhood
            </small>
          </span>
        </PlanDatum>
        <PlanDatum>
          <span>Remote Posting</span>{" "}
          <span>
            {user?.plan.remotePostingLimit} flyers <br />
            <small>
              Posting from your address without having to be physically near the
              location
            </small>
          </span>
        </PlanDatum>
        <PlanDatum>
          <span>Remote Posting Distance</span>{" "}
          <span>
            {(user!.plan!.virtualPostingDistance! * 100 * 0.621371).toFixed(2)}{" "}
            miles
            <br />
            <small>
              Max distance from your address to post a flyer virtually
            </small>
          </span>
        </PlanDatum>
        <PlanDatum>
          <span>Templates</span>{" "}
          <span>
            {user?.plan.templateLimit} templates <br />
            <small>Instantly post flyers based on pre-defined templates</small>
          </span>
        </PlanDatum>
        <PlanDatum>
          <span>Assets Allowed </span>{" "}
          <span>{user?.plan.numOfMedia} per flyer</span>
        </PlanDatum>
        <PlanDatum>
          <span>Total Assets</span> <span>{user?.plan.maxAssets}</span>
        </PlanDatum>
        <PlanDatum>
          <span>Lifespan</span>
          <span>
            Up to {user?.plan.lifespan} wks per flyer <br />
            <small>
              After this period, the flyer will be deleted from the boards
            </small>
          </span>
        </PlanDatum>
        {/* <PlanDatum>
          <span>Analytics</span> <span>{user?.plan.hasAnalytics}</span>
        </PlanDatum> */}
      </StyledPlanDatumContainer>
      {/* <PlanItem plan={user!.plan!} selected={true} action={() => {}} /> */}
    </MyPlanContainer>
  );
}
