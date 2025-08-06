import { Control, Controller, UseFormRegister } from "react-hook-form";
import ReactQuill from "react-quill-new";
import { FieldErrors, FieldValues } from "react-hook-form";
import FormControl from "./FormControl";
import FieldInputError from "./FieldInputError";
import styled from "styled-components";
import Input from "../Input";

const StyledLabel = styled.label`
  font-weight: 600;
  color: var(--color-brand-600);
  &.error {
    color: var(--color-orange-600);
  }
`;

const StyledSmall = styled.small`
  font-weight: 600;
  color: var(--color-grey-600);
`;

export default function CtaInput({
  register,
  control,
  errors,
}: {
  register: UseFormRegister<any>;
  control: Control<FieldValues, any, FieldValues>;
  errors: FieldErrors<{
    callToAction: {
      cta: { message: string };
      instructions: { message: string };
    };
  }>;
}) {
  const { callToAction } = errors;
  return (
    <FormControl testId="cta-container">
      <StyledLabel htmlFor="cta" className={`${callToAction?.cta && "error"}`}>
        Call To Action
      </StyledLabel>
      <p>
        Encourage the user to take action by offering BOGO, Coupons, Free
        Consultation or ask them to Volunteer/Donate/Join
      </p>
      <Input
        type="text"
        id="cta"
        {...register("callToAction.cta", {
          required: { value: true, message: "Call to Action is required" },
          validate: (value) => {
            if (value === "") {
              return "Call to Action is required";
            }
            return true;
          },
        })}
        placeholder="BOGO, 10% off, or ask them to volunteer/donate"
        hasError={Boolean(callToAction?.cta)}
      />
      {callToAction?.cta && (
        <FieldInputError message={callToAction?.cta?.message as string} />
      )}
      {/* <StyledSmall>
        Encourage the user to take action like Buy One Get One Coupon, Free
        Consultation or ask them to Volunteer/Donate/Join
      </StyledSmall> */}
      <StyledLabel
        htmlFor="cta"
        className={`${callToAction?.instructions && "error"}`}
      >
        Instructions
      </StyledLabel>
      <Controller
        control={control}
        name="callToAction.instructions"
        defaultValue={""}
        render={({ field }) => (
          <ReactQuill
            className={`${callToAction?.cta && "error"}`}
            {...field}
            theme="snow"
            placeholder="Give detailed instructions & explain the terms... i.e Save this flyer for your next visit."
          />
        )}
        rules={{
          required: { value: true, message: "Instructions is required" },
          validate: (value) => {
            if (value === "<p><br></p>") {
              return "Instructions is required";
            }
            return true;
          },
        }}
      />
      {callToAction?.instructions && (
        <FieldInputError
          message={callToAction?.instructions?.message as string}
        />
      )}
    </FormControl>
  );
}
