import { UseFormSetValue } from "react-hook-form";

import styled from "styled-components";
import { UploadApiResponse } from "cloudinary";
import { deleteFileOverTime } from "../../services/cloudinary";
import ImagePreviewItem from "./ImagePreviewItem";

const StyledImagePreview = styled.div`
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  flex-direction: row;
`;

export default function ImagePreview({
  imageUrlArr,
  setValue,
}: {
  imageUrlArr: UploadApiResponse[];
  setValue: UseFormSetValue<any>;
}) {
  async function handleDeleteImage(idx: number) {
    const imgToRemoveFromCloudinary = imageUrlArr.splice(idx, 1);
    try {
      // Delete image from cloudinary
      const result = await deleteFileOverTime(imgToRemoveFromCloudinary[0]);
      // remove image from state
      setValue("imageUrlArr", imageUrlArr);
    } catch (error) {
      console.log("error deleting file", error);
      // #TODO: toast to handle error
    }
  }
  return (
    <StyledImagePreview>
      {imageUrlArr.length &&
        imageUrlArr.map((imageUrl, idx: number) => (
          <ImagePreviewItem
            imageUrl={imageUrl}
            idx={idx}
            handleDeleteImage={handleDeleteImage}
            key={imageUrl.public_id}
          />
        ))}

      <small>
        To save resources, each file will be deleted after 8 minutes of being
        uploaded if post has not been finalized.
      </small>
    </StyledImagePreview>
  );
}
