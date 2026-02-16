import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

import Modal from "react-modal";
import Heading from "../Heading";
import Button from "../Button";
import { useGlobalContext } from "../../context/GlobalContext";
import useStripe from "../../hooks/useStripe";
import toast from "react-hot-toast";
import OverlaySpinner from "../OverlaySpinner";
import { useState } from "react";
import useAssetMutations from "../../features/assets/useAssetMutations";
import useSignup from "../../features/authentication/useSignup";

const StyledSubmitError = styled(Heading)`
  color: var(--color-red-600) !important;
`;

const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`;

const StyledMessageContainer = styled.div`
  margin-top: 1.4rem;
`;

const StyledReminder = styled.p`
  font-size: 1.4rem;
  color: var(--color-orange-600);
`;

export default function DeleteAccountModal() {
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { showDeleteAccountModal, setShowDeleteAccountModal, user, setUser } =
    useGlobalContext();

  const { deleteAllAssetsAsync } = useAssetMutations();
  const { deleteCustomerAsync } = useStripe();
  const { deleteUserAsyncFn, sendDeletedUserEmailAsyncFn } = useSignup();

  const navigate = useNavigate();

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

  function handleStayWithAccount() {
    setShowDeleteAccountModal(false);
  }

  async function handleDelete() {
    await performDeleteAccountAction();
  }

  async function performDeleteAccountAction() {
    try {
      setShowSpinner(true);
      // delete assets in cloudinary
      const assetsToDeleteVideo = (user?.assets || [])
        .filter((asset) => asset.asset_info.resource_type === "video")
        .map((asset) => asset.asset_info.public_id);
      const assetsToDeleteImages = (user?.assets || [])
        .filter((asset) => asset.asset_info.resource_type === "image")
        .map((asset) => asset.asset_info.public_id);

      await deleteAllAssetsAsync({
        assetVideos: assetsToDeleteVideo,
        assetImages: assetsToDeleteImages,
      });
      // delete customer in stripe
      //  - if using deleteCustomerFn from useStripe hook, it will also delete customer in supabase
      if (user?.customers.length > 0) {
        await deleteCustomerAsync({
          customerId: user?.customers[0]?.customerId,
        });
      }
      // delete auth user
      //  - the user profile associated with the auth user will be auto deleted
      //    - all flyers associated with the referenced user profile will be auto deleted.
      //      - all saved flyers associated with the referenced flyer will be auto deleted
      //    - all saved templates associated with the referenced user profile will be auto deleted
      //    - all user assets rows in supabase assets table will be auto deleted
      //    - the customer row in supabase customers table will be auto deleted
      await deleteUserAsyncFn();
      // send an email to the user to notify them that their account has been deleted
      await sendDeletedUserEmailAsyncFn({
        email: user!.email,
        name: user!.name || "",
        firstName: user!.firstName || "",
        lastName: user!.lastName || "",
      });

      setShowSpinner(false);
      setShowDeleteAccountModal(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      setShowSpinner(false);
      setSubmitError("Something went wrong. Please try again.");
    }
  }

  return (
    // https://www.npmjs.com/package/react-modal
    <Modal
      testId="close-slide-in-modal"
      isOpen={showDeleteAccountModal}
      style={customStyles}
    >
      {submitError && (
        <StyledSubmitError as={"h4"} id="form-error">
          Error: {submitError}
        </StyledSubmitError>
      )}
      <Heading as="h2">STOP!</Heading>
      <Heading as="h2">Are you sure you want to delete your Account?</Heading>

      <StyledMessageContainer>
        <p>By deleting this account, you will lose all of your data.</p>
        <p>You cannot recover from this action.</p>
        <StyledReminder>Reminder: This cannot be undone.</StyledReminder>
      </StyledMessageContainer>
      <StyledButtonContainer>
        <Button size="small" variation="danger" onClick={handleDelete}>
          Delete Account
        </Button>
        <Button
          size="small"
          variation="primary"
          onClick={handleStayWithAccount}
        >
          Stay with Account
        </Button>
      </StyledButtonContainer>
      {showSpinner && (
        <OverlaySpinner message="Deleting your account, this may take a while..." />
      )}
    </Modal>
  );
}
