import { useState } from "react";
import styled from "styled-components";
import FormControl from "./FormControl";
import Select from "../Select";
import {
  FieldErrors,
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

const StyledLabel = styled.label`
  font-weight: 600;
  color: var(--color-brand-600);
  &.error {
    color: var(--color-orange-600);
  }
`;

export default function BorderRadiusInput({
  register,
  // setValue,
  getValues,
}: {
  register: UseFormRegister<any>;
  // setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
}) {
  const [borderRadius, setBorderRadius] = useState("borderTopLeftRadius");
  // const [radiusValue, setRadiusValue] = useState(getValues(borderRadius));
  console.log(borderRadius, getValues(borderRadius));
  return (
    <FormControl className="border-radius" testId="border-radius-container">
      <StyledLabel htmlFor="category">Round/Sharpen Corners</StyledLabel>
      <Select
        options={[
          { value: "borderTopLeftRadius", label: "Top left corner" },
          { value: "borderTopRightRadius", label: "Top right corner" },
          { value: "borderBottomLeftRadius", label: "Bottom left corner" },
          { value: "borderBottomRightRadius", label: "Bottom right corner" },
        ]}
        value={borderRadius}
        onChange={(e) => setBorderRadius(e.target.value)}
        hasError={false}
      />
      <input
        type="range"
        id="radius"
        min="0"
        max="20"
        value={getValues(borderRadius)}
        step="1"
        {...register(borderRadius)}
      />
      <label htmlFor="radius">{getValues(borderRadius)}px</label>
    </FormControl>
  );
}
