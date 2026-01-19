import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

import Modal from "react-modal";
import Heading from "../Heading";
import Button from "../Button";
import { useGlobalContext } from "../../context/GlobalContext";
import useStripe from "../../hooks/useStripe";
import toast from "react-hot-toast";
import OverlaySpinner from "../OverlaySpinner";
import { useState } from "react";

const StyledSubmitError = styled(Heading)`
  color: var(--color-red-600) !important;
`;

const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`;

const StyledMessageContainer = styled.div`
  margin-top: 1.4rem;
`;

const StyledReminder = styled.p`
  font-size: 1.4rem;
  color: var(--color-orange-600);
`;

export default function CancelSubscriptionModal() {
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const {
    showCancelSubscriptionModal,
    setShowCancelSubscriptionModal,
    cancelSubscriptionModalType,
    setCancelSubscriptionModalType,
    customerId,
    setCustomerId,
    setIsOpenBottomSlideIn,
    setBottomSlideInType,
    user,
    setUser,
  } = useGlobalContext();

  const { deleteCustomerFn, updateUserPlanFn } = useStripe();

  const navigate = useNavigate();

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

  function handleContinueToPay() {
    setShowCancelSubscriptionModal(false);
  }
  function handleStayWithPlan() {
    setShowCancelSubscriptionModal(false);
  }

  async function handleDelete() {
    await performCancelSubscriptionAction();
  }

  async function performCancelSubscriptionAction() {
    try {
      if (cancelSubscriptionModalType === "onPayment") {
        console.log("cancel signup");
        // must delete the customer in Stripe
        // must delete the customer in Supabase
        deleteCustomerFn(
          { customerId },
          {
            onSuccess: () => {
              toast.success(
                "Cancelled payment successfully. \nImportant: \nPlease verify your email and log in."
              );
              setShowCancelSubscriptionModal(false);
              setCancelSubscriptionModalType(null);
              setCustomerId(null);
              setIsOpenBottomSlideIn(false);
              setBottomSlideInType(null);
            },
            onError: (error: any) => {
              setShowSpinner(false);
              toast.error(error.message);
              setSubmitError(error.message);
            },
          }
        );
      } else if (cancelSubscriptionModalType === "onAccount") {
        console.log("cancel onAccount");
        // must delete the customer in Stripe
        // must delete the customer in Supabase
        deleteCustomerFn(
          { customerId },
          {
            onSuccess: () => {
              // update user plan to Seed plan in profiles
              updateUserPlanFn(
                {
                  userId: user!.id as string,
                  plan: "1",
                },
                {
                  onSuccess: ({ user }) => {
                    toast.success(
                      "Cancelled subscription successfully. \nYou are on Seed plan now."
                    );
                    setUser(user);
                    setShowCancelSubscriptionModal(false);
                    setCancelSubscriptionModalType(null);
                    setCustomerId(null);
                    setIsOpenBottomSlideIn(false);
                    setBottomSlideInType(null);
                    navigate("/dashboard/home");
                  },
                }
              );
            },
            onError: (error: any) => {
              setShowSpinner(false);
              toast.error(error.message);
              setSubmitError(error.message);
            },
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    // https://www.npmjs.com/package/react-modal
    <Modal
      testId="close-slide-in-modal"
      isOpen={showCancelSubscriptionModal}
      style={customStyles}
    >
      {submitError && (
        <StyledSubmitError as={"h4"} id="form-error">
          Error: {submitError}
        </StyledSubmitError>
      )}
      <Heading as="h2">
        Are you sure you want to cancel this subscription?
      </Heading>
      {cancelSubscriptionModalType === "onPayment" && (
        <>
          <StyledMessageContainer>
            <p>By canceling this payment, you will not be charged.</p>
            <p>You will be auto-enrolled into the Seed Plan (FREE).</p>
            <p>You will be able to upgrade to a paid plan at any time.</p>
            <StyledReminder>
              Reminder: You must verify your email address first.
            </StyledReminder>
          </StyledMessageContainer>
          <StyledButtonContainer>
            <Button size="small" variation="danger" onClick={handleDelete}>
              Cancel Payment
            </Button>
            <Button
              size="small"
              variation="primary"
              onClick={handleContinueToPay}
            >
              Continue to Pay
            </Button>
          </StyledButtonContainer>
          {showSpinner && (
            <OverlaySpinner message="Setting up FREE Seed Plan..." />
          )}
        </>
      )}

      {cancelSubscriptionModalType === "onAccount" && (
        <>
          <StyledMessageContainer>
            <p>
              By canceling this subscription, you will be auto-enrolled into the
              Seed Plan (FREE).
            </p>
            <p>You will be able to upgrade to a paid plan at any time.</p>
            <StyledReminder>Reminder: This cannot be undone.</StyledReminder>
          </StyledMessageContainer>
          <StyledButtonContainer>
            <Button size="small" variation="danger" onClick={handleDelete}>
              Cancel Subscription
            </Button>
            <Button
              size="small"
              variation="primary"
              onClick={handleStayWithPlan}
            >
              Stay with Plan
            </Button>
          </StyledButtonContainer>
          {showSpinner && (
            <OverlaySpinner message="Setting up FREE Seed Plan..." />
          )}
        </>
      )}
    </Modal>
  );
}
