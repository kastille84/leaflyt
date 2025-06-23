// import component 👇
import Drawer from "react-modern-drawer";

//import styles 👇
import "react-modern-drawer/dist/index.css";
import { useGlobalContext } from "../../context/GlobalContext";
import CreateFlyer from "../../features/createFlyer/CreateFlyer";
import FlyerFormContainer from "./FlyerFormContainer";
import { JSX } from "react";

export default function FlyerSlideIn() {
  const {
    isOpenFlyerDrawer,
    setShowCloseSlideInModal,
    drawerAction,
    selectedPlace,
  } = useGlobalContext();

  const determineTypeOfDrawer = (): JSX.Element | null => {
    if (!drawerAction) return null;
    if (drawerAction === "create") {
      return <CreateFlyer />;
    }
    return <CreateFlyer />; // TODO: implement edit flyer
  };

  function handleDrawerClose() {
    setShowCloseSlideInModal(true);
  }

  if (!selectedPlace) return null;
  return (
    <>
      {/* https://www.npmjs.com/package/react-modern-drawer */}
      <Drawer
        open={isOpenFlyerDrawer}
        onClose={handleDrawerClose}
        direction="right"
        size={"50vw"}
      >
        <FlyerFormContainer
          action={drawerAction!}
          name={selectedPlace?.displayName.text!}
        >
          {determineTypeOfDrawer()}
        </FlyerFormContainer>
      </Drawer>
    </>
  );
}
