import styled from "styled-components";

import Modal from "react-modal";
import Button from "../Button";
import { useGlobalContext } from "../../context/GlobalContext";

import { useResponsiveWidth } from "../../hooks/useResponsiveWidth";

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

const StyledSpan = styled.span`
  font-weight: bold;
  color: var(--color-brand-600);
`;

const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`;

export default function BoardWelcomeModal() {
  const {
    showBoardWelcomeModal,
    setShowBoardWelcomeModal,
    selectedPlace,
    setBottomSlideInType,
    setIsOpenBottomSlideIn,
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
    setShowBoardWelcomeModal(false);
  }

  function handleSignUp() {
    setBottomSlideInType("signup");
    setIsOpenBottomSlideIn(true);
    handleClose();
  }

  return (
    // https://www.npmjs.com/package/react-modal
    <Modal
      testId="close-slide-in-modal"
      isOpen={showBoardWelcomeModal}
      style={customStyles}
    >
      <StyledContentContainer>
        <StyledMain>
          <h1>{selectedPlace?.displayName.text || "This Location"}</h1>
          {/* <p>
            This is a virtual community board for{" "}
            {selectedPlace?.displayName.text || "this location"} where you can
            find and share local news, events, and resources. Whether you're
            looking for recommendations, want to connect with neighbors, or just
            want to stay informed about what's happening in your area, this
            board is here to help. Feel free to explore, post, and engage with
            your community!
          </p> */}
          {/* <h1>Welcome to this Community Board</h1> */}
          {/* <p>
            This is a virtual community board for{" "}
            <StyledSpan>
              {selectedPlace?.displayName.text || "this location"}
            </StyledSpan>{" "}
            where you can find and share local news, events, and resources.
          </p>
          <br /> */}
          <p>Welcome, Neighbor!</p>
          <p>
            This community board makes it easy to discover local events, find
            helpful services, and stay connected with people nearby. Explore
            what's happening around you and support the neighborhoods you love.
          </p>
          <br />
          <h2>
            <strong>Post as a guest in seconds!</strong>
          </h2>
          <p style={{ lineHeight: "1.8" }}>
            Post a simple flyer <strong>instantly as a Guest</strong> using the{" "}
            <StyledSpan>"Create Flyer"</StyledSpan> button. Or{" "}
            <Button size="small" onClick={handleSignUp}>
              Create a Free Account
            </Button>{" "}
            to add images, polished layouts, and analytics so your message
            reaches more neighbors.
          </p>
          <br />
          <StyledSpan>
            Explore, post, and help your neighborhood thrive.
          </StyledSpan>
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
