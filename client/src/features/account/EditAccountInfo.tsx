import { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm, UseFormProps } from "react-hook-form";
import toast from "react-hot-toast";

import Form from "../../ui/Form/Form";
import FormControlRow from "../../ui/Form/FormControlRow";
import FormControl from "../../ui/Form/FormControl";

import Heading from "../../ui/Heading";

import { useGlobalContext } from "../../context/GlobalContext";
import useGetUserLimits from "../../hooks/useGetUserLimits";
import FirstNameInput from "../../ui/Form/FirstNameInput";
import LastNameInput from "../../ui/Form/LastNameInput";
import PhoneInput from "../../ui/Form/PhoneInput";
import AddressInput from "../../ui/Form/AddressInput";
import WebsiteInput from "../../ui/Form/WebsiteInput";
import FullNameInput from "../../ui/Form/FullNameInput";
import OverlaySpinner from "../../ui/OverlaySpinner";
import Button from "../../ui/Button";

import useAccount from "./useAccount";

const StyledEditAccountInfoContainer = styled.div``;

const StyledFormContainer = styled.div`
  width: 70%;
  height: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-brand-100);
  padding: 2.4rem 0 2.4rem 2.4rem;

  @media (max-width: 75em) {
    width: 90%;
    padding: 4rem;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  height: 70rem;
  padding-top: 2.4rem;
  padding-right: 2.4rem;
  overflow-y: auto;

  @media (max-width: 59em) {
    height: 100%;
  }
`;

const StyledSubmitError = styled(Heading)`
  color: var(--color-red-600);
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

export default function EditAccountInfo() {
  const [submitError, setSubmitError] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const { user, setUser, setBottomSlideInType, setIsOpenBottomSlideIn } =
    useGlobalContext();
  const { updateProfile } = useAccount();
  const formOptions: UseFormProps = {
    mode: "onBlur",
  };

  let defaultValues = {};
  if (user?.typeOfUser === "individual") {
    defaultValues = {
      individual: {
        name: {
          firstName: user?.firstName,
          lastName: user?.lastName,
        },
        contact: {
          phone: user?.phone,
          address: user?.address.formatted_address,
          website: user?.website,
        },
      },
    };
  } else if (user?.typeOfUser === "business") {
    defaultValues = {
      business: {
        name: user?.name,
        contact: {
          phone: user?.phone,
          address: user?.address.formatted_address,
          website: user?.website,
        },
      },
    };
  } else if (user?.typeOfUser === "organization") {
    defaultValues = {
      organization: {
        name: user?.name,
        contact: {
          phone: user?.phone,
          address: user?.address.formatted_address,
          website: user?.website,
        },
      },
    };
  }
  formOptions.defaultValues = defaultValues;

  const {
    register,

    handleSubmit,

    getValues,
    setValue,
    formState: { errors },
  } = useForm(formOptions);

  const planLimits = useGetUserLimits();

  console.log("errors", errors);
  console.log("getValues", getValues());

  const onSubmit = async (data: any) => {
    setSubmitError("");
    console.log("submit - data", data);
    setShowSpinner(true);

    try {
      const response = await updateProfile(
        {
          profile: data,
          typeOfUser: user!.typeOfUser,
          userId: user!.id as string,
        },
        {
          onSuccess: ({ user }: any) => {
            console.log("response", response);
            // set user in global context
            setUser(user);
            toast.success("Account info updated successfully!", {
              duration: 6000,
            });
            setShowSpinner(false);
            handleCancel();
          },
          onError: (error) => {
            console.log("onError", error.message);
            setSubmitError(error.message);
            // set focus on error
            document.querySelector("#form-error")?.scrollIntoView();
            setShowSpinner(false);
          },
        }
      );
    } catch (error: any) {
      console.log("error", error);
      setSubmitError(error.message);
      // set focus on error
      document.querySelector("#form-error")?.scrollIntoView();
      setShowSpinner(false);
    }
  };

  function handleCancel() {
    setBottomSlideInType(null);
    setIsOpenBottomSlideIn(false);
  }

  return (
    <StyledFormContainer>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {submitError && (
          <StyledSubmitError as={"h4"} id="form-error">
            Error: {submitError}
          </StyledSubmitError>
        )}
        <Heading as="h3">Edit Account Info</Heading>
        {user?.typeOfUser === "individual" && (
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
                disabled
                cantUpdate
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
        {user?.typeOfUser === "business" && (
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
                disabled
                cantUpdate
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
        {user?.typeOfUser === "organization" && (
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
                disabled
                cantUpdate
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
        <StyledFormButtonContainer data-testid="form-button-container">
          <Button type="submit">Update</Button>
          <Button type="button" variation="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </StyledFormButtonContainer>
      </StyledForm>
      {showSpinner && <OverlaySpinner message={"Creating your account..."} />}
    </StyledFormContainer>
  );
}
