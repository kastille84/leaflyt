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

export default function ForgotPassword() {
  const [submitError, setSubmitError] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const { user } = useGlobalContext();

  const { forgotPasswordFn } = useLogin();

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
    console.log("submit - data", data);
    setShowSpinner(true);

    try {
      forgotPasswordFn(data.email, {
        onSuccess: (response) => {
          console.log("response", response);
          setShowSpinner(false);
          toast.success(
            "Password reset link sent to your email successfully! Check your inbox.",
            {
              duration: 6000,
            }
          );
        },
        onError: (error) => {
          console.log("onError", error.message);
          setSubmitError(error.message);
          // set focus on error
          document.querySelector("#form-error")?.scrollIntoView();
          setShowSpinner(false);
        },
      });
    } catch (error: any) {
      console.log("error", error);
      setSubmitError(error.message);
      // set focus on error
      document.querySelector("#form-error")?.scrollIntoView();
      setShowSpinner(false);
    }
  };

  return (
    <StyledForgotPassword>
      <StyledHeadingContainer>
        <Heading as="h2">Forgot Password</Heading>
      </StyledHeadingContainer>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {submitError && (
          <StyledSubmitError as={"h4"} id="form-error">
            Error: {submitError}
          </StyledSubmitError>
        )}
        <Heading as="h3">
          Please provide your email address registered with this account.
        </Heading>
        <p>We will send you a link to reset your password</p>

        <FormControlRow>
          <EmailInput
            register={register}
            registerName="email"
            errors={errors}
          />
          <FormControl>{/* placeholder */}</FormControl>
        </FormControlRow>

        <FormControlRow>
          <FormControl>
            <StyledFormButtonContainer data-testid="form-button-container">
              <Button type="submit">Reset Password</Button>
            </StyledFormButtonContainer>
          </FormControl>
          <FormControl>{/* placeholder */}</FormControl>
        </FormControlRow>
      </StyledForm>
      {showSpinner && <OverlaySpinner message={"Updating your account..."} />}
    </StyledForgotPassword>
  );
}
