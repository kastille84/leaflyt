import styled from "styled-components";
import { useParams } from "react-router-dom";

import Modal from "react-modal";
import Heading from "../Heading";
import Button from "../Button";
import { useGlobalContext } from "../../context/GlobalContext";
// import useRegisteredFlyer from "../../features/createFlyer/useRegisteredFlyer";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import useAssetMutations from "../../features/assets/useAssetMutations";
import { useState } from "react";
import OverlaySpinner from "../OverlaySpinner";

const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`;

export default function DeleteFilesModal() {
  const [showSpinner, setShowSpinner] = useState(false);

  const {
    contextImages,
    setContextImages,
    setShowDeleteFilesModal,
    showDeleteFilesModal,
    setUser,
  } = useGlobalContext();

  const { deleteAssetsFn } = useAssetMutations();

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
    setShowDeleteFilesModal(false);
    setContextImages(null);
  }

  async function handleDelete() {
    setShowSpinner(true);

    deleteAssetsFn(contextImages!, {
      onSuccess: ({ user }: any) => {
        // update the user
        setUser(user);
        setShowSpinner(false);

        toast.success("Assets deleted!");
        handleCancel();
      },
      onError: (error) => {
        toast.error("Assets deletion failed! Try again.");
        setShowSpinner(false);
      },
    });
  }

  return (
    // https://www.npmjs.com/package/react-modal
    <Modal
      testId="close-slide-in-modal"
      isOpen={showDeleteFilesModal}
      style={customStyles}
    >
      <Heading as="h2">Are you sure you want to delete the file(s)</Heading>

      <StyledButtonContainer>
        <Button size="small" variation="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button size="small" variation="danger" onClick={handleDelete}>
          Delete
        </Button>
      </StyledButtonContainer>
      {showSpinner && <OverlaySpinner message={"Deleting the file(s)..."} />}
    </Modal>
  );
}
