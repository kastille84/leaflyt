import styled from "styled-components";

import Modal from "react-modal";
import Button from "../Button";
import { useGlobalContext } from "../../context/GlobalContext";

import { useResponsiveWidth } from "../../hooks/useResponsiveWidth";

const StyledContentContainer = styled.div`
  /* width: 80%; */
  height: 80dvh;
  overflow-y: auto;
  @media (max-height: 59em) {
    height: 60dvh;
    min-height: unset;
  }
`;

const StyledMain = styled.main`
  padding: 1.4rem;

  & h1,
  & h2,
  & h3,
  & a {
    margin-top: 1.4rem;
    color: var(--color-brand-600);
  }

  & ol {
    margin: 1.6rem;
  }
  & li {
    padding-left: 0.8rem;
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

export default function DcmaModal() {
  const { showDcmaModal, setShowDcmaModal } = useGlobalContext();

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
    setShowDcmaModal(false);
  }

  return (
    // https://www.npmjs.com/package/react-modal
    <Modal
      testId="close-slide-in-modal"
      isOpen={showDcmaModal}
      style={customStyles}
    >
      <StyledContentContainer>
        <StyledMain>
          <h1>DMCA COPYRIGHT POLICY</h1>

          <p>
            Leaflit respects the intellectual property rights of others and
            expects its users to do the same. In accordance with the Digital
            Millennium Copyright Act of 1998, the text of which may be found on
            the U.S. Copyright Office website, Leaflit will respond
            expeditiously to claims of copyright infringement committed using
            the Leaflit service.
          </p>

          <h2>1. How to File a Takedown Notice</h2>
          <p>
            If you are a copyright owner or an agent thereof and believe that
            any content hosted on Leaflit infringes upon your copyrights, you
            may submit a notification pursuant to the DMCA by providing our
            Designated Copyright Agent with the following information in
            writing:
          </p>

          <ol>
            <li>
              <strong>Identification of the copyrighted work</strong> claimed to
              have been infringed (e.g., a link to your original photo or a
              detailed description).
            </li>
            <li>
              <strong>Identification of the infringing material</strong> that is
              to be removed, including the specific geo-location/Virtual Board
              and the username of the flyer creator if available.
            </li>
            <li>
              <strong>Your contact information</strong>, including your address,
              telephone number, and an email address.
            </li>
            <li>
              <strong>A statement of "Good Faith Belief":</strong> "I hereby
              state that I have a good faith belief that the disputed use of the
              copyrighted material is not authorized by the copyright owner, its
              agent, or the law."
            </li>
            <li>
              <strong>
                A statement of "Accuracy under Penalty of Perjury":
              </strong>{" "}
              "I hereby state that the information in this Notice is accurate
              and, under penalty of perjury, that I am the owner, or authorized
              to act on behalf of the owner, of the copyright or of an exclusive
              right under the copyright that is allegedly infringed."
            </li>
            <li>
              <strong>A physical or electronic signature</strong> of the person
              authorized to act on behalf of the owner of the copyright
              interest.
            </li>
          </ol>

          <h2>2. Where to Send the Notice</h2>
          <p>Please send all DMCA notices to our Designated Agent:</p>
          <address>
            Leaflit Copyright Agent
            <br />
            Leaflit
            <br />
            Edwin Martinez
            <br />
            <a href="mailto:support@leaflit.us">support@leaflit.us</a>
          </address>

          <h2>3. Counter-Notification Procedures</h2>
          <p>
            If a user’s flyer is removed, they will be notified. If the user
            believes the material was removed by mistake or misidentification,
            they may file a "Counter-Notice" containing:
          </p>

          <ul>
            <li>Identification of the material that was removed.</li>
            <li>
              A statement under penalty of perjury that the user has a good
              faith belief the material was removed by mistake.
            </li>
            <li>The user’s name, address, and telephone number.</li>
            <li>
              Consent to the jurisdiction of the Federal District Court for the
              judicial district in which the user's address is located.
            </li>
            <li>A physical or electronic signature.</li>
          </ul>

          <h2>4. Repeat Infringer Policy</h2>
          <p>
            Leaflit maintains a "three-strike" policy. Any user who is the
            subject of three or more valid DMCA takedown notices will have their
            account permanently terminated.
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
