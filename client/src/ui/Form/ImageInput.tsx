import { useEffect, useRef } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormGetValues,
  RegisterREturn,
  UseFormSetValue,
} from "react-hook-form";
import FormControl from "./FormControl";
import Button from "../Button";
import styled from "styled-components";
import { FILE_UPLOAD_OPTIONS } from "../../constants";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import toast from "react-hot-toast";

const StyledLabel = styled.label`
  font-weight: 600;
  color: var(--color-brand-600);
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
  register: RegisterREturn<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  errors: FieldErrors<FieldValues>;
  level: number;
}) {
  const uploadButtonRef = useRef(null);
  const cloudinaryWidgetRef = useRef(null);

  useEffect(() => {
    setValue("fileUrlArr", []);
  }, []);
  const fileUrlArr = getValues("fileUrlArr");

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
            // TODO: remove this console.log
            console.log("Done! Here is the image info: ", result.info);
            setValue("fileUrlArr", [...fileUrlArr, result.info]); // Update form field
          }
          if (error) {
            console.log(error);
            toast.error(error.message);
          }
        }
      );
    }
    (cloudinaryWidgetRef.current as any).open();
  };
  return (
    <>
      <FormControl testId="file-container">
        <FormControl>
          <StyledLabel
            htmlFor="title"
            className={`${errors["fileUrlArr"] && "error"}`}
          >
            File Upload
          </StyledLabel>
          <Button
            ref={uploadButtonRef}
            type="button"
            onClick={openCloudinaryWidget}
            disabled={
              fileUrlArr &&
              fileUrlArr?.length >= FILE_UPLOAD_OPTIONS[level].maxFiles
            }
            variation={
              fileUrlArr &&
              fileUrlArr?.length >= FILE_UPLOAD_OPTIONS[level].maxFiles
                ? "disabled"
                : "primary"
            }
          >
            Upload Image
          </Button>
          <input
            type="hidden"
            {...register("fileUrlArr", {
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
