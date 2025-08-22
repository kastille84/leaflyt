import React from "react";
import Button from "../Button";
import { useGlobalContext } from "../../context/GlobalContext";

export default function CreateFlyerButton({
  size,
}: {
  size?: "small" | "medium" | "large";
}) {
  const {
    setIsOpenFlyerDrawer,
    setDrawerAction,
    user,
    setIsOpenBottomSlideIn,
    setBottomSlideInType,
  } = useGlobalContext();
  let hasTemplates = false;
  if (user) {
    hasTemplates = user.templates.length > 0;
  }

  function handleHasTemplates() {
    setIsOpenBottomSlideIn(true);
    setBottomSlideInType("hasTemplates");
  }

  function handleCreateFlyer() {
    setDrawerAction("create");
    setIsOpenFlyerDrawer(true);
  }
  return (
    <Button
      size={size}
      onClick={hasTemplates ? handleHasTemplates : handleCreateFlyer}
    >
      Create Flyer
    </Button>
  );
}
