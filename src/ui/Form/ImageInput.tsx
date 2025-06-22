import { useEffect, useRef } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import FormControl from "./FormControl";
import Button from "../Button";
import styled from "styled-components";
import { FILE_UPLOAD_OPTIONS } from "../../constants";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

const StyledLabel = styled.label`
  &.error {
    color: var(--color-orange-600);
  }
`;
export default function ImageInput({
  register,
  setValue,
  getValues,
  errors,
  level,
}: {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  errors: FieldErrors<FieldValues>;
  level: number;
}) {
  const uploadButtonRef = useRef(null);
  const cloudinaryWidgetRef = useRef(null);

  useEffect(() => {
    setValue("imageUrlArr", []);
  }, []);
  const imageUrlArr = getValues("imageUrlArr");

  const openCloudinaryWidget = () => {
    if (!cloudinaryWidgetRef?.current && uploadButtonRef?.current) {
      cloudinaryWidgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
          uploadPreset: import.meta.env.VITE_CLOUDINARY_PRESET,
          ...FILE_UPLOAD_OPTIONS[level],
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (!error && result && result.event === "success") {
            console.log("Done! Here is the image info: ", result.info);
            setValue("imageUrlArr", [...imageUrlArr, result.info]); // Update form field
          }
        }
      );
    }
    (cloudinaryWidgetRef.current as any).open();
  };
  return (
    <>
      <FormControl>
        <FormControl>
          <StyledLabel
            htmlFor="title"
            className={`${errors["imageUrlArr"] && "error"}`}
          >
            File Upload
          </StyledLabel>
          <Button
            ref={uploadButtonRef}
            type="button"
            onClick={openCloudinaryWidget}
            disabled={imageUrlArr.length >= FILE_UPLOAD_OPTIONS[level].maxFiles}
            variation={
              imageUrlArr.length >= FILE_UPLOAD_OPTIONS[level].maxFiles
                ? "disabled"
                : "primary"
            }
          >
            Upload Image
          </Button>
          <input
            type="hidden"
            {...register("imageUrlArr", {
              validate: (val: any) => {
                if (val.length > FILE_UPLOAD_OPTIONS[level].maxFiles) {
                  return `You can only upload a maximum of ${FILE_UPLOAD_OPTIONS[level].maxFiles} files. Consider upgrading your plan.`;
                }
              },
            })}
          />
        </FormControl>
        {/* Hidden input to store URL */}
      </FormControl>
    </>
  );
}
