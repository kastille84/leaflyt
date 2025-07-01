import React from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import styled from "styled-components";
import { useGlobalContext } from "../../context/GlobalContext";
import Form from "../../ui/Form/Form";
import EmailInput from "../../ui/Form/EmailInput";
import PasswordInput from "../../ui/Form/PasswordInput";

const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`;

const StyledFormContainer = styled.div`
  padding: 1.6rem 2.4rem;
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

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal } = useGlobalContext();

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

  function handleCancel() {
    setShowLoginModal(false);
    reset();
  }

  function handleLogin() {
    setShowLoginModal(false);
  }

  const onSubmit = async (data: any) => {};

  return (
    // https://www.npmjs.com/package/react-modal
    <Modal
      testId="close-slide-in-modal"
      isOpen={showLoginModal}
      style={customModalStyles}
    >
      <StyledHeaderContainer>
        <StyledName>Login to Leaflyt</StyledName>
        <StyledSubHeader>Spread your message</StyledSubHeader>
      </StyledHeaderContainer>
      <StyledFormContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <EmailInput register={register} registerName="User" errors={errors} />
          <PasswordInput
            register={register}
            registerName="Password"
            errors={errors}
          />
        </Form>
      </StyledFormContainer>

      <StyledButtonContainer>
        <Button size="small" variation="primary" onClick={handleLogin}>
          Login
        </Button>
        <Button size="small" variation="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </StyledButtonContainer>
    </Modal>
  );
}
