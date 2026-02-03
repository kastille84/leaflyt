import styled from "styled-components";

import Modal from "react-modal";
import Heading from "../Heading";
import Button from "../Button";
import { useGlobalContext } from "../../context/GlobalContext";

import TermsOfUse from "../../partials/TermsOfUse";
import { useResponsiveWidth } from "../../hooks/useResponsiveWidth";
import PrivacyPolicy from "../../partials/PrivacyPolicy";
import CommunityGuidelines from "../../partials/CommunityGuidelines";

const StyledContentContainer = styled.div`
  /* width: 80%; */
  height: 600px;
  overflow-y: auto;
  @media (max-height: 59em) {
    height: 60vh;
    min-height: unset;
  }
`;

const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`;

export default function TermsModal() {
  const {
    showTermsModal,
    setShowTermsModal,
    termsModalType,
    setTermsModalType,
  } = useGlobalContext();

  const responsiveVal = useResponsiveWidth();

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
      width: ["s_tablet", "m_tablet", "l_mobile", "s_mobile"].includes(
        responsiveVal,
      )
        ? "95%"
        : "80%",
      maxWidth: "800px",
      borderRadius: "var(--border-radius-lg)",
    },
  };

  function handleClose() {
    setShowTermsModal(false);
    setTermsModalType(null);
  }

  return (
    // https://www.npmjs.com/package/react-modal
    <Modal
      testId="close-slide-in-modal"
      isOpen={showTermsModal}
      style={customStyles}
    >
      <StyledContentContainer>
        {termsModalType === "terms" && <TermsOfUse />}
        {termsModalType === "privacy" && <PrivacyPolicy />}
        {termsModalType === "guidelines" && <CommunityGuidelines />}
      </StyledContentContainer>
      <StyledButtonContainer>
        <Button size="small" variation="secondary" onClick={handleClose}>
          Close
        </Button>
      </StyledButtonContainer>
    </Modal>
  );
}
