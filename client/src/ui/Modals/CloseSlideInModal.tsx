import React from "react";
import Modal from "react-modal";
import Heading from "../Heading";
import Button from "../Button";
import styled from "styled-components";
import { useGlobalContext } from "../../context/GlobalContext";
import { deleteFileOverTime } from "../../services/cloudinary";

const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`;

export default function CloseSlideInModal() {
  const {
    showCloseSlideInModal,
    setShowCloseSlideInModal,
    setIsOpenFlyerDrawer,
    setDrawerAction,
    selectedFlyer,
    setSelectedFlyer,
    selectedTemplate,
    setSelectedTemplate,
    setCurrentFormOptions,
    currentFormOptions,
    user,
  } = useGlobalContext();
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

  async function handleLeave() {
    if (selectedFlyer) setSelectedFlyer(null);
    if (selectedTemplate) setSelectedTemplate(null);
    if (!user && currentFormOptions.getValues("fileUrlArr").length > 0) {
      // delete any assets that were uploaded while not logged in
      await deleteFileOverTime(currentFormOptions.getValues("fileUrlArr")[0]);
    }
    setShowCloseSlideInModal(false);
    setIsOpenFlyerDrawer(false);
    setDrawerAction(null);
    setCurrentFormOptions(null);
  }

  function handleStay() {
    setShowCloseSlideInModal(false);
  }

  return (
    // https://www.npmjs.com/package/react-modal
    <Modal
      testId="close-slide-in-modal"
      isOpen={showCloseSlideInModal}
      style={customStyles}
    >
      <Heading as="h2">Don't lose your message!</Heading>
      <p>Are you sure you want to leave?</p>
      <StyledButtonContainer>
        <Button size="small" variation="primary" onClick={handleStay}>
          Stay
        </Button>
        <Button size="small" variation="danger" onClick={handleLeave}>
          Leave
        </Button>
      </StyledButtonContainer>
    </Modal>
  );
}
