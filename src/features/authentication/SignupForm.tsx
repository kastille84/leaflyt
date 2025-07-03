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
import { useGlobalContext } from "../../context/GlobalContext";
import { SignupSubmitData } from "../../interfaces/Auth_User";
import useSignup from "./useSignup";

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-brand-100);
  padding: 2.4rem 0 2.4rem 2.4rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  height: 70rem;
  padding-top: 2.4rem;
  padding-right: 2.4rem;
  overflow-y: auto;
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

export default function SignupForm() {
  const [showSpinner, setShowSpinner] = useState(false);
  const { signup } = useSignup();
  const {
    register,
    unregister,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors, isValid },
    control,
  } = useForm({
    mode: "onBlur",
  });

  const { setBottomSlideInType, setIsOpenBottomSlideIn } = useGlobalContext();

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

  function handleCancel() {
    setIsOpenBottomSlideIn(false);
    setBottomSlideInType(null);
  }

  function onSubmit(data: any) {
    console.log("data", data);
    // set full addressObj to address field
    data[typeOfUser].contact.address = data.addressObjToSave;
    console.log("data after", data);
    const result = signup(data as SignupSubmitData);
    console.log("result", result);
    setShowSpinner(true);
  }

  return (
    <StyledFormContainer>
      <StyledHeading as="h2">Let's Get You Signed Up.</StyledHeading>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {/* <StyledContentContainer> */}
        <Heading as="h3">Tell us a bit about yourself.</Heading>
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
            <StyledFormButtonContainer data-testid="form-button-container">
              <Button type="submit" disabled={!isValid}>
                Create
              </Button>
              <Button
                type="button"
                variation="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </StyledFormButtonContainer>
          </>
        )}
        {/* </StyledContentContainer> */}
      </StyledForm>
    </StyledFormContainer>
  );
}
