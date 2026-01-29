import React from "react";
import Button from "../Button";
import { useGlobalContext } from "../../context/GlobalContext";

export default function CreateFlyerButton({
  size,
  disabled = false,
}: {
  size?: "small" | "medium" | "large";
  disabled?: boolean;
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
      disabled={disabled}
      variation={disabled ? "disabled" : "primary"}
    >
      Create Flyer
    </Button>
  );
}
