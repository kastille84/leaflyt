// import component 👇
import Drawer from "react-modern-drawer";

//import styles 👇
import "react-modern-drawer/dist/index.css";
import { useGlobalContext } from "../../context/GlobalContext";
import CreateFlyer from "../../features/createFlyer/CreateFlyer";
import FlyerFormContainer from "./FlyerFormContainer";
import { JSX } from "react";
import Registered from "../../features/createFlyer/Registered";

export default function FlyerSlideIn() {
  const {
    isOpenFlyerDrawer,
    setShowCloseSlideInModal,
    drawerAction,
    selectedPlace,
    flyerToEdit,
    templateToEdit,
  } = useGlobalContext();

  const determineTypeOfDrawer = (): JSX.Element | null => {
    if (!drawerAction) return null;
    switch (drawerAction) {
      case "create":
        return <CreateFlyer />;
      case "edit":
        return <Registered flyerToEdit={flyerToEdit} />;
      case "editTemplate":
        return (
          <Registered type={drawerAction} templateToEdit={templateToEdit} />
        );
      case "createTemplate":
        return <Registered type={drawerAction} />;
    }
  };

  function handleDrawerClose() {
    setShowCloseSlideInModal(true);
  }

  // if (!selectedPlace) return null;
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
