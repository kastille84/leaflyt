import styled from "styled-components";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import {
  FieldErrors,
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import FormControl from "./FormControl";

const StyledLabel = styled.label`
  font-weight: 600;
  color: var(--color-brand-600);
  &.error {
    color: var(--color-orange-600);
  }
`;

export default function ColorInput({
  register,
  setValue,
  getValues,
  selectedSection,
}: {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  selectedSection: string;
}) {
  const registerName =
    selectedSection.split("_").length > 1
      ? `${selectedSection.split("_").join(".")}`
      : `${selectedSection}`;

  const [color, setColor] = useColor(getValues(registerName));
  function handleColorChange(color: any) {
    setColor(color);
  }

  function handleColorChangeComplete(color: any) {
    setValue(registerName, color.hex);
  }
  console.log("getValues", getValues());
  console.log("color", getValues(registerName));
  return (
    <FormControl>
      <StyledLabel htmlFor="color">Select Color</StyledLabel>
      <ColorPicker
        hideInput={["rgb", "hsv"]}
        color={color}
        onChange={handleColorChange}
        onChangeComplete={handleColorChangeComplete}
      />
      <p>{color.hex}</p>
      {/* <input
        type="hidden"
        {...register(registerName)}
        value={getValues(registerName)}
      /> */}
    </FormControl>
  );
}
