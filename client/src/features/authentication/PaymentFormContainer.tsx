import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  CheckoutProvider,
  useCheckout,
  PaymentElement,
} from "@stripe/react-stripe-js/checkout";

import { useStripeContext } from "../../context/StripeContext";
import useStripe from "../../hooks/useStripe";
import { Auth_User_Signup_Response } from "../../interfaces/Auth_User";
import { PickPlanInfo } from "./SignupContainer";
import OverlaySpinner from "../../ui/OverlaySpinner";
import Heading from "../../ui/Heading";
import PaymentForm from "./PaymentForm";

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-brand-100);
  padding: 2.4rem 0 2.4rem 2.4rem;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 75em) {
    padding: 4rem;
    height: 80%;
  }
`;
const StyledSubmitError = styled(Heading)`
  color: var(--color-red-600) !important;
`;
const StyledHeading = styled(Heading)`
  color: var(--color-brand-600);
`;

export default function PaymentFormContainer({
  signedUpUser,
  pickPlanInfo,
}: {
  signedUpUser: Auth_User_Signup_Response | null;
  pickPlanInfo: PickPlanInfo;
}) {
  const { stripe, loading } = useStripeContext();
  const [clientSecret, setClientSecret] = useState(null);

  const { createCheckoutSessionFn } = useStripe();

  useEffect(() => {
    if (pickPlanInfo && signedUpUser) {
      createCheckoutSessionFn(
        { plan: pickPlanInfo.plan, customerId: pickPlanInfo.customerId },
        {
          onSuccess: (data: any) => {
            console.log("Checkout Session data", data);
            setClientSecret(data.clientSecret);
          },
          onError: (error: any) => {},
        }
      );
    }
  }, []);

  if (loading || !clientSecret) {
    return <OverlaySpinner message={"Loading Payment Form..."} />;
  }

  return (
    <CheckoutProvider stripe={stripe} options={{ clientSecret: clientSecret }}>
      <StyledFormContainer>
        <PaymentForm signedUpUser={signedUpUser} pickPlanInfo={pickPlanInfo} />
      </StyledFormContainer>
    </CheckoutProvider>
  );
}
