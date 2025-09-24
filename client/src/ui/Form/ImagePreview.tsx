import { UseFormSetValue } from "react-hook-form";

import styled from "styled-components";
import { UploadApiResponse } from "cloudinary";
import { deleteFileOverTime } from "../../services/cloudinary";
import ImagePreviewItemTimed from "./ImagePreviewItemTimed";
import toast from "react-hot-toast";
import ImagePreviewItem from "./ImagePreviewItem";

const StyledImagePreview = styled.div`
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  flex-direction: row;
`;

export default function ImagePreview({
  fileUrlArr,
  setValue,
  isTimed,
}: {
  fileUrlArr: UploadApiResponse[];
  setValue: UseFormSetValue<any>;
  isTimed: boolean;
}) {
  async function handleDeleteImage(idx: number) {
    const imgToRemoveFromCloudinary = fileUrlArr.splice(idx, 1);
    try {
      if (isTimed) {
        // Delete image from cloudinary
        await deleteFileOverTime(imgToRemoveFromCloudinary[0]);
      } else {
        // If stand-alone flyer, just delete from filrUrlArr
        // If template, delete from cloudinary
      }
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
          if (isTimed) {
            return (
              <ImagePreviewItemTimed
                imageUrl={imageUrl}
                idx={idx}
                handleDeleteImage={handleDeleteImage}
                key={imageUrl.public_id}
              />
            );
          } else {
            return (
              <ImagePreviewItem
                imageUrl={imageUrl}
                idx={idx}
                handleDeleteImage={handleDeleteImage}
                key={imageUrl.public_id}
              />
            );
          }
        })}

      {isTimed && (
        <small>
          To save resources, each file will be deleted after 8 minutes of being
          uploaded if post has not been finalized.
        </small>
      )}
    </StyledImagePreview>
  );
}
