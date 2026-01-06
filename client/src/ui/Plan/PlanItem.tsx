import styled from "styled-components";
import { Plan } from "../../interfaces/Plan";

const StyledPlanItem = styled.div`
  width: 300px;
  padding: 1.2rem;
  border: 1px solid var(--color-grey-200);
  box-shadow: var(--shadow-lg);
  border-top: 5px solid var(--color-brand-600);
  border-radius: var(--border-radius-md);
  background-color: var(--color-grey-50);
`;

const StyledPlanName = styled.div``;
const StyledPlanSubtitle = styled.p`
  font-size: 1.4rem;
`;
const StyledPlanPriceSection = styled.div`
  padding: 1.2rem;
`;

const StyledPlanPrice = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.8rem;
`;

const StyledPriceValue = styled.p`
  font-weight: 600;
  font-size: 4.8rem;
  color: var(--color-brand-600);
`;

const StyledPlanItemSection = styled.div`
  border-bottom: 1px solid var(--color-grey-200);
  padding: 1.2rem;
`;

const StyledDatum = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;
const StyledDatumValue = styled.p`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-brand-600);
`;
const StyledDatumLabel = styled.p`
  color: var(--color-grey-600);
  font-size: 1.2rem;
`;

export default function PlanItem({
  plan,
  selected,
}: {
  plan: Plan;
  selected: boolean;
}) {
  return (
    <StyledPlanItem>
      <StyledPlanItemSection>
        <StyledPlanName>{plan.name}</StyledPlanName>
        <StyledPlanSubtitle>{plan.subtitle}</StyledPlanSubtitle>
      </StyledPlanItemSection>
      <StyledPlanPriceSection>
        <StyledPlanPrice>
          <StyledPriceValue>${plan.price}</StyledPriceValue>
          <p>/ month</p>
        </StyledPlanPrice>
        <StyledPlanSubtitle style={{ textAlign: "right" }}>
          {plan.priceDescription}
        </StyledPlanSubtitle>
      </StyledPlanPriceSection>
      <p>Features</p>
      {/* Max Flyers */}
      <StyledPlanItemSection>
        <StyledDatum>
          <StyledDatumValue>
            {plan.onLocationPostingLimit + plan.remotePostingLimit}
          </StyledDatumValue>
          <StyledDatumLabel>max flyers posted at any moment</StyledDatumLabel>
        </StyledDatum>
      </StyledPlanItemSection>
      {/* On Location */}
      <StyledPlanItemSection>
        <StyledDatum>
          <StyledDatumValue>{plan.onLocationPostingLimit}</StyledDatumValue>
          <StyledDatumLabel>of those posted on location</StyledDatumLabel>
        </StyledDatum>
      </StyledPlanItemSection>
      {/* Remote */}
      <StyledPlanItemSection>
        <StyledDatum>
          <StyledDatumValue>{plan.remotePostingLimit}</StyledDatumValue>
          <StyledDatumLabel>of those posted from home/office</StyledDatumLabel>
        </StyledDatum>
      </StyledPlanItemSection>
      {/* Remote Distance */}
      <StyledPlanItemSection>
        <StyledDatum>
          <StyledDatumLabel>Post up to</StyledDatumLabel>
          <StyledDatumValue>
            {(plan!.virtualPostingDistance! * 100 * 0.621371).toFixed(2)}
          </StyledDatumValue>
          <StyledDatumLabel>Miles away</StyledDatumLabel>
        </StyledDatum>
      </StyledPlanItemSection>
      {/* Templates */}
      <StyledPlanItemSection>
        <StyledDatum>
          <StyledDatumLabel>Create up to</StyledDatumLabel>
          <StyledDatumValue>{plan.templateLimit}</StyledDatumValue>
          <StyledDatumLabel>Templates for fast posting</StyledDatumLabel>
        </StyledDatum>
      </StyledPlanItemSection>
      {/* Max Assets */}
      <StyledPlanItemSection>
        <StyledDatum>
          <StyledDatumValue>{plan.maxAssets}</StyledDatumValue>
          <StyledDatumLabel>Max total assets </StyledDatumLabel>
        </StyledDatum>
        <StyledDatum>
          <StyledDatumLabel>Type</StyledDatumLabel>
          <StyledDatumValue>
            {plan.level === 1 ? "Images only" : "Images & Videos"}
          </StyledDatumValue>
        </StyledDatum>
      </StyledPlanItemSection>
      {/* Assets Per Flyer */}
      <StyledPlanItemSection>
        <StyledDatum>
          <StyledDatumValue>{plan.numOfMedia}</StyledDatumValue>
          <StyledDatumLabel>Max assets per flyer</StyledDatumLabel>
        </StyledDatum>
      </StyledPlanItemSection>
      {/* Lifespan */}
      <StyledPlanItemSection>
        <StyledDatum>
          <StyledDatumLabel>Up to</StyledDatumLabel>
          <StyledDatumValue>{plan.lifespan}</StyledDatumValue>
          <StyledDatumLabel>weeks lifespan</StyledDatumLabel>
        </StyledDatum>
      </StyledPlanItemSection>
    </StyledPlanItem>
  );
}
