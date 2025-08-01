// import component 👇
import Drawer from "react-modern-drawer";

//import styles 👇
import "react-modern-drawer/dist/index.css";
import { useGlobalContext } from "../../context/GlobalContext";
import RegistrationContainer from "../../features/authentication/SignupContainer";
import { SIGNUP } from "../../constants";
import styled from "styled-components";
import { HiOutlineXMark } from "react-icons/hi2";
import FlyerDesignerContainer from "../../features/createFlyer/FlyerDesigner/FlyerDesignerContainer";

const StyledCloseContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 2.4rem;
  font-size: 3rem;
  color: var(--color-brand-700);
  cursor: pointer;
`;

const StyledContentContainer = styled.div`
  height: 80rem;
`;

export default function SlideInBottom() {
  const {
    isOpenBottomSlideIn,
    setIsOpenBottomSlideIn,
    bottomSlideInType,
    setBottomSlideInType,
  } = useGlobalContext();

  function determineSlideInType() {
    if (bottomSlideInType === SIGNUP) {
      return <RegistrationContainer />;
    } else if (bottomSlideInType === "upsell") {
      return <p>Upsell</p>;
    } else if (bottomSlideInType === "flyerDesigner") {
      return <FlyerDesignerContainer />;
    }
  }

  function handleDrawerClose() {
    setIsOpenBottomSlideIn(false);
    setBottomSlideInType(null);
  }

  return (
    <Drawer
      open={isOpenBottomSlideIn}
      onClose={handleDrawerClose}
      direction="bottom"
      size={"100vh"}
      // style={{ position: "fixed", top: "auto", bottom: 0, right: 0, left: 0 }}
    >
      <StyledCloseContainer>
        <HiOutlineXMark onClick={handleDrawerClose} />
      </StyledCloseContainer>
      <StyledContentContainer>{determineSlideInType()} </StyledContentContainer>
    </Drawer>
  );
}
