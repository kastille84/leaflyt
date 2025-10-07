import styled from "styled-components";
import FormControl from "./FormControl";
import Button from "../Button";
import { useGlobalContext } from "../../context/GlobalContext";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import UpgradeText from "../UpgradeText";

const StyledLabel = styled.label`
  font-weight: 600;
  color: var(--color-brand-600);
  &.error {
    color: var(--color-orange-600);
  }
`;

export default function FlyerDesignerInput({
  // getValues,
  // setValue,
  canUpgrade,
}: {
  // setValue: UseFormSetValue<any>;
  // getValues: UseFormGetValues<any>;
  canUpgrade: boolean;
}) {
  const { setIsOpenBottomSlideIn, setBottomSlideInType } = useGlobalContext();
  function handleOpenFlyerDesigner() {
    setIsOpenBottomSlideIn(true);
    setBottomSlideInType("flyerDesigner");
  }

  return (
    <FormControl testId="flyerDesigner-container">
      <StyledLabel>Flyer Designer</StyledLabel>
      <p>
        Give your flyer a custom look and feel. (Best viewed after you've filled
        out the fields above)
      </p>
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
