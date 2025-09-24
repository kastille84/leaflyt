import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { UploadApiResponse } from "cloudinary";
import styled from "styled-components";
import { set } from "react-hook-form";

const StyledFigure = styled.figure`
  position: relative;

  & img {
    border-radius: var(--border-radius-sm);
  }

  & small {
    display: block;
  }
`;

const StyledCross = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  background-color: var(--color-red-600);

  border-radius: 50%;
  display: inline-block;
  width: 1.6rem;
  height: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    color: var(--color-grey-50);
    z-index: 100;
  }

  &:hover {
    background-color: var(--color-grey-50);
  }
  &:hover svg {
    color: var(--color-red-600);
  }
`;

export default function ImagePreviewItem({
  imageUrl,
  idx,
  handleDeleteImage,
}: {
  imageUrl: UploadApiResponse;
  idx: number;
  handleDeleteImage: (idx: number) => void;
}) {
  return (
    <StyledFigure
      key={imageUrl.public_id}
      data-testid={`image-preview-item-${idx}`}
    >
      <img
        src={imageUrl.thumbnail_url}
        alt={imageUrl.public_id}
        key={imageUrl.public_id}
        style={{ width: "100px", height: "100px" }}
      />
      <StyledCross onClick={() => handleDeleteImage(idx)} data-testid="delete">
        <HiOutlineXMark />
      </StyledCross>
    </StyledFigure>
  );
}
