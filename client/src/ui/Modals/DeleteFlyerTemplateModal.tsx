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

export default function DeleteFlyerTemplateModal() {
  const {
    selectedTemplate,
    setSelectedTemplate,
    selectedFlyer,
    setSelectedFlyer,
    setShowDeleteFlyerTemplateModal,
    showDeleteFlyerTemplateModal,
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

  function handleCancel() {
    setShowDeleteFlyerTemplateModal(false);
    setSelectedTemplate(null);
    setSelectedFlyer(null);
  }

  async function handleDelete() {
    if (selectedTemplate) {
      // delete template
      console.log("delete template");
    } else if (selectedFlyer) {
      // delete flyer
      console.log("delete flyer");
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
        <Button size="small" variation="danger" onClick={handleDelete}>
          Delete
        </Button>
        <Button size="small" variation="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </StyledButtonContainer>
    </Modal>
  );
}
