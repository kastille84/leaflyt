import styled from "styled-components";
import { useForm } from "react-hook-form";

import FormControl from "../Form/FormControl";
import Modal from "react-modal";
import Heading from "../Heading";
import Button from "../Button";
import { useGlobalContext } from "../../context/GlobalContext";
import useRegisteredFlyer from "../../features/createFlyer/useRegisteredFlyer";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import FlaggedReasonInput from "../Form/FlaggedReasonInput";
import OverlaySpinner from "../OverlaySpinner";
import useCreateUnregisteredFlyer from "../../features/createFlyer/useCreateUnregisteredFlyer";
import { useParams } from "react-router-dom";

const StyledForm = styled.form``;

const StyledSubmitError = styled(Heading)`
  color: var(--color-red-600) !important;
`;

const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`;

export default function FlaggedModal() {
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const {
    setUser,
    user,
    selectedFlyer,
    setSelectedFlyer,
    setShowFlaggedModal,
    showFlaggedModal,
    selectedPlace,
  } = useGlobalContext();

  const { id } = useParams();
  const { flagFlyerFn } = useCreateUnregisteredFlyer();

  const queryClient = useQueryClient();

  const customStyles = {
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
    },
  };

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

  function handleCancel() {
    setShowFlaggedModal(false);
    setSelectedFlyer(null);
  }

  async function handleReport(data: any) {
    setShowSpinner(true);
    flagFlyerFn(
      {
        flyer: selectedFlyer!,
        reason: data.reason,
        userId: user ? (user!.id as string) : null,
        placeName: selectedPlace!.displayName.text,
      },
      {
        onSuccess: () => {
          // update the user
          // setUser(user);
          toast.success("Flyer Flagged!");
          // invalidate queries to update the board
          queryClient.invalidateQueries({
            queryKey: ["board", id],
          });
          setShowSpinner(false);
          handleCancel();
        },
        onError: (error) => {
          toast.error("Flyer flagging failed! Try again.");
          setShowSpinner(false);
        },
      },
    );
  }

  return (
    // https://www.npmjs.com/package/react-modal
    <Modal
      testId="close-slide-in-modal"
      isOpen={showFlaggedModal}
      style={customStyles}
    >
      <Heading as="h2">
        You are proceeding to flag this flyer as inappropriate. <br /> Please
        give a reason for this and our team will review it.
      </Heading>
      <StyledForm onSubmit={handleSubmit(handleReport)}>
        {submitError && (
          <StyledSubmitError as={"h4"} id="form-error">
            Error: {submitError}
          </StyledSubmitError>
        )}
        <FormControl>
          <FlaggedReasonInput
            register={register}
            registerName="reason"
            errors={errors}
          />
        </FormControl>
        <StyledButtonContainer>
          <Button size="small" variation="danger" type="submit">
            Report
          </Button>
          <Button size="small" variation="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </StyledButtonContainer>
      </StyledForm>
      {showSpinner && <OverlaySpinner message={"Flagging the flyer..."} />}
    </Modal>
  );
}
