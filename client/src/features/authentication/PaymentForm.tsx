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
import Input from "../../ui/Input";
import FormControl from "../../ui/Form/FormControl";
import FieldInputError from "../../ui/Form/FieldInputError";
import { useGlobalContext } from "../../context/GlobalContext";

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

const StyledPromoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
`;

const StyledPromoLabel = styled.label`
  font-weight: 600;
  color: var(--color-brand-600);
`;

const StyledPromoApplied = styled.span`
  color: var(--color-brand-600);
  font-weight: 600;
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
  hideCancel,
  updatePaymentInfo,
  onBack,
}: {
  signedUpUser: Auth_User_Signup_Response | null;
  pickPlanInfo: PickPlanInfo;
  hideCancel?: boolean;
  updatePaymentInfo?: boolean;
  // when set, shows a Back button that returns to the plan picker
  onBack?: () => void;
}) {
  const {
    setShowCancelSubscriptionModal,
    setCancelSubscriptionModalType,
    setCustomerId,
  } = useGlobalContext();
  const [showSpinner, setShowSpinner] = useState(false);
  const [goingBack, setGoingBack] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const { deleteCustomerAsync } = useStripe();

  const checkoutState = useCheckout();

  async function handleApplyPromo() {
    const code = promoCode.trim();
    if (!code || checkoutState.type !== "success") return;
    setPromoError("");
    setPromoLoading(true);
    try {
      const result: any = await checkoutState.checkout.applyPromotionCode(code);
      if (result?.type === "error") {
        setPromoError(result.error?.message || "Invalid promo code");
      } else {
        setAppliedPromoCode(code);
        setPromoCode("");
      }
    } catch (error: any) {
      setPromoError(error?.message || "Could not apply promo code");
    } finally {
      setPromoLoading(false);
    }
  }

  async function handleRemovePromo() {
    if (checkoutState.type !== "success") return;
    setPromoError("");
    setPromoLoading(true);
    try {
      const result: any = await checkoutState.checkout.removePromotionCode();
      if (result?.type === "error") {
        setPromoError(result.error?.message || "Could not remove promo code");
      } else {
        setAppliedPromoCode("");
      }
    } catch (error: any) {
      setPromoError(error?.message || "Could not remove promo code");
    } finally {
      setPromoLoading(false);
    }
  }

  function handleCancel() {
    // warns user about canceling at this stage
    // remove Customer from Stripe
    setCustomerId(pickPlanInfo!.customerId!);
    setCancelSubscriptionModalType("onPayment");
    setShowCancelSubscriptionModal(true);
  }

  async function handleBack() {
    if (!onBack) return;
    setSubmitError("");
    setGoingBack(true);
    try {
      // the customer was created when the plan was picked. Remove it so that
      // picking a plan again doesn't leave a duplicate customer behind.
      await deleteCustomerAsync({ customerId: pickPlanInfo.customerId });
      onBack();
    } catch (error: any) {
      setGoingBack(false);
      setSubmitError(error?.message || "Could not go back. Please try again.");
    }
  }

  async function handlePay() {
    setSubmitError("");
    setShowSpinner(true);
    try {
      // if (updatePaymentInfo) {
      //   // delete current customer, which has old subscription, to make way for new one with new payment details
      //   await deleteCustomerAsync({
      //     customerId: signedUpUser?.customers[0]?.customerId,
      //   });
      // }
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
      return <OverlaySpinner message="Loading Payment Form" />;
    case "error":
      return <div>Error: {checkoutState.error.message}</div>;
    case "success":
      return (
        <StyledForm data-testid="PaymentFormContainer">
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
            <FormControl testId="promo-code-container">
              <StyledPromoLabel htmlFor="promo-code">Promo code</StyledPromoLabel>
              {appliedPromoCode ? (
                <StyledPromoRow>
                  <StyledPromoApplied data-testid="promo-applied">
                    Code {appliedPromoCode} applied
                  </StyledPromoApplied>
                  <Button
                    type="button"
                    size="small"
                    variation="brand-outlined"
                    onClick={handleRemovePromo}
                    disabled={promoLoading}
                  >
                    Remove
                  </Button>
                </StyledPromoRow>
              ) : (
                <StyledPromoRow>
                  <Input
                    type="text"
                    id="promo-code"
                    value={promoCode}
                    hasError={Boolean(promoError)}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onKeyDown={(e) => {
                      // Enter would otherwise submit the surrounding <form>
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyPromo();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="small"
                    variation="brand-outlined"
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoCode.trim()}
                  >
                    Apply
                  </Button>
                </StyledPromoRow>
              )}
              {promoError && <FieldInputError message={promoError} />}
            </FormControl>
            <PaymentElement />
          </StyledPaymentSection>
          <StyledFormButtonContainer data-testid="form-button-container">
            <Button type="button" onClick={handlePay} disabled={goingBack}>
              Pay {checkoutState.checkout.total.total.amount}
            </Button>
            {onBack && (
              <Button
                type="button"
                variation="brand-outlined"
                onClick={handleBack}
                disabled={goingBack}
              >
                Back
              </Button>
            )}
            {!hideCancel && (
              <Button
                type="button"
                variation="secondary"
                onClick={handleCancel}
                disabled={goingBack}
              >
                Cancel
              </Button>
            )}
          </StyledFormButtonContainer>
          {showSpinner && <OverlaySpinner message={"Paying..."} />}
          {goingBack && <OverlaySpinner message={"Going back..."} />}
        </StyledForm>
      );
  }
}
