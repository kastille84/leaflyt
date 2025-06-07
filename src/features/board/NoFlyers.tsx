import { useState } from "react";
import styled from "styled-components";
import Button from "../../ui/Button";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
// import component 👇
import Drawer from "react-modern-drawer";

//import styles 👇
import "react-modern-drawer/dist/index.css";

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;

  & svg {
    color: var(--color-brand-600);
  }
`;
const StyledButtonContainer = styled.div`
  margin-top: 2.4rem;
  text-align: center;
`;
export default function NoFlyers() {
  const [openPanel, setOpenPanel] = useState(false);
  return (
    <>
      <StyledContainer>
        <div>
          <h1>
            <HiOutlinePaperAirplane />
          </h1>
          <p>There are no flyers at this location.</p>
          <p> Be the first to create one!</p>
          <StyledButtonContainer>
            <Button onClick={() => setOpenPanel(true)} size="large">
              Create Flyer
            </Button>
          </StyledButtonContainer>
        </div>
      </StyledContainer>
      {/* https://www.npmjs.com/package/react-modern-drawer */}
      <Drawer
        open={openPanel}
        onClose={() => setOpenPanel(false)}
        direction="right"
        size={"50vw"}
      >
        <div>Hello</div>
        <Button onClick={() => setOpenPanel(false)}>Close</Button>
      </Drawer>
    </>
  );
}
