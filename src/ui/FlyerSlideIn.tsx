// import component 👇
import Drawer from "react-modern-drawer";

//import styles 👇
import "react-modern-drawer/dist/index.css";
import { useGlobalContext } from "../context/GlobalContext";
import CreateFlyer from "../features/createFlyer/CreateFlyer";
import FlyerFormContainer from "./FlyerFormContainer";
import { JSX } from "react";

export default function FlyerSlideIn() {
  const {
    isOpenFlyerDrawer,
    setIsOpenFlyerDrawer,
    drawerAction,
    selectedPlace,
  } = useGlobalContext();

  const determineTypeOfDrawer = (): JSX.Element => {
    if (drawerAction === "create") {
      return <CreateFlyer />;
    }
    return <CreateFlyer />;
  };

  return (
    <>
      {/* https://www.npmjs.com/package/react-modern-drawer */}
      <Drawer
        open={isOpenFlyerDrawer}
        onClose={() => setIsOpenFlyerDrawer(false)}
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
