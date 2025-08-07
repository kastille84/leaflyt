import {
  Control,
  Controller,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import ReactQuill from "react-quill-new";
import { FieldErrors, FieldValues } from "react-hook-form";
import FormControl from "./FormControl";
import FieldInputError from "./FieldInputError";
import styled from "styled-components";
import Input from "../Input";
import RadioGroupInput from "./RadioGroupInput";

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
  watch,
  // getValues,
  // setValue,
  control,
  errors,
}: {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  // getValues: UseFormGetValues<any>;
  // setValue: UseFormSetValue<any>;
  control: Control<FieldValues, any, FieldValues>;
  errors: FieldErrors<{
    callToAction: {
      headline: { message: string };
      instructions: { message: string };
    };
  }>;
}) {
  const { callToAction } = errors;
  const ctaTypeWatch = watch("callToAction.ctaType");

  return (
    <>
      <FormControl testId="cta-container">
        <StyledLabel htmlFor="headline">Call To Action</StyledLabel>
        <p>
          Encourage the user to take action by offering BOGO, Coupons, Free
          Consultation or ask them to Volunteer/Donate/Join
        </p>
        <RadioGroupInput
          groupLabel="Type"
          register={register}
          // getValues={getValues}
          // setValue={setValue}
          registerName="callToAction.ctaType"
          options={[
            {
              value: "offer",
              label: "Offer (BOGO/Coupon/Free Consultation/etc)",
            }, // { value: "coupon", label: "Deal/Coupon" },
            { value: "ask", label: "Ask (Volunteer/Donate/Join/etc)" },
            { value: "none", label: "No Call To Action" },
          ]}
        />
      </FormControl>
      {ctaTypeWatch !== "none" && (
        <FormControl>
          <StyledLabel
            htmlFor="headline"
            className={`${callToAction?.headline && "error"}`}
          >
            Headline
          </StyledLabel>
          <Input
            type="text"
            id="headline"
            {...register("callToAction.headline", {
              required: { value: true, message: "Headline is required" },
              validate: (value) => {
                if (value === "") {
                  return "Headline is required";
                }
                return true;
              },
            })}
            placeholder="BOGO, 10% off, or ask them to volunteer/donate"
            hasError={Boolean(callToAction?.headline)}
          />
          {callToAction?.headline && (
            <FieldInputError
              message={callToAction?.headline?.message as string}
            />
          )}
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
                className={`${callToAction?.instructions && "error"}`}
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
      )}
      {ctaTypeWatch === "none" && <FormControl>{/*Empty */}</FormControl>}
    </>
  );
}
