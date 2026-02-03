import styled from "styled-components";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "react-modal";
import Heading from "../Heading";
import Button from "../Button";
import { useGlobalContext } from "../../context/GlobalContext";

import { useResponsiveWidth } from "../../hooks/useResponsiveWidth";
import { sortPlansByLevel } from "../../utils/GeneralUtils";
import { Plan } from "../../interfaces/Plan";
import PlanItem from "../Plan/PlanItem";

const StyledContentContainer = styled.div`
  /* width: 80%; */
  height: 600px;
  overflow-y: auto;
`;

const StyledPlansItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 1.2rem;
  min-height: 500px;
  max-height: 800px;
  overflow-y: auto;
  @media (max-height: 59em) {
    height: 60vh;
    min-height: unset;
  }
`;

const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`;

export default function PlansModal() {
  const {
    showPlansModal,
    setShowPlansModal,
    currentFormOptions,
    setCurrentFormOptions,
    bottomSlideInType,
    user,
  } = useGlobalContext();
  const responsiveVal = useResponsiveWidth();

  const queryClient = useQueryClient();

  const plansObj = queryClient.getQueryData<{
    data: Plan[];
    error: any;
  }>(["getPlans"]);
  console.log("plansModal", plansObj);

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: "1000",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      boxShadow: "var(--shadow-lg)",
      padding: "3.2rem",
      width: ["s_tablet", "m_tablet", "l_mobile", "s_mobile"].includes(
        responsiveVal,
      )
        ? "95%"
        : "80%",
      maxWidth: "1400px",
      borderRadius: "var(--border-radius-lg)",
    },
  };

  function handleClose() {
    setShowPlansModal(false);
    // setCurrentFormOptions(null);
  }

  function handlePlanSelect(plan: Plan) {
    currentFormOptions?.setValue("plan", plan.id.toString());
    currentFormOptions?.clearErrors("plan");
    handleClose();
  }

  function determineIfDisabled(planItem: Plan) {
    if (bottomSlideInType === "upgrade" && user?.plan.id >= planItem.id) {
      return true;
    }
    if (
      bottomSlideInType === "changePlan" &&
      (user?.plan.id === planItem.id || planItem.id === 1)
    ) {
      return true;
    }
    return false;
  }

  return (
    // https://www.npmjs.com/package/react-modal
    <Modal
      testId="close-slide-in-modal"
      isOpen={showPlansModal}
      style={customStyles}
    >
      <StyledPlansItemsContainer>
        {plansObj &&
          sortPlansByLevel(plansObj.data!).map((plan: Plan) => (
            <PlanItem
              key={plan.id}
              plan={plan}
              selected={
                currentFormOptions?.getValues("plan") === plan.id.toString()
              }
              disabled={determineIfDisabled(plan)}
              action={() => handlePlanSelect(plan)}
            />
          ))}
      </StyledPlansItemsContainer>
      <StyledButtonContainer>
        <Button size="small" variation="secondary" onClick={handleClose}>
          Close
        </Button>
      </StyledButtonContainer>
    </Modal>
  );
}
