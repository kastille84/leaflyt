import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import Select from "../Select";
import FormControl from "./FormControl";
import FieldInputError from "./FieldInputError";
import styled from "styled-components";

const StyledLabel = styled.label`
  font-weight: 600;
  color: var(--color-brand-600);
  &.error {
    color: var(--color-orange-600);
  }
`;

export default function TypeOfUserInput({
  register,
  title,
  value,
  errors,
  showUnregisteredMessaging = false,
}: {
  register: UseFormRegister<any>;
  title: string;
  value: string;
  errors: FieldErrors<FieldValues>;
  showUnregisteredMessaging?: boolean;
}) {
  return (
    <FormControl className="typeOfUser" testId="typeOfUser-container">
      <StyledLabel
        htmlFor="typeOfUser"
        className={`${errors["typeOfUser"] && "error"}`}
      >
        {title}
      </StyledLabel>
      {showUnregisteredMessaging && (
        <small>
          Unregistered users must provide info below everytime they post. <br />
          Registered users do not need to provide this information.
        </small>
      )}
      <Select
        options={[
          { label: "Choose one", value: "" },
          { label: "Anonymous", value: "anonymous" },
          { label: "Individual", value: "individual" },
          { label: "Business", value: "business" },
          { label: "Organization", value: "organization" },
        ]}
        value={value}
        defaultValue={""}
        {...register("typeOfUser", {
          required: { value: true, message: "This field is required" },
        })}
        hasError={Boolean(errors["typeOfUser"])}
      />
      {errors["typeOfUser"] && (
        <FieldInputError message={errors["typeOfUser"]?.message as string} />
      )}
    </FormControl>
  );
}
