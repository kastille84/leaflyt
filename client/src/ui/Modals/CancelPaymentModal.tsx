import styled from "styled-components";
import { useParams } from "react-router-dom";

import Modal from "react-modal";
import Heading from "../Heading";
import Button from "../Button";
import { useGlobalContext } from "../../context/GlobalContext";
// import useRegisteredFlyer from "../../features/createFlyer/useRegisteredFlyer";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import useAssetMutations from "../../features/assets/useAssetMutations";
import { set } from "react-hook-form";

const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`;

const StyledMessageContainer = styled.div`
  margin-top: 1.4rem;
`;

export default function CancelPaymentModal() {
  const {
    showCancelPaymentModal,
    setShowCancelPaymentModal,
    cancelPaymentModalType,
    setCancelPaymentModalType,
    setIsOpenBottomSlideIn,
  } = useGlobalContext();

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
    },
  };

  function handleCancel() {
    setShowCancelPaymentModal(false);
  }

  async function handleDelete() {
    setShowCancelPaymentModal(false);
    await performCancelPaymentAction();
  }

  async function performCancelPaymentAction() {
    try {
      if (cancelPaymentModalType === "signup") {
        console.log("cancel signup");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    // https://www.npmjs.com/package/react-modal
    <Modal
      testId="close-slide-in-modal"
      isOpen={showCancelPaymentModal}
      style={customStyles}
    >
      <Heading as="h2">Are you sure you want to cancel this payment?</Heading>
      <StyledMessageContainer>
        <p>By canceling this payment, you will not be charged.</p>
        <p>You will be auto-enrolled into the Seed Plan (free).</p>
        <p>You will be able to upgrade to a paid plan at any time.</p>
        <p>Please remember to verify your email address.</p>
      </StyledMessageContainer>
      <StyledButtonContainer>
        <Button size="small" variation="danger" onClick={handleDelete}>
          Cancel Payment
        </Button>
        <Button size="small" variation="primary" onClick={handleCancel}>
          Continue to Pay
        </Button>
      </StyledButtonContainer>
    </Modal>
  );
}
