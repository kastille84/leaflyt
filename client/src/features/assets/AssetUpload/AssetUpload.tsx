import { useRef } from "react";
import Button from "../../../ui/Button";
import styled from "styled-components";
import { FILE_UPLOAD_OPTIONS } from "../../../constants";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import toast from "react-hot-toast";
import { keysBasedOnEnv } from "../../../utils/GeneralUtils";

const StyledAssetUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
`;

const StyledLabel = styled.label`
  font-weight: 600;
  color: var(--color-brand-600);
  &.error {
    color: var(--color-orange-600);
  }
`;
export default function AssetUpload({
  level,
  onAssetAdded,
  currentTotalAssets,
}: {
  level: number;
  onAssetAdded: Function;
  currentTotalAssets: number;
}) {
  const uploadButtonRef = useRef(null);
  const cloudinaryWidgetRef = useRef(null);

  const openCloudinaryWidget = () => {
    if (!cloudinaryWidgetRef?.current && uploadButtonRef?.current) {
      cloudinaryWidgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: keysBasedOnEnv().cloudinary.name,
          uploadPreset: keysBasedOnEnv().cloudinary.preset,
          ...FILE_UPLOAD_OPTIONS[level],
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (!error && result && result.event === "success") {
            // setFileUrlArr((prevFileUrlArr: any) => [
            //   ...prevFileUrlArr,
            //   result.info,
            // ]);
            // setValue("fileUrlArr", [...getValues("fileUrlArr"), result.info]); // Update form field
            onAssetAdded(result.info);
            (cloudinaryWidgetRef.current as any).close();
            cloudinaryWidgetRef.current = null;
          }
          if (error) {
            toast.error(error.statusText);
            // (cloudinaryWidgetRef.current as any).close();
          }
        },
      );
    }
    (cloudinaryWidgetRef.current as any).open();
  };

  return (
    <>
      {/* <FormControl testId="file-container"> */}
      <StyledAssetUploadContainer>
        <StyledLabel
          htmlFor="title"
          // className={`${errors["fileUrlArr"] && "error"}`}
        >
          File Upload
        </StyledLabel>

        <Button
          ref={uploadButtonRef}
          type="button"
          onClick={openCloudinaryWidget}
          disabled={currentTotalAssets >= FILE_UPLOAD_OPTIONS[level].maxFiles}
          variation={
            currentTotalAssets >= FILE_UPLOAD_OPTIONS[level].maxFiles
              ? "disabled"
              : "primary"
          }
        >
          Upload Asset
        </Button>
        {/* <input
            type="hidden"
            {...register("fileUrlArr", {
              validate: (val: any) => {
                if (val.length > FILE_UPLOAD_OPTIONS[level].maxFiles) {
                  return `You can only upload a maximum of ${FILE_UPLOAD_OPTIONS[level].maxFiles} files. Consider upgrading your plan.`;
                }
              },
            })}
          /> */}
        <small>
          Uploaded files can be deleted within the alloted time.
          <br /> After that, it becomes part of your assets library.
        </small>
      </StyledAssetUploadContainer>
      {/* Hidden input to store URL */}
      {/* </FormControl> */}
    </>
  );
}
