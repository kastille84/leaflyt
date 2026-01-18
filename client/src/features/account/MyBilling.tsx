import styled from "styled-components";

import Heading from "../../ui/Heading";
import { useGlobalContext } from "../../context/GlobalContext";
import UpgradeText from "../../ui/UpgradeText";
import useGetUserLimits from "../../hooks/useGetUserLimits";
import Button from "../../ui/Button";

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

export default function MyBilling() {
  const {
    user,
    setShowCancelSubscriptionModal,
    setCancelSubscriptionModalType,
    setCustomerId,
  } = useGlobalContext();
  const { canUpgrade } = useGetUserLimits();
  console.log("user", user?.customers);
  const customer = user?.customers[0];

  function handleCancelSubscription() {
    setCustomerId(customer!.id!);
    setCancelSubscriptionModalType("onAccount");
    setShowCancelSubscriptionModal(true);
  }
  return (
    <MyPlanContainer>
      {canUpgrade && (
        <small>
          <UpgradeText
            text="Want to change your plan?"
            type="upgrade"
            btnText="Upgrade"
          ></UpgradeText>
        </small>
      )}
      <Heading as={"h3"}>Billing Information</Heading>

      <StyledPlanDatumContainer>
        <PlanDatum>
          <span>Status</span>
          <span style={{ textTransform: "capitalize" }}>
            {customer.subscriptionStatus}
          </span>
        </PlanDatum>
        <PlanDatum>
          <span>Current Plan</span>
          <span>
            {user!.plan!.name! + " Plan"}
            <br />
            <small>
              Max distance from your address to post a flyer virtually
            </small>
          </span>
        </PlanDatum>
        <PlanDatum>
          <span>Change Plan Tier?</span>{" "}
          <span>
            <UpgradeText
              text="Want to change your plan?"
              type="changePlan"
              btnText="Change Plan"
            ></UpgradeText>
            <small>
              If downgrading your plan, your capabilities will be limited.
            </small>
          </span>
        </PlanDatum>
        <PlanDatum>
          <span>Cancel Subscription?</span>{" "}
          <span>
            <small style={{ lineHeight: "1.7rem" }}>
              You will lose paid capabilities of higher plans. <br />
              You will be assigned to the Free Seed Plan. <br />
              Your account will permanently delete all your flyers
            </small>
            <p>
              <Button
                size="small"
                variation="danger"
                onClick={handleCancelSubscription}
              >
                Cancel Subscription
              </Button>
            </p>
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
