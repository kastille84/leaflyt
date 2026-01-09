import styled from "styled-components";
import { Plan } from "../../interfaces/Plan";
import Button from "../Button";

const StyledPlanItem = styled.div<{ selected: boolean }>`
  width: 300px;
  padding: 1.2rem;
  border: 1px solid var(--color-grey-200);
  box-shadow: var(--shadow-lg);
  border-top: 5px solid
    ${(props) =>
      props.selected ? "var(--color-blue-600)" : "var(--color-brand-600)"};
  position: relative;
`;

const StyledPlanName = styled.div<{ selected: boolean }>`
  color: ${(props) =>
    props.selected ? "var(--color-blue-600)" : "var(--color-brand-600)"};
  font-weight: 600;
  font-size: 2.4rem;
`;
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

const StyledPriceValue = styled.p<{ selected: boolean }>`
  font-weight: 600;
  font-size: 4.8rem;
  color: ${(props) =>
    props.selected ? "var(--color-blue-600)" : "var(--color-brand-600)"};
`;

const StyledPlanDescription = styled.p`
  font-size: 1.4rem;
  font-weight: 600;
  font-style: italic;
  color: var(--color-orange-600);
  text-align: right;
`;

const StyledFeatureText = styled.p<{ selected: boolean }>`
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(props) =>
    props.selected ? "var(--color-blue-600)" : "var(--color-brand-600)"};
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
const StyledDatumValue = styled.p<{ selected: boolean }>`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${(props) =>
    props.selected ? "var(--color-blue-600)" : "var(--color-brand-600)"};
`;
const StyledDatumLabel = styled.p`
  color: var(--color-grey-600);
  font-size: 1.2rem;
`;

const StyledActionContainer = styled.div`
  padding: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  & button {
    flex-grow: 1;
    align-self: flex-end;
  }
`;

const StyledRecommended = styled.p`
  position: absolute;
  top: -5px;
  right: 0;
  background-color: var(--color-orange-500);
  color: #fff;
  padding: 0.4rem 0.8rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

const StyledSelected = styled.p`
  position: absolute;
  top: -5px;
  left: 0;
  background-color: var(--color-blue-600);
  color: #fff;
  padding: 0.4rem 0.8rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

export default function PlanItem({
  plan,
  selected,
  action,
}: {
  plan: Plan;
  selected: boolean;
  action: () => void;
}) {
  return (
    <StyledPlanItem selected={selected}>
      {selected && <StyledSelected>Selected</StyledSelected>}
      {plan.level === 3 && <StyledRecommended>Recommended</StyledRecommended>}
      <StyledPlanItemSection>
        <StyledPlanName selected={selected}>{plan.name}</StyledPlanName>
        <StyledPlanSubtitle>{plan.subtitle}</StyledPlanSubtitle>
      </StyledPlanItemSection>
      <StyledPlanPriceSection>
        <StyledPlanPrice>
          <StyledPriceValue selected={selected}>${plan.price}</StyledPriceValue>
          <p>/ month</p>
        </StyledPlanPrice>
        <StyledPlanDescription>{plan.priceDescription}</StyledPlanDescription>
      </StyledPlanPriceSection>
      <StyledFeatureText selected={selected}>Features</StyledFeatureText>
      {/* Max Flyers */}
      <StyledPlanItemSection>
        <StyledDatum>
          <StyledDatumValue selected={selected}>
            {plan.onLocationPostingLimit + plan.remotePostingLimit}
          </StyledDatumValue>
          <StyledDatumLabel>max flyers posted at any moment</StyledDatumLabel>
        </StyledDatum>
      </StyledPlanItemSection>
      {/* On Location */}
      <StyledPlanItemSection>
        <StyledDatum>
          <StyledDatumValue selected={selected}>
            {plan.onLocationPostingLimit}
          </StyledDatumValue>
          <StyledDatumLabel>of those posted on location</StyledDatumLabel>
        </StyledDatum>
      </StyledPlanItemSection>
      {/* Remote */}
      <StyledPlanItemSection>
        <StyledDatum>
          <StyledDatumValue selected={selected}>
            {plan.remotePostingLimit}
          </StyledDatumValue>
          <StyledDatumLabel>of those posted from home/office</StyledDatumLabel>
        </StyledDatum>
      </StyledPlanItemSection>
      {/* Remote Distance */}
      <StyledPlanItemSection>
        <StyledDatum>
          <StyledDatumLabel>Post up to</StyledDatumLabel>
          <StyledDatumValue selected={selected}>
            {(plan!.virtualPostingDistance! * 100 * 0.621371).toFixed(2)}
          </StyledDatumValue>
          <StyledDatumLabel>Miles away</StyledDatumLabel>
        </StyledDatum>
      </StyledPlanItemSection>
      {/* Templates */}
      <StyledPlanItemSection>
        <StyledDatum>
          <StyledDatumLabel>Create up to</StyledDatumLabel>
          <StyledDatumValue selected={selected}>
            {plan.templateLimit}
          </StyledDatumValue>
          <StyledDatumLabel>Templates for fast posting</StyledDatumLabel>
        </StyledDatum>
      </StyledPlanItemSection>
      {/* Max Assets */}
      <StyledPlanItemSection>
        <StyledDatum>
          <StyledDatumValue selected={selected}>
            {plan.maxAssets}
          </StyledDatumValue>
          <StyledDatumLabel>Max total assets </StyledDatumLabel>
        </StyledDatum>
        <StyledDatum>
          <StyledDatumLabel>Type</StyledDatumLabel>
          <StyledDatumValue selected={selected}>
            {plan.level === 1 ? "Images only" : "Images & Videos"}
          </StyledDatumValue>
        </StyledDatum>
      </StyledPlanItemSection>
      {/* Assets Per Flyer */}
      <StyledPlanItemSection>
        <StyledDatum>
          <StyledDatumValue selected={selected}>
            {plan.numOfMedia}
          </StyledDatumValue>
          <StyledDatumLabel>Max assets per flyer</StyledDatumLabel>
        </StyledDatum>
      </StyledPlanItemSection>
      {/* Lifespan */}
      <StyledPlanItemSection>
        <StyledDatum>
          <StyledDatumLabel>Up to</StyledDatumLabel>
          <StyledDatumValue selected={selected}>
            {plan.lifespan}
          </StyledDatumValue>
          <StyledDatumLabel>weeks lifespan</StyledDatumLabel>
        </StyledDatum>
      </StyledPlanItemSection>
      <StyledActionContainer>
        <Button size="large" onClick={action}>
          Select
        </Button>
      </StyledActionContainer>
    </StyledPlanItem>
  );
}
