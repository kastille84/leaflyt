import React from "react";
import Modal from "react-modal";
import Heading from "../Heading";
import Button from "../Button";
import styled from "styled-components";
import { useGlobalContext } from "../../context/GlobalContext";

const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`;

export default function EditFlyerModal() {
  const {
    user,
    showEditFlyerModal,
    setShowEditFlyerModal,
    setIsOpenFlyerDrawer,
    setDrawerAction,
    setTemplateToEdit,
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

  function handleLeave() {
    setShowEditFlyerModal(false);
    setIsOpenFlyerDrawer(false);
    setDrawerAction(null);
  }

  function handleEditTemplate() {
    // find the template and set it
    setShowEditFlyerModal(false);
    setIsOpenFlyerDrawer(true);
    setDrawerAction("editTemplate");
  }

  function handleEditFlyer() {
    setShowEditFlyerModal(false);
    setIsOpenFlyerDrawer(true);
    setDrawerAction("edit");
  }

  return (
    // https://www.npmjs.com/package/react-modal
    <Modal
      testId="close-slide-in-modal"
      isOpen={showEditFlyerModal}
      style={customStyles}
    >
      <Heading as="h2">This flyer was created using a "Template"</Heading>
      <p>
        Editing the flyer will make the flyer out-of-sync with the template.
      </p>
      <p>Essentially, making it a stand-alone flyer.</p>
      <p>Stand-alone flyers lose the benefits of the template.</p>
      <Heading as={"h4"}>
        It is suggested that you edit the template instead and repost the flyer
        on this board.
      </Heading>
      <StyledButtonContainer>
        {/* #TODO: add the "edit template" functionality */}
        <Button size="small" variation="primary" onClick={handleEditTemplate}>
          Edit Template
        </Button>
        <Button size="small" variation="secondary" onClick={handleEditFlyer}>
          Edit Flyer
        </Button>
        <Button size="small" variation="danger" onClick={handleLeave}>
          Cancel
        </Button>
      </StyledButtonContainer>
    </Modal>
  );
}
