import styled from "styled-components";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

import useGetPlans from "../../hooks/useGetPlans";
import OverlaySpinner from "../OverlaySpinner";
import { Plan } from "../../interfaces/Plan";
import PlanItem from "./PlanItem";
import { getPlansForSelect, sortPlansByLevel } from "../../utils/GeneralUtils";
import PlanInput from "../Form/PlanInput";
import FormControlRow from "../Form/FormControlRow";
import FormControl from "../Form/FormControl";
import { useState } from "react";
import Button from "../Button";

const StyledPlansContainer = styled.div``;
const StyledPlansItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 1.2rem;
  max-height: 700px;
  overflow-y: auto;
`;

export default function PlansContainer({
  register,
  value,
  errors,
}: {
  register: UseFormRegister<any>;
  value: string;
  errors: FieldErrors<FieldValues>;
}) {
  const [showPlans, setShowPlans] = useState(false);
  const { isLoading, plans, error } = useGetPlans();
  console.log("plans", plans);

  if (isLoading)
    return <OverlaySpinner message="Getting Plans"></OverlaySpinner>;

  if (error) return <div>Oops, could not get plans. Try again.</div>;

  return (
    <StyledPlansContainer>
      <FormControlRow>
        <PlanInput
          register={register}
          options={getPlansForSelect(plans!.data!)}
          value={value}
          errors={errors}
        />
        <FormControl>{/* Placeholder */}</FormControl>
      </FormControlRow>
      <Button
        type="button"
        size="small"
        onClick={() => setShowPlans(!showPlans)}
      >
        Show Plans
      </Button>
      {showPlans && (
        <StyledPlansItemsContainer>
          {plans &&
            sortPlansByLevel(plans.data!).map((plan: Plan) => (
              <PlanItem
                key={plan.id}
                plan={plan}
                selected={false}
                action={() => {}}
              />
            ))}
        </StyledPlansItemsContainer>
      )}
    </StyledPlansContainer>
  );
}
