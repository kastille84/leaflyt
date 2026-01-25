import { useEffect, useState } from "react";
import styled from "styled-components";
import { get, useForm } from "react-hook-form";

import Heading from "../../ui/Heading";
import FormControlRow from "../../ui/Form/FormControlRow";
import EmailInput from "../../ui/Form/EmailInput";
import PasswordInput from "../../ui/Form/PasswordInput";
import TypeOfUserInput from "../../ui/Form/TypeOfUserInput";
import FormControl from "../../ui/Form/FormControl";
import WebsiteInput from "../../ui/Form/WebsiteInput";
import PhoneInput from "../../ui/Form/PhoneInput";
import AddressInput from "../../ui/Form/AddressInput";
import FullNameInput from "../../ui/Form/FullNameInput";
import LastNameInput from "../../ui/Form/LastNameInput";
import FirstNameInput from "../../ui/Form/FirstNameInput";
import Button from "../../ui/Button";
import OverlaySpinner from "../../ui/OverlaySpinner";

import { useGlobalContext } from "../../context/GlobalContext";
import {
  Auth_User_Profile_Response,
  Auth_User_Signup_Response,
  SignupSubmitData,
} from "../../interfaces/Auth_User";

import toast from "react-hot-toast";

import PlansInputContainer from "../../ui/Plan/PlansInputContainer";
import { parseAdrAddress } from "../../utils/ServiceUtils";
import { PickPlanInfo } from "./SignupContainer";
import useStripe from "../../hooks/useStripe";

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-brand-100);
  padding: 2.4rem 0 2.4rem 2.4rem;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 75em) {
    padding: 4rem;
    /* height: 80%; */
  }
`;

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
const StyledFormButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 2.4rem;
`;

const StyledPlanSection = styled.div`
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledCurrentPlanName = styled.p`
  color: var(--color-brand-600);
  display: inline-block;
`;

export default function PaymentBillingInfoForm({
  signedUpUser,
  setPickPlanInfo,
  currentPlanId = 1,
  updatedPaymentInfo = false,
}: {
  signedUpUser: Auth_User_Signup_Response | null;
  setPickPlanInfo: React.Dispatch<React.SetStateAction<PickPlanInfo | null>>;
  currentPlanId?: number;
  updatedPaymentInfo?: boolean;
}) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { createCustomerFn, deleteCustomerAsync } = useStripe();
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm({
    mode: "all",
    defaultValues: {
      plan: "1",
    },
  });

  const {
    setBottomSlideInType,
    setIsOpenBottomSlideIn,
    setTermsModalType,
    setShowTermsModal,
    setUser,
  } = useGlobalContext();

  console.log("getValues", getValues());
  console.log("errors", errors);

  function handleClose() {
    setIsOpenBottomSlideIn(false);
    setBottomSlideInType(null);
  }

  function handleTryFree() {
    handleClose();

    toast.success(
      "Seed Plan Selected. \nRemember to confirm your email. \nBesides that, you're all set! \nFind Boards Near You and start posting!",
      {
        duration: 10000,
      },
    );
  }

  function handleLinkClick(type: "terms" | "privacy" | "guidelines" | null) {
    setShowTermsModal(true);
    setTermsModalType(type);
  }

  async function onSubmit(data: any) {
    setSubmitError("");
    console.log("data", data);
    setShowSpinner(true);
    // delete old customer in Stripe if they are trying to update their payment information
    if (updatedPaymentInfo) {
      // delete current customer, which has old subscription, to make way for new one with new payment details
      await deleteCustomerAsync({
        customerId: signedUpUser?.customers[0]?.customerId,
      });
      // create new customer in Stripe
      const addressObj = parseAdrAddress(data.addressObjToSave.adr_address);
      createCustomerFn(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: signedUpUser?.email,
          address: addressObj,
          userId: signedUpUser!.id,
        },
        {
          onSuccess: (customer) => {
            console.log("customer", customer);

            // action
            setPickPlanInfo({
              plan: currentPlanId.toString(),
              firstName: data.firstName,
              lastName: data.lastName,
              address: parseAdrAddress(data.addressObjToSave.adr_address),
              customerId: customer.id,
            });
            setShowSpinner(false);
          },
          onError: (error) => {
            console.log("error", error);
            setShowSpinner(false);
            setSubmitError(error.message);
          },
        },
      );
    }
  }

  return (
    <StyledFormContainer>
      <StyledHeading as="h2">
        Next, Provide Your Billing Information.
      </StyledHeading>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {submitError && (
          <StyledSubmitError as={"h4"} id="form-error">
            Error: {submitError}
          </StyledSubmitError>
        )}
        <StyledPlanSection>
          <Heading as="h3">
            Current Plan:{" "}
            <StyledCurrentPlanName>
              {signedUpUser?.plan.name}
            </StyledCurrentPlanName>
          </Heading>
        </StyledPlanSection>

        <Heading as="h3">Account Holder Information</Heading>
        <FormControlRow>
          {/* Personal Info / firstName */}
          <FirstNameInput
            register={register}
            registerName="firstName"
            errors={errors}
          />
          {/* Personal Info / lastName */}
          <LastNameInput
            register={register}
            registerName="lastName"
            errors={errors}
          />
        </FormControlRow>
        <FormControlRow>
          <AddressInput
            register={register}
            setValue={setValue}
            registerName="address"
            errors={errors}
            fieldName="Billing Address"
            shouldSaveAddressObj
          />

          <FormControl>{/* empty */}</FormControl>
        </FormControlRow>
        <StyledFormButtonContainer data-testid="form-button-container">
          {/* Free Plan */}

          <Button type="button" variation="secondary" onClick={handleTryFree}>
            Switch To Free Plan (Seed Plan)
          </Button>
          {/* Continue */}
          <Button type="submit">Continue to Pay</Button>
        </StyledFormButtonContainer>

        {/* </StyledContentContainer> */}
      </StyledForm>
      {showSpinner && <OverlaySpinner message={"Configuring your plan..."} />}
    </StyledFormContainer>
  );
}
