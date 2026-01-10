import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useCheckout, PaymentElement } from "@stripe/react-stripe-js/checkout";

import { useStripeContext } from "../../context/StripeContext";
import useStripe from "../../hooks/useStripe";
import { Auth_User_Signup_Response } from "../../interfaces/Auth_User";
import { PickPlanInfo } from "./SignupContainer";
import OverlaySpinner from "../../ui/OverlaySpinner";
import Heading from "../../ui/Heading";

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

export default function PaymentForm({
  signedUpUser,
  pickPlanInfo,
}: {
  signedUpUser: Auth_User_Signup_Response | null;
  pickPlanInfo: PickPlanInfo;
}) {
  const checkoutState = useCheckout();

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
          <PaymentElement />
        </StyledForm>
      );
  }
}
