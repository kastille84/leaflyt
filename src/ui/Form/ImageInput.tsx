import { useRef } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import FormControl from "./FormControl";
import Button from "../Button";
import styled from "styled-components";

const StyledLabel = styled.label`
  &.error {
    color: var(--color-orange-600);
  }
`;
export default function ImageInput({
  register,
  setValue,
  errors,
}: {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<FieldValues>;
}) {
  const uploadButtonRef = useRef(null);
  const cloudinaryWidgetRef = useRef(null);

  const openCloudinaryWidget = () => {
    if (!cloudinaryWidgetRef?.current && uploadButtonRef?.current) {
      cloudinaryWidgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
          uploadPreset: import.meta.env.VITE_CLOUDINARY_PRESET,
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            console.log("Done! Here is the image info: ", result.info);
            setValue("imageUrl", result.info.secure_url); // Update form field
          }
        }
      );
    }
    (cloudinaryWidgetRef.current as any).open();
  };
  return (
    <FormControl>
      <StyledLabel
        htmlFor="title"
        className={`${errors["imageUrl"] && "error"}`}
      >
        File Upload
      </StyledLabel>
      <Button
        ref={uploadButtonRef}
        type="button"
        onClick={openCloudinaryWidget}
      >
        Upload Image
      </Button>
      <input type="hidden" {...register("imageUrl")} />{" "}
      {/* Hidden input to store URL */}
    </FormControl>
  );
}
