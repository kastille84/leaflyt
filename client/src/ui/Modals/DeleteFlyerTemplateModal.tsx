import styled from "styled-components";
import { useParams } from "react-router-dom";

import Modal from "react-modal";
import Heading from "../Heading";
import Button from "../Button";
import { useGlobalContext } from "../../context/GlobalContext";
import useRegisteredFlyer from "../../features/createFlyer/useRegisteredFlyer";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import OverlaySpinner from "../OverlaySpinner";

const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`;

export default function DeleteFlyerTemplateModal() {
  const [showSpinner, setShowSpinner] = useState(false);
  const {
    setUser,
    selectedTemplate,
    setSelectedTemplate,
    selectedFlyer,
    setSelectedFlyer,
    setShowDeleteFlyerTemplateModal,
    showDeleteFlyerTemplateModal,
  } = useGlobalContext();

  const { deleteFlyerFn, deleteTemplateFn } = useRegisteredFlyer();
  const { id } = useParams();
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

  function handleCancel() {
    setShowDeleteFlyerTemplateModal(false);
    setSelectedTemplate(null);
    setSelectedFlyer(null);
  }

  async function handleDelete() {
    setShowSpinner(true);

    if (selectedTemplate) {
      // delete template
      deleteTemplateFn(selectedTemplate, {
        onSuccess: ({ user }) => {
          // update the user
          setUser(user);
          toast.success("Template deleted!");
          handleCancel();
        },
        onError: (error) => {
          toast.error("Flyer deletion failed! Try again.");
          setShowSpinner(false);
        },
      });
    } else if (selectedFlyer) {
      // delete flyer
      deleteFlyerFn(selectedFlyer, {
        onSuccess: ({ user }) => {
          // update the user
          setUser(user);
          toast.success("Flyer deleted!");
          // invalidate queries to update the board
          queryClient.invalidateQueries({
            queryKey: ["board", id],
          });
          handleCancel();
        },
        onError: (error) => {
          toast.error("Flyer deletion failed! Try again.");
          setShowSpinner(false);
        },
      });
    }
  }

  return (
    // https://www.npmjs.com/package/react-modal
    <Modal
      testId="close-slide-in-modal"
      isOpen={showDeleteFlyerTemplateModal}
      style={customStyles}
    >
      <Heading as="h2">
        Are you sure you want to delete the{" "}
        {selectedTemplate ? "template" : "flyer"}?
      </Heading>
      {selectedTemplate && (
        <p>
          Deleting the template will make all flyers using this template
          standalone. <br />
          You'll also lose statistics for this template.
        </p>
      )}

      <StyledButtonContainer>
        <Button size="small" variation="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button size="small" variation="danger" onClick={handleDelete}>
          Delete
        </Button>
      </StyledButtonContainer>
      {showSpinner && <OverlaySpinner message={"Deleting..."} />}
    </Modal>
  );
}
