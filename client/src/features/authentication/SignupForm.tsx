import { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";

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
import { SignupSubmitData } from "../../interfaces/Auth_User";
import useSignup from "./useSignup";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import PlansContainer from "../../ui/Plan/PlansContainer";

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-brand-100);
  padding: 2.4rem 0 2.4rem 2.4rem;

  @media (max-width: 75em) {
    padding: 4rem;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  /* gap: 2.4rem; */
  height: 70rem;
  padding-top: 2.4rem;
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
  /* position: fixed; */
  /* bottom: 2.4rem; */
  /* right: 2.4rem; */
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 2.4rem;
`;

const StyledCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1.4rem;
  margin-bottom: 1.4rem;
`;

const StyledCheckbox = styled.input`
  width: 1.6rem;
  height: 1.6rem;
`;

const StyledCheckboxLabel = styled.label`
  font-size: 1.4rem;
  color: var(--color-grey-600);

  & a {
    color: var(--color-brand-500);
    text-decoration: underline;
  }
`;

const StyledPlanSection = styled.div`
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default function SignupForm() {
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { signup } = useSignup();
  const {
    register,
    unregister,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
    control,
  } = useForm({
    mode: "all",
  });

  const {
    setBottomSlideInType,
    setIsOpenBottomSlideIn,
    setTermsModalType,
    setShowTermsModal,
  } = useGlobalContext();

  const typeOfUserWatch = watch("typeOfUser");
  const typeOfUser = getValues("typeOfUser");

  console.log("getValues", getValues());
  console.log("errors", errors);

  useEffect(() => {
    if (typeOfUser) {
      unregister(
        ["individual", "business", "organization"].filter(
          (item) => item !== typeOfUser
        )
      );
    }
  }, [typeOfUser]);

  function handleClose() {
    setIsOpenBottomSlideIn(false);
    setBottomSlideInType(null);
  }

  function handleLinkClick(type: "terms" | "privacy" | "guidelines" | null) {
    setShowTermsModal(true);
    setTermsModalType(type);
  }

  function onSubmit(data: any) {
    setSubmitError("");
    console.log("data", data);
    // set full addressObj to address field
    data[typeOfUser].contact.address = data.addressObjToSave;
    console.log("data after", data);
    setShowSpinner(true);
    // action
    signup(data as SignupSubmitData, {
      onSuccess: (response) => {
        /* v8 ignore start */
        if (response.error) {
          throw response.error;
        }
        /* v8 ignore end */
        handleClose();
        toast.success(
          `Signup successful! You must verify your email: ${response.data.email} before logging in. Make sure to check your SPAM folder.`,
          {
            duration: 8000,
          }
        );
        setShowSpinner(false);
      },
      onError: (error) => {
        console.log("onError", error.message);
        setSubmitError(error.message);
        // set focus on error
        document.querySelector("#form-error")?.scrollIntoView();
        setShowSpinner(false);
      },
    });
  }

  return (
    <StyledFormContainer>
      <StyledHeading as="h2">Let's Get You Signed Up.</StyledHeading>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {submitError && (
          <StyledSubmitError as={"h4"} id="form-error">
            Error: {submitError}
          </StyledSubmitError>
        )}
        {/* <StyledContentContainer> */}
        {/* <Heading as="h3">Tell us a bit about yourself.</Heading> */}
        <FormControlRow>
          <TypeOfUserInput
            title="How do you want to post as?"
            register={register}
            value={typeOfUserWatch}
            errors={errors}
            includeAnonymous={false}
          />
          <FormControl>{/*Empty*/}</FormControl>
        </FormControlRow>
        {typeOfUserWatch === "individual" && (
          <>
            <FormControlRow>
              {/* Personal Info / firstName */}
              <FirstNameInput
                register={register}
                registerName="individual.name.firstName"
                errors={errors}
              />
              {/* Personal Info / lastName */}
              <LastNameInput
                register={register}
                registerName="individual.name.lastName"
                errors={errors}
              />
            </FormControlRow>
            <FormControlRow>
              {/* Personal Info / Phone */}
              <PhoneInput
                register={register}
                registerName="individual.contact.phone"
                errors={errors}
              />
              <AddressInput
                register={register}
                setValue={setValue}
                registerName="individual.contact.address"
                errors={errors}
                locationAdvisory
                shouldSaveAddressObj
              />
            </FormControlRow>
            <FormControlRow>
              <WebsiteInput
                register={register}
                registerName="individual.contact.website"
                errors={errors}
              />
              <FormControl>{/* empty */}</FormControl>
            </FormControlRow>
          </>
        )}
        {typeOfUserWatch === "business" && (
          <>
            <FormControlRow>
              {/*Business / name */}
              <FullNameInput
                register={register}
                registerName="business.name"
                name="Business"
                errors={errors}
              />
              {/*Business / address */}
              <AddressInput
                register={register}
                setValue={setValue}
                registerName="business.contact.address"
                errors={errors}
                locationAdvisory
                shouldSaveAddressObj
              />
            </FormControlRow>
            <FormControlRow>
              <PhoneInput
                register={register}
                registerName="business.contact.phone"
                errors={errors}
              />
              <WebsiteInput
                register={register}
                registerName="business.contact.website"
                errors={errors}
              />
            </FormControlRow>
          </>
        )}
        {typeOfUserWatch === "organization" && (
          <>
            <FormControlRow>
              {/*Org / name */}
              <FullNameInput
                register={register}
                registerName="organization.name"
                name="Organization"
                errors={errors}
              />
              {/*Org / address */}
              <AddressInput
                register={register}
                setValue={setValue}
                registerName="organization.contact.address"
                errors={errors}
                locationAdvisory
                shouldSaveAddressObj
              />
            </FormControlRow>
            <FormControlRow>
              <PhoneInput
                register={register}
                registerName="organization.contact.phone"
                errors={errors}
              />
              <WebsiteInput
                register={register}
                registerName="organization.contact.website"
                errors={errors}
              />
            </FormControlRow>
          </>
        )}
        {typeOfUser && (
          <StyledPlanSection>
            <Heading as="h3">Plans</Heading>
            <PlansContainer register={register} errors={errors} value="1" />
          </StyledPlanSection>
        )}
        {typeOfUserWatch && (
          <>
            <Heading as="h3">Credentials</Heading>
            <FormControlRow>
              <EmailInput
                register={register}
                registerName={`${typeOfUser}.contact.email`}
                errors={errors}
              />
              <PasswordInput
                register={register}
                registerName="password"
                errors={errors}
                shouldShow
              />
            </FormControlRow>
            <div>
              <StyledCheckboxContainer>
                <StyledCheckbox
                  id="terms"
                  type="checkbox"
                  {...register("terms", { required: true })}
                />
                <StyledCheckboxLabel htmlFor="terms">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick("terms");
                    }}
                  >
                    Terms and Conditions
                  </Link>
                  ,{" "}
                  <Link
                    to="/privacy"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick("privacy");
                    }}
                  >
                    Privacy Policy
                  </Link>
                  ,{" & "}
                  <Link
                    to="/guidelines"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick("guidelines");
                    }}
                  >
                    Community Guidelines
                  </Link>
                </StyledCheckboxLabel>
              </StyledCheckboxContainer>
            </div>
            <StyledFormButtonContainer data-testid="form-button-container">
              <Button type="submit">Sign up</Button>
              <Button type="button" variation="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </StyledFormButtonContainer>
          </>
        )}
        {/* </StyledContentContainer> */}
      </StyledForm>
      {showSpinner && <OverlaySpinner message={"Creating your account..."} />}
    </StyledFormContainer>
  );
}
