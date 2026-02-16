import { useState } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import { useForm, UseFormProps } from "react-hook-form";

import FormControlRow from "../../ui/Form/FormControlRow";
import FormControl from "../../ui/Form/FormControl";
import Heading from "../../ui/Heading";
import EmailInput from "../../ui/Form/EmailInput";
import Button from "../../ui/Button";
import OverlaySpinner from "../../ui/OverlaySpinner";
import { useGlobalContext } from "../../context/GlobalContext";
import useLogin from "./useLogin";
import PasswordInput from "../../ui/Form/PasswordInput";

const StyledForgotPassword = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  width: 70%;
  @media (max-width: 75em) {
    /* flex-direction: column;
    align-items: center; */
    flex-wrap: wrap;
  }
  @media (max-width: 59em) {
    width: 100%;
  }
  @media (max-width: 34em) {
    justify-content: center;
  }
`;

const StyledHeadingContainer = styled.div`
  display: flex;
  align-items: start;
  gap: 2.4rem;

  @media (max-width: 59em) {
    justify-content: center;
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

const StyledFormButtonContainer = styled.div`
  /* position: fixed; */
  /* bottom: 2.4rem; */
  /* right: 2.4rem; */
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 2.4rem;
`;

export default function ResetPassword() {
  const [submitError, setSubmitError] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  // const { user } = useGlobalContext();

  const { updatePasswordFn } = useLogin();

  const formOptions: UseFormProps = {
    mode: "onBlur",
  };

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm(formOptions);

  const onSubmit = async (data: any) => {
    setSubmitError("");
    setShowSpinner(true);

    try {
      updatePasswordFn(data.password, {
        onSuccess: (response) => {
          setShowSpinner(false);
          toast.success("Password Updated! Try to login now!", {
            duration: 6000,
          });
        },
        onError: (error) => {
          setSubmitError(error.message);
          // set focus on error
          document.querySelector("#form-error")?.scrollIntoView();
          setShowSpinner(false);
        },
      });
    } catch (error: any) {
      setSubmitError(error.message);
      // set focus on error
      document.querySelector("#form-error")?.scrollIntoView();
      setShowSpinner(false);
    }
  };

  return (
    <StyledForgotPassword>
      <StyledHeadingContainer>
        <Heading as="h2">Reset Password</Heading>
      </StyledHeadingContainer>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {submitError && (
          <StyledSubmitError as={"h4"} id="form-error">
            Error: {submitError}
          </StyledSubmitError>
        )}
        <Heading as="h3">
          Please provide your new password for this account.
        </Heading>

        <FormControlRow>
          <PasswordInput
            register={register}
            registerName="password"
            errors={errors}
            shouldShow={true}
          />
          <FormControl>{/* placeholder */}</FormControl>
        </FormControlRow>

        <FormControlRow>
          <FormControl>
            <StyledFormButtonContainer data-testid="form-button-container">
              <Button type="submit">Update Password</Button>
            </StyledFormButtonContainer>
          </FormControl>
          <FormControl>{/* placeholder */}</FormControl>
        </FormControlRow>
      </StyledForm>
      {showSpinner && <OverlaySpinner message={"Updating your password..."} />}
    </StyledForgotPassword>
  );
}
