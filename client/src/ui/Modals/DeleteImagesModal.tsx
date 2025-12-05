import styled from "styled-components";
import { useParams } from "react-router-dom";

import Modal from "react-modal";
import Heading from "../Heading";
import Button from "../Button";
import { useGlobalContext } from "../../context/GlobalContext";
// import useRegisteredFlyer from "../../features/createFlyer/useRegisteredFlyer";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`;

export default function DeleteImagesModal() {
  const {
    contextImages,
    setContextImages,
    setShowDeleteImagesModal,
    showDeleteImagesModal,
  } = useGlobalContext();

  // const { deleteFlyerFn, deleteTemplateFn } = useRegisteredFlyer();
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
    setShowDeleteImagesModal(false);
    setContextImages(null);
  }

  async function handleDelete() {
    console.log("delete images", contextImages);
    // deleteTemplateFn(selectedTemplate, {
    //   onSuccess: ({ user }) => {
    //     // update the user
    //     setUser(user);
    //     toast.success("Template deleted!");
    //     handleCancel();
    //   },
    //   onError: (error) => {
    //     toast.error("Flyer deletion failed! Try again.");
    //   },
    // });

    // #TODO: delete images from contextImages
    // setContextImages(null);
  }

  return (
    // https://www.npmjs.com/package/react-modal
    <Modal
      testId="close-slide-in-modal"
      isOpen={showDeleteImagesModal}
      style={customStyles}
    >
      <Heading as="h2">Be careful, this action can&apos;t be undone!</Heading>

      <p>
        By deleting the image(s), all flyers & templates that use these image(s)
        will have said image(s) removed.
        <br />
        It is best to only delete when you are sure that these images are no
        longer being used.
        <br />
        As in, you've deleted all the flyers using the image(s) or the flyers
        have out-lived their lifespan and are auto-deleted.
      </p>

      <StyledButtonContainer>
        <Button size="small" variation="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button size="small" variation="danger" onClick={handleDelete}>
          Delete
        </Button>
      </StyledButtonContainer>
    </Modal>
  );
}
