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
  /* height: 600px; */
  overflow-y: auto;
`;

const StyledMain = styled.main`
  padding: 1.4rem;

  & h1,
  & h2,
  & h3 {
    margin-top: 1.4rem;
    color: var(--color-brand-600);
  }
  & strong {
    color: var(--color-orange-600);
  }
`;

const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`;

export default function MerchantDisclaimerModal() {
  const { showMerchantDisclaimerModal, setShowMerchantDisclaimerModal } =
    useGlobalContext();

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
    setShowMerchantDisclaimerModal(false);
  }

  return (
    // https://www.npmjs.com/package/react-modal
    <Modal
      testId="close-slide-in-modal"
      isOpen={showMerchantDisclaimerModal}
      style={customStyles}
    >
      <StyledContentContainer>
        <StyledMain>
          <h1>Merchant Disclaimer</h1>
          <p>
            {" "}
            <strong>Notice</strong>: This Virtual Community Board is an
            independent digital service provided by Leaflit. It is not owned,
            operated, endorsed, or monitored by the physical establishment at
            this location. All flyers, offers, and media are user-generated
            content.{" "}
            <strong>
              The establishment is not responsible for the accuracy of these
              flyers or any transactions resulting from them.
            </strong>
          </p>
        </StyledMain>
      </StyledContentContainer>
      <StyledButtonContainer>
        <Button size="small" variation="secondary" onClick={handleClose}>
          Close
        </Button>
      </StyledButtonContainer>
    </Modal>
  );
}
