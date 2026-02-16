import styled from "styled-components";
import {
  FieldErrors,
  FieldValues,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

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
import { useGlobalContext } from "../../context/GlobalContext";

const StyledPlansContainer = styled.div``;
// const StyledPlansItemsContainer = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: center;
//   gap: 1.2rem;
//   margin-top: 1.2rem;
//   max-height: 700px;
//   overflow-y: auto;
// `;

export default function PlansInputContainer({
  register,
  setValue,
  getValues,
  clearErrors,
  // value,
  errors,
  isUpgrade = false,
  currentPlanId = 1,
  isAnyPaidPlan = false,
}: {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  clearErrors: UseFormClearErrors<any>;
  // value: string;
  errors: FieldErrors<FieldValues>;
  isUpgrade?: boolean;
  currentPlanId?: number;
  isAnyPaidPlan?: boolean;
}) {
  const { showPlansModal, setShowPlansModal, setCurrentFormOptions } =
    useGlobalContext();
  const { isLoading, plans, error } = useGetPlans();

  function handleShowPlansClick() {
    setCurrentFormOptions({
      setValue: setValue,
      getValues: getValues,
      clearErrors: clearErrors,
    });
    setShowPlansModal(!showPlansModal);
  }

  function determineWhichPlansToRender() {
    if (isUpgrade) {
      return getPlansForSelect(plans!.data!).slice(currentPlanId);
    }
    if (isAnyPaidPlan) {
      return getPlansForSelect(plans!.data!)
        .slice(1)
        .filter((select) => select.value !== currentPlanId.toString());
    }
    return getPlansForSelect(plans!.data!);
  }

  if (isLoading)
    return <OverlaySpinner message="Getting Plans"></OverlaySpinner>;

  if (error) return <div>Oops, could not get plans. Try again.</div>;

  return (
    <StyledPlansContainer>
      <FormControlRow>
        <PlanInput
          register={register}
          options={determineWhichPlansToRender()}
          // value={value}
          errors={errors}
        />
        <FormControl>{/* Placeholder */}</FormControl>
      </FormControlRow>
      <Button type="button" size="small" onClick={handleShowPlansClick}>
        View All Plans
      </Button>
    </StyledPlansContainer>
  );
}
