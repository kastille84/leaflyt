import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useCheckout, PaymentElement } from "@stripe/react-stripe-js/checkout";

import { useStripeContext } from "../../context/StripeContext";
import useStripe from "../../hooks/useStripe";
import { Auth_User_Signup_Response } from "../../interfaces/Auth_User";
import { PickPlanInfo } from "./SignupContainer";
import OverlaySpinner from "../../ui/OverlaySpinner";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import { useGlobalContext } from "../../context/GlobalContext";
import { set } from "react-hook-form";
import toast from "react-hot-toast";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  /* gap: 2.4rem; */
  height: 70rem;
  /* padding-top: 2.4rem; */
  padding-right: 2.4rem;
  overflow-y: auto;

  @media (max-width: 59em) {
    height: 100%;
  }
`;
const StyledSubmitError = styled(Heading)`
  color: var(--color-red-600) !important;
`;
const StyledHeading = styled(Heading)`
  color: var(--color-brand-600);
`;

const StyledPaymentSection = styled.div`
  padding: 2.4rem;
`;

const StyledFormButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 2.4rem;
`;
export default function PaymentForm({
  signedUpUser,
  pickPlanInfo,
}: {
  signedUpUser: Auth_User_Signup_Response | null;
  pickPlanInfo: PickPlanInfo;
}) {
  const { setShowCancelPaymentModal } = useGlobalContext();
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // const { setBottomSlideInType, setIsOpenBottomSlideIn } = useGlobalContext();

  const checkoutState = useCheckout();

  function handleClose() {
    // setShowSpinner(true);
    // remove Customer from Stripe
    setShowCancelPaymentModal(true);
  }

  function handlePay() {
    setSubmitError("");
    setShowSpinner(true);
    try {
      checkoutState.checkout.confirm().then((result: any) => {
        // will never reach here
        if (result.type === "error") {
          setShowSpinner(false);
          setSubmitError(result.error.message);
        }
      });
    } catch (error: any) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      setShowSpinner(false);
      setSubmitError(result.error);
    }
  }

  switch (checkoutState.type) {
    case "loading":
      return <div>Loading ...</div>;
    case "error":
      return <div>Error: {checkoutState.error.message}</div>;
    case "success":
      return (
        <StyledForm>
          {/* <pre>
              {JSON.stringify(checkoutState.checkout.lineItems, null, 2)}
              // A formatted total amount Total:{" "}
              {checkoutState.checkout.total.total.amount}
            </pre> */}
          <StyledHeading as="h2">
            Lastly, We'll Collect Payment Information.
          </StyledHeading>
          {submitError && (
            <StyledSubmitError as={"h4"} id="form-error">
              Error: {submitError}
            </StyledSubmitError>
          )}
          <StyledPaymentSection>
            <PaymentElement />
          </StyledPaymentSection>
          <StyledFormButtonContainer data-testid="form-button-container">
            <Button type="button" onClick={handlePay}>
              Pay {checkoutState.checkout.total.total.amount}
            </Button>
            <Button type="button" variation="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </StyledFormButtonContainer>
          {showSpinner && <OverlaySpinner message={"Paying..."} />}
        </StyledForm>
      );
  }
}
