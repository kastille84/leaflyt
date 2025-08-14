import FormControl from "./FormControl";
import Heading from "../Heading";
import Button from "../Button";
import { useGlobalContext } from "../../context/GlobalContext";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import UpgradeText from "../UpgradeText";

export default function FlyerDesignerInput({
  getValues,
  setValue,
  canUpgrade,
}: {
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  canUpgrade: boolean;
}) {
  const {
    setIsOpenBottomSlideIn,
    setBottomSlideInType,
    setFlyerDesignOptions,
  } = useGlobalContext();
  function handleOpenFlyerDesigner() {
    setIsOpenBottomSlideIn(true);
    setBottomSlideInType("flyerDesigner");
    setFlyerDesignOptions({
      getValues: getValues,
      setValue: setValue,
    });
  }

  return (
    <FormControl>
      <Heading as="h4">Flyer Designer</Heading>
      <p>Give your flyer a custom look and feel.</p>
      <p>
        <Button
          disabled={canUpgrade}
          variation={canUpgrade ? "disabled" : "primary"}
          type="button"
          size="small"
          onClick={handleOpenFlyerDesigner}
        >
          Open the Flyer Designer
        </Button>
      </p>
      {canUpgrade && <UpgradeText text="Feature available when you upgrade." />}
    </FormControl>
  );
}
