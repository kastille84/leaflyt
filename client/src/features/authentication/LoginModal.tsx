import React, { useState } from "react";
import Modal from "react-modal";
import { set, useForm } from "react-hook-form";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import styled from "styled-components";
import { useGlobalContext } from "../../context/GlobalContext";
import Form from "../../ui/Form/Form";
import EmailInput from "../../ui/Form/EmailInput";
import PasswordInput from "../../ui/Form/PasswordInput";
import useLogin from "./useLogin";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import OverlaySpinner from "../../ui/OverlaySpinner";

const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`;

const StyledFormContainer = styled.div`
  padding: 1.6rem 2.4rem;

  & form {
    margin-bottom: 2.4rem;
  }
`;

const StyledHeaderContainer = styled.div`
  padding: 1.6rem 2.4rem;
`;

const StyledSubHeader = styled.small`
  color: var(--color-orange-600);
  text-transform: uppercase;
  letter-spacing: 0.1rem;
`;

const StyledName = styled.h2`
  color: var(--color-brand-600);
  text-transform: capitalize;
`;

const CloseModalButton = styled(Button)`
  position: absolute;
  top: 1.6rem;
  right: 1.6rem;
`;

const customModalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: "1000",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "var(--shadow-lg)",
    padding: "3.2rem",
    width: "400px",
  },
};

const StyledSubmitError = styled(Heading)`
  color: var(--color-red-600) !important;
`;

const LinkContainer = styled.div`
  margin-top: 1rem;
  text-align: right;
  & a {
    color: var(--color-brand-600);
    text-decoration: underline;
  }
`;

export default function LoginModal() {
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const {
    showLoginModal,
    setShowLoginModal,
    setUser,
    selectedPlace,
    setBottomSlideInType,
    setIsOpenBottomSlideIn,
  } = useGlobalContext();

  const { login } = useLogin();
  const navigate = useNavigate();

  const {
    register,
    unregister,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useForm({
    mode: "onBlur",
  });

  function handleClose() {
    setShowLoginModal(false);
    reset();
  }

  function handleRegister(event?: React.MouseEvent<HTMLAnchorElement>) {
    event?.preventDefault();
    setShowLoginModal(false);
    setIsOpenBottomSlideIn(true);
    setBottomSlideInType("signup");
  }

  const onSubmit = async (data: any) => {
    setSubmitError("");
    setShowSpinner(true);
    console.log("data", data);
    // action
    login(data, {
      onSuccess: (response) => {
        /* v8 ignore start */
        // set user in global context
        setUser(response.data);
        // a purposefully thrown error (i.e. user hasn't paid)
        if (response.error) {
          throw new Error((response.error as any).message);
        }
        /* v8 ignore stop */
        handleClose();
        toast.success(`Login successful!`);
        setShowSpinner(false);
        // TODO: redirect user to dashboard
        navigate(
          `/dashboard${
            selectedPlace?.id ? "/board/" + selectedPlace.id : "/home"
          }`,
        );
      },
      onError: (error) => {
        console.log("onError", error);
        setSubmitError(error.message);
        // set focus on error
        document.querySelector("#form-error")?.scrollIntoView();
        setShowSpinner(false);
        if (error.message === "unpaid") {
          setShowLoginModal(false);
          setIsOpenBottomSlideIn(true);
          setBottomSlideInType("unpaid");
        }
      },
    });
  };

  return (
    // https://www.npmjs.com/package/react-modal
    <Modal
      testId="login-modal"
      isOpen={showLoginModal}
      style={customModalStyles}
      appElement={document.getElementById("root")!}
    >
      <StyledHeaderContainer>
        <StyledName>Login to Leaflit</StyledName>
        <StyledSubHeader>Spread your message</StyledSubHeader>
      </StyledHeaderContainer>
      {showSpinner && <OverlaySpinner message="Logging in..." />}
      <StyledFormContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {submitError && (
            <StyledSubmitError as={"h4"} id="form-error">
              Error: {submitError}
            </StyledSubmitError>
          )}
          <EmailInput
            register={register}
            registerName="email"
            errors={errors}
          />
          <PasswordInput
            register={register}
            registerName="password"
            errors={errors}
          />
          <StyledButtonContainer data-testid="form-button-container">
            <Button
              data-testid="login-button"
              size="small"
              variation="primary"
              type="submit"
            >
              Login
            </Button>
            <Button
              data-testid="cancel-button"
              size="small"
              variation="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </StyledButtonContainer>
        </Form>
        <LinkContainer>
          <Link to="/dashboard/forgot-password" onClick={handleClose}>
            Forgot your password?
          </Link>
        </LinkContainer>
        <LinkContainer>
          <Link to="/register" onClick={(e) => handleRegister(e)}>
            Don't have an account? Register
          </Link>
        </LinkContainer>
      </StyledFormContainer>
    </Modal>
  );
}
