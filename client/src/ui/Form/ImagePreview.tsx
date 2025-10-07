import { UseFormSetValue } from "react-hook-form";

import styled from "styled-components";
import { UploadApiResponse } from "cloudinary";
import { deleteFileOverTime } from "../../services/cloudinary";
import ImagePreviewItemTimed from "./ImagePreviewItemTimed";
import toast from "react-hot-toast";

const StyledImagePreview = styled.div`
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  flex-direction: row;
`;

export default function ImagePreview({
  fileUrlArr,
  setValue,
}: {
  fileUrlArr: UploadApiResponse[];

  setValue: UseFormSetValue<any>;
}) {
  async function handleDeleteImage(idx: number) {
    const imgToRemoveFromCloudinary = fileUrlArr.splice(idx, 1);
    try {
      // Delete image from cloudinary
      await deleteFileOverTime(imgToRemoveFromCloudinary[0]);

      // remove image from state
      setValue("fileUrlArr", fileUrlArr);
    } catch (error) {
      console.log("error deleting file", error);
      toast.error("Error deleting image");
    }
  }

  return (
    <StyledImagePreview data-testid="image-preview">
      {fileUrlArr.length &&
        fileUrlArr.map((imageUrl, idx: number) => {
          return (
            <ImagePreviewItemTimed
              imageUrl={imageUrl}
              idx={idx}
              handleDeleteImage={handleDeleteImage}
              key={imageUrl.public_id}
            />
          );
        })}

      <small>
        To save resources, each file will be deleted after 8 minutes of being
        uploaded if post has not been finalized.
      </small>
    </StyledImagePreview>
  );
}
